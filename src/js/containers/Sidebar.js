import {render} from "react-dom";
import React from "react";
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Header from '../components/sidebar/Header'
import {cleanBookingData} from '../actions/booking'
class Sidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.close = this.close.bind(this)
  }
  close() {
    const {params, dispatch} = this.props
    hashHistory.push(`/salon/${params.id}/`)
    dispatch(cleanBookingData())
  }
  render() {
    const {location, params} = this.props
    return <div className="sidebar">
      <div className="container">
        <Header path={location.pathname} close={this.close} salon_id={params.id} service_id={params.service_id} client_id={params.client_id} stylist_id={params.stylist_id} booking_id={params.booking_id}/> {this.props.children}
      </div>
      <div className="bg" onClick={this.close}></div>
    </div>;
  }
}
function mapStateToProps(state) {
  return {}
}
export default connect(mapStateToProps)(Sidebar);
