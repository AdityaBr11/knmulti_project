import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Entryfile/Main';
import 'react-loading-skeleton/dist/skeleton.css';
import store from './store/store';
import { Provider } from 'react-redux';

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('app')
);

if (module.hot) {
  // enables hot module replacement if plugin is installed
  module.hot.accept();
}
