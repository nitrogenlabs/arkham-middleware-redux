# @nlabs/arkhamjs-middleware-redux

ArkhamJS Redux middleware integrates ArkhamJS into existing redux applications to provide access to ArkhamJS features and/or provide a simple migration path to ArkhamJS.

## Installation

```bash
yarn add @nlabs/arkhamjs-middleware-redux
```

## Usage

### `createArkhamStore`

Create a Redux store that creates a two-way binding with ArkhamJS.

```javascript
// Create Redux store
const store = createArkhamStore(rootReducer, statePath, reduxMiddleware, arkhamOptions);

// Example ----------
import {createArkhamStore} from '@nlabs/arkhamjs-middleware-redux';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import App from './components/App';
import {rootReducers} from './reducers';

// Create Redux store
const store = createArkhamStore(rootReducer, 'todos' null, {name: 'reduxTodos'});

// Render root component with store
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

- **rootReducer** - *(Reducer)* Redux root reducer. The reducer created by `combineReducers()`.
- **statePath** - *(string[] | string)* State tree path where to set this branch of the store's state tree.
- **reduxMiddleware** - *(Middleware[])* (optional) Redux middleware. Any additional Redux middleware used in the app.
- **arkhamOptions** - *(FluxOptions)* (optional) ArkhamJS options. Use only if intending to initialize a new instance.

### `ReduxMiddleware`

ArkhamJS middleware to relay dispatched actions to Redux.

```javascript
// Create ArkhamJS middleware
const reduxMiddleware = new ReduxMiddleware(statePath, store);

// Example ----------
import {ReduxMiddleware} from '@nlabs/arkhamjs-middleware-redux';
import {createStore} from 'redux';
import {rootReducers} from './reducers';

const store = createStore(rootReducers);
const middleware = [new ReduxMiddleware('myApp', store)];

Flux.init({middleware});
```

- **statePath** - *(string[] | string)* State tree path where to set this branch of the store's state tree.
- **store** - *(Store)* Redux root store. The store created by `createStore()`.

### `arkhamMiddleware`

Redux middleware to relay Redux action dispatches to ArkhamJS.

```javascript
// Create Redux middleware
const middleware = arkhamMiddleware(statePath);

// Example ----------
import {arkhamMiddleware} from '@nlabs/arkhamjs-middleware-redux';
import {applyMiddleware, createStore} from 'redux';

const store = createStore(rootReducer, applyMiddleware(arkhamMiddleware('myApp')));
```

- **statePath** - *(string[] | string)* State tree path where to set this branch of the store's state tree.

## Additional Documentation 

Additional details may be found in the [ArkhamJS Documentation](https://docs.arkhamjs.io).

## Examples

The following are examples using the [Todo example](https://github.com/reactjs/redux/tree/master/examples/todos) within the Redux repository.

### Example 1: Integrate with existing ArkhamJS app.

Full example. This scenario is recommended if migrating from Redux to ArkhamJS. This will call `Flux.init()` manually. The middleware will be added using the `Flux.addMiddleware()` automatically via the `createArkhamStore()` function.

```javascript
import {Logger, LoggerDebugLevel} from '@nlabs/arkhamjs-middleware-logger';
import {createArkhamStore} from '@nlabs/arkhamjs-middleware-redux';
import {BrowserStorage} from '@nlabs/arkhamjs-storage-browser';
import {Flux} from 'arkhamjs';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/App';
import rootReducer from './reducers';

// Add a console logger for Arkham (optional).
const logger = new Logger({
  debugLevel: LoggerDebugLevel.DISPATCH
});

// Initialize ArkhamJS.
const Flux.init({
  name: 'reduxDemo', // Optional name of application, defaults to 'arkhamjs'
  storage: new BrowserStorage(), // Optional persistent storage cache
  middleware: [logger] // Optional console logger
});

// Create an ArkhamJS store for Redux
const store = createArkhamStore(rootReducer, 'demo');

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```


### Example 2: Add as a new integrated app

Simplified root level app setup. This method will call `Flux.init()` with the configuration options provided. The middleware will be appended to the list of middleware added in the options via the `createArkhamStore()` function.

```javascript
import {Logger, LoggerDebugLevel} from '@nlabs/arkhamjs-middleware-logger';
import {createArkhamStore} from '@nlabs/arkhamjs-middleware-redux';
import {BrowserStorage} from '@nlabs/arkhamjs-storage-browser';
import {Flux} from 'arkhamjs';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/App';
import rootReducer from './reducers';

// Add a console logger for Arkham (optional).
const logger = new Logger({
  debugLevel: LoggerDebugLevel.DISPATCH
});

// ArkhamJS options. If options are set, will call Flux.init(), 
// otherwise will call Flux.addMiddleware().
const arkhamOptions = {
  name: 'reduxDemo', // Optional name of application, defaults to 'arkhamjs'
  storage: new BrowserStorage(), // Optional persistent storage cache
  middleware: [logger] // Optional console logger
};

// Create an ArkhamJS store for Redux
const store = createArkhamStore(rootReducer, 'demo', null, arkhamOptions);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```


### Example 3: Add as a child app

Nested child app example. In this scenario, Flux.init() is already called in the root.

```javascript
import {createArkhamStore} from '@nlabs/arkhamjs-middleware-redux';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/App';
import rootReducer from './reducers';

// Create an ArkhamJS store for Redux
const store = createArkhamStore(rootReducer, 'app.demo');

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```