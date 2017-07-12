import React from "react";
import {render} from "react-dom";
import moment from "moment"
class BookingRow extends React.Component {
  render() {
    const {click, booking} = this.props
    return (
      <div className="booking-row-title">
        <div className="booking-details" onClick={click}>
          <div className="list date">
            <span className="item list-align-left">
              Date:</span>
            <span className="item list-align-right">{moment(booking.start_time).format("MMMM Do YYYY")}</span>
          </div>
          <div className="list time">
            <span className="item list-align-left">
              Time:</span>
            <span className="item list-align-right">{moment(booking.start_time).format("HH:mm a")}</span>
          </div>
          {booking.title && <div className="list title">
            <span className="item list-align-left">
              Services:</span>
            <span className="item list-align-right">{booking.title}</span>
          </div>}
          <div className="list price">
            <span className="item list-align-left">
              Price:</span>
            <span className="item list-align-right">£{booking.price}</span>
          </div>
        </div>
        {booking.notes && <div className="booking-notes">
          <div className="list notes">
            <span className="item list-align-left">
              <i className="zmdi zmdi-comment-text-alt"></i>
              Notes:</span>
            <span className="item list-align-right">{booking.notes}</span>
          </div>
        </div>}
      </div>
    );
  }
}
class BookingList extends React.Component {
  constructor(props) {
    super(props)
    this.sendBack = this.sendBack.bind(this)
  }
  sendBack(_booking) {
    const {click} = this.props
    click(_booking)
  }
  render() {
    const {click, bookings} = this.props
    return (
      <div className="user-list">
        {bookings && bookings.map((booking, i) => <BookingRow className="booking-row" click={() => this.sendBack(booking)} key={i} booking={booking}></BookingRow>)}
      </div>
    );
  }
}
export default BookingList
