import React from 'react';
import cx from 'classnames';
import { parseMinutes } from '../../utils/dateTimeUtils';
import styles from './LateReport.module.css';

const LateReportEntry = ({ name, inTimesByDates, totalLate, debug }) => {
  if (!debug && !totalLate) return null;
  const inTimes = debug ? inTimesByDates : inTimesByDates.filter(({ late }) => !!late);

  return (
    <div className={styles.nameEntry}>
      <div className={styles.name}>{name}</div>
      <div className={styles.nameData}>
        <div className={styles.nameDates}>
          {inTimes.map(({ date, timeIn, late }) => (
            <div key={date}>
              <div className={styles.date}>{date && date.split('-').reverse().join('.')}</div>
              <div className={cx(styles.time, { [styles.late]: !!late })} data-rh={late ? parseMinutes(late) : null}>{timeIn}</div>
              {/*late && (late > 0) && <div className={styles.lateCount}>{parseMinutes(late)}</div>*/}
            </div>
          ))}
        </div>
        <div className={styles.entryTotal}>Общее опоздание за период: {parseMinutes(totalLate)}</div>
      </div>
    </div>
  );
}

export default LateReportEntry;