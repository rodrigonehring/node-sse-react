import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'

import mySaga from './sagas'
import rootReducer from './reducers/rootReducer'


export default function(initialState) {
  // create the saga middleware
  const sagaMiddleware = createSagaMiddleware()
  const middlewares = [ sagaMiddleware ]

  // redux devtools extension chrome
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const finalCreateStore = composeEnhancers(
    applyMiddleware(...middlewares))
    (createStore)

  // mount it on the Store
  const store = finalCreateStore(rootReducer, initialState)

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('./reducers/rootReducer.js', () =>
      store.replaceReducer(require('./reducers/rootReducer').default)
    );
  }

  // then run the saga
  sagaMiddleware.run(mySaga)

  return store;
}
