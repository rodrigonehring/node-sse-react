import { createStore } from 'redux'

function reducer(state = { olar: true }, action) {
  // For now, don't handle any actions
  // and just return the state given to us.
  return state
}

export default function() {
  return createStore(
    reducer, /* preloadedState, */
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}
