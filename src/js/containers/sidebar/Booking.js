import React from "react";
import { render } from "react-dom";
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import $ from 'jquery'
import moment from "moment"
import DatePicker from "react-datepicker"
import autoBind from 'react-autobind'
import Raven from 'raven-js'
import { raiseError, cleanError } from '../../actions/errors'
import { CURRENCY } from '../../config'
import UserList from '../../components/sidebar/UserList'
import Footer from '../../components/sidebar/Footer'
import ServiceList from '../../components/sidebar/ServiceList'
import { fetchNewBooking, cleanBookingData, persistBooking } from '../../actions/booking'
import { fetchServicesBySalon, fetchClient } from '../../actions/salon'
class Booking extends React.Component {
  constructor( props ) {
    super( props )
    this.state = {
      view: 'home',
      status: "unconfirmed",
      price: 0,
      currency: CURRENCY,
      id: undefined,
      services: [],
      client_id: undefined,
      stylist_id: undefined,
      client: undefined,
      stylist: undefined,
      serviceObjects: undefined,
      start_time: moment( ),
      end_time: moment( ),
      notes: ""
    }
    autoBind( this )
  }
  componentDidMount( ) {
    const { dispatch, params } = this.props
    // console.log('back to booking')
    dispatch(cleanError( ))
    this.receiveBookings( this.props )
    this.checkView( this.props )
  }
  componentWillReceiveProps( nextProps ) {
    const { fromOtherComponent, dispatch } = this.props
    this.checkView( nextProps )
    // console.log(nextProps)
    if ( fromOtherComponent ) {
      //this is for when we come back from other components (e.g new client)
      dispatch(persistBooking( false ))
    } else {
      if (( !nextProps.isFetchingBookings && this.props.isFetchingBookings ) || ( nextProps.isFetchingBookings && !this.props.isFetchingBookings ) || ( nextProps.newBooking.isFetching && !this.props.newBooking.isFetching )) {
        this.receiveBookings( nextProps );
      }
      // detect if we just saved a new booking
      if (( nextProps.newBooking.isFetching && !this.props.newBooking.isFetching )) {
        hashHistory.goBack( )
      }
    }
  }
  checkView( _props ) {
    const { params, routes } = _props
    if ( routes[5] && routes[5].path == 'client' ) {
      this.setState({ view: 'clients' })
    } else if ( routes[5] && routes[5].path == 'service' ) {
      this.setState({ view: 'services' })
    } else if ( routes[5] && routes[5].path == 'stylist' ) {
      this.setState({ view: 'stylists' })
    } else {
      this.setState({ view: 'home' })
    }
  }
  receiveBookings( nextProps ) {
    const { dispatch, params, bookings, newBooking, bookings_index } = nextProps
    // check if the client is on the clients list, fetch it otherwise
    let ourBooking = undefined;
    if (params['booking_id']) {
      if ( params['booking_id'] in bookings_index ) {
        ourBooking = bookings[bookings_index[params['booking_id']]]
      }
    } else if ( newBooking.data ) {
      ourBooking = newBooking.data
    }
    if ( !ourBooking ) {
      if ( !newBooking.isFetching && !nextProps.isFetchingBookings ) {
        dispatch(fetchNewBooking( {
          id: params['booking_id'],
          salon_id: params.id
        }, "GET" ))
      }
      return
    }
    this.setBookingFromState( ourBooking, nextProps )
  }
  setBookingFromState( _booking, nextProps ) {
    if ( _booking ) {
      let newState = {
        status: _booking.status,
        price: _booking.price,
        currency: CURRENCY,
        services: _booking.services,
        client_id: _booking.client_id,
        stylist_id: _booking.stylist_id,
        client: this.getClient( _booking.client_id, nextProps ),
        stylist: this.getStylist( _booking.stylist_id, nextProps ),
        serviceObjects: this.getServices( _booking.services, nextProps ),
        start_time: moment( _booking.start_time ),
        end_time: moment( _booking.end_time ),
        notes: _booking.notes
          ? _booking.notes
          : ""
      }
      if ( _booking.id ) {
        newState['id'] = _booking.id
      }
      this.setState( newState );
    }
  }
  getClient( client_id, nextProps ) {
    const { clients, dispatch, params } = nextProps
    // try to get the client
    if ( client_id ) {
      let client = clients
        .clients
        .filter( function ( obj ) {
          return obj.id == client_id;
        })
      if ( client.length > 0 ) {
        return client[0]
      } else {
        // fetch the client
        if ( !clients.isFetching ) {
          dispatch(fetchClient( params.id, {
            id: client_id
          }, 'GET' ));
        }
      }
    }
    return null
  }
  getStylist( stylist_id, nextProps ) {
    const { dispatch, stylists, params } = nextProps
    // try to get the stylists
    if ( stylist_id ) {
      let stylist = stylists
        .stylists
        .filter( function ( obj ) {
          return obj.id == stylist_id;
        })
      if ( stylist.length > 0 ) {
        return stylist[0]
      } else {
        // fetch the stylist
        if ( !stylists.isFetching ) {
          dispatch(fetchStylistsBySalon( params.id ));
        }
      }
    }
    return null
  }
  getServices( service_list, nextProps ) {
    // try to get the service
    const { services, dispatch, params } = nextProps
    if ( service_list ) {
      let serviceObjects = [ ]
      for ( var i = 0; i < service_list.length; i++ ) {
        let service = services
          .services
          .filter( function ( obj ) {
            return obj.id == service_list[i];
          })
        if ( service.length > 0 ) {
          serviceObjects.push(service[0])
        }
      }
      return serviceObjects
    }
    return [ ]
  }
  pickStylist( ) {
    const { params } = this.props
    hashHistory.push( `/salon/${ params.id }/menu/booking/stylist` );
  }
  pickClient( ) {
    const { params } = this.props
    hashHistory.push( `/salon/${ params.id }/menu/booking/client` );
  }
  pickServices( ) {
    const { params } = this.props
    hashHistory.push( `/salon/${ params.id }/menu/booking/service` );
  }
  newClient( ) {
    const { params, dispatch } = this.props
    //this is for when we come back it doesn't think we are saving
    dispatch(persistBooking( true ))
    hashHistory.push( `/salon/${ params.id }/menu/client/new` )
  }
  setClient( _data ) {
    const { dispatch } = this.props
    dispatch(cleanError( ))
    // we need reset the client in the state
    this.setState({
      client_id: _data['client'],
      client: this.getClient( _data['client'], this.props )
    })
    hashHistory.goBack( )
  }
  setStylist( _data ) {
    const { dispatch } = this.props
    dispatch(cleanError( ))
    this.setState({
      stylist_id: _data["stylist"],
      stylist: this.getStylist( _data["stylist"], this.props )
    })
    hashHistory.goBack( )
  }
  saveServices( ) {
    const { bookingData, params } = this.props
    const services = this.servicelist.state.selected
    const ids = this.servicelist.state.selected_ids
    let price = 0
    let end_time = this
      .state
      .start_time
      .clone( )
    services.map(( service, i ) => {
      price = price + parseFloat( service.price )
      end_time.add(moment.duration( service.duration ))
    })
    this.setState({ price: price, services: ids, serviceObjects: services, end_time: end_time })
    hashHistory.goBack( )
  }
  saveBooking( ) {
    const { dispatch, bookingData, params } = this.props
    let method = this.state.id == null
      ? 'POST'
      : 'PUT'
    dispatch(cleanError( ))
    if (!this.state.end_time || !this.state.start_time || this.state.end_time.isSame( this.state.start_time )) {
      dispatch(raiseError({
        code: 400,
        fields: {
          end_time: [ "This field cannot be equal to start time" ]
        }
      }))
      return
    }
    let data = {
      id: this.state.id,
      salon_id: parseInt( params.id ),
      stylist_id: this.state.stylist_id,
      start_time: this
        .state
        .start_time
        .toISOString( ),
      end_time: this
        .state
        .end_time
        .toISOString( ),
      services: this.state.services,
      price: parseFloat( this.state.price ),
      currency: this.state.currency,
      status: this.state.status,
      notes: this.state.notes
    }
    if ( this.state.client_id ) {
      data['client_id'] = this.state.client_id
    }
    dispatch(fetchNewBooking( data, method )).catch(( err ) => {
      Raven.captureException( err )
    });
  }
  deleteBooking( ) {
    const { dispatch, bookingData, params } = this.props
    dispatch(cleanError( ))
    let data = {
      id: this.state.id,
      salon_id: parseInt( params.id ),
      stylist_id: this.state.stylist_id,
      start_time: this
        .state
        .start_time
        .toISOString( ),
      end_time: this
        .state
        .end_time
        .toISOString( ),
      services: this.state.services,
      price: parseFloat( this.state.price ),
      currency: this.state.currency,
      status: "deleted",
      notes: this.state.notes
    }
    if ( this.state.client_id ) {
      data['client_id'] = this.state.client_id
    }
    dispatch(fetchNewBooking( data, "DELETE" )).catch(( err ) => {
      Raven.captureException( err )
    })
  }
  showTimeOffTab( ) {
    this.setState({ status: "time_off" })
  }
  showBookingTab( ) {
    this.setState({ status: "unconfirmed" })
  }
  updateTime( _data, _state_value ) {
    const { dispatch } = this.props
    let date = this
      .state[_state_value]
      .clone( )
    dispatch(cleanError( ))
    if (_data['date']) {
      date.dayOfYear(_data['date'].dayOfYear( ))
    }
    if (_data['hour']) {
      date.hour(_data['hour'])
    }
    if (_data['minute']) {
      date.minute(_data['minute'])
    }
    //validation, start_time cannot be after end_time
    if ( _state_value == "start_time" ) {
      //start time cannot be after end time
      let end_time = this
        .state["end_time"]
        .clone( )
      if (date.isAfter( end_time )) {
        dispatch(raiseError({
          code: 400,
          fields: {
            start_time: [ "This field cannot be after end time" ]
          }
        }))
        return
      }
    } else if ( _state_value == "end_time" ) {
      //end time cannot be before start time
      let start_time = this
        .state["start_time"]
        .clone( )
      if (date.isBefore( start_time )) {
        dispatch(raiseError({
          code: 400,
          fields: {
            end_time: [ "This field cannot be before start time" ]
          }
        }))
        return
      }
    }
    switch ( _state_value ) {
      case "start_time":
        this.setState({ start_time: date });
        break
      case "end_time":
        this.setState({ end_time: date });
        break
      default:
        return
    }
  }
  rightButton( ) {
    switch ( this.state.view ) {
      case 'services':
        return this.saveServices( )
      case 'clients':
        return this.newClient( )
      default:
        return this.saveBooking( )
    }
  }
  getRightButtonName( ) {
    switch ( this.state.view ) {
      case 'services':
        return "SAVE"
      case 'clients':
        return "CREATE NEW"
      default:
        return "SAVE"
    }
  }
  // quickComplete(){
  //     this.setState({status: "finished"}, () => {
  //         this.saveBooking()
  //     })
  // }
  render( ) {
    const {
      bookingData,
      isFetchingBooking,
      stylists,
      clients,
      services,
      params,
      isError,
      errorFields
    } = this.props
    return <div className="sidebar-booking">
      <div className="view_home">
        {this.state.view == 'home' && <div>
          <ul className="nav nav-tabs nav-justified">
            <li className={this.state.status != "time_off"
              ? "active"
              : ""} onClick={this.showBookingTab}>Booking</li>
            <li className={this.state.status != "time_off"
              ? ""
              : "active"} onClick={this.showTimeOffTab}>Time off</li>
          </ul>
          {this.state.status != "time_off" && <div className="list-select" onClick={this.pickClient}>
            <div className="item list-align-left">
              <i className="zmdi zmdi-accounts-list"></i>Client</div>
            <div className="item list-align-right">
              {this.state.client
                ? this.state.client.first_name + " " + this.state.client.last_name
                : "Walk-in"}
              <i className="zmdi zmdi-search"></i>
            </div>
            {( isError && errorFields && errorFields['client'] && errorFields['client'].length > 0 ) && <p className="alert">{errorFields['client'].map( ( validation ) => validation )}</p>}
          </div>}
          <div className="list-select" onClick={this.pickStylist}>
            <div className="item list-align-left">
              <i className="zmdi zmdi-account-o"></i>Stylist</div>
            <div className="item list-align-right">{this.state.stylist
                ? this.state.stylist.first_name + " " + this.state.stylist.last_name
                : ""}
              <i className="zmdi zmdi-chevron-right"></i>
            </div>
          </div>
          {this.state.status != "time_off" && <div className="list-select" onClick={this.pickServices}>
            <div className="item list-align-left">
              <i className="zmdi zmdi-scissors"></i>Service</div>
            <div className="item list-align-right">
              {this.state.serviceObjects && this.state.serviceObjects.length > 0
                ? this
                  .state
                  .serviceObjects
                  .map( function ( service ) {
                    return service.name
                  })
                  .join( " + " )
                : "Not set"}
              <i className="zmdi zmdi-chevron-right"></i>
            </div>
          </div>}
          {this.state.status != "time_off" && <label className="list-select list-grey list-input" htmlFor="price_field">
            <div className="title">
              <i className="zmdi zmdi-money"></i>Cost</div>
            <input type="text" id="price_field" value={this.state.price} onChange={( event ) => this.setState({ price: event.target.value })} className='form-control' placeholder='e.g. 45'/>
          </label>}
          {this.state.status != "time_off" && <div className="list-select">
            <div className="item list-align-left">
              <i className="zmdi zmdi-label-alt-outline"></i>Booking status</div>
            <div className="item list-align-right no-padding-right">
              <div className="select-wrapper status">
                <span className={this.state.status}></span>
                <select value={this.state.status} onChange={( event ) => this.setState({ status: event.target.value })}>
                  <option value="unconfirmed">Unconfirmed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="finished">Finished</option>
                  <option value="no_show">No Show</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
            </div>
          </div>}
          <div className="list-select">
            <div className="item list-align-left">
              <i className="zmdi zmdi-calendar"></i>Date</div>
            <div className="item list-align-right">
              <p>{this
                  .state
                  .start_time
                  .format( "MMMM Do YYYY" )}</p>
            </div>
          </div>
          <div className="list-select">
            <div className="item list-align-left">
              <i className="zmdi zmdi-time"></i>Duration</div>
            <div className="item list-align-right">
              <div className="select-group">
                <p>Start</p>
                <div className="select-wrapper">
                  <select value={this
                    .state
                    .start_time
                    .hour( )} onChange={( event ) => this.updateTime( {
                    hour: event.target.value
                  }, "start_time" )}>
                    {[...Array( 24 || 0 )].map(( v, hour ) => <option key={hour} value={hour}>{( hour < 10
                        ? '0' + hour
                        : hour )}</option>)}
                  </select>
                </div>
                <div className="select-wrapper">
                  <select value={this
                    .state
                    .start_time
                    .minute( )} onChange={( event ) => this.updateTime( {
                    minute: event.target.value
                  }, "start_time" )}>
                    {[...Array( 4 || 1 )].map(( v, minute ) => <option key={minute * 15} value={minute * 15}>{( minute * 15 < 10
                        ? '0' + minute * 15
                        : minute * 15 )}</option>)}
                  </select>
                </div>
              </div>
              <div className="select-group">
                <p>End</p>
                <div className="select-wrapper">
                  <select value={this
                    .state
                    .end_time
                    .hour( )} onChange={( event ) => this.updateTime( {
                    hour: event.target.value
                  }, "end_time" )}>
                    {[...Array( 24 || 0 )].map(( v, hour ) => <option key={hour} value={hour}>{( hour < 10
                        ? '0' + hour
                        : hour )}</option>)}
                  </select>
                </div>
                <div className="select-wrapper">
                  <select value={this
                    .state
                    .end_time
                    .minute( )} onChange={( event ) => this.updateTime( {
                    minute: event.target.value
                  }, "end_time" )}>
                    {[...Array( 4 || 1 )].map(( v, minute ) => <option key={minute * 15} value={minute * 15}>{( minute * 15 < 10
                        ? '0' + minute * 15
                        : minute * 15 )}</option>)}
                  </select>
                </div>
              </div>
            </div>
            {( isError && errorFields && errorFields['start_time'] && errorFields['start_time'].length > 0 ) && <p className="alert">{errorFields['start_time'].map( ( validation ) => validation )}</p>}
            {( isError && errorFields && errorFields['end_time'] && errorFields['end_time'].length > 0 ) && <p className="alert">{errorFields['end_time'].map( ( validation ) => validation )}</p>}
          </div>
          <label className="list-select list-input" htmlFor="notes_field">
            <div className="title">
              <i className="zmdi zmdi-comment-outline"></i>Notes</div>
            <textarea id="notes_field" onChange={( event ) => this.setState({ notes: event.target.value })} className='form-control' placeholder='' value={this.state.notes}/>
          </label>
        </div>}
      </div>
      {this.state.view == 'clients' && <div className="view_clients">
        <UserList id={params.id} users={clients.clients} type="client" click={this.setClient} add_new={this.newClient} in_booking="True"/>
      </div>}
      {this.state.view == 'stylists' && <div className="view_stylist">
        <UserList id={params.id} users={stylists.stylists} type="stylist" click={this.setStylist}/>
      </div>}
      {this.state.view == 'services' && <div className="view_services">
        <ServiceList mode="select" stylist_id={this.state.stylist_id} stylists={stylists.stylists} selected={this.state.serviceObjects} ref={( ref ) => this.servicelist = ref} services={services.services}/>
      </div>}
      {this.state.id
        ? <Footer id={params.id} right_name={this.getRightButtonName( )} right={this.rightButton} left_name="DELETE" left={this.deleteBooking}/>
        : <Footer id={params.id} right_name={this.getRightButtonName( )} right={this.rightButton}/>}
    </div>;
  }
}
function mapStateToProps( state ) {
  const { booking, salon, errors } = state
  const { bookings: bookings, bookings_index: bookings_index, persist_booking: fromOtherComponent, isFetching: isFetchingBookings } = booking
  const { new_booking: newBooking } = state
  const { stylistsBySalon: stylists, clientsBySalon: clients, servicesBySalon: services } = salon
  const { isError: isError, fields: errorFields } = errors || {
    isError: false,
    fields: {},
    message: ''
  }
  return {
    isError,
    fromOtherComponent,
    errorFields,
    bookings,
    bookings_index,
    newBooking,
    isFetchingBookings,
    stylists,
    clients,
    services
  }
}
export default connect( mapStateToProps )( Booking )
