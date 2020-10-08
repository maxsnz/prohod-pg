import React, { Fragment } from 'react';
import DateF from '../Date';
import Time from '../Time';
import { parseMinutes } from '../../utils/dateTimeUtils';

const timeEntryStyles = {
  border: '1px solid #d8d8d8',
  boxSizing: 'border-box',
  padding: '0 5px',
  marginRight: '5px',
  borderRadius: '3px',
  fontSize: '12px',
  color: '#555',
  whiteSpace: 'nowrap',
};

const SmenasDataGrid = ({ data }) => (
  <Fragment>
    <div className="dataGridTitle">Данные, разбитые на смены:</div>
      <div className="dataGrid mb20" style={{ gridTemplateColumns: '200px 40px 40px auto 100px', width: '600px' }}>
        {data.map(({ key, isNight, isWeekend, isHoliday, entries, date, smenaStart, smenaEnd, smenaLength }) => (
          <Fragment key={key}>
            <div className="dataGridItem">
              <div className="dataGridItemInner alignLeft">
                <DateF date={date} />
              </div>
            </div>
            <div className="dataGridItem">
              <div className="dataGridItemInner alignCenter" data-rh={(isWeekend || isHoliday) ? 'выходной или праздничный день' : 'будний день'}>
                {(isWeekend || isHoliday) ? ' 📅' : ''}
              </div>
            </div>
            <div className="dataGridItem">
              <div className="dataGridItemInner alignCenter" data-rh={isNight ? 'ночная смена' : 'дневная смена'}>
                {isNight ? ' 🌃' : ' 🌅'}
              </div>
            </div>
            <div className="dataGridItem">
              <div className="dataGridItemInner alignLeft">
                {entries.map(({ timeIn, timeOut }) => (
                  <div style={timeEntryStyles} key={timeIn}>
                    <Time date={timeIn} /> - <Time date={timeOut} />
                  </div>
                ))}
              </div>
            </div>
            <div className="dataGridItem">
              <div className="dataGridItemInner alignLeft">
                {parseMinutes(smenaLength)}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
  </Fragment>
);

export default SmenasDataGrid;