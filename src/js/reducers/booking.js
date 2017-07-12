import {combineReducers} from 'redux'
import {
  putInList,
  putListInList,
  remove,
  removeFromListWithId,
  createDateIndex,
  createIndex
} from '../lib/redux_functions'
import moment from 'moment'
import {
  BOOKING_CLEAN,
  BOOKINGSBYSALON_REQUEST,
  BOOKINGSBYSALON_SUCCESS,
  BOOKINGSBYCLIENT_REQUEST,
  BOOKINGSBYCLIENT_SUCCESS,
  NEWBOOKING_SUCCESS,
  PERSISTBOOKING
} from '../actions/booking'
import {CLEAN_ALL_DATA} from '../actions/salon'
let initState = {
  bookings: [],
  bookings_date_index: {},
  bookings_index: {},
  isFetching: false,
  date: {},
  go_back_to_booking: false,
  bookingsByClient: {
    isFetching: false,
    bookings: [],
    client_id: null,
    date: null
  }
}
function booking(state = initState, action) {
  let newState;
  switch (action.type) {
    case CLEAN_ALL_DATA:
      return initState;
    case BOOKING_CLEAN:
      return initState;
    case BOOKINGSBYSALON_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case BOOKINGSBYSALON_SUCCESS:
      newState = JSON.parse(JSON.stringify(state));
      newState['bookings'] = putListInList(newState['bookings'], action.data);
      newState['bookings_date_index'] = createDateIndex(newState['bookings']);
      newState['bookings_index'] = createIndex(newState['bookings']);
      newState['date'][action.date] = moment().toISOString();
      newState['isFetching'] = false
      return newState
    case BOOKINGSBYCLIENT_REQUEST:
      return {
        ...state,
        bookingsByClient: {
          isFetching: true,
          bookings: [],
          client_id: action.client_id,
          date: moment().toISOString()
        }
      }
    case BOOKINGSBYCLIENT_SUCCESS:
      newState = JSON.parse(JSON.stringify(state));
      newState['bookings'] = putListInList(newState['bookings'], action.data);
      newState['bookings_date_index'] = createDateIndex(newState['bookings']);
      newState['bookings_index'] = createIndex(newState['bookings']);
      newState['bookingsByClient'] = {
        isFetching: false,
        bookings: action.data,
        client_id: action.client_id,
        date: moment().toISOString()
      }
      return newState
    case NEWBOOKING_SUCCESS:
      newState = JSON.parse(JSON.stringify(state));
      if (action.method == "DELETE") {
        newState['bookings'] = removeFromListWithId(newState['bookings'], action.id);
      } else {
        newState['bookings'] = putInList(newState['bookings'], action.data);
      }
      newState['bookings_date_index'] = createDateIndex(newState['bookings']);
      newState['bookings_index'] = createIndex(newState['bookings']);
      newState['new_booking_edit'] = {
        isFetching: false,
        errorMessage: '',
        data: null
      }
      return newState
    case PERSISTBOOKING:
      return {
        ...state,
        persist_booking: action.flag
      }
    default:
      return state
  }
}
export default booking
