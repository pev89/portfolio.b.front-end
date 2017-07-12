import fetch from 'isomorphic-fetch'
import {API_ROOT} from '../config'
import {fetchEndpoint} from '../lib/api'
import {raiseError} from './errors'
export const RECOVERY_REQUEST = 'RECOVERY_REQUEST'
export const RECOVERY_SUCCESS = 'RECOVERY_SUCCESS'
export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const SET_REDIRECT = 'SET_REDIRECT'
//LOGIN
function requestLogin(creds) {
  return {type: LOGIN_REQUEST, isFetching: true, isAuthenticated: false}
}
function receiveLogin(auth) {
  return {type: LOGIN_SUCCESS, isFetching: false, isAuthenticated: true, token: auth.token}
}
export function loginUser(creds) {
  const url = API_ROOT + 'login/';
  let config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(creds)
  }
  return dispatch => {
    let start_function = () => dispatch(requestLogin(creds))
    let additional_function = (_json) => {
      localStorage.setItem('token', _json.token)
      var now = new Date().getTime();
      localStorage.setItem('token_time', now)
    }
    let complete_function = (_json) => dispatch(receiveLogin(_json))
    let error_500 = () => dispatch(raiseError({code: 500, message: "Login Error, please retry in a few minutes."}))
    let error_400 = (_json) => dispatch(raiseError({code: 400, fields: _json}))
    return fetchEndpoint(url, config, start_function, complete_function, error_500, error_400, additional_function)
  }
}
//LOGOUT
function receiveLogout() {
  return {type: LOGOUT_SUCCESS, isFetching: false, isAuthenticated: false}
}
export function logoutUser() {
  return dispatch => {
    localStorage.removeItem('token')
    localStorage.removeItem('token_time')
    dispatch(receiveLogout())
  }
}
//SET REDIRECTS FOR LOGIN
export function setRedirectUrl(redirectUrl) {
  return {type: SET_REDIRECT, redirectUrl: redirectUrl}
}
//RECOVERY
function requestRecovery(creds) {
  return {type: RECOVERY_REQUEST, isFetching: true, isAuthenticated: false}
}
function receiveRecovery(auth) {
  return {type: RECOVERY_SUCCESS, isFetching: false, isAuthenticated: true, token: auth.token}
}
export function recoveryUser(creds, method) {
  let url = API_ROOT + 'user/recovery/';
  let config = {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  if (method != "GET") {
    config['body'] = JSON.stringify(creds)
  } else {
    url = url + '?phone=' + creds.phone;
  }
  return dispatch => {
    let start_function = () => dispatch(requestRecovery(creds))
    let complete_function = (_json) => dispatch(receiveRecovery(_json))
    let error_500 = () => dispatch(raiseError({code: 500, message: "RecoVery Error, please retry in a few minutes."}))
    let error_400 = (_json) => dispatch(raiseError({code: 400, fields: _json}))
    return fetchEndpoint(url, config, start_function, complete_function, error_500, error_400)
  }
}
