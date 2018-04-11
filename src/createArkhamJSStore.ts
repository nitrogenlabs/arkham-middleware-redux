import {Flux} from 'arkhamjs';
import {createStore} from 'redux';

export const createArkhamJSStore = (reducer, reduxMiddleware = [], statePath, fluxOptions) => {
  const arkhamMiddleware = store => next => action => {
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
  };

  // Add the listener via middleware
  const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
  const store = createStore(rootReducer, devTools, applyMiddleware(...reduxMiddleware, arkhamMiddleware));

  // Add redux middleware to Arkham to relay dispatches to Redux
  const {middleware = [], ...options} = fluxOptions;
  middleware.push(new ReduxMiddleware(store));
  options.middleware = middleware;

  // Initialize ArkhamJS
  if(options) {
    Flux.init(options);
  }

  // Save initial state tree
  Flux.onInit(() => {
    Flux.setState(statePath, store.getState());
  });

  return store;
};
