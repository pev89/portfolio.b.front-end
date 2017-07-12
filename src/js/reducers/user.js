import {combineReducers} from 'redux'
import {SALONSBYUSER_REQUEST, SALONSBYUSER_SUCCESS} from '../actions/user'
function user(state = {
  salonsByUser: {
    isFetching: false,
    data: []
  }
}, action) {
  let newState = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    case SALONSBYUSER_REQUEST:
      newState['salonsByUser'] = {
        isFetching: true
      }
      return newState
    case SALONSBYUSER_SUCCESS:
      newState['salonsByUser'] = {
        isFetching: false,
        data: action.data
      }
      return newState
    default:
      return state
  }
}
export default user
