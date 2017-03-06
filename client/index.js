import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import Test from './components/Test';
import App from './components/App';
import placeHolderReducer from './reducers/placeHolderReducer';

export const store = createStore(
  placeHolderReducer,
  compose(
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

ReactDOM.render((
  <Provider store={store}>
    <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Test} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('container'));
