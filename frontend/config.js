export default {
  NAME_COLUMN_LETTER: 'C',
  DATE_COLUMN_LETTER: 'A',
  IN_COLUMN_LETTER: 'E',
  OUT_COLUMN_LETTER: 'F',
  SMENA_ENDS_AFTER: 60 * 5, // смена заканчивается через 5 часов отсутствия,
  ENTRY_MAX_LENGTH: 60 * 15, // максимальное время нахождения внутри 15 часов
  DEFAULT_DAY_START: '8:00',
  DEFAULT_DAY_END: '20:00',
  DEFAULT_NIGHT_START: '20:00',
  DEFAULT_NIGHT_END: '08:00',
  HOLIDAYS: [
    '01.01.2020',
    '02.01.2020',
    '03.01.2020',
    '06.01.2020',
    '07.01.2020',
    '08.01.2020',
    '24.02.2020',
    '09.03.2020',
    '01.05.2020',
    '04.05.2020',
    '05.05.2020',
    '11.05.2020',
    '12.06.2020',
    '04.11.2020',
  ],
};

