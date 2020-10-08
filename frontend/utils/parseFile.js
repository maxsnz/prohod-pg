import { uniq } from 'ramda';
import { parseISO, min, max } from 'date-fns'
import { isDateAfter } from './dateTimeUtils';
import fileReadPromise from './fileReadPromise';
import config from '../config';

// genArr(13,16) => [13,14,15,16]
const genArr = (startIndex, endIndex) => Array.from({length: endIndex}, (_, i) => i+1).slice(startIndex-1);

const getN = key => parseInt(key.substr(1), 10);

const parseTimeStr = str => {
  const timeReg = /^\d\d:\d\d/;
  const result = str.match(timeReg);
  return result ? result[0] : null;
}

// 3
function parseEntries(matrix) {
  // составляем массив уникальных имён
  const datesStrArr = [];
  const namesArr = matrix.filter(({ name }) => name).map(({ name }) => name);
  const uniqNamesArr = uniq(namesArr);
  const allEntriesByNames = uniqNamesArr.reduce((acc, name) => ({ ...acc, [name]: [] }), {});

  // тут найдем стартовые строки для имён
  for (let i = 0; i < matrix.length; i++) {
    const { rowKey, timeIn, timeOut, name, date } = matrix[i];
    if (name) {
      allEntriesByNames[name].push({ date, rowKey, timeIn, timeOut });
      if (date) datesStrArr.push(date);
      while (matrix[i + 1] && !matrix[i + 1].name) {
        i++;
        // сформируем объект записи
        // он состоит из даты, времени ухода и времени прихода
        const { rowKey, timeIn, timeOut } = matrix[i];
        allEntriesByNames[name].push({ date, rowKey, timeIn, timeOut });
        // продолжаем цикл пока в следующей ячейке для имени не появится имя
      } 
    }
  }

  const uniqDatesStrArr = uniq(datesStrArr);
  const datesArr = uniqDatesStrArr.map(str => parseISO(str));
  const minDate = min(datesArr);
  const maxDate = max(datesArr);
  return { data: allEntriesByNames, names: uniqNamesArr, minDate, maxDate };
}


// 2
function parseWorkbook(workbook) {
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const allKeysMap = Object.keys(worksheet).filter(key => key.substr(0, 1) !== '!');

  // поиск начала и конца данных на листе
  let startCellNumber = 0;
  allKeysMap.forEach(key => {
    if (worksheet[key] && (worksheet[key].v === "Дата")) {
      startCellNumber = getN(key) + 2;
    }
  });

  if (!startCellNumber) {
    // eslint-disable-next-line no-throw-literal
    throw 'неправильная структура таблицы';
  }

  const startCellKey = `A${startCellNumber}`;
  const startCellKeyIndex = allKeysMap.indexOf(startCellKey);
  const keysMap = allKeysMap.slice(startCellKeyIndex);

  // составляем массив всех ячеек с данными
  const lastCellNumber = keysMap[keysMap.length - 1].substr(1);
  const dataKeysMap = genArr(startCellNumber, lastCellNumber).map(N => `${config.NAME_COLUMN_LETTER}${N}`);

  return dataKeysMap.map(key => {
    const index =  getN(key);
    const name = worksheet[key] ? worksheet[key].v : null;
    const date = worksheet[`${config.DATE_COLUMN_LETTER}${index}`] ? worksheet[`${config.DATE_COLUMN_LETTER}${index}`].v : null; 
    const timeIn = worksheet[`${config.IN_COLUMN_LETTER}${index}`] ? parseTimeStr(worksheet[`${config.IN_COLUMN_LETTER}${index}`].v) : null;
    const timeOut = worksheet[`${config.OUT_COLUMN_LETTER}${index}`] ? parseTimeStr(worksheet[`${config.OUT_COLUMN_LETTER}${index}`].v) : null;
    return { name, date, rowKey: index, timeIn, timeOut };
  });
}


// 1
export default function parseFile(files) {
  return new Promise((resolve, reject) => {
    const promises = [...files].map(fileReadPromise);
    Promise.all(promises).then(workbooks => { 
      try {
        // const matrix = workbooks.reduce((acc, workbook) => [...acc, ...parseWorkbook(workbook)], []); /* этот способ не сортирует таблицы */
        const entriesMatrix = workbooks.map(parseWorkbook);
        // нужно отсортировать таблицы
        entriesMatrix.sort((a, b) => {
          // для сортировки используем первую найденную в таблице дату
          const findDate = arr => arr.filter(({ date }) => !!date)[0].date;
          const dateA = findDate(a);
          const dateB = findDate(b);
          // eslint-disable-next-line no-throw-literal
          if (dateA === dateB) throw 'невозможно отсортировать таблицы: повторение дат';
          return isDateAfter(parseISO(dateB), parseISO(dateA)) ? -1 : 1;
        });
        // соберем данные в один массив
        const matrix = entriesMatrix.reduce((acc, entries) => [...acc, ...entries], []);
        const result = parseEntries(matrix);
        resolve(result);
      } catch (error) {
        reject(`Ошибка парсинга: ${error}`);
        console.error(error);
        return;
      }
    })
  })
}
