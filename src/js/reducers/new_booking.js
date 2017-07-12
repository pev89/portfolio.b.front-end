import {combineReducers} from 'redux'
import {
  putInList,
  putListInList,
  remove,
  removeFromListWithId,
  createDateIndex,
  createIndex
} from '../lib/redux_functions'
import {NEWBOOKING_REQUEST, NEWBOOKING_SUCCESS, NEWBOOKING_DATA, CLEANBOOKINGDATA} from '../actions/booking'
import {CLEAN_ALL_DATA} from '../actions/salon'
let initState = {
  isFetching: false,
  errorMessage: '',
  data: null
}
function new_booking(state = initState, action) {
  switch (action.type) {
    case CLEAN_ALL_DATA:
      return initState;
    case NEWBOOKING_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case NEWBOOKING_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorMessage: '',
        data: null
      }
    case NEWBOOKING_DATA:
      return {
        ...state,
        isFetching: false,
        errorMessage: '',
        data: action.data
      }
    case CLEANBOOKINGDATA:
      return {
        ...state,
        isFetching: false,
        errorMessage: '',
        data: null
      }
    default:
      return state
  }
}
export default new_booking
