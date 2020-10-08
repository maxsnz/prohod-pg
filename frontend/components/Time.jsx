import { formatTime, checkValid } from '../utils/dateTimeUtils';

const Time = ({ date }) => 
  checkValid(date) ? formatTime(date) : null;

export default Time;