import React from 'react';
import T from 'prop-types';
import { toast } from 'react-toastify';
import Select from 'react-select';
import countWorkerEntries from '../../utils/countWorkerEntries';
import Expander from '../Expander';
import RawDataGrid from './RawDataGrid';
import EntriesDataGrid from './EntriesDataGrid';
import SmenasDataGrid from './SmenasDataGrid';
import ResultDataGrid from './ResultDataGrid';
import FormDatePicker from '../FormDatePicker';
import EasterEgg from '../EasterEgg';
import normalizeNameForSearch from '../../utils/normalizeNameForSearch';
import { formatDate, checkValid } from '../../utils/dateTimeUtils';
import styles from './WageReport.module.css';

class Form extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: null,
      rawData: null,
      entriesArr: null,
      smenasArr: null,
      startDate: null, 
      endDate: null,
      rate: '',
      isInWhiteList: false,
    };
    this.onSelectManHandler = this.onSelectManHandler.bind(this);
    this.onDateRangeChange = this.onDateRangeChange.bind(this);
    this.onChangeRate = this.onChangeRate.bind(this);
    this.onInputChangeHandler = this.onInputChangeHandler.bind(this);
    this.onPrevClickHandler = this.onPrevClickHandler.bind(this);
    this.onNextClickHandler = this.onNextClickHandler.bind(this);
  }

  componentDidMount() {
    const { minDate, maxDate } = this.props;

    this.setState({
      selected: null,
      startDate: minDate, 
      endDate: maxDate,
      workerSchedule: {},
    });
  }

  onPrevClickHandler(event) {
    event.preventDefault();
    const { selected } = this.state;
    const { names } = this.props;
    if (!selected) return;

    const currentSelectedIndex = names.indexOf(selected);
    if (currentSelectedIndex === -1) {
      return;
    } else if (currentSelectedIndex === 0) {
      this.setSelected(names[names.length - 1]);
    } else {
      this.setSelected(names[currentSelectedIndex - 1]);
    }
  }

  onNextClickHandler(event) {
    event.preventDefault();
    const { selected } = this.state;
    const { names } = this.props;

    if (!selected) {
      this.setSelected(names[0]);
    } else {
      const currentSelectedIndex = names.indexOf(selected);
      if (currentSelectedIndex === -1) {
        return;
      } else if (currentSelectedIndex === (names.length - 1)) {
        this.setSelected(names[0]);
      } else {
        this.setSelected(names[currentSelectedIndex + 1]);
      }
    }
  }

  onSelectManHandler(event) {
    const workerName = event.value;
    this.setSelected(workerName);
  }

  setSelected(workerName) {
    const { data, schedule, whiteList } = this.props;

    const scheduleSearchResult = schedule.filter(({ name }) => ( normalizeNameForSearch(name) === normalizeNameForSearch(workerName) ));
    // console.log('scheduleSearchResult', scheduleSearchResult);
    const workerSchedule = scheduleSearchResult[0] || {};
    const { rate } = workerSchedule;

    const isInWhiteList = whiteList.includes(workerName);

    this.setState({
      selected: workerName,
      rawData: data[workerName],
      entriesArr: null,
      smenasArr: null,
      workerSchedule,
      rate: rate || '',
      isInWhiteList,
    });

    countWorkerEntries(data[workerName], workerSchedule, workerName).then(({ entriesArr, smenasArr }) => {
      // console.log({ entriesArr, smenasArr });
      this.setState({ entriesArr, smenasArr });
    }).catch(error => {
      console.error(error);
      toast.error(error, { autoClose: 3000 });
    });
    // console.log(data[event.value]);
  }

  onDateRangeChange([ startDate, endDate ]) {
    this.setState({ startDate, endDate });
  }

  onChangeRate(event) {
    const rate = event.target.value;
    this.setState({ rate })
  }

  onInputChangeHandler(event) {
    if (event === 'кнопа') {
      this.setState({ easterEgg: true });
    }
  }

  render() {
    const { names, minDate, maxDate } = this.props;
    const { rawData, entriesArr, smenasArr, startDate, endDate, rate, easterEgg, selected, workerSchedule, isInWhiteList } = this.state;
    const optionsFormatted = names.map(o => ({ value: o, label: o }));
    const startDateStr = checkValid(startDate || minDate) ? formatDate(startDate || minDate) : null;
    const endDateStr = checkValid(endDate || maxDate) ? formatDate(endDate || maxDate) : null;
    const resultKey = `${selected}-${startDateStr}-${endDateStr}`;

    return (
      <div className={styles.formContainer}>
        <div className={styles.formTop}>
          <div className={styles.selectContainer}>
            <button className={styles.selectArrowButton} disabled={!selected} onClick={this.onPrevClickHandler}>←</button>
            <Select 
              options={optionsFormatted} 
              placeholder="ФИО..."
              isSearchable
              onChange={this.onSelectManHandler}
              onInputChange={this.onInputChangeHandler}
              className={styles.select}
              value={{ value: selected, label: selected }}
            />
            <button className={styles.selectArrowButton} onClick={this.onNextClickHandler}>→</button>
          </div>
          <div className={styles.datepickerContainer}>
            <FormDatePicker 
              minDate={minDate} 
              maxDate={maxDate} 
              startDate={startDate} 
              endDate={endDate} 
              onDateRangeChange={this.onDateRangeChange} 
            />
          </div>
          <div className={styles.rateContainer}>
            <input 
              type="number" 
              className={styles.rateInput}
              placeholder="ставка сотрудника" 
              value={rate}
              onChange={this.onChangeRate}
            />
          </div>
        </div>

        {rawData && (
          <Expander title="Отладка" defaultCollapsed>
            <>
              {rawData && <RawDataGrid data={rawData} />}
              {entriesArr && <EntriesDataGrid data={entriesArr} />}
              {smenasArr && <SmenasDataGrid data={smenasArr} />}
            </>
          </Expander>
        )}
        
        {selected && ( 
          <>
            {smenasArr && (smenasArr.length > 0) ? (
              <ResultDataGrid 
                data={smenasArr} 
                startDate={startDate || minDate} 
                endDate={endDate || maxDate} 
                rate={rate}
                selected={selected}
                workerSchedule={workerSchedule}
                isInWhiteList={isInWhiteList}
                key={resultKey}
              />
            ) : <div>Валидные смены для <b>{selected}</b> не найдены</div>}
          </>
        )}

        {easterEgg && <EasterEgg />}
        
      </div>
    );
  }
}

Form.propTypes = {
  names: T.array.isRequired,
  minDate: T.instanceOf(Date).isRequired,
  maxDate: T.instanceOf(Date).isRequired,
  data: T.object.isRequired,
}

export default Form;
