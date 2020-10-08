import React, { useState } from 'react';
import cx from 'classnames';
import Time from '../Time';
import styles from './Breaks.module.css';

const Breaks = ({ breaks, showBreaksClassName, containerClassName, itemClassName }) => {
  const [showBreaks, setShowBreaks] = useState(false);
  if (!showBreaks) return <div className={cx(styles.showBreaks, showBreaksClassName)} onClick={() => setShowBreaks(true)}>показать</div>;

  return (
    <div className={cx(styles.container, containerClassName)}>
      {breaks.map(({ start, end }) => (<div className={cx(styles.breakItem, itemClassName)} key={start}><Time date={start} /> - <Time date={end} /></div>))}
    </div>
  );
}

export default Breaks;