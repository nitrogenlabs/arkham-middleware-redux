/**
 * Copyright (c) 2018-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {Flux, FluxOptions} from 'arkhamjs';
import {applyMiddleware, createStore, Middleware, Reducer, Store} from 'redux';
import {arkhamMiddleware} from './middleware/arkhamMiddleware';
import {ReduxMiddleware} from './middleware/ReduxMiddleware';

export interface ReduxWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION__: () => void;
}

declare let window: ReduxWindow;

export const createArkhamStore = (
  rootReducer: Reducer<any>,
  statePath: string,
  reduxMiddleware: Middleware[],
  arkhamOptions: FluxOptions
): Store<any> => {
  reduxMiddleware = reduxMiddleware || [];

  // Add the listener via middleware
  const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
  const store = createStore(rootReducer, devTools, applyMiddleware(...reduxMiddleware, arkhamMiddleware(statePath)));

  // Add redux middleware to Arkham to relay dispatches to Redux
  const {middleware = [], ...options} = arkhamOptions;
  middleware.push(new ReduxMiddleware(statePath, store));

  // Initialize ArkhamJS
  if(options) {
    Flux.init({...options, middleware});
  } else {
    Flux.addMiddleware(middleware);
  }

  // Save initial state tree
  Flux.onInit(() => {
    Flux.setState(statePath, store.getState());
  });

  return store;
};
