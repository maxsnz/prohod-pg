/* eslint no-throw-literal: 0 */
import { parseTimeAndDate, timeDiffInMinutes, formatTimeAndDate, isDifferentDays, isWeekendDay, setTime, isDateAfter, isSameDate, parseDate, plusDays, formatDate } from './dateTimeUtils';
import config from '../config';

// сначала найти out
// потом найти in, который ДО out
// если нет - рекурсивно найти следующий out
const findInAndOutRecursion = (recursionCounter, arr, sliceAccumulator, debug) => {
  if (recursionCounter > 1000) {
    throw 'recursion counter infinite loop in findInAndOutRecursion()';
  }

  if (!arr.length) return [null, null];
  if (debug) console.log(recursionCounter, 'start iteration', [...arr].slice(0,5));
  if (debug) console.log(recursionCounter, 'sliceAccumulator', sliceAccumulator);

  const outIndex = arr.findIndex(entry => !!entry.timeOut);
  if (debug) console.log(recursionCounter, 'outIndex', outIndex);
  const outDependedArr = outIndex > -1 ? arr.slice(0, outIndex + 1).map(entry => !!entry.timeIn) : [];
  if (debug) console.log(recursionCounter, 'outDependedArr', outDependedArr);
  const inIndex = outDependedArr.lastIndexOf(true);
  if (debug) console.log(recursionCounter, 'inIndex', inIndex);

  // если inIndex ДО outIndex не нашлось - проверим есть ли еще outIndex
  // и запустим функцию рекурсивно
  const hasMoreOut = !!arr.slice(outIndex + 1).find(entry => !!entry.timeOut);
  if (debug) console.log(recursionCounter, 'hasMoreOut', hasMoreOut);

  // чекнуть не слишком ли далеко timeOut от timeIn
  const timeIn = (inIndex >= 0) && arr[inIndex].timeIn && parseTimeAndDate(arr[inIndex].timeIn, arr[inIndex].date);
  const timeOut = (outIndex >= 0) && arr[outIndex].timeOut && parseTimeAndDate(arr[outIndex].timeOut, arr[outIndex].date);
  const tooLongSmena = timeIn && timeOut && timeDiffInMinutes(timeOut, timeIn) > config.ENTRY_MAX_LENGTH;
  if (debug) console.log(recursionCounter, 'tooLongSmena');

  if ((tooLongSmena && hasMoreOut) || ((outIndex >= 0) && (inIndex < 0) && hasMoreOut)) {
    if (debug) console.log(recursionCounter, 'next recursion');
    if (debug) console.log('---------------------------------');
    const sliceAccumulatorNext = (outIndex >= 0) ? sliceAccumulator + outIndex + 1 : sliceAccumulator + 1;
    return findInAndOutRecursion(recursionCounter + 1, arr.slice(outIndex + 1), sliceAccumulatorNext, debug);
  } else {
    if (debug) console.log(recursionCounter, 'finish', sliceAccumulator)
    if (debug) console.log('---------------------------------');
    if (debug) console.log(timeIn && formatTimeAndDate(timeIn), timeOut && formatTimeAndDate(timeOut));
    if (debug) console.log('---------------------------------');
    return [inIndex + sliceAccumulator, outIndex + sliceAccumulator];
    
  }
}

const findEntrieRecursion = (recursionCounter, arr, accumulator) => {
  if (recursionCounter > 10000) {
    throw 'recursion counter infinite loop in findEntrieRecursion()';
  }

  if (!arr.length) return accumulator;
  const [inIndex, outIndex] = findInAndOutRecursion(0, arr, 0, false);
  if ((inIndex < 0) || (outIndex < 0)) {
    // заканчиваем
    return accumulator;
  } else {
    const timeIn = parseTimeAndDate(arr[inIndex].timeIn, arr[inIndex].date);
    const timeOut = parseTimeAndDate(arr[outIndex].timeOut, arr[outIndex].date);
    accumulator.push({ rowKey: arr[inIndex].rowKey, timeIn, timeOut });
    return findEntrieRecursion(recursionCounter + 1, arr.slice(outIndex + 1), accumulator);
  }
}

const countSmenaLength = smena =>
  smena.reduce((accumulator, currentValue) => 
    accumulator + timeDiffInMinutes(currentValue.timeOut, currentValue.timeIn),
    0
  );

const checkIsHoliday = dt =>
  !!config.HOLIDAYS.filter(date => isSameDate(dt, parseDate(date))).length;

// '08:00' => { hours: 8, minutes: 0 }
const giveMeHoursAndMinutes = str =>
  ({ hours: parseInt(str.split(':')[0], 10), minutes: parseInt(str.split(':')[1], 10) });

const getBreaksFromSmena = smena =>
  smena.reduce((accumulator, currentValue, index, arr) => ((index === (arr.length - 1)) ? accumulator : [...accumulator, { start: arr[index].timeOut, end: arr[index + 1].timeIn, breakLength: timeDiffInMinutes(arr[index + 1].timeIn, arr[index].timeOut) }]), []);

const countTotalOutside = breaks => 
  breaks.reduce((accumulator, currentValue) => (accumulator + currentValue.breakLength), 0);

const prepareSmena = (smena, { dayStart, dayEnd, nightStart, nightEnd }, workerName) => {
  const date = setTime(smena[0].timeIn, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });

  const smenaStart = smena[0].timeIn;
  const smenaEnd = smena[smena.length - 1].timeOut;
  const isNight = isDifferentDays(smenaStart, smenaEnd);

  const dateStart = date;
  const shouldStartAt = isNight ? 
    nightStart ? setTime(dateStart, giveMeHoursAndMinutes(nightStart)) : smenaStart
  :
    dayStart ? setTime(dateStart, giveMeHoursAndMinutes(dayStart)) : smenaStart
  ;
  const isLateIn = isDateAfter(smenaStart, shouldStartAt); // опоздание
  const lateInMinutes  =  isLateIn ? timeDiffInMinutes(smenaStart, shouldStartAt) : 0;
  const earlyInMinutes = !isLateIn ? timeDiffInMinutes(shouldStartAt, smenaStart) : 0

  const dateEnd = isNight ? plusDays(dateStart, 1) : dateStart;
  const shouldEndAt = isNight ? 
    nightEnd ? setTime(dateEnd, giveMeHoursAndMinutes(nightEnd)) : smenaEnd
  :
    dayEnd ? setTime(dateEnd, giveMeHoursAndMinutes(dayEnd)) : smenaEnd
  ;
  const isEarlyOut = isDateAfter(shouldEndAt, smenaEnd); // ранний уход
  const earlyOutMinutes = isEarlyOut ? timeDiffInMinutes(shouldEndAt, smenaEnd) : 0;
  const lateOutMinutes = !isEarlyOut ? timeDiffInMinutes(smenaEnd, shouldEndAt) : 0

  const isWeekend = isWeekendDay(date);
  const isHoliday = checkIsHoliday(date);

  const breaks = getBreaksFromSmena(smena);
  const totalMinutesOutside = countTotalOutside(breaks);
  const leaveCounter = smena.length - 1;

  return {
    workerName,
    entries: smena,
    date,
    dateStr: formatDate(date),
    smenaStart,
    smenaEnd,
    isNight,
    smenaLength: countSmenaLength(smena) - lateOutMinutes - earlyInMinutes,
    key: formatTimeAndDate(smenaStart),
    isWeekend,
    isHoliday,
    shouldStartAt, 
    shouldEndAt,
    isLateIn,
    lateInMinutes,
    lateOutMinutes,
    isEarlyOut,
    earlyInMinutes,
    earlyOutMinutes,
    leaveCounter,
    breaks,
    totalMinutesOutside,
    increasedRate: (isNight || isWeekend || isHoliday),
    hasProblems: isLateIn || isEarlyOut || (totalMinutesOutside > 30) || (leaveCounter > 2),
  };
}

const isSmenaEnd = (e1, e2) => 
  (timeDiffInMinutes(e2.timeIn, e1.timeOut) > config.SMENA_ENDS_AFTER);

const findSmenas = (entriesArr, schedule, workerName) => {
  const flatMap = entriesArr.reduce((accumulator, currentValue, index, arr) => {
    if ((index === 0) || isSmenaEnd(arr[index-1], arr[index])) {
      return [...accumulator, [currentValue]];
    } else {
      const lastAccumulatorIndex = accumulator.length-1;
      const lastAccumulatorEl = accumulator[lastAccumulatorIndex];
      const newArr = [...accumulator];
      newArr[lastAccumulatorIndex] = [...lastAccumulatorEl, currentValue]
      return newArr;
    }
  }, []);

  return flatMap.map(smena => prepareSmena(smena, schedule, workerName));
}

// просто заполним расписание 
const prepareSchedule = ({ name, dayStart, dayEnd, nightStart, nightEnd, }) => ( name ? {
  dayStart, dayEnd, nightStart, nightEnd,
} : {
  dayStart: config.DEFAULT_DAY_START, 
  dayEnd: config.DEFAULT_DAY_END, 
  nightStart: config.DEFAULT_NIGHT_START, 
  nightEnd: config.DEFAULT_NIGHT_END, 
});

export default function countWorkerEntries(arr, rawSchedule, workerName) {
  return new Promise((resolve, reject) => {
    try {
      // первый заход на работу (отсеим хвосты не попадающих в выборку смен)
      const firstInEntryIndex = arr.findIndex(entry => !!entry.timeIn);
      if (firstInEntryIndex < 0) {
        // нет записи входа
        // reject('записи о входе не найдены или пустые');
        resolve({ entriesArr: [], smenasArr: [], workerName });
        return;
      }

      const schedule = prepareSchedule(rawSchedule);
      // console.log('schedule', schedule);

      const entriesArr = findEntrieRecursion(0, arr.slice(firstInEntryIndex), []);
      const smenasArr = findSmenas(entriesArr, schedule, workerName);
      resolve({ entriesArr, smenasArr, workerName });
    } catch (error) {
      reject(error);
    }
  });
}
