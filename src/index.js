import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from "redux-logger";
import {Provider} from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App/index';
import * as serviceWorker from './serviceWorker';
import myReducer from './App/reducers/index';
import thunk from "redux-thunk";
import config from './config';

const loggerMiddleware = createLogger();

const store = createStore(
  myReducer,
  applyMiddleware(
    thunk, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
);

const app = (
    <Provider store={store}>
        <BrowserRouter basename={config.basename}>
            {/* basename="/datta-able" */}
            <App />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

serviceWorker.unregister();
