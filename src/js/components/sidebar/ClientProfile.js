import React from "react"
import {connect} from 'react-redux'
import {render} from "react-dom"
import moment from "moment"
import {hashHistory} from 'react-router'
import autoBind from 'react-autobind'
import {CURRENCY} from '../../config'
import BookingList from '../../components/sidebar/BookingList'
class ClientProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "details",
      gender: 'female',
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      birthday: "",
      notifications: true,
      magazine: "",
      drink: "",
      appointments: 0,
      no_shows: 0,
      total_spent: 0,
      currency: CURRENCY,
      patch_test_notes: "",
      patch_test_date: null,
      patch_test_stylist_id: null,
      patch_test_stylist: null
    }
    autoBind(this)
  }
  componentDidMount() {
    const {client} = this.props
    this.setState({
      first_name: client["first_name"],
      last_name: client["last_name"],
      phone: client["phone"],
      gender: client["gender"],
      email: client["email"],
      birthday: moment(client["birthday"]),
      notifications: client["notifications"],
      magazine: client["magazine"],
      drink: client["drink"],
      appointments: client["appointments"],
      no_shows: client["no_shows"],
      total_spent: client["total_spent"],
      currency: CURRENCY,
      patch_test_notes: client["patch_test_notes"],
      patch_test_date: client["patch_test_date"]
        ? moment(client["patch_test_date"])
        : null,
      patch_test_stylist_id: client["patch_test_stylist_id"],
      patch_test_stylist: this.getStylist(client["patch_test_stylist_id"], this.props)
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.stylists != this.props.stylists) {
      this.getStylist(this.state.patch_test_stylist_id, nextProps)
    }
  }
  getStylist(stylist_id, nextProps) {
    const {dispatch, stylists, params} = nextProps
    // try to get the stylists
    if (stylist_id) {
      let stylist = stylists.stylists.filter(function(obj) {
        return obj.id == stylist_id;
      })
      if (stylist.length > 0) {
        return stylist[0]
      } else {
        // fetch the stylist
        if (!stylists.isFetching) {
          dispatch(fetchStylistsBySalon(params.id));
        }
      }
    }
    return null
  }
  changePanel(new_view) {
    this.setState({view: new_view})
  }
  openBooking(_booking) {
    const {params} = this.props
    hashHistory.push(`/salon/${_booking.salon_id}/menu/booking/${_booking.id}`);
  }
  render() {
    const {bookings, isError, errors, onClickPatchTest} = this.props
    return (
      <div className='profile client'>
        <div className="view_profile">
          <ul className="nav nav-tabs nav-justified">
            <li className={this.state.view == "details"
              ? "active"
              : ""} onClick={() => this.changePanel('details')}>
              Details
            </li>
            <li className= {this.state.view == "bookings" ? "active" : "" } onClick={() => this.changePanel('bookings')}>
              Activity
            </li>
          </ul>
        </div>
        {(this.state.view == "bookings") && <div className="view_list_activity">
          <BookingList click={this.openBooking} bookings={bookings}/>
        </div>}
        {this.state.view == "details" && <div>
          <div className="profile_header">
            <div>
              <i className="zmdi zmdi-scissors"></i>
              <div className="title">APPOINTMENTS</div>
              <p>{this.state.appointments}</p>
            </div>
            <div>
              <i className="zmdi zmdi-alert-circle-o"></i>
              <div className="title">NO-SHOWS</div>
              <p>
                {this.state.no_shows}</p>
            </div>
            <div>
              <i className="zmdi zmdi-money"></i>
              <div className="title">TOTAL SPENT</div>
              <p>£{this.state.total_spent}</p>
            </div>
          </div>
          <div className="list-select">
            <div className="item list-align-left">
              <i className="zmdi zmdi-account-o"></i>First Name</div>
            <div className="item list-align-right">{this.state.first_name}</div>
          </div>
          <div className="list-select">
            <div className="item list-align-left">Last Name</div>
            <div className="item list-align-right">{this.state.last_name}</div>
          </div>
          <div className="list-select">
            <div className="item list-align-left">
              <i className="zmdi zmdi-phone"></i>Phone Number</div>
            <div className="item list-align-right">{this.state.phone}</div>
          </div>
          <div className="list-select">
            <div className="item list-align-left">
              <i className="zmdi zmdi-calendar"></i>Date of birth</div>
            <div className="item list-align-right">{this.state.birthday && this.state.birthday.format("DD/MM/YYYY")}</div>
          </div>
          <div className="list-select">
            <div className="item list-align-left">
              <i className="zmdi zmdi-email"></i>Email</div>
            <div className="item list-align-right">{this.state.email}</div>
          </div>
          <div className="list-select">
            <div className="item list-align-left">
              <i className="zmdi zmdi-male-female"></i>Gender</div>
            <div className="item list-align-right">{this.state.gender}</div>
          </div>
          <label className="list-select" htmlFor="switchNotification">
            <div className="item list-align-left">
              <i className="zmdi zmdi-notifications-none"></i>Notification</div>
            <div className="item list-align-right">
              <span className="material-switch"><input id="switchNotification" name="notifications002" type="checkbox" disabled='true' checked={this.state.notifications}/>
                <span className="switch"></span>
              </span>
            </div>
          </label>
          <div className="list-select">
            <div className="item list-align-left">
              <i className="zmdi zmdi-book"></i>Favourite Magazine</div>
            <div className="item list-align-right">{this.state.magazine}</div>
          </div>
          <div className="list-select">
            <div className="item list-align-left">
              <i className="zmdi zmdi-cocktail"></i>Favourite Drink</div>
            <div className="item list-align-right">{this.state.drink}</div>
          </div>
          {this.state.patch_test_date
            ? <div className="patch patch-hover" onClick={onClickPatchTest}>
                <p>Patch Test
                  <span className="float-right">
                    {this.state.patch_test_date
                      ? this.state.patch_test_date.format('MMMM Do YYYY')
                      : "Not yet"}
                  </span>
                </p>
                <div className="list-select">
                  <div className="item list-align-left">
                    <i className="zmdi zmdi-account-o"></i>Stylist</div>
                  <div className="item list-align-right">{this.state.patch_test_stylist
                      ? this.state.patch_test_stylist.title
                      : ""}
                  </div>
                </div>
                <div className="list-select">
                  <div className="item list-align-left">
                    <i className="zmdi zmdi-comment-outline"></i>Notes</div>
                  <div className="item list-align-right">{this.state.patch_test_notes
                      ? this.state.patch_test_notes
                      : ""}</div>
                </div>
              </div>
            : <div className="list-select">
              <div className="item list-align-right">
                <div className="btn btn-neutral btn-small" onClick={onClickPatchTest}>Add Patch Test</div>
              </div>
            </div>}
        </div>}
      </div>
    )
  }
}
export default ClientProfile
