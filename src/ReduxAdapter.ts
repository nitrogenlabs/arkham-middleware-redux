export class ReduxMiddleware {
  name: string;
  reduxStore;

  constructor(reduxStore) {
    this.name = 'reduxAdapter';
    this.reduxStore = reduxStore;

    // Methods
    this.postDispatch = this.postDispatch.bind(this);
  }

  postDispatch(action, nextStore) {
    // ... Alter action if needed
    const {__ARKHAMJS_DISPATCH: isArkhamJS} = action;

    if(!isArkhamJS) {
      action.__ARKHAMJS_DISPATCH = true;
      this.reduxStore.dispatch(action);
    }

    return Promise.resolve(action);
  }
}
