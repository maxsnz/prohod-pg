import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactHintFactory from 'react-hint'
import 'react-hint/css/index.css';
import api from 'api';
import Header from '../Header';
import DropZone from '../DropZone';
// import WhiteList from '../WhiteList';
import WorkersList from '../WorkersList';
import WageReport from '../WageReport';
import LateReport from '../LateReport';
import parseFile from '../../utils/parseFile';
// import parseWhiteList from '../../utils/parseWhiteList';
import parseWorkersList from '../../utils/parseWorkersList';
import styles from './App.module.css';
import '../../utils/dataGrid.css';

const ReactHint = ReactHintFactory(React);

class App extends React.Component {
  constructor() {
    super();
    const { localStorage } = window;
    const cachedData = localStorage.getItem("PROHOD_DATA");
    const parsedData = JSON.parse(cachedData) || {};
    const { schedule, whiteList } = parsedData;
    this.state = {
      fileLoaded: false,
      names: [],
      data: null,
      minDate: null, 
      maxDate: null,
      currentTab: 'init',
      disabledTabs: ['wageReport', 'lateReport'],
      whiteList: whiteList || [],
      schedule,
    };

    this.onFileLoad = this.onFileLoad.bind(this);
    this.onWorkersListLoad = this.onWorkersListLoad.bind(this);
    this.onDateRangeChange = this.onDateRangeChange.bind(this);
    this.onSetCurrentTabIndex = this.onSetCurrentTabIndex.bind(this);
  }

  componentDidMount() {
    const toastPendingSync = toast.info('Синхронизация с сервером...', { autoClose: false });
    api.getData().then(result => {
      const cachedData = localStorage.getItem("PROHOD_DATA");
      console.log(result);
      console.log(cachedData);
      if (result !== cachedData) {
        const parsed = JSON.parse(result);
        console.log('parsed', parsed);
        const { whiteList, schedule } = parsed;

        this.setState({ whiteList, schedule });
        const { localStorage } = window;
        localStorage.setItem('PROHOD_DATA', JSON.stringify({ whiteList, schedule }));
        toast.update(toastPendingSync, { type: toast.TYPE.SUCCESS, render: 'Синхронизация завершена, данные обновлены', autoClose: 3000 });
      } else {
        toast.update(toastPendingSync, { type: toast.TYPE.SUCCESS, render: 'Синхронизация завершена', autoClose: 3000 });
      }
    }).catch(error => {
      toast.update(toastPendingSync, { type: toast.TYPE.ERROR, render: `Синхронизация не завершена: ${error}` });
      console.error('error', error);
    });
  }

  onFileLoad({ data, names, minDate, maxDate }) {
    this.setState({ 
      fileLoaded: true, 
      names, 
      data, 
      minDate, 
      maxDate,
      startDate: minDate,
      endDate: maxDate,
      currentTab: 'wageReport',
      disabledTabs: [],
    });
  }

  onWorkersListLoad({ whiteList, schedule }) {
    const toastPendingSync = toast.info('Синхронизация с сервером...', { autoClose: false });
    this.setState({ whiteList, schedule });
    const { localStorage } = window;
    localStorage.setItem('PROHOD_DATA', JSON.stringify({ whiteList, schedule }));

    api.postData({ whiteList, schedule }).then(result => {
      toast.update(toastPendingSync, { type: toast.TYPE.SUCCESS, render: 'Синхронизация завершена, данные обновлены', autoClose: 3000 });
      console.log('result', result);
    }).catch(error => {
      toast.update(toastPendingSync, { type: toast.TYPE.ERROR, render: 'Ошибка синхронизации' });
      console.error('error', error);
    });
  }

  onDateRangeChange({ startDate, endDate }) {
    this.setState({ startDate, endDate });
  }

  onSetCurrentTabIndex(currentTab) {
    this.setState({ currentTab });
  }

  render() {
    const { names, data, fileLoaded, minDate, maxDate, currentTab, disabledTabs, whiteList, schedule } = this.state;

    return (
      <div className={styles.container}>
        <ReactHint autoPosition events />
        <Header currentTab={currentTab} onSetCurrentTabIndex={this.onSetCurrentTabIndex} disabledTabs={disabledTabs} />

        {(currentTab === 'init') && (
          <>
            <DropZone onLoad={this.onFileLoad} parseFunction={parseFile} />
          </>
        )}

        {(currentTab === 'workersList') && (
          <>
            <WorkersList schedule={schedule} whiteList={whiteList} />
            <DropZone onLoad={this.onWorkersListLoad} parseFunction={parseWorkersList} />
          </>
        )}

        {(currentTab === 'wageReport') && (
          <>
            {fileLoaded && (names.length > 0) && (
              <WageReport 
                names={names} 
                data={data} 
                minDate={minDate}
                maxDate={maxDate}
                schedule={schedule || []} 
                whiteList={whiteList || []}
              />
            )}
          </>
        )}

        {(currentTab === 'lateReport') && (
          <>
            {fileLoaded && (names.length > 0) && (
              <LateReport 
                data={data} 
                whiteList={whiteList}
                schedule={schedule || []}  
              />
            )}
          </>
        )}

        <ToastContainer
          hideProgressBar
          position="top-right"
          autoClose={3000}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
        />
      </div>
    );
  }
}

export default App;
