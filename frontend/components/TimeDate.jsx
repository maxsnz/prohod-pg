import React, { Fragment } from 'react';
import { formatTime, formatDate, checkValid } from '../utils/dateTimeUtils';

const TimeDate = ({ date, timeClassName, dateClassName }) => 
  checkValid(date) ? (
    <Fragment>
      <span className={dateClassName}>{formatDate(date)}</span>
      <span className={timeClassName}>{formatTime(date)}</span>
    </Fragment>
  ) : null;

export default TimeDate;