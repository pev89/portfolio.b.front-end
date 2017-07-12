import {combineReducers} from 'redux'
import jwt_decode from 'jwt-decode'
import {LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_SUCCESS, SET_REDIRECT} from '../actions/authentication'
//clear the token if is more than 24h old
function checkExpiration() {
  var now = new Date().getTime();
  var setupTime = localStorage.getItem('token_time');
  if (!setupTime) {
    return false
  } else if (now - setupTime > 24 * 60 * 60 * 1000) { //expiry 24h
    localStorage.clear()
    return false
  } else {
    return true
  }
}
function getUserInfosFromToken() {
  var token = localStorage.getItem('token');
  if (token) {
    var decoded = jwt_decode(token);
    return decoded
  } else
    return {}
  }
function authentication(state = {
  isFetching: false,
  isAuthenticated: checkExpiration()
    ? true
    : false,
  user: getUserInfosFromToken()
}, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false
      })
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        user: getUserInfosFromToken()
      })
    case SET_REDIRECT:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        redirectUrl: action.redirectUrl
      })
    default:
      return state
  }
}
export default authentication
