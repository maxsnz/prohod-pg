import React, { createRef, forwardRef } from 'react';
import T from 'prop-types';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate } from '../../utils/dateTimeUtils';
import styles from './FormDatePicker.module.css';

const FormDatePicker = ({ minDate, maxDate, startDate, endDate, onDateRangeChange }) => {

  const FormDatePickerButton = forwardRef(({ onClick }, ref) => (
    <button className={styles.formDatePickerButton} onClick={onClick} data-rh="по датам" ref={ref}>
      {startDate && <span>{formatDate(startDate)}</span>}
      <span className={styles.formDatePickerButtonDivider}>–</span>
      {endDate && <span>{formatDate(endDate)}</span>}
    </button>
  ));
  const ref = createRef();

  return (
    <DatePicker
      //monthsShown={2}
      selected={startDate}
      onChange={onDateRangeChange}
      selectsRange
      startDate={startDate}
      endDate={endDate}
      showPreviousMonths
      minDate={minDate}
      maxDate={maxDate}
      shouldCloseOnSelect={false}
      locale="ru-RU"
      //inline
      customInput={<FormDatePickerButton ref={ref} />}
    />
  )
};

FormDatePicker.defaultProps = {
  startDate: null,
  endDate: null,
}

FormDatePicker.propTypes = {
  minDate: T.instanceOf(Date).isRequired,
  maxDate: T.instanceOf(Date).isRequired,
  startDate: T.instanceOf(Date),
  endDate: T.instanceOf(Date),
  onDateRangeChange: T.func.isRequired,
}

export default FormDatePicker;