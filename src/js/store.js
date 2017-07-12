import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import * as reducers from './reducers'
import ravenMiddleware from './middleware/raven'

const rootReducers = combineReducers({
  ...reducers
})

function wrappedReducers(state, action){
  if (action.type === 'LOGOUT_SUCCESS') {
    state = undefined
  }

  return rootReducers(state, action)
}

export default function configureStore(initialState) {
  return createStore(
    wrappedReducers,
    compose(
      applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
        ravenMiddleware
      ),
      window.devToolsExtension ? window.devToolsExtension() : f => f
      )
    )
}
