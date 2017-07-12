import {combineReducers} from 'redux'
import {putInList, putListInList, remove} from '../lib/redux_functions'
import {
  CLEAN_ALL_DATA,
  STYLISTSBYSALON_REQUEST,
  STYLISTSBYSALON_SUCCESS,
  CLIENTSBYSALON_REQUEST,
  CLIENTSBYSALON_SUCCESS,
  SERVICESBYSALON_REQUEST,
  SERVICESBYSALON_SUCCESS,
  CLIENT_REQUEST,
  CLIENT_SUCCESS,
  SERVICE_REQUEST,
  SERVICE_SUCCESS,
  STYLIST_REQUEST,
  STYLIST_SUCCESS,
  CATEGORIES_REQUEST,
  CATEGORIES_SUCCESS,
  CLIENTSSEARCHBYSALON_REQUEST,
  CLIENTSSEARCHBYSALON_SUCCESS
} from '../actions/salon'
//reducers
let initState = {
  stylistsBySalon: {
    isFetching: false,
    stylists: []
  },
  clientsBySalon: {
    isFetching: false,
    clients: []
  },
  servicesBySalon: {
    isFetching: false,
    services: []
  },
  clientsSearchBySalon: {
    isFetching: false,
    clients: []
  },
  categories: {
    isFetching: false,
    categories: []
  },
  edit_client: {
    isFetching: false,
    data: undefined
  },
  edit_service: {
    isFetching: false,
    data: undefined
  },
  edit_stylist: {
    isFetching: false,
    data: undefined
  }
}
function salon(state = initState, action) {
  let newState;
  switch (action.type) {
    case CLEAN_ALL_DATA:
      return initState;
    case STYLISTSBYSALON_REQUEST:
      return {
        ...state,
        stylistsBySalon: {
          ...state.stylistsBySalon,
          isFetching: true
        }
      }
    case STYLISTSBYSALON_SUCCESS:
      newState = JSON.parse(JSON.stringify(state));
      newState['stylistsBySalon']['stylists'] = putListInList(newState['stylistsBySalon']['stylists'], action.data);
      newState['stylistsBySalon']['isFetching'] = false;
      return newState
    case CLIENTSBYSALON_REQUEST:
      return {
        ...state,
        clientsBySalon: {
          ...state.clientsBySalon,
          isFetching: true
        }
      }
    case CLIENTSBYSALON_SUCCESS:
      newState = JSON.parse(JSON.stringify(state));
      newState['clientsBySalon']['clients'] = putListInList(newState['clientsBySalon']['clients'], action.clients);
      newState['clientsBySalon']['isFetching'] = false;
      return newState
    case CLIENTSSEARCHBYSALON_REQUEST:
      return {
        ...state,
        clientsSearchBySalon: {
          ...state.clientsSearchBySalon,
          isFetching: true
        }
      }
    case CLIENTSSEARCHBYSALON_SUCCESS:
      return {
        ...state,
        clientsSearchBySalon: {
          isFetching: false,
          clients: action.clients
        }
      }
    case SERVICESBYSALON_REQUEST:
      return {
        ...state,
        servicesBySalon: {
          ...state.servicesBySalon,
          isFetching: true
        }
      }
    case SERVICESBYSALON_SUCCESS:
      newState = JSON.parse(JSON.stringify(state));
      newState['servicesBySalon']['services'] = putListInList(newState['servicesBySalon']['services'], action.services);
      newState['servicesBySalon']['isFetching'] = false
      return newState
    case CLIENT_REQUEST:
      return {
        ...state,
        edit_client: {
          ...state.edit_client,
          isFetching: true
        }
      }
    case CLIENT_SUCCESS:
      newState = JSON.parse(JSON.stringify(state));
      newState['clientsBySalon']['clients'] = putInList(newState['clientsBySalon']['clients'], action.received);
      newState['edit_client'] = {
        isFetching: false,
        data: undefined
      }
      return newState
    case STYLIST_REQUEST:
      return {
        ...state,
        edit_stylist: {
          ...state.edit_stylist,
          isFetching: true
        }
      }
    case STYLIST_SUCCESS:
      newState = JSON.parse(JSON.stringify(state));
      newState['stylistsBySalon']['stylists'] = putInList(newState['stylistsBySalon']['stylists'], action.received);
      newState['edit_stylist'] = {
        isFetching: false,
        data: undefined
      }
      return newState
    case SERVICE_REQUEST:
      return {
        ...state,
        edit_service: {
          ...state.edit_service,
          isFetching: true
        }
      }
    case SERVICE_SUCCESS:
      newState = JSON.parse(JSON.stringify(state));
      newState['servicesBySalon']['services'] = putInList(newState['servicesBySalon']['services'], action.received);
      newState['edit_service'] = {
        isFetching: false,
        data: undefined
      }
      return newState
    case CATEGORIES_REQUEST:
      return {
        ...state,
        categories: {
          ...state.categories,
          isFetching: true
        }
      }
    case CATEGORIES_SUCCESS:
      newState = JSON.parse(JSON.stringify(state));
      newState['categories']['categories'] = putListInList(newState['categories']['categories'], action.categories);
      newState['categories']['isFetching'] = false
      return newState
    default:
      return state
  }
}
export default salon
