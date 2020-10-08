import React from 'react';
import { toast } from 'react-toastify';
import cx from 'classnames';
import { isDateAfter, parseDate } from '../../utils/dateTimeUtils';
import LateReportName from './LateReportName';
import LateReportDate from './LateReportDate';
import countAllWorkerEntries from '../../utils/countAllWorkerEntries';
import normalizeNameForSearch from '../../utils/normalizeNameForSearch';
import styles from './LateReport.module.css';

class LateReport extends React.Component {
  constructor() {
    super();

    this.state = {
      smenasByWorker: [],
      smenasByDate: [],
      tab: 'workers',
    }
  }

  componentDidMount() {
    const { data, schedule, whiteList } = this.props;
    const arr = Object.keys(data).map(workerName => ({ entries: data[workerName], workerName }));
    const arrFiltered = arr.filter(({ workerName }) => !whiteList.map(normalizeNameForSearch).includes(normalizeNameForSearch(workerName)) );
    countAllWorkerEntries(arrFiltered, schedule).then(({ smenasByWorker }) => {
      const allSmenas = smenasByWorker.reduce((acc, { smenasArr }) => ([...acc, ...smenasArr]), []);
      const allDates = allSmenas.reduce((acc, { dateStr }) => (acc.includes(dateStr) ? acc : [...acc, dateStr]), []);
      const allDateSorted = allDates.sort((dateA, dateB) => isDateAfter(parseDate(dateB), parseDate(dateA)) ? -1 : 1);
      const smenasByDate = allDateSorted.map(date => ({
        date,
        smenasArr: allSmenas.filter(({ dateStr }) => dateStr === date),
      }));
      this.setState({ smenasByWorker, smenasByDate });
    }).catch(error => {
      console.error(error);
      toast.error(error, { autoClose: 3000 });
    });
  }

  render() {
    const { tab, smenasByWorker, smenasByDate } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <div className={cx(styles.headerItem, {[styles.headerItemActive]: tab === 'workers'})} onClick={() => this.setState({ tab: 'workers' })}>по сотрудникам</div>
            <div className={cx(styles.headerItem, {[styles.headerItemActive]: tab === 'dates'})} onClick={() => this.setState({ tab: 'dates' })}>по датам</div>
          </div>
          {(tab === 'workers') && smenasByWorker.map(({ workerName, smenasArr }) => (
            <LateReportName 
              key={workerName} 
              name={workerName} 
              data={smenasArr} 
            />
          ))}
          {(tab === 'dates') && smenasByDate.map(({ date, smenasArr }) => (
            <LateReportDate 
              key={date} 
              date={date} 
              data={smenasArr} 
            />
          ))}
        </div>
      </div>
    );
  };
};

export default LateReport;
