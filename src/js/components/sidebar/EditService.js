import React from "react"
import {render} from "react-dom"
import moment from "moment"
import autoBind from 'react-autobind'
import {CURRENCY} from '../../config'
class EditService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      service_category_id: undefined,
      category: undefined,
      price: 0,
      currency: CURRENCY,
      duration: moment.duration("00:15:00"),
      stylist_id: undefined,
      stylist: undefined
    }
    autoBind(this)
  }
  componentDidMount() {
    const {service, category, categories, stylist} = this.props
    //we need to set a default category or it raises an error
    if (categories.length != 0) {
      this.setState({service_category_id: categories[0].id})
    }
    if (service) {
      this.setState({
        name: service['name'],
        description: service['description'],
        service_category_id: service['service_category_id'],
        category: category,
        price: service['price'],
        currency: service['currency'],
        duration: moment.duration(service['duration'])
      })
      if (stylist && stylist != null) {
        this.setState({stylist_id: service['stylist_id'], stylist: stylist})
      }
    }
  }
  handleChange(event) {
    let newstate = {}
    newstate[event.target.name] = event.target.value;
    this.setState(newstate);
  }
  render() {
    const {categories, stylists, isError, errors} = this.props
    return <div className='service'>
      <label className="list-select list-input" htmlFor="service_name_field">
        <div className="title">
          <i className="zmdi zmdi-scissors"></i>Name</div>
        <input type="text" id="service_name_field" value={this.state.name} name="name" onChange={this.handleChange} className='form-control' placeholder='e.g. Haircut'/> {(isError && errors && errors['name'] && errors['name'].length > 0) && <p>{errors['name'].map((validation) => validation)}</p>}
      </label>
      <label className="list-select list-input" htmlFor="service_desc_field">
        <div className="title">Description</div>
        <input type="text" id="service_desc_field" value={this.state.description} name="description" onChange={this.handleChange} className='form-control' placeholder='e.g. Service description'/>
      </label>
      <div className="list-select">
        <div className="item list-align-left">
          <i className="zmdi zmdi-label"></i>Category</div>
        <div className="item list-align-right no-padding-right">
          <div className="select-wrapper">
            <select value={this.state.service_category_id} onChange={(event) => this.setState({service_category_id: event.target.value})}>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="list-select">
        <div className="item list-align-left">
          <i className="zmdi zmdi-account-circle"></i>Stylist</div>
        <div className="item list-align-right no-padding-right">
          <div className="select-wrapper">
            <select value={this.state.stylist_id} onChange={(event) => this.setState({stylist_id: event.target.value})}>
              <option value="undefined">General</option>
              {stylists.map((stylist) => {
                if (stylist.status == "active")
                  return <option key={stylist.id} value={stylist.id}>{stylist.title}</option>
              })}
            </select>
          </div>
        </div>
      </div>
      <label className="list-select list-input" htmlFor="service_currency_field">
        <div className="title">
          <i className="zmdi zmdi-money"></i>
          Cost
        </div>
        <input type="text" id="service_currency_field" value={this.state.price} onChange={(event) => this.setState({price: event.target.value})} className='form-control' placeholder='e.g. 45.00'></input>
        {(isError && errors && errors['price'] && errors['price'].length > 0) && <p>{errors['price'].map((validation) => validation)}</p>}
      </label>
      <div className="list-select">
        <div className="item list-align-left">
          <i className="zmdi zmdi-timer"></i>Duration</div>
        <div className="item list-align-right no-padding-right">
          <div className="select-wrapper">
            <select value={moment(this.state.duration.asMilliseconds()).format('HH:mm')} onChange={(event) => this.setState({
              duration: moment.duration(event.target.value)
            })}>
              <option value="00:15">00:15 hours</option>
              <option value="00:30">00:30 hours</option>
              <option value="00:45">00:45 hours</option>
              <option value="01:00">01:00 hours</option>
              <option value="01:15">01:15 hours</option>
              <option value="01:30">01:30 hours</option>
              <option value="01:45">01:45 hours</option>
              <option value="02:00">02:00 hours</option>
              <option value="02:15">02:15 hours</option>
              <option value="02:30">02:30 hours</option>
              <option value="02:45">02:45 hours</option>
              <option value="03:00">03:00 hours</option>
              <option value="03:15">03:15 hours</option>
              <option value="03:30">03:30 hours</option>
              <option value="03:45">03:45 hours</option>
              <option value="04:00">04:00 hours</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  }
}
export default EditService
