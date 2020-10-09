import React from 'react';
import cx from 'classnames';
import styles from './ErrorBoundary.module.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      hasError: false,
      errorMessage: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error, info) {
    const errorMessage = error && error.message && (typeof error.message === 'string') ? error.message : '';
    const errorInfo = info && info.componentStack && (typeof info.componentStack === 'string') ? info.componentStack : '';
    this.setState({ hasError: true, errorMessage, errorInfo });
  }

  render() {
    const { hasError, errorMessage, errorInfo } = this.state;
    if (hasError) {
      // You can render any custom fallback UI
      return (
        <div className={styles.container}>
          <h1>Что-то пошло не так</h1>
          <div className={styles.message}>{errorMessage}</div>
          <div className={styles.info}>
            <pre>
              <code className={cx('JavaScript', styles.errorCode)}>
                {errorInfo}
              </code>
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
