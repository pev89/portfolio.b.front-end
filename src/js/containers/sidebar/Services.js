import React from "react"
import {connect} from 'react-redux'
import {render} from "react-dom"
import autoBind from 'react-autobind'
import {hashHistory} from 'react-router'
import Raven from 'raven-js'
import ServiceList from '../../components/sidebar/ServiceList'
import Footer from '../../components/sidebar/Footer'
import {fetchService, fetchServicesBySalon} from '../../actions/salon'
import Service from '../../components/sidebar/Service'
import EditService from '../../components/sidebar/EditService'
import {cleanBookings} from '../../actions/booking'
import {cleanError} from '../../actions/errors'
class Services extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      view: 'list',
      service: null
    }
    autoBind(this)
  }
  componentDidMount() {
    const {dispatch} = this.props
    dispatch(cleanError())
    this.checkView(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.checkView(nextProps)
  }
  componentDidUpdate(prevProps, prevState) {
    // check if we just save the new client
    if (!this.props.newService.isFetching && prevProps.newService.isFetching) {
      // we are getting back from a edit/new save state
      hashHistory.goBack()
      this.receiveService(nextProps);
    }
  }
  checkView(_props) {
    const {params, routes} = _props
    if (params['service_id']) {
      // this is a client
      if (routes[6] && routes[6].path == 'edit') {
        this.setState({view: 'edit'});
      } else {
        this.setState({view: 'profile'});
      }
      this.receiveService(_props);
    } else {
      if (routes[5] && routes[5].path == 'new') {
        this.setState({view: 'edit'})
      } else {
        this.setState({view: 'list'})
      }
    }
  }
  receiveService(nextProps) {
    const {dispatch, params, services} = nextProps
    // check if the client is on the clients list, fetch it otherwise
    if (params['service_id']) {
      let service = services.services.filter(function(obj) {
        return obj.id == params['service_id'];
      })
      if (service.length > 0) {
        this.setState({
          service: service[0],
          category: this.getCategories(service[0].service_category_id, nextProps),
          stylist: this.getStylist(service[0].stylist_id, nextProps)
        });
      } else {
        // fetch the service
        dispatch(fetchServicesBySalon(params.id));
        this.setState({service: null})
      }
    } else {
      this.setState({service: null})
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
      }
    }
    return null
  }
  getCategories(category_id, nextProps) {
    const {dispatch, categories, params} = nextProps
    // try to get the categories
    if (category_id) {
      let category = categories.categories.filter(function(obj) {
        return obj.id == category_id;
      })
      if (category.length > 0) {
        return category[0]
      }
    }
    return null
  }
  openService(_service) {
    const {params} = this.props
    hashHistory.push(`/salon/${params.id}/menu/service/${_service['id']}`);
  }
  addNewService() {
    const {params, dispatch} = this.props
    this.setState({service: null})
    dispatch(cleanError())
    hashHistory.push(`/salon/${params.id}/menu/service/new`);
  }
  editService() {
    const {params, dispatch} = this.props
    dispatch(cleanError())
    hashHistory.push(`/salon/${params.id}/menu/service/${params.service_id}/edit`);
  }
  saveService() {
    const {dispatch, params} = this.props
    dispatch(cleanError())
    let new_service_data = {
      price: parseFloat(this.editServiceForm.state['price']),
      description: this.editServiceForm.state['description'],
      name: this.editServiceForm.state['name'],
      duration: this.editServiceForm.state['duration'],
      currency: this.editServiceForm.state['currency'],
      service_category_id: this.editServiceForm.state['service_category_id'],
      salon_id: parseInt(params.id)
    }
    if (this.editServiceForm.state['stylist_id']) {
      new_service_data['stylist_id'] = parseInt(this.editServiceForm.state['stylist_id'])
    }
    if (params['service_id']) {
      new_service_data['id'] = params['service_id']
      dispatch(fetchService(new_service_data, 'PUT', params.id))
    } else {
      dispatch(fetchService(new_service_data, 'POST', params.id))
    }
  }
  rightButton() {
    switch (this.state.view) {
      case 'list':
        return this.addNewService()
      case 'profile':
        return this.editService()
      case 'edit':
        return this.saveService()
      case 'new':
        return this.saveService()
      default:
        return
    }
  }
  getRightButtonName() {
    switch (this.state.view) {
      case 'list':
        return "ADD NEW"
      case 'profile':
        return "EDIT"
      case 'edit':
        return "SAVE"
      case 'new':
        return "SAVE"
      default:
        return
    }
  }
  deleteService() {
    const {dispatch, params} = this.props
    let delete_service_data = this.state.service
    delete_service_data['status'] = "deleted"
    dispatch(fetchService(delete_service_data, 'DELETE', params.id)).then(() => {
      // we need to reload the services, and the bookings
      dispatch(cleanBookings())
      hashHistory.goBack()
    }).catch((err) => {
      Raven.captureException(err)
    })
  }
  leftButton() {
    switch (this.state.view) {
      case 'profile':
        return this.deleteService()
      default:
        return
    }
  }
  getLeftButtonName() {
    switch (this.state.view) {
      case 'profile':
        return "DELETE"
      default:
        return
    }
  }
  render() {
    const {
      services,
      params,
      isFetchingService,
      stylists,
      categories,
      isError,
      errorFields
    } = this.props
    return <div className="sidebar-services">
      {this.state.view == 'list' && <div className="view_services">
        <ServiceList mode="list" services={services.services} stylists={stylists.stylists} click={this.openService}/>
      </div>}
      {this.state.view == 'profile' && <div className="view_new">
        <Service service={this.state.service} category={this.state.category} stylist={this.state.stylist}/>
      </div>}
      {(this.state.view == 'edit' || this.state.view == 'new') && <div className="view_new">
        <EditService ref={(editServiceForm) => {
          this.editServiceForm = editServiceForm;
        }} service={this.state.service} errors={errorFields} isError={isError} categories={categories.categories} stylists={stylists.stylists}/>
      </div>}
      <Footer id={params.id} left_name={this.getLeftButtonName()} left={this.leftButton} right_name={this.getRightButtonName()} right={this.rightButton}/>
    </div>;
  }
}
function mapStateToProps(state) {
  const {salon, errors} = state
  const {stylistsBySalon: stylists, servicesBySalon: services, categories: categories, edit_service: newService} = salon
  const {isError: isError, fields: errorFields} = errors || {
    isError: false,
    fields: {},
    message: ''
  }
  return {
    stylists,
    services,
    categories,
    newService,
    isError,
    errorFields
  }
}
export default connect(mapStateToProps)(Services);
