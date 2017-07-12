import React from "react";
import {render} from "react-dom";
import {hashHistory} from 'react-router'
class Header extends React.Component {
  getTitle() {
    const {
      path,
      salon_id,
      service_id,
      client_id,
      stylist_id,
      booking_id
    } = this.props
    let title = ""
    switch (path) {
      case '/salon/' + salon_id + '/menu':
        title = 'Menu'
        break
      case '/salon/' + salon_id + '/menu/client':
        title = 'Clients List'
        break
      case '/salon/' + salon_id + '/menu/client/' + client_id:
        title = 'Client Profile'
        break
      case '/salon/' + salon_id + '/menu/client/' + client_id + '/edit':
        title = 'Edit Client'
        break
      case '/salon/' + salon_id + '/menu/client/' + client_id + '/patch':
        title = 'Edit Client'
        break
      case '/salon/' + salon_id + '/menu/client/new':
        title = 'New Client'
        break
      case '/salon/' + salon_id + '/menu/client/stylist':
        title = 'Selet a Stylist'
        break
      case '/salon/' + salon_id + '/menu/stylist':
        title = 'Stylists List'
        break
      case '/salon/' + salon_id + '/menu/stylist/' + stylist_id:
        title = 'Stylist Profile'
        break
      case '/salon/' + salon_id + '/menu/stylist/' + stylist_id + '/edit':
        title = 'Edit Stylist'
        break
      case '/salon/' + salon_id + '/menu/stylist/new':
        title = 'New Stylist'
        break
      case '/salon/' + salon_id + '/menu/service':
        title = 'Services List'
        break
      case '/salon/' + salon_id + '/menu/service/' + service_id:
        title = 'Service Profile'
        break
      case '/salon/' + salon_id + '/menu/service/' + service_id + '/edit':
        title = 'Edit Service'
        break
      case '/salon/' + salon_id + '/menu/service/new':
        title = 'New Service'
        break
      case '/salon/' + salon_id + '/menu/booking':
        title = 'Booking'
        break
      case '/salon/' + salon_id + '/menu/booking/' + booking_id:
        title = 'Booking'
        break
      case '/salon/' + salon_id + '/menu/booking/client':
        title = 'Select a Client'
        break
      case '/salon/' + salon_id + '/menu/booking/stylist':
        title = 'Select a Stylist'
        break
      case '/salon/' + salon_id + '/menu/booking/service':
        title = 'Select Services'
        break
    }
    return title
  }
  getPosition() {
    const {path, salon_id} = this.props
    let position
    switch (path) {
      case '/salon/' + salon_id + '/menu':
        position = 'menu'
        break
      case '/salon/' + salon_id + '/menu/booking':
        position = 'booking'
        break
      default:
        return ""
    }
    return position
  }
  render() {
    const {salon_id, close} = this.props
    return <div className="sidebar-header">
      {this.getPosition() != "menu" && this.getPosition() != "booking" && <div className="back-button" onClick={() => hashHistory.goBack()}>
        <i className="zmdi zmdi-arrow-left"></i>
      </div>}
      {this.getTitle()}
      <div className="close-button" onClick={() => close()}>
        <i className="zmdi zmdi-close"></i>
      </div>
    </div>;
  }
}
export default Header
