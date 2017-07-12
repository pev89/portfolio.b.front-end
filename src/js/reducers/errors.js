import {combineReducers} from 'redux'
import {ERROR, CLEAN_ERROR} from '../actions/errors'
import {CLEAN_ALL_DATA} from '../actions/salon'
let initState = {
  isError: false
}
function errors(state = initState, action) {
  switch (action.type) {
    case CLEAN_ALL_DATA:
      return initState;
    case ERROR:
      let newState = action.error
      newState['isError'] = true
      return newState
    case CLEAN_ERROR:
      return {
        ...state,
        isError: false
      }
    default:
      return state
  }
}
export default errors
