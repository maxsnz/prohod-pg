import React, { Fragment } from 'react';
import Expander from '../Expander';
import styles from './WorkersList.module.css';

const WorkersList = ({ whiteList, schedule }) => (
  <div className={styles.container}>
    {schedule && (schedule.length > 0) && (
      <Expander title="Список сотрудников" className={styles.debugPanel}>
        <div className={styles.listContainer}>
          <div className="dataGrid" style={{ gridTemplateColumns: '400px 100px 80px 80px 80px 80px' }}>
            <div className="dataGridItem">
              <div className="dataGridItemInner alignLeft headerCell">ФИО</div>
            </div>
            <div className="dataGridItem rawDataItemDate">
              <div className="dataGridItemInner alignLeft headerCell">ставка</div>
            </div>
            <div className="dataGridItem">
              <div className="dataGridItemInner alignLeft headerCell">начало день</div>
            </div>
            <div className="dataGridItem">
              <div className="dataGridItemInner alignLeft headerCell">конец день</div>
            </div>
            <div className="dataGridItem">
              <div className="dataGridItemInner alignLeft headerCell">начало ночь</div>
            </div>
            <div className="dataGridItem">
              <div className="dataGridItemInner alignLeft headerCell">конец ночь</div>
            </div>
            {schedule.map(({ name, rate, dayStart, dayEnd, nightStart, nightEnd }) => (
              <Fragment key={name}>
                <div className="dataGridItem"><div className="dataGridItemInner alignLeft">{name}</div></div>
                <div className="dataGridItem"><div className="dataGridItemInner alignLeft">{rate}</div></div>
                <div className="dataGridItem"><div className="dataGridItemInner alignCenter">{dayStart}</div></div>
                <div className="dataGridItem"><div className="dataGridItemInner alignCenter">{dayEnd}</div></div>
                <div className="dataGridItem"><div className="dataGridItemInner alignCenter">{nightStart}</div></div>
                <div className="dataGridItem"><div className="dataGridItemInner alignCenter">{nightEnd}</div></div>
              </Fragment>
            ))}
          </div>
        </div>
        {/*<button className={styles.clearButton} onClick={onScheduleClear}>очистить</button>*/}
      </Expander>
    )}
    {whiteList && (whiteList.length > 0) && (
      <Expander title="Список исключений" className={styles.debugPanel}>
        <div className={styles.listContainer}>
          <div className="dataGrid" style={{ gridTemplateColumns: '400px' }}>
            {whiteList.map(item => (
              <div className="dataGridItem" key={item}><div className="dataGridItemInner alignLeft">{item}</div></div>
            ))}
          </div>
        </div>
        {/*<button className={styles.clearButton} onClick={onWhiteListClear}>очистить</button>*/}
      </Expander>
    )}
  </div>
);

export default WorkersList;
