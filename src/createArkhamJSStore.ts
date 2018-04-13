/**
 * Copyright (c) 2018-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {Flux} from 'arkhamjs';
import {applyMiddleware, createStore, Store} from 'redux';
import {arkhamJSMiddleware} from './middleware/arkhamJSMiddleware';
import {ReduxMiddleware} from './middleware/ReduxMiddleware';

export interface ReduxWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION__: () => void;
}

declare let window: ReduxWindow;

export const createArkhamJSStore = (rootReducer, reduxMiddleware = [], statePath, fluxOptions): Store<any> => {
  // Add the listener via middleware
  const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
  const store = createStore(rootReducer, devTools, applyMiddleware(...reduxMiddleware, arkhamJSMiddleware(statePath)));

  // Add redux middleware to Arkham to relay dispatches to Redux
  const {middleware = [], ...options} = fluxOptions;
  middleware.push(new ReduxMiddleware(statePath, store));
  options.middleware = middleware;

  // Initialize ArkhamJS
  if(options) {
    Flux.init(options);
  } else {
    Flux.addMiddleware(middleware);
  }

  // Save initial state tree
  Flux.onInit(() => {
    Flux.setState(statePath, store.getState());
  });

  return store;
};
