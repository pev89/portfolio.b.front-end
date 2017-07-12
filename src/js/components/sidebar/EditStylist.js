import React from "react"
import {connect} from 'react-redux'
import {render} from "react-dom"
import DatePicker from "react-datepicker"
import moment from "moment"
import autoBind from 'react-autobind'
import {hashHistory} from 'react-router'
import {CURRENCY} from '../../config'
import PhotoUpload from '../../components/sidebar/PhotoUpload'
import avatar from '../../../assets/images/default_avatar.png'
class EditStylist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: undefined,
      gender: 'female',
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      dob: moment().add(-24, 'years')
    }
    autoBind(this)
  }
  componentDidMount() {
    const {stylist} = this.props
    if (stylist) {
      this.setState({
        id: stylist['id'],
        first_name: stylist["first_name"],
        image: stylist["image"],
        last_name: stylist["last_name"],
        phone: stylist["phone"],
        gender: stylist["gender"],
        email: stylist["email"],
        dob: moment(stylist["dob"])
      })
    }
  }
  handleChange(event) {
    let newstate = {}
    newstate[event.target.name] = event.target.value;
    this.setState(newstate);
  }
  setBirthday(_date) {
    const {check_dob} = this.props
    var is_valid = check_dob(_date)
    if (is_valid) {
      this.setState({birthday: _date})
    }
  }
  render() {
    const {isError, errors, stylist} = this.props
    return <div className='profile'>
      {this.state.id && <PhotoUpload ref={(editPhotoForm) => {
        this.editPhotoForm = editPhotoForm
      }} preview={this.state.image
        ? this.state.image
        : avatar} model='stylist' id={this.state.id}/>}
      <label className="list-select list-input" htmlFor="first_name_field">
        <div className="title">
          <i className="zmdi zmdi-account-o"></i>First Name</div>
        <input type="text" id="first_name_field" value={this.state.first_name} name="first_name" onChange={this.handleChange} className='form-control' placeholder='e.g. Pedram'></input>
        {(isError && errors && errors['first_name'] && errors['first_name'].length > 0) && <p>{errors['first_name'].map((validation) => validation)}</p>}
      </label>
      <label className="list-select list-input" htmlFor="last_name_field">
        <div className="title">Last Name</div>
        <input type="text" id="last_name_field" value={this.state.last_name} name="last_name" onChange={this.handleChange} className='form-control' placeholder='e.g. Vahabi'></input>
        {(isError && errors && errors['last_name'] && errors['last_name'].length > 0) && <p>{errors['last_name'].map((validation) => validation)}</p>}
      </label>
      <label className="list-select list-input" htmlFor="phone_field">
        <div className="title">
          <i className="zmdi zmdi-phone"></i>Phone Number</div>
        <input type="tel" id="phone_field" value={this.state.phone} name="phone" onChange={this.handleChange} className='form-control' placeholder='e.g. 07934462171'></input>
        {(isError && errors && errors['phone'] && errors['phone'].length > 0) && <p>{errors['phone'].map((validation) => validation)}</p>}
      </label>
      <label className="list-select list-input" htmlFor="date_field">
        <div className="title">
          <i className="zmdi zmdi-calendar"></i>Date of birth</div>
        <DatePicker selected={this.state.dob} onChange={this.setBirthday} showMonthDropdown showYearDropdown dropdownMode="select" popoverAttachment='top center' popoverTargetAttachment='top center'/> {(isError && errors && errors['birthday'] && errors['birthday'].length > 0) && <p>{errors['birthday'].map((validation) => validation)}</p>}
      </label>
      <label className="list-select list-input" htmlFor="email_field">
        <div className="title">
          <i className="zmdi zmdi-email"></i>Email</div>
        <input type="email" id="email_field" value={this.state.email
          ? this.state.email
          : ""} name="email" onChange={this.handleChange} className='form-control' placeholder='e.g. pedramvahabi@gmail.com'></input>
        {(isError && errors && errors['email'] && errors['email'].length > 0) && <p>{errors['email'].map((validation) => validation)}</p>}
      </label>
      <div className="list-select">
        <div className="item list-align-left">
          <i className="zmdi zmdi-male-female"></i>Gender</div>
        <div className="item list-align-right no-padding-right">
          <div className="select-wrapper">
            <select value={this.state.gender} name="gender" onChange={this.handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  }
}
export default EditStylist
