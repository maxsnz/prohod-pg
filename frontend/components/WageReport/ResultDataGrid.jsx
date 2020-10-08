import React, { useState } from 'react';
import cx from 'classnames';
import { areIntervalsOverlapping, /*add,*/ getDay } from 'date-fns';
import { parseMinutes, weekdays } from '../../utils/dateTimeUtils';
import DateF from '../Date';
import Time from '../Time';
import Breaks from '../Breaks';
import styles from './WageReport.module.css';

const ResultDataGridItem = ({
  isInWhiteList,
  isLateIn, 
  isEarlyOut, 
  isWeekend, 
  isHoliday, 
  isNight, 
  increasedRate, 
  entries, 
  date, 
  smenaStart, 
  smenaEnd, 
  smenaLength,
  leaveCounter,
  breaks,
  totalMinutesOutside,
  checked,
  onSetChecked,
}) => (
  <>
    <td className="dataTableItem">
      <div className="dataTableItemInner alignCenter">
        <input type="checkbox" checked={checked} onChange={onSetChecked} />
      </div>
    </td>
    <td className="dataTableItem">
      {(isWeekend || isHoliday) && <div className="bgLightRed posAbs" />}
      <div className="dataTableItemInner alignCenter">
        {weekdays[getDay(date)]}
      </div>
    </td>
    <td className="dataTableItem">
      {(isWeekend || isHoliday) && <div className="bgLightRed posAbs" />}
      <div className="dataTableItemInner alignLeft">
        <DateF date={date} />
      </div>
    </td>
    <td className="dataTableItem">
      <div className="dataTableItemInner alignCenter" data-rh={isNight ? 'ночная смена' : 'дневная смена'}>
        {isNight ? ' 🌃' : ' 🌅'}
      </div>
    </td>
    <td className="dataTableItem">
      <div className="dataTableItemInner alignLeft">
        {increasedRate ? '1.2' : '1.0'}
      </div>
    </td>
    <td className="dataTableItem">
      {isLateIn && !isInWhiteList && <div className="bgRed posAbs" />}
      <div className="dataTableItemInner alignLeft">
        <Time date={smenaStart} />
      </div>
    </td>
    <td className="dataTableItem">
      {isEarlyOut && !isInWhiteList && <div className="bgRed posAbs" />}
      <div className="dataTableItemInner alignLeft">
        <Time date={smenaEnd} />
      </div>
    </td>
    <td className="dataTableItem">
      <div className="dataTableItemInner alignLeft">
        {parseMinutes(smenaLength)}
      </div>
    </td>
    <td className="dataTableItem">
      {(breaks.length > 2) && !isInWhiteList && <div className="bgRed posAbs" />}
      <div className="dataTableItemInner alignJustify">
        {leaveCounter}
        {(breaks.length > 0) && <Breaks breaks={breaks} containerClassName={styles.breaksContainer} itemClassName={styles.breakItem} />}
      </div>
    </td>
    <td className="dataTableItem">
      {(totalMinutesOutside > 30) && !isInWhiteList && <div className="bgRed posAbs" />}
      <div className="dataTableItemInner alignLeft">
        {parseMinutes(totalMinutesOutside)}
      </div>
    </td>
  </>
);

const ResultDataGrid = ({ data, startDate, endDate, rate, selected, workerSchedule, isInWhiteList }) => {
  const filteredByDateData = data.filter(({ date }) => (
    areIntervalsOverlapping({ start: date, end: date }, { start: startDate, end: endDate/*add(endDate, { days: 1 })*/ }, { inclusive: true })
  ));
  const initialCheckedState = filteredByDateData.map(({ key }) => key).reduce((acc, key) => ({ ...acc, [key]: true }), {});
  const [checked, setChecked] = useState(initialCheckedState);
  const filteredByCheckboxData = filteredByDateData.filter(({ key }) => checked[key] );
  const worked = filteredByCheckboxData.reduce((acc, { smenaLength }) => (acc + smenaLength), 0);
  const workedNormal = filteredByCheckboxData.filter(({ isNight, isWeekend, isHoliday }) => (!isNight && !isWeekend && !isHoliday)).reduce((acc, { smenaLength }) => (acc + smenaLength), 0);
  const workedIncreased = filteredByCheckboxData.filter(({ isNight, isWeekend, isHoliday }) => (isNight || isWeekend || isHoliday)).reduce((acc, { smenaLength }) => (acc + smenaLength), 0);
  const parsedRate = parseInt(rate || 0, 10);
  const [resultWageRub, resultWageKop] = (workedNormal / 60 * parsedRate + workedIncreased / 60 * 1.2 * parsedRate).toFixed(2).toString().split('.');
  const { dayStart, dayEnd, nightStart, nightEnd } = workerSchedule;

  return (
    <> 
      <div className={styles.reportHeader}>
        <div>Отчет о зарплате по сотруднику <b>{selected}</b></div>
        <div>за период <b><DateF date={startDate} /> - <DateF date={endDate} /></b></div>
        {dayStart && <div>График работы день: <b>{dayStart} – {dayEnd}</b></div>}
        {nightStart && <div>График работы ночь: <b>{nightStart} – {nightEnd}</b></div>}
      </div>
      <table className="dataTable mb20">
        <thead>
          <tr>
            <th className="dataTableItem" style={{ width: '50px' }}>
              <div className="bgGrey posAbs" />
              <div className="dataTableItemInner headerCell"></div>
            </th>
            <th className={cx('dataTableItem', 'rawDataItemDate')} style={{ width: '50px' }}>
              <div className="bgGrey posAbs" />
              <div className="dataTableItemInner alignLeft headerCell"></div>
            </th>
            <th className={cx('dataTableItem', 'rawDataItemDate')} style={{ width: '150px' }}>
              <div className="bgGrey posAbs" />
              <div className="dataTableItemInner alignLeft headerCell">Дата</div>
            </th>
            <th className={cx('dataTableItem', 'rawDataItemDate')} style={{ width: '50px' }}>
              <div className="bgGrey posAbs" />
              <div className="dataTableItemInner alignLeft headerCell"></div>
            </th>
            <th className={cx('dataTableItem', 'rawDataItemDate')} style={{ width: '100px' }}>
              <div className="bgGrey posAbs" />
              <div className="dataTableItemInner alignLeft headerCell">Ставка</div>
            </th>
            <th className="dataTableItem" style={{ width: '100px' }}>
              <div className="bgGrey posAbs" />
              <div className="dataTableItemInner alignCenter headerCell">Приход</div>
            </th>
            <th className="dataTableItem" style={{ width: '100px' }}>
              <div className="bgGrey posAbs" />
              <div className="dataTableItemInner alignCenter headerCell">Уход</div>
            </th>
            <th className="dataTableItem" style={{ width: '100px' }}>
              <div className="bgGrey posAbs" />
              <div className="dataTableItemInner alignCenter headerCell">Отработано</div>
            </th>
            <th className="dataTableItem" style={{ width: '120px' }}>
              <div className="bgGrey posAbs" />
              <div className="dataTableItemInner alignLeft headerCell">Количество выходов</div>
            </th>
            <th className="dataTableItem" style={{ width: '110px' }}>
              <div className="bgGrey posAbs" />
              <div className="dataTableItemInner alignLeft headerCell">Время отсутствия</div>
            </th>
          </tr>
        </thead>
        <tbody>
        {filteredByDateData.map(({ key, ...rest }) => (
          <tr key={key}>
            <ResultDataGridItem 
              checked={checked[key]} 
              onSetChecked={() => setChecked({ ...checked, [key]: !checked[key] })}
              isInWhiteList={isInWhiteList}
              {...rest} 
            />
          </tr>
        ))}
        </tbody>
      </table>

      <div className="wageResultContainer">
        <div>Всего отработано по нормальной ставке: <strong>{parseMinutes(workedNormal)}</strong></div>
        <div>Всего отработано по повышенной ставке: <strong>{parseMinutes(workedIncreased)}</strong></div>
        <div>Всего отработано: <strong>{parseMinutes(worked)}</strong></div>
        {resultWageRub && resultWageKop && rate && (rate > 0) && <div>ЗП: <strong>{resultWageRub}р. {resultWageKop}коп.</strong></div>}
      </div>
    </>
  );
};

export default ResultDataGrid;
