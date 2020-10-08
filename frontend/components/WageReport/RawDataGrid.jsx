import React, { Fragment } from 'react';

const RawDataGrid = ({ data }) => (
  <>
    <div className="dataGridTitle">Найденные записи из таблицы:</div>
      <div className="dataGrid mb20" style={{ gridTemplateColumns: '50px auto 80px 80px', width: '400px' }}>
        <div className="dataGridItem">
          <div className="dataGridItemInner alignCenter headerCell"></div>
        </div>
        <div className="dataGridItem">
          <div className="dataGridItemInner alignLeft headerCell">Дата</div>
        </div>
        <div className="dataGridItem">
          <div className="dataGridItemInner alignCenter headerCell">Приход</div>
        </div>
        <div className="dataGridItem">
          <div className="dataGridItemInner alignCenter headerCell">Уход</div>
        </div>
        {data.map(({ date, timeIn, timeOut, rowKey }) => (
          <Fragment key={`${rowKey}${date}`}>
            <div className="dataGridItem">
              <div className="dataGridItemInner alignCenter indexCell">{rowKey}</div>
            </div>
            <div className="dataGridItem">
              <div className="dataGridItemInner alignLeft">{date}</div>
            </div>
            <div className="dataGridItem">
              <div className="dataGridItemInner alignCenter">{timeIn || '❌'}</div>
            </div>
            <div className="dataGridItem">
              <div className="dataGridItemInner alignCenter">{timeOut || '❌'}</div>
            </div>
          </Fragment>
        ))}
      </div>
  </>
);

export default RawDataGrid;