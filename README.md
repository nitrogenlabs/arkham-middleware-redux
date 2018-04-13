# @nlabs/arkham-middleware-redux

ArkhamJS Redux middleware integrates ArkhamJS into existing redux applications to provide access to ArkhamJS features and/or provide a simple migration path to ArkhamJS.

## Installation

```bash
yarn add @nlabs/arkhamjs-middleware-redux
```

## Additional Documentation 

Additional details may be found in the [ArkhamJS Documentation](https://docs.arkhamjs.io).

## Examples

The following are examples using the [Todo example](https://github.com/reactjs/redux/tree/master/examples/todos) within the Redux repository.

### Example: Integrate with existing ArkhamJS app.

Full example. This scenario is recommended if migrating from Redux to ArkhamJS. This will call `Flux.init()` manually. The middleware will be added using the `Flux.addMiddleware()` automatically via the `createArkhamJSStore()` function.

```javascript
import {Logger, LoggerDebugLevel} from '@nlabs/arkhamjs-middleware-logger';
import {createArkhamJSStore} from '@nlabs/arkhamjs-middleware-redux';
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
const store = createArkhamJSStore(rootReducer, [], 'app.demo');

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```


### Example: Add as a new integrated app

Simplified root level app setup. This method will call `Flux.init()` with the configuration options provided. The middleware will be appended to the list of middleware added in the options via the `createArkhamJSStore()` function.

```javascript
import {Logger, LoggerDebugLevel} from '@nlabs/arkhamjs-middleware-logger';
import {createArkhamJSStore} from '@nlabs/arkhamjs-middleware-redux';
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
const arkhamJSOptions = {
  name: 'reduxDemo', // Optional name of application, defaults to 'arkhamjs'
  storage: new BrowserStorage(), // Optional persistent storage cache
  middleware: [logger] // Optional console logger
};

// Create an ArkhamJS store for Redux
const store = createArkhamJSStore(rootReducer, [], 'app.demo', arkhamJSOptions);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```


### Example: Add as a child app

Nested child app example. In this scenario, Flux.init() is already called in the root.

```javascript
import {createArkhamJSStore} from '@nlabs/arkhamjs-middleware-redux';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/App';
import rootReducer from './reducers';

// Create an ArkhamJS store for Redux
const store = createArkhamJSStore(rootReducer, [], 'app.demo');

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```