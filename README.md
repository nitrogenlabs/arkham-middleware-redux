# arkham-middleware-redux

ArkhamJS Redux middleware integrates ArkhamJS into existing redux applications to provide access to ArkhamJS features and/or provide a simple migration path to ArkhamJS.

## Installation

```bash
yarn add @nlabs/arkhamjs-middleware-redux
```

## Additional Documentation 

Additional details may be found in the [ArkhamJS Documentation](https://docs.arkhamjs.io).

## Example

An example using the Todo example within the redux repository.

```javascript
import {Logger, LoggerDebugLevel} from '@nlabs/arkhamjs-middleware-logger';
import {createArkhamJSStore} from '@nlabs/arkhamjs-middleware-redux';
import {BrowserStorage} from '@nlabs/arkhamjs-storage-browser';
import {Flux} from 'arkhamjs';
import React from 'react';
import {render} from 'react-dom';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import App from './components/App';
import rootReducer from './reducers';

// Add a console logger for Arkham (optional).
const logger = new Logger({
  debugLevel: LoggerDebugLevel.DISPATCH
});

// ArkhamJS options, leave null if this is a child app.
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