import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
// import * as serviceWorker from './serviceWorker';

/*
<React.StrictMode>
  <App />
</React.StrictMode>
*/

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// https://create-react-app.dev/docs/making-a-progressive-web-app/
// serviceWorker.register();