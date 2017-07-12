import { render } from "react-dom"
import { connect } from 'react-redux'
import React from "react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Link, hashHistory } from 'react-router'
import $ from 'jquery'
import fullCalendar from 'fullcalendar'
import CODatePicker from "../components/DatePicker"
import moment from "moment"
import autoBind from 'react-autobind'
import Raven from 'raven-js'
import { CURRENCY } from '../config'
import { fetchSalonsByUser } from '../actions/user'
import { fetchBookingsBySalon, cleanBookingData, saveNewBookingData, fetchNewBooking } from '../actions/booking'
import { fetchStylistsBySalon, fetchClientsBySalon, fetchServicesBySalon, fetchCategories } from '../actions/salon'
import { cleanError } from '../actions/errors'
import Calendar from '../components/Calendar'
class Scheduler extends React.Component {
  constructor( props ) {
    super( props )
    this.state = {
      date: moment( ),
      showCalendar: false,
      openingTime: "08:00:00",
      closingTime: "18:00:00"
    }
    autoBind( this )
  }
  componentWillMount( ) {
    const { dispatch, bookings_date } = this.props
    dispatch(cleanError( ))
    dispatch(cleanBookingData( ))
    dispatch(fetchSalonsByUser( ))
    dispatch(fetchStylistsBySalon( this.props.params.id ))
    dispatch(fetchClientsBySalon( this.props.params.id ))
    dispatch(fetchServicesBySalon( this.props.params.id ))
    dispatch(fetchCategories( ))
    this.changeDate(moment( ))
  }
  getBookingsByDate( ) {
    const { params, dispatch, bookings, bookings_date, isFetchingBookings } = this.props
    let from_date = this
      .state
      .date
      .format( "YYYYMMDD" )
    if (bookings_date[from_date] && moment(bookings_date[from_date]) > moment( ).add( -5, 'minutes' )) {
      return
    }
    // now we actually fetch those from the api
    let to_date = this
      .state
      .date
      .clone( )
      .add( 1, 'days' )
      .format( "YYYYMMDD" )
    if ( !isFetchingBookings ) {
      dispatch(fetchBookingsBySalon( params.id, from_date, to_date ))
    }
  }
  componentDidUpdate( prevProps, prevState ) {
    const { dispatch } = this.props
    // check if the bookings were just deleted
    if ( Object.keys( prevProps.booking_index ).length !== 0 && Object.keys( this.props.booking_index ).length === 0 ) {
      this.getBookingsByDate( )
    }
  }
  createBooking( _start, _resource_id, _end ) {
    const { dispatch, stylists } = this.props
    dispatch(saveNewBookingData({
      client_id: null,
      color: "#8E24AA",
      id: undefined,
      name: "",
      notes: "",
      price: 0,
      salon_id: this.props.params.salon_id,
      start_time: _start,
      end_time: _end
        ? _end
        : _start
          .clone( )
          .add( 1, 'hour' ),
      stylist_id: parseInt( _resource_id ),
      status: "unconfirmed",
      title: "",
      services: [],
      resourceId: parseInt( _resource_id )
    }))
    hashHistory.push( `/salon/${ this.props.params.id }/menu/booking` );
  }
  editBooking( _event ) {
    hashHistory.push( `/salon/${ this.props.params.id }/menu/booking/${ _event.id }` );
  }
  immediateUpdateBooking( _event, _new_status ) {
    const { dispatch, stylists } = this.props
    let data = {
      id: _event.id,
      salon_id: parseInt( this.props.params.id ),
      stylist_id: parseInt( _event.resourceId ),
      services: _event.services,
      start_time: _event
        .start
        .toISOString( ),
      end_time: _event
        ._end
        .toISOString( ),
      price: parseFloat( _event.price ),
      currency: _event.currency,
      status: _event.status
    }
    if ( _new_status ) {
      data['status'] = _new_status
    }
    if ( _event.status != "time_off" && _event.client_id ) {
      data['client_id'] = _event.client_id
    }
    dispatch(fetchNewBooking( data, 'PUT' ))
  }
  changeDate( _date ) {
    const { dispatch, bookings_date } = this.props
    //change date
    let today = this
      .state
      .date
      .clone( )
    let new_date
    let from_date
    let to_date
    switch ( _date ) {
      case "prev":
        this.state.date = today
          .subtract( 1, 'days' )
          .startOf( 'day' );
        $( '#calendar' ).fullCalendar( 'prev' );
        break;
      case "next":
        this.state.date = today
          .add( 1, 'days' )
          .startOf( 'day' );
        $( '#calendar' ).fullCalendar( 'next' );
        break;
      default:
        this.state.date = _date.startOf( 'day' );
        $( '#calendar' ).fullCalendar( 'gotoDate', _date );
        break;
    }
    this.getBookingsByDate( )
    $( '#calendar .fc-agendaDay-view' ).scrollLeft( 0 )
    //if is a past day put a class
    $( '#calendar' ).removeClass( 'old-day' )
    if (this.state.date.isBefore( moment( ), 'd' )) {
      $( '#calendar' ).addClass( 'old-day' )
    }
    this.setState({ date: this.state.date, showCalendar: false })
  }
  openStylist( stylist_id ) {
    hashHistory.push( `/salon/${ this.props.params.id }/menu/stylist/${ stylist_id }` );
  }
  render( ) {
    const {
      isError,
      salons,
      errorMessage,
      isFetchingStylists,
      isFetchingClients,
      isFetchingCategories,
      isFetchingUser,
      stylists,
      isFetchingServices
    } = this.props
    return <div className='scheduler_container'>
      <div className='scheduler'>
        <div className="header">
          <Link className="menu-icon" to={`/salon/${ this.props.params.id }/menu`} activeClassName="active">
            <i className="zmdi zmdi-menu"></i>Menu</Link>
          <ul className="switch-day-ul">
            <li onClick={( ) => this.changeDate( 'prev' )}>
              <i className="zmdi zmdi-chevron-left"></i>
            </li>
            <li onClick={( ) => this.changeDate(moment( ))} className={(this.state['date'].format( "MMM DD, YYYY" ) == moment( ).format( "MMM DD, YYYY" ))
              ? "button-today active"
              : "button-today"}>Today</li>
            <li onClick={( ) => {
              let showCalendar = this.state.showCalendar
                ? false
                : true;
              this.setState({ showCalendar: showCalendar })
            }} className="button-calendar">
              <i className="zmdi zmdi-calendar"></i>{this
                .state['date']
                .format( "ddd, DD MMM YYYY" )}</li>
            <li onClick={( ) => this.changeDate( 'next' )}>
              <i className="zmdi zmdi-chevron-right"></i>
            </li>
          </ul>
        </div>
        <div className={"day-select " + ( this.state.showCalendar
          ? ''
          : 'hidden' )}>
          <CODatePicker inline selected={this.state.date} isShowing={this.state.showCalendar} onOutsideClick={( ) => {
            this.setState({ showCalendar: false })
          }} onChange={( _date ) => this.changeDate( _date )}/>
        </div>
        {!isFetchingStylists && !isFetchingUser && <Calendar current_date={this.state.date} start={this.state.openingTime} end={this.state.closingTime} resource_click={this.openStylist} new_event={this.createBooking} edit_event={this.editBooking} drop_event={this.immediateUpdateBooking}/>}
        {!isFetchingClients && !isFetchingCategories && !isFetchingStylists && !isFetchingServices && <ReactCSSTransitionGroup transitionName="sidebar-in" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {this.props.children}
        </ReactCSSTransitionGroup>}
      </div>
      {isError && errorMessage && <p>{errorMessage}</p>}
      {this.state.isEventPopOver && <div className="event-popover">
        <span>{this.state.currentEvent.client_id}</span>
        <span>{this
            .state
            .currentEvent
            ._start
            .format( 'hh:mm a' )}</span>
        <span>{this
            .state
            .currentEvent
            ._end
            .format( 'hh:mm a' )}</span>
        <span>{CURRENCY} {this.state.currentEvent.price}</span>
        <a>Complete</a>
        <a>Edit</a>
      </div>}
    </div>;
  }
}
function mapStateToProps( state ) {
  const { booking, salon, errors, user } = state
  const { bookings: bookings, date: bookings_date, bookings_date_index: booking_index, isFetching: isFetchingBookings } = booking
  const { new_booking: new_booking_edit } = state
  const {
    salonsByUser: {
      isFetching: isFetchingUser,
      data: salons
    }
  } = user
  const {
    stylistsBySalon: {
      isFetching: isFetchingStylists,
      stylists: stylists
    },
    clientsBySalon: {
      isFetching: isFetchingClients,
      clients: clients,
      entities: clients_entities
    },
    categories: {
      isFetching: isFetchingCategories
    },
    servicesBySalon: {
      services: services,
      isFetching: isFetchingServices
    }
  } = salon
  const { isError: isError, message: errorMessage } = errors || {
    isError: false,
    message: ''
  }
  return {
    isFetchingBookings,
    isFetchingCategories,
    isFetchingStylists,
    isFetchingClients,
    isFetchingServices,
    isFetchingUser,
    bookings,
    booking_index,
    new_booking_edit,
    bookings_date,
    stylists,
    clients,
    clients_entities,
    salons,
    services,
    isError,
    errorMessage
  }
}
export default connect( mapStateToProps )( Scheduler )
