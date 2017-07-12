import React from "react";
import { render } from "react-dom";
import moment from "moment"
class ServiceList extends React.Component {
  constructor( props ) {
    super( props )
    this.state = {
      selected_ids: [],
      selected: [ ]
    }
    this.select = this
      .select
      .bind( this )
  }
  componentDidMount( ) {
    const { selected } = this.props
    let ids = [ ]
    if ( selected ) {
      selected.map(( service, i ) => {
        ids.push( service.id )
      })
      this.setState({ selected: selected, selected_ids: ids })
    }
  }
  select( _service ) {
    const { click } = this.props
    let selected = this.state.selected
    let selected_ids = this.state.selected_ids
    if ( selected_ids.indexOf( _service.id ) != -1 ) {
      selected.splice( selected.indexOf( _service ), 1 )
      selected_ids.splice( selected_ids.indexOf( _service.id ), 1 )
    } else {
      selected.push( _service )
      selected_ids.push( _service.id )
    }
    this.setState({ selected: selected, selected_ids: selected_ids })
    if ( click ) {
      click({ services: selected_ids })
    }
  }
  groupServices( _services ) {
    let servicesRemapped = {}
    _services.map(( service ) => {
      if ( service.status == "active" ) {
        if ( service['stylist_id'] == null ) {
          if (!servicesRemapped['General']) {
            servicesRemapped['General'] = [ ]
          }
          servicesRemapped['General'].push( service )
        } else {
          let id = service['stylist_id']
          if (!servicesRemapped[id]) {
            servicesRemapped[id] = [ ]
          }
          servicesRemapped[id].push( service )
        }
      }
    })
    return servicesRemapped
  }
  getStylistName( _id ) {
    const { stylists } = this.props
    let name = ""
    stylists.filter(( stylist ) => {
      if ( stylist.id == _id ) {
        name = stylist.last_name + ' ' + stylist.first_name
      }
    })
    return name
  }
  render( ) {
    let remapped = null
    const { services, mode, click, stylist_id } = this.props
    if ( services ) {
      remapped = this.groupServices( services )
    }
    return <div className="service-list">
      {services && Object
        .keys( remapped )
        .map(( key ) => <div key={key}>
          {( stylist_id == null || key == 'General' || stylist_id == key ) && <h3>{( key != 'General' )
              ? this.getStylistName( key )
              : "General"}
            &nbsp;Services</h3>}
          {remapped[key].map(( service, i ) => <div key={i}>
            {mode == "select"
              ? <div onClick={( ) => this.select( service )} key={i}>
                  {( stylist_id == null || service.stylist_id == null || stylist_id == service.stylist_id ) && <div className="user-list">
                    <span className="check">{( this.state.selected_ids.indexOf( service.id ) != -1 )
                        ? <i className="zmdi zmdi-check-circle"></i>
                        : <i className="zmdi zmdi-circle-o"></i>}</span>
                    <span className="title">{service.name}
                      &nbsp;({moment(moment.duration( service.duration ).asMilliseconds( )).format( 'HH:mm' )}&nbsp;hours)</span>
                    <span className="price">£{service
                        .price
                        .toFixed( 2 )}</span>
                  </div>}
                </div>
              : <div className="user-list" onClick={( ) => click( service )} key={i}>
                <span className="title">{service.name}
                  &nbsp;({moment(moment.duration( service.duration ).asMilliseconds( )).format( 'HH:mm' )}&nbsp;hours)</span>
                <span className="price">£{service
                    .price
                    .toFixed( 2 )}</span>
              </div>}
          </div>)}
        </div>)}
    </div>;
  }
}
export default ServiceList
