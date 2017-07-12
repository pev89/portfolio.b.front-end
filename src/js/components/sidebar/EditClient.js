import React from "react"
import {connect} from 'react-redux'
import {render} from "react-dom"
import DatePicker from "react-datepicker"
import moment from "moment"
import {hashHistory} from 'react-router'
import autoBind from 'react-autobind'
import {CURRENCY} from '../../config'
class EditClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: 'female',
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      birthday: moment().add(-24, 'years'),
      notifications: true,
      magazine: "",
      drink: ""
    }
    autoBind(this)
  }
  componentDidMount() {
    const {client} = this.props
    if (client) {
      this.setClient(client)
    }
  }
  componentWillReceiveProps(nextProps) {
    const {client} = nextProps
    if (client) {
      this.setClient(client)
    }
  }
  setClient(client) {
    this.setState({
      first_name: client["first_name"],
      image: client["image"],
      last_name: client["last_name"],
      phone: client["phone"],
      gender: client["gender"],
      email: client["email"],
      birthday: moment(client["birthday"]),
      notifications: client["notifications"],
      magazine: client["magazine"],
      drink: client["drink"]
    })
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
    const {isError, errors, onClickStylist} = this.props
    return (
      <div className='profile'>
        <label className="list-select list-input" htmlFor="first_name_field">
          <div className="title">
            <i className="zmdi zmdi-account-o"></i>First Name</div>
          <input type="text" id="first_name_field" value={this.state.first_name} name="first_name" onChange={this.handleChange} className='form-control' placeholder='e.g. John'></input>
          {(isError && errors && errors['first_name'] && errors['first_name'].length > 0) && <p>{errors['first_name'].map((validation) => validation)}</p>}
        </label>
        <label className="list-select list-input" htmlFor="last_name_field">
          <div className="title">Last Name</div>
          <input type="text" id="last_name_field" value={this.state.last_name} name="last_name" onChange={this.handleChange} className='form-control' placeholder='e.g. Doe'></input>
          {(isError && errors && errors['last_name'] && errors['last_name'].length > 0) && <p>{errors['last_name'].map((validation) => validation)}</p>}
        </label>
        <label className="list-select list-input" htmlFor="phone_field">
          <div className="title">
            <i className="zmdi zmdi-phone"></i>Phone Number</div>
          <input type="tel" id="phone_field" value={this.state.phone} name="phone" onChange={this.handleChange} className='form-control' placeholder='e.g. 07933948200'></input>
          {(isError && errors && errors['phone'] && errors['phone'].length > 0) && <p>{errors['phone'].map((validation) => validation)}</p>}
        </label>
        <label className="list-select list-input" htmlFor="date_field">
          <div className="title">
            <i className="zmdi zmdi-calendar"></i>Date of birth</div>
          <DatePicker selected={this.state.birthday} onChange={this.setBirthday} showMonthDropdown showYearDropdown dropdownMode="select" popoverAttachment='top center' popoverTargetAttachment='top center'/> {(isError && errors && errors['birthday'] && errors['birthday'].length > 0) && <p>{errors['birthday'].map((validation) => validation)}</p>}
        </label>
        <label className="list-select list-input" htmlFor="email_field">
          <div className="title">
            <i className="zmdi zmdi-email"></i>Email</div>
          <input type="email" id="email_field" value={this.state.email} name="email" onChange={this.handleChange} className='form-control' placeholder='e.g. john.doe@gmail.com'></input>
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
        <label className="list-select" htmlFor="switchNotification">
          <div className="item list-align-left">
            <i className="zmdi zmdi-notifications-none"></i>Notification</div>
          <div className="item list-align-right">
            <span className="material-switch">
              <input id="switchNotification" name="notifications002" type="checkbox" checked={this.state.notifications} onChange={(event) => this.setState({
                notifications: this.state.notifications
                  ? false
                  : true
              })}></input>
              <span className="switch"></span>
            </span>
          </div>
        </label>
        <label className="list-select list-input" htmlFor="magazine_field">
          <div className="title">
            <i className="zmdi zmdi-book"></i>Favourite Magazine</div>
          <input type="text" id="magazine_field" value={this.state.magazine} name="magazine" onChange={this.handleChange} className='form-control' placeholder='e.g. Cosmopolitan'/>
        </label>
        <label className="list-select list-input" htmlFor="drink_field">
          <div className="title">
            <i className="zmdi zmdi-cocktail"></i>Favourite Drink</div>
          <input type="text" id="drink_field" value={this.state.drink} name="drink" onChange={this.handleChange} className='form-control' placeholder='e.g. Black Tea'/>
        </label>
      </div>
    )
  }
}
export default EditClient
