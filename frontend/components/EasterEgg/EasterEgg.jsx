import React from 'react';
import cat from './cat50.png'; 
import styles from './EasterEgg.module.css';

const EasterEgg = () => (
  <div className={styles.container}>
    <img src={cat} alt="easter egg" />
  </div>
);

export default EasterEgg;