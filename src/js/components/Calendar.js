import React from "react";
import { render } from "react-dom"
import { connect } from 'react-redux'
import $ from 'jquery'
import moment from "moment"
import fullCalendar from 'fullcalendar-scheduler'
import autoBind from 'react-autobind'
import avatar from '../../assets/images/default_avatar.png'
class Calendar extends React.Component {
  constructor( props ) {
    super( props )
    autoBind( this )
  }
  listStylists( ) {
    // filter the deleted stylists
    const { stylists, bookings, bookings_date_index, current_date } = this.props
    let result = [ ]
    for ( var i = 0; i < stylists.length; i++ ) {
      if ( stylists[i].status == "active" ) {
        result.push(stylists[i])
      } else {
        // check if the stylist still has bookings, even if it is deleted
        if (bookings_date_index[current_date]) {
          let lbooks = bookings_date_index[current_date]
          let stylist_id = stylists[i].id
          for ( var j = 0; j < lbooks.length; j++ ) {
            if ( bookings[lbooks[j]].stylist_id == stylist_id ) {
              // add it and stop the loop
              result.push(stylists[i])
              j = lbooks.length
            }
          }
        }
      }
    }
    return result
  }
  listBookings( ) {
    const { current_date, bookings, bookings_date_index, new_booking } = this.props
    let earnings = {}
    let abook = [ ]
    if ( new_booking.data ) {
      let booking_edit = Object.assign( {}, new_booking.data )
      booking_edit['start'] = new_booking
        .data['start_time']
        .toISOString( )
      booking_edit['end'] = new_booking
        .data['end_time']
        .toISOString( )
      abook.push( booking_edit )
    }
    // use the bookings_index to get the bookings that belong on this date
    if ( current_date in bookings_date_index ) {
      let day_bookings = bookings_date_index[current_date];
      for ( var i = 0; i < day_bookings.length; i++ ) {
        let book = bookings[day_bookings[i]]
        book["start"] = book["start_time"]
        book["end"] = book["end_time"]
        book["resourceId"] = book["stylist_id"]
        abook.push( book )
        if (!earnings[book.stylist_id]) {
          earnings[book.stylist_id] = 0
        }
        if ( book.status == 'finished' ) {
          earnings[book.stylist_id] = earnings[book.stylist_id] + book.price
        }
      }
      for ( var stylist in earnings ) {
        $( '#resource-header-' + stylist + ' .resource-header-revenue' ).html("£" + earnings[stylist])
      }
    }
    return abook
  }
  componentDidUpdate( prevProps, prevState ) {
    if ( prevProps.stylists != this.props.stylists ) {
      $( '#calendar' ).fullCalendar( "refetchResources" )
    }
    if ( prevProps.bookings != this.props.bookings || prevProps.new_booking.data != this.props.new_booking.data ) {
      // bookings have changed, so make sure that we update the stylists
      // if we just got new bookings, we will redraw the resources to
      if ( prevProps.bookings.length == 0 ) {
        $( '#calendar' ).fullCalendar( "refetchResources" )
      }
      $( '#calendar' ).fullCalendar( "refetchEvents" )
    }
    if ( prevProps.current_date != this.props.current_date ) {
      $( '#calendar' ).fullCalendar( "refetchEvents" )
    }
  }
  componentDidMount( ) {
    const {
      stylists,
      bookings,
      bookings_date_index,
      new_event,
      edit_event,
      drop_event,
      resource_click,
      start,
      end,
      current_date
    } = this.props
    // we need to define listStylists here, so that it is available on the JQuery definitions
    const { listStylists, listBookings } = this
    var start_time = start
      ? start
      : "07:00:00"
    var end_time = end
      ? end
      : "18:00:00"
    $( '#calendar' ).fullCalendar({
      defaultView: 'agendaDay',
      resources: function ( callback ) {
        callback(listStylists( ))
      },
      header: false,
      longPressDelay: 500,
      editable: true,
      nowIndicator: true,
      refetchResourcesOnNavigate: true,
      slotDuration: moment.duration( "00:15:00" ),
      slotLabelFormat: 'h(:mm)a',
      timeFormat: 'h(:mm)t',
      selectable: true,
      selectHelper: true,
      scrollTime: moment( )
        .subtract( 1, 'hour' )
        .format( "HH:mm:ss" ),
      events: function ( start, end, timezone, callback ) {
        callback(listBookings( ))
      },
      timezone: "local",
      // minTime: min, //to be done programmatically
      // maxTime: max, //to be done programmatically
      schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
      businessHours: { //to be done programmatically
        dow: [
          1, 2, 3, 4, 5
        ], // Monday - Friday
        start: start_time, // a start time (8:30 am in this example)
        end: end_time, // an end time (6pm in this example)
      },
      dayClick: function ( startDate, jsEvent, view, resourceObj ) {
        //new event
        if ( resourceObj.status == "active" ) {
          new_event( startDate, resourceObj.id )
        }
      },
      eventClick: function ( calEvent, jsEvent, view ) {
        edit_event( calEvent )
      },
      eventResize: function ( calEvent, jsEvent, view ) {
        drop_event( calEvent )
      },
      eventResize: function ( calEvent, jsEvent, view ) {
        drop_event( calEvent )
      },
      eventDrop: function ( event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view ) {
        drop_event( event )
      },
      select: function ( startDate, endDate, jsEvent, view, resourceObj ) {
        if ( resourceObj.status == "active" ) {
          new_event( startDate, resourceObj.id, endDate )
        }
        $( '#calendar' ).fullCalendar( 'unselect' )
      },
      resourceRender: function ( resourceObj, labelTds, bodyTds ) {
        labelTds
          .on( 'click', function ( ) {
            resource_click( resourceObj.id )
          });
        let title = resourceObj.status == "active"
          ? resourceObj.title
          : resourceObj.title + " (deleted)"
        labelTds.html( "<div id='resource-header-" + resourceObj.id + "'><img class='resource-header-img' src='" + `${ resourceObj.image
          ? resourceObj.image
          : avatar }` + "'/><div class='title'>" + title + "<span class='resource-header-revenue'>£0</span></div></div>" )
        let remail = resourceObj.email
          ? resourceObj.email
          : "&nbsp;"
        labelTds.append( "<div class='popover-stylist hidden'><span><i class='zmdi zmdi-account-o'></i>" + title + "</span><span><i class='zmdi zmdi-phone'></i>" + resourceObj.phone + "</span><span><i class='zmdi zmdi-email'></i>" + remail + "</span></div>" )
        labelTds.hover( function ( ) {
          labelTds
            .find( '.popover-stylist' )
            .removeClass( 'hidden' )
        }, function ( ) {
          labelTds
            .find( '.popover-stylist' )
            .addClass( 'hidden' )
        })
      },
      eventRender: function ( event, element ) {
        var booking = element.find( '.fc-content' )
        // if this a time off event?
        if ( event.status != "time_off" ) {
          if ( event.client_id ) {
            booking.append( "<a href='/#/salon/" + event.salon_id + "/menu/client/" + event.client_id + "' class='client'>" + event.name + "</a>" );
          } else {
            booking.append( "<span class='client'>Walk In</span>" );
          }
          event.notes
            ? booking.append( "<div class='notes'>" + event.notes + "</div>" )
            : null
          if ( event.status != "finished" ) {
            booking.append( "<a class='complete_button'><i class='zmdi zmdi-check'></i></a>" );
            booking
              .find( '.complete_button' )
              .on( 'click', function ( e ) {
                drop_event( event, "finished" )
                //we prevent the dsidebar from opening
                e.stopPropagation( )
              })
          }
        } else {
          booking.append( "<span class='client'>Time Off</span>" );
        }
      },
      viewRender: function ( ) {
        if ( $( '#calendar .sticky-hours' ).length == 0 ) {
          $( "#calendar .fc-scroller .fc-unselectable .fc-slats" )
            .addClass( 'calendar-lines' )
            .clone( )
            .addClass( 'sticky-hours' )
            .removeClass( 'calendar-lines' )
            .appendTo( "#calendar .fc-scroller .fc-unselectable" );
          $( '#calendar .fc-agendaDay-view' ).on( 'scroll', function ( e ) {
            $( '#calendar .sticky-hours' ).css('left', $( '#calendar .fc-agendaDay-view' ).scrollLeft( ))
          })
        }
      }
    })
  }
  render( ) {
    return (
      <div className="parent_calendar">
        <div id="calendar"></div>
      </div>
    );
  }
}
function mapStateToProps( state ) {
  const { booking, salon, new_booking } = state
  const { bookings: bookings, bookings_date_index: bookings_date_index, bookings_index: bookings_index } = booking
  const {
    stylistsBySalon: {
      stylists: stylists
    }
  } = salon
  return { bookings, new_booking, bookings_date_index, bookings_index, stylists }
}
export default connect( mapStateToProps )( Calendar )
