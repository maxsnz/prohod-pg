import fileReadPromise from './fileReadPromise';

function parseSchedule(worksheet) {
  const firstColumnKeysMap = Object.keys(worksheet).filter(key => key.substr(0, 1) === 'A').filter(key => key.substr(1) !== '1');
  const allIndexMap = firstColumnKeysMap.map(key => key.substr(1));
  const allValues = allIndexMap.reduce((acc, index) => {
    const rowObj = Object.keys(worksheet).filter(key => key.substr(1) === index).reduce((obj, key) => {
      let dataObj = {};
      if (key.substr(0, 1) === 'A') dataObj.name = worksheet[key].v;
      if (key.substr(0, 1) === 'B') dataObj.rate = worksheet[key].v;
      if (key.substr(0, 1) === 'C') dataObj.dayStart = worksheet[key].w;
      if (key.substr(0, 1) === 'D') dataObj.dayEnd = worksheet[key].w;
      if (key.substr(0, 1) === 'E') dataObj.nightStart = worksheet[key].w;
      if (key.substr(0, 1) === 'F') dataObj.nightEnd = worksheet[key].w;
      return {...obj, ...dataObj };
    }, {});
    return [...acc, rowObj];
  }, []);
  return allValues;
}

function parseWhiteList(worksheet) {
  const allKeysMap = Object.keys(worksheet).filter(key => key.substr(0, 1) === 'A');
  const allValues = allKeysMap.map(key => worksheet[key].v);
  return allValues;
}

export default function parseFile(files) {
  return new Promise((resolve, reject) => {
    fileReadPromise(files[0]).then(workbook => {
      try {
        const schedule = parseSchedule(workbook.Sheets[workbook.SheetNames[0]]);
        const whiteList = parseWhiteList(workbook.Sheets[workbook.SheetNames[1]]);

        resolve({ schedule, whiteList });
      } catch (error) {
        reject(`ошибка парсинга: ${error}`);
        return;
      }
    });
  });
}
