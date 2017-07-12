import fetch from 'isomorphic-fetch'
import {API_ROOT} from '../config'
import {hashHistory} from 'react-router'
import {fetchEndpoint} from '../lib/api'
import {raiseError} from './errors'
export const CLEAN_ALL_DATA = 'CLEAN_ALL_DATA'
export const STYLISTSBYSALON_REQUEST = 'STYLISTSBYSALON_REQUEST'
export const STYLISTSBYSALON_SUCCESS = 'STYLISTSBYSALON_SUCCESS'
export const CLIENTSBYSALON_REQUEST = 'CLIENTSBYSALON_REQUEST'
export const CLIENTSBYSALON_SUCCESS = 'CLIENTSBYSALON_SUCCESS'
export const CLIENTSSEARCHBYSALON_REQUEST = 'CLIENTSSEARCHBYSALON_REQUEST'
export const CLIENTSSEARCHBYSALON_SUCCESS = 'CLIENTSSEARCHBYSALON_SUCCESS'
export const SERVICESBYSALON_REQUEST = 'SERVICESBYSALON_REQUEST'
export const SERVICESBYSALON_SUCCESS = 'SERVICESBYSALON_SUCCESS'
export const CLIENT_REQUEST = 'CLIENT_REQUEST'
export const CLIENT_SUCCESS = 'CLIENT_SUCCESS'
export const SERVICE_REQUEST = 'SERVICE_REQUEST'
export const SERVICE_SUCCESS = 'SERVICE_SUCCESS'
export const STYLIST_REQUEST = 'STYLIST_REQUEST'
export const STYLIST_SUCCESS = 'STYLIST_SUCCESS'
export const CATEGORIES_REQUEST = 'CATEGORIES_REQUEST'
export const CATEGORIES_SUCCESS = 'CATEGORIES_SUCCESS'
//STYLISTS BY SALON
function requestStylistsBySalon() {
  return {type: STYLISTSBYSALON_REQUEST, isFetching: true}
}
function receiveStylistsBySalon(data) {
  return {type: STYLISTSBYSALON_SUCCESS, isFetching: false, data: data}
}
export function cleanAllData() {
  return {type: CLEAN_ALL_DATA}
}
export function fetchStylistsBySalon(id) {
  const token = localStorage.getItem('token');
  if (!token) {
    hashHistory.replace("/login")
  }
  const url = API_ROOT + 'salon/' + id + '/stylist/';
  let config = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
  // return (fullied promise)
  return dispatch => {
    let start_function = () => dispatch(requestStylistsBySalon())
    let complete_function = (_json) => dispatch(receiveStylistsBySalon(_json))
    let error_500 = () => dispatch(raiseError({code: 500, message: "We had a problem retrieving the stylists in this salon."}))
    let error_400 = (_json) => dispatch(raiseError({code: 400, fields: _json}))
    return fetchEndpoint(url, config, start_function, complete_function, error_500, error_400)
  }
}
//CLIENTS BY SALON
function requestClientsBySalon() {
  return {type: CLIENTSBYSALON_REQUEST, isFetching: true}
}
function receiveClientsBySalon(clients) {
  return {type: CLIENTSBYSALON_SUCCESS, isFetching: false, clients: clients}
}
export function fetchClientsBySalon(id) {
  const token = localStorage.getItem('token');
  if (!token) {
    hashHistory.replace("/login")
  }
  const url = API_ROOT + 'salon/' + id + '/client/';
  let config = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
  return dispatch => {
    let start_function = () => dispatch(requestClientsBySalon())
    let complete_function = (_json) => dispatch(receiveClientsBySalon(_json))
    let error_500 = () => dispatch(raiseError({code: 500, message: "We had a problem retrieving the clients in this salon."}))
    let error_400 = (_json) => dispatch(raiseError({code: 400, fields: _json}))
    return fetchEndpoint(url, config, start_function, complete_function, error_500, error_400)
  }
}
//CLIENTS BY SALON
function requestSearchClientsBySalon() {
  return {type: CLIENTSSEARCHBYSALON_REQUEST, isFetching: true}
}
function receiveSearchClientsBySalon(clients) {
  return {type: CLIENTSSEARCHBYSALON_SUCCESS, isFetching: false, clients: clients}
}
export function fetchSearchClientsBySalon(id, query) {
  const token = localStorage.getItem('token');
  if (!token) {
    hashHistory.replace("/login")
  }
  const url = API_ROOT + 'salon/' + id + '/client/search/?query=' + query;
  let config = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
  return dispatch => {
    let start_function = () => dispatch(requestSearchClientsBySalon())
    let complete_function = (_json) => dispatch(receiveSearchClientsBySalon(_json))
    let error_500 = () => dispatch(raiseError({code: 500, message: "We had a problem retrieving this search."}))
    let error_400 = (_json) => dispatch(raiseError({code: 400, fields: _json}))
    return fetchEndpoint(url, config, start_function, complete_function, error_500, error_400)
  }
}
//SERVICES BY SALON
function requestServicesBySalon() {
  return {type: SERVICESBYSALON_REQUEST, isFetching: true}
}
function receiveServicesBySalon(services) {
  return {type: SERVICESBYSALON_SUCCESS, isFetching: false, services: services}
}
export function fetchServicesBySalon(id) {
  const token = localStorage.getItem('token');
  if (!token) {
    hashHistory.replace("/login")
  }
  const url = API_ROOT + 'salon/' + id + '/service/';
  let config = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
  return dispatch => {
    let start_function = () => dispatch(requestServicesBySalon())
    let complete_function = (_json) => dispatch(receiveServicesBySalon(_json))
    let error_500 = () => dispatch(raiseError({code: 500, message: "We had a problem retrieving the services in this salon."}))
    let error_400 = (_json) => dispatch(raiseError({code: 400, fields: _json}))
    return fetchEndpoint(url, config, start_function, complete_function, error_500, error_400)
  }
}
//CATEGORIES
function requestCategories() {
  return {type: CATEGORIES_REQUEST, isFetching: true}
}
function receiveCategories(categories) {
  return {type: CATEGORIES_SUCCESS, isFetching: false, categories: categories}
}
export function fetchCategories() {
  const token = localStorage.getItem('token');
  if (!token) {
    hashHistory.replace("/login")
  }
  const url = API_ROOT + 'category/';
  let config = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
  return dispatch => {
    let start_function = () => dispatch(requestCategories())
    let complete_function = (_json) => dispatch(receiveCategories(_json))
    let error_500 = () => dispatch(raiseError({code: 500, message: "We had a problem retrieving the categories in this salon."}))
    let error_400 = (_json) => dispatch(raiseError({code: 400, fields: _json}))
    return fetchEndpoint(url, config, start_function, complete_function, error_500, error_400)
  }
}
//EDIT-NEW CLIENT
function requestClient() {
  return {type: CLIENT_REQUEST, isFetching: true}
}
function receiveClient(_json) {
  return {type: CLIENT_SUCCESS, isFetching: false, received: _json}
}
export function fetchClient(salon_id, _data, _method) {
  const token = localStorage.getItem('token');
  let url = ''
  let method = _method
  if (!token) {
    hashHistory.replace("/login")
  }
  if (_data["id"]) {
    url = API_ROOT + 'salon/' + salon_id + '/client/' + _data["id"] + '/';
  } else {
    url = API_ROOT + 'salon/' + salon_id + '/client/';
  }
  let config = {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
  if (_method == 'POST' || _method == "PUT" || _method == "DELETE") {
    config['body'] = JSON.stringify(_data)
  }
  return dispatch => {
    let start_function = () => dispatch(requestClient())
    let complete_function = (_json) => dispatch(receiveClient(_json))
    let error_500 = () => dispatch(raiseError({code: 500, message: "We had a problem retrieving this client"}))
    let error_400 = (_json) => dispatch(raiseError({code: 400, fields: _json}))
    return fetchEndpoint(url, config, start_function, complete_function, error_500, error_400)
  }
}
//EDIT-NEW SERVICE
function requestService() {
  return {type: SERVICE_REQUEST, isFetching: true}
}
function receiveService(_json) {
  return {type: SERVICE_SUCCESS, isFetching: false, received: _json}
}
export function fetchService(_data, _method, id) {
  const token = localStorage.getItem('token');
  let url = ''
  let method = _method
  if (!token) {
    hashHistory.replace("/login")
  }
  if (_data["id"]) {
    url = API_ROOT + 'salon/' + id + '/service/' + _data["id"] + '/';
  } else {
    url = API_ROOT + 'salon/' + id + '/service/';
  }
  let config = {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
  if (_method == 'POST' || _method == 'PUT' || _method == "DELETE") {
    config['body'] = JSON.stringify(_data)
  }
  return dispatch => {
    let start_function = () => dispatch(requestService())
    let complete_function = (_json) => dispatch(receiveService(_json))
    let error_500 = () => dispatch(raiseError({code: 500, message: "We had a problem retrieving this client"}))
    let error_400 = (_json) => dispatch(raiseError({code: 400, fields: _json}))
    return fetchEndpoint(url, config, start_function, complete_function, error_500, error_400)
  }
}
//SALONS BY USER
function requestSalonsByUser() {
  return {type: SALONSBYUSER_REQUEST, isFetching: true}
}
function receiveSalonsByUser(data) {
  return {type: SALONSBYUSER_SUCCESS, isFetching: false, data: data}
}
export function fetchSalonsByUser() {
  const token = localStorage.getItem('token');
  if (!token) {
    hashHistory.replace("/login")
  }
  const url = API_ROOT + 'salon/';
  let config = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
  return dispatch => {
    let start_function = () => dispatch(requestSalonsByUser())
    let complete_function = (_json) => dispatch(receiveSalonsByUser(_json))
    let error_500 = () => dispatch(raiseError({code: 500, message: "We had a problem retrieving your salons."}))
    let error_400 = (_json) => dispatch(raiseError({code: 400, fields: _json}))
    return fetchEndpoint(url, config, start_function, complete_function, error_500, error_400)
  }
}
//stylist
function requestStylist() {
  return {type: STYLIST_REQUEST, isFetching: true}
}
export function receiveStylist(_json) {
  return {type: STYLIST_SUCCESS, isFetching: false, received: _json}
}
export function fetchStylist(salon_id, _data, _method) {
  const token = localStorage.getItem('token');
  let url = ''
  let method = _method
  if (!token) {
    hashHistory.replace("/login")
  }
  if (_data["id"]) {
    url = API_ROOT + 'salon/' + salon_id + '/stylist/' + _data["id"] + '/';
  } else {
    url = API_ROOT + 'salon/' + salon_id + '/stylist/';
  }
  let config = {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
  if (_method == 'POST' || _method == "PUT" || _method == "DELETE") {
    config['body'] = JSON.stringify(_data)
  }
  return dispatch => {
    let start_function = () => dispatch(requestStylist())
    let complete_function = (_json) => dispatch(receiveStylist(_json))
    let error_500 = () => dispatch(raiseError({code: 500, message: "We had a problem saving this stylist"}))
    let error_400 = (_json) => dispatch(raiseError({code: 400, fields: _json}))
    return fetchEndpoint(url, config, start_function, complete_function, error_500, error_400)
  }
}
