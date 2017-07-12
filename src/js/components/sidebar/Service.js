import React from "react"
import { render } from "react-dom"
import moment from "moment"
import { CURRENCY } from '../../config'
class Service extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      name: "",
      description: "",
      category: [],
      price: 0,
      currency: CURRENCY,
      duration: moment.duration( 0 ),
      stylist_id: undefined,
      stylist: undefined
    }
  }
  componentDidMount( ) {
    const { service, category, stylist } = this.props
    this.setState({
      name: service['name'],
      description: service['description'],
      service_category_id: service['service_category_id'],
      category: category,
      price: service['price'],
      duration: moment.duration(service['duration']),
      stylist_id: service['stylist_id'],
      stylist: stylist
    })
  }
  render( ) {
    const { isError, errors } = this.props
    return <div className='service'>
      <div className="list-select">
        <div className="item list-align-left">
          <i className="zmdi zmdi-scissors"></i>Name</div>
        <div className="item list-align-right">{this.state.name}</div>
      </div>
      <div className="list-select">
        <div className="item list-align-left">Description</div>
        <div className="item list-align-right">{this.state.description}</div>
      </div>
      <div className="list-select">
        <div className="item list-align-left">
          <i className="zmdi zmdi-label"></i>Category</div>
        <div className="item list-align-right">{this.state.category && this.state.category.name}
        </div>
      </div>
      <div className="list-select">
        <div className="item list-align-left">
          <i className="zmdi zmdi-account-circle"></i>Stylist</div>
        <div className="item list-align-right">{this.state.stylist
            ? this.state.stylist.first_name + " " + this.state.stylist.last_name
            : "General"}
        </div>
      </div>
      <div className="list-select">
        <div className="item list-align-left">
          <i className="zmdi zmdi-money"></i>Cost</div>
        <div className="item list-align-right">£{this
            .state
            .price
            .toFixed( 2 )}</div>
      </div>
      <div className="list-select">
        <div className="item list-align-left">
          <i className="zmdi zmdi-timer"></i>Duration</div>
        <div className="item list-align-right">{moment(this.state.duration.asMilliseconds( )).format( 'HH:mm' )}
          &nbsp;hours</div>
      </div>
    </div>
  }
}
export default Service
