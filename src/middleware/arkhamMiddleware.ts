/**
 * Copyright (c) 2018-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {Flux} from 'arkhamjs';
import {Middleware} from 'redux';

export const arkhamMiddleware = (statePath: string): Middleware => (store) => (next) => (action: any) => {
  const {__ARKHAMJS_DISPATCH: isArkhamJS} = action;
  delete action.__ARKHAMJS_DISPATCH;

  // Run the action through the redux reducers
  next(action);

  // Save the new, altered state within ArkhamJS
  Flux.setState(statePath, store.getState());

  // Make sure we emit the event through ArkhamJS for any listeners.
  if(!isArkhamJS) {
    action.__ARKHAMJS_DISPATCH = true;
    Flux.dispatch(action);
  }

  return null;
};
