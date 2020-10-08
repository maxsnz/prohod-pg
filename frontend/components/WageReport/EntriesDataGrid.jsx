import React, { Fragment } from 'react';
import TimeDate from '../TimeDate';

const EntriesDataGrid = ({ data }) => (
  <Fragment>
    <div className="dataGridTitle">Валидные пары вход/выход:</div>
      <div className="dataGrid mb20" style={{ gridTemplateColumns: 'auto auto', width: '400px' }}>
        {data.map(({ timeIn, timeOut, rowKey }) => (
          <Fragment key={`${rowKey}${timeIn}`}>
            <div className="dataGridItem">
              <div className="dataGridItemInner alignCenter">
                <TimeDate 
                  timeClassName="dataGridItemTime" 
                  dateClassName="dataGridItemDate"
                  date={timeIn} 
                />
              </div>
            </div>
            <div className="dataGridItem">
              <div className="dataGridItemInner alignCenter">
                <TimeDate 
                  timeClassName="dataGridItemTime" 
                  dateClassName="dataGridItemDate"
                  date={timeOut} 
                />
              </div>
            </div>
          </Fragment>
        ))}
      </div>
  </Fragment>
);

export default EntriesDataGrid;