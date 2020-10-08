import React from 'react';
import Expander from '../Expander';
import styles from './WhiteList.module.css';

const WhiteList = ({ data, onClear }) => {
  return (
    <div className={styles.container}>
      <Expander title="Список исключений" className={styles.debugPanel}>
        <div className={styles.listContainer}>
          {data.map(item => <div key={item}>{item}</div>)}
        </div>
        {/*<button className={styles.clearButton} onClick={onClear}>очистить</button>*/}
      </Expander>
    </div>
  );
}

export default WhiteList;