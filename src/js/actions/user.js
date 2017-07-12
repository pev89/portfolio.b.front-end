import fetch from 'isomorphic-fetch'
import {API_ROOT} from '../config'
import {hashHistory} from 'react-router'
import {fetchEndpoint} from '../lib/api'
import {raiseError} from './errors'

export const SALONSBYUSER_REQUEST = 'SALONSBYUSER_REQUEST'
export const SALONSBYUSER_SUCCESS = 'SALONSBYUSER_SUCCESS'

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
