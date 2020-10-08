import React from 'react';
import cx from 'classnames';
import styles from './Header.module.css';

const Tab = ({ disabled, children, id, current, setTab }) => (
  <div className={cx(styles.tab, {[styles.active]: current === id, [styles.disabled]: disabled})} onClick={disabled ? () => {} : () => setTab(id)}>{children}</div>
);

const Header = ({ currentTab, onSetCurrentTabIndex, disabledTabs }) => (
  <div className={styles.container}>
    <div className={styles.inner}>
      <div className={styles.left}>
        <Tab id={'init'} current={currentTab} setTab={onSetCurrentTabIndex}>Загрузка таблицы вход/выход</Tab>
        {/*<Tab id={'whiteList'} current={currentTab} setTab={onSetCurrentTabIndex}>Исключения</Tab>*/}
        <Tab id={'workersList'} current={currentTab} setTab={onSetCurrentTabIndex}>Список сотрудников</Tab>
        <Tab id={'wageReport'} current={currentTab} setTab={onSetCurrentTabIndex} disabled={disabledTabs.includes('wageReport')}>Отчёт о зарплате</Tab>
        <Tab id={'lateReport'} current={currentTab} setTab={onSetCurrentTabIndex} disabled={disabledTabs.includes('lateReport')}>Отчёт об опозданиях</Tab>
      </div>
      <div className={styles.right}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>PROHOD</div>
          <a className={styles.version} href="https://github.com/maxsnz/prohod-pg" target="_blank" rel="noopener noreferrer">v{process.env.RELEASE}</a>
          {/*<div className={styles.by}>by</div>
          <a className={styles.ghLink} href="https://github.com/maxsnz" target="_blank" rel="noopener noreferrer">@maxsnz</a>*/}
        </div>
      </div>
    </div>
  </div>
);

export default Header;