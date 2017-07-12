import fetch from 'isomorphic-fetch'
import {API_ROOT} from '../config'
import {hashHistory} from 'react-router'
import {fetchEndpoint} from '../lib/api'
import {raiseError} from './errors'
export const CLEANBOOKINGDATA = 'CLEANBOOKINGDATA'
export const PERSISTBOOKING = 'PERSISTBOOKING'
export const BOOKING_CLEAN = 'BOOKING_CLEAN'
export const BOOKINGSBYSALON_REQUEST = 'BOOKINGSBYSALON_REQUEST'
export const BOOKINGSBYSALON_SUCCESS = 'BOOKINGSBYSALON_SUCCESS'
export const NEWBOOKING_REQUEST = 'NEWBOOKING_REQUEST'
export const NEWBOOKING_SUCCESS = 'NEWBOOKING_SUCCESS'
export const NEWBOOKING_DATA = 'NEWBOOKING_DATA'
export const BOOKINGSBYCLIENT_REQUEST = 'BOOKINGSBYCLIENT_REQUEST'
export const BOOKINGSBYCLIENT_SUCCESS = 'BOOKINGSBYCLIENT_SUCCESS'
//FETCH BOOKINGS BY SALON
function requestBookingsBySalon() {
  return {type: BOOKINGSBYSALON_REQUEST, isFetching: true}
}
function receiveBookingsBySalon(data, date) {
  return {type: BOOKINGSBYSALON_SUCCESS, isFetching: false, data: data, date: date}
}
export function cleanBookings() {
  return {type: BOOKING_CLEAN}
}
export function fetchBookingsBySalon(id, from_date, to_date) {
  // we first try to see if the from date is already on the state
  const token = localStorage.getItem('token');
  if (!token) {
    hashHistory.replace("/login")
  }
  let url = API_ROOT + 'salon/' + id + '/booking/';
  if (from_date && to_date) {
    url = url + '?from=' + from_date + '&to=' + to_date
  }
  let config = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
  return dispatch => {
    let start_function = () => dispatch(requestBookingsBySalon())
    let complete_function = (_json) => dispatch(receiveBookingsBySalon(_json, from_date))
    let error_500 = () => dispatch(raiseError({code: 500, message: "We had a problem retrieving the bookings in this salon."}))
    let error_400 = (_json) => dispatch(raiseError({code: 400, fields: _json}))
    return fetchEndpoint(url, config, start_function, complete_function, error_500, error_400)
  }
}
//FETCH BOOKINGS BY CLIENT
function requestBookingsByClient(client_id) {
  return {type: BOOKINGSBYCLIENT_REQUEST, isFetching: true, client_id: client_id}
}
function receiveBookingsByClient(data, client_id) {
  return {type: BOOKINGSBYCLIENT_SUCCESS, isFetching: false, data: data, client_id: client_id}
}
function fetchBookingsByClientError(message) {
  return {type: BOOKINGSBYCLIENT_FAILURE, isFetching: false, message}
}
export function fetchBookingsByClient(client_id, salon_id) {
  const token = localStorage.getItem('token');
  if (!token) {
    return fetchBookingsByClientError("error")
  }
  const url = API_ROOT + 'salon/' + salon_id + '/client/' + client_id + '/booking/';
  let config = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
  return dispatch => {
    let start_function = () => dispatch(requestBookingsByClient(client_id))
    let complete_function = (_json) => dispatch(receiveBookingsByClient(_json, client_id))
    let error_500 = () => dispatch(raiseError({code: 500, message: "There was a problem getting the booking for this client"}))
    let error_400 = (_json) => dispatch(raiseError({code: 400, fields: _json}))
    return fetchEndpoint(url, config, start_function, complete_function, error_500, error_400)
  }
}
//CLEAN BOOKING DATA
export function cleanBookingData() {
  return {type: CLEANBOOKINGDATA}
}
//GO BACK TO BOOKING FLAG
export function persistBooking(_flag) {
  return {type: PERSISTBOOKING, flag: _flag}
}
//CREATE NEW BOOKING - EDIT BOOKING
function requestNewBooking() {
  return {type: NEWBOOKING_REQUEST, isFetching: true}
}
function receiveNewBooking(_id, _json, _method) {
  return {type: NEWBOOKING_SUCCESS, isFetching: false, data: _json, id: _id, method: _method}
}
export function saveNewBookingData(_data) {
  return {type: NEWBOOKING_DATA, data: _data}
}
export function fetchNewBooking(_data, _method) {
  const token = localStorage.getItem('token');
  let url = ''
  if (!token) {
    return fetchNewBookingError("error")
  }
  if (_data["id"]) {
    url = API_ROOT + 'salon/' + _data['salon_id'] + '/booking/' + _data["id"] + '/';
  } else {
    url = API_ROOT + 'salon/' + _data['salon_id'] + '/booking/';
  }
  let config = {
    method: _method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
  if (_method != "GET") {
    config['body'] = JSON.stringify(_data)
  }
  return dispatch => {
    let start_function = () => dispatch(requestNewBooking())
    let complete_function = (_json) => dispatch(receiveNewBooking(_data["id"], _json, _method))
    let error_500 = () => dispatch(raiseError({code: 500, message: "There was a problem saving this booking"}))
    let error_400 = (_json) => dispatch(raiseError({code: 400, fields: _json}))
    return fetchEndpoint(url, config, start_function, complete_function, error_500, error_400)
  }
}
