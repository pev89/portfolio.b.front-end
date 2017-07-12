import React from "react"
import {connect} from 'react-redux'
import {render} from "react-dom"
import DatePicker from "react-datepicker"
import moment from "moment"
import {hashHistory} from 'react-router'
import {CURRENCY} from '../../config'
import PhotoUpload from './PhotoUpload'
import avatar from '../../../assets/images/default_avatar.png'
import BookingList from '../../components/sidebar/BookingList'
class StylistProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      gender: 'male',
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      dob: moment()
    }
  }
  componentDidMount() {
    const {stylist} = this.props
    this.setState({
      first_name: stylist["first_name"],
      image: stylist["image"],
      last_name: stylist["last_name"],
      phone: stylist["phone"],
      gender: stylist["gender"],
      email: stylist["email"],
      dob: moment(stylist["dob"])
    })
  }
  render() {
    const {isError, errors} = this.props
    return (
      <div className='profile'>
        <div className="profile-photo">
          <div className="profile-image">
            <img src={this.state.image
              ? this.state.image
              : avatar}/>
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
          <div className="item list-align-right">{this.state.dob && this.state.dob.format("DD/MM/YYYY")}
          </div>
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
      </div>
    )
  }
}
export default StylistProfile
