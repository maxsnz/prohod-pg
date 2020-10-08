import React from 'react';
import Time from '../Time';
import Breaks from '../Breaks';
import { parseMinutes } from '../../utils/dateTimeUtils';
import styles from './LateReport.module.css';

const LateReportDate = ({ date, data }) => {
  const totalProblemsCount = data.reduce((acc, { hasProblems }) => (hasProblems ? (acc + 1) : acc), 0);
  if (totalProblemsCount === 0) return null;

  return (
    <div className={styles.nameEntry}>
      {/*<div className={styles.debugContainer}>
        <label className={styles.debugLabel}>
          <input type="checkbox" checked={debug} onChange={() => this.setState({debug: !debug})} className={styles.debugCheckbox} /> Отладка
        </label>
      </div>*/}
      <div className={styles.name}>{date}</div>
      <div className={styles.nameData}>
        <div className={styles.nameDates}>
          {data.filter(({ hasProblems }) => hasProblems).map(({ key, workerName, isLateIn, isEarlyOut, totalMinutesOutside, smenaStart, smenaEnd, breaks, leaveCounter }) => (
            <div className={styles.nameDateItem} key={workerName}>
              <div className={styles.date}>{workerName}</div>
              {isLateIn && <div className={styles.nameDateItemProblem}>опоздание: <Time date={smenaStart} /></div>}
              {isEarlyOut && <div className={styles.nameDateItemProblem}>ранний уход: <Time date={smenaEnd} /></div>}
              {(totalMinutesOutside > 30) && <div className={styles.nameDateItemProblem}>долгое отсутствие: {parseMinutes(totalMinutesOutside)}<Breaks breaks={breaks} containerClassName={styles.breaksContainer} itemClassName={styles.breakItem} /></div>}
              {(leaveCounter > 2) && <div className={styles.nameDateItemProblem}>частые уходы: {leaveCounter}шт <Breaks breaks={breaks} containerClassName={styles.breaksContainer} itemClassName={styles.breakItem} /></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LateReportDate;
