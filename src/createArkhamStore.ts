/**
 * Copyright (c) 2018-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {Flux} from 'arkhamjs';
import isPlainObject from 'lodash/isPlainObject';
import merge from 'lodash/merge';
import {AnyAction, applyMiddleware, createStore, Dispatch, Middleware, Store} from 'redux';
import {arkhamMiddleware} from './middleware/arkhamMiddleware';
import {ReduxMiddleware} from './middleware/ReduxMiddleware';

export interface ArkhamReduxStoreType {
  arkhamMiddleware: any[];
  devTools: any;
  flux: any;
  reducers: Dispatch<AnyAction>;
  reduxMiddleware: Middleware[];
  statePath: string;
}

export const createArkhamStore = (configuration: ArkhamReduxStoreType): Store<any> => {
  const {
    arkhamMiddleware: middleware = [],
    flux,
    reducers,
    statePath = '',
    reduxMiddleware = [],
    devTools
  } = configuration;

  // Save initial state tree
  const {storage} = Flux.getOptions();
  let store: Store;

  if(storage) {
    const cachedState = Flux.getState(statePath);

    if(devTools) {
      store = createStore(
        devTools(reducers, cachedState),
        applyMiddleware(...reduxMiddleware, arkhamMiddleware(statePath, flux)));
    } else {
      store = createStore(
        reducers,
        cachedState,
        applyMiddleware(...reduxMiddleware, arkhamMiddleware(statePath, flux)));
    }

    if(cachedState === undefined) {
      const stateTree = store.getState();
      const updatedState = isPlainObject(stateTree) ? merge(stateTree, cachedState) : stateTree;
      Flux.setState(statePath, updatedState);
    }
  } else {
    store = createStore(
      reducers,
      devTools,
      applyMiddleware(...reduxMiddleware, arkhamMiddleware(statePath, flux))
    );

    Flux.setState(statePath, store.getState());
  }

  // Add redux middleware to Arkham to relay dispatches to Redux
  middleware.push(new ReduxMiddleware(store, statePath));

  // Initialize ArkhamJS
  Flux.addMiddleware(middleware);

  return store;
};
