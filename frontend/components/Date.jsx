import { formatDate, checkValid } from '../utils/dateTimeUtils';

const DateF = ({ date }) => 
  checkValid(date) ? formatDate(date) : null;

export default DateF;