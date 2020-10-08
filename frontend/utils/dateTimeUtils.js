import { format, parse, differenceInMinutes, isValid, differenceInCalendarDays, set, isAfter, addDays } from 'date-fns';
import isWeekend from 'date-fns/isWeekend';
import isSameDay from 'date-fns/isSameDay'

import { registerLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
export const LOCALE = 'ru-RU';

// https://github.com/Hacker0x01/react-datepicker/#localization
// https://reactdatepicker.com/#example-15
// https://date-fns.org/v2.0.0-alpha.25/docs/I18n
if (global.window) registerLocale(LOCALE, ru);

export const parseTimeAndDate = (time, date) => 
  parse(`${time} ${date}`, 'HH:mm yyyy-MM-dd', new Date());

export const parseDate = str =>
  parse(str, 'dd.MM.yyyy', new Date());

export const formatTimeAndDate = dateTime =>
  format(dateTime, 'dd.MM.yyyy HH:mm');

export const formatTime = dateTime =>
  format(dateTime, 'HH:mm');

export const formatDate = dateTime =>
  format(dateTime, 'dd.MM.yyyy');

export const timeDiffInMinutes = (d1, d2) =>
  differenceInMinutes(d1, d2);

export const checkValid = dateTime =>
  isValid(dateTime);

export const isDifferentDays = (d1, d2) =>
  (differenceInCalendarDays(d2, d1) > 0)

export const isWeekendDay = dateTime =>
  isWeekend(dateTime);

export const getHours = dateTime =>
  parseInt(format(dateTime, 'H'))

export const setTime = (dateTime, time) =>
  set(dateTime, time);

export const isDateAfter = (date, dateToCompare) =>
  isAfter(date, dateToCompare);

export const isSameDate = (d1, d2) =>
  isSameDay(d1, d2);
  
export const parseMinutes = m => 
  `${(m - m % 60) / 60}ч ${m % 60}м`;

export const plusDays = (date, amount) =>
  addDays(date, amount)

export const weekdays = [
  'ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'
]
