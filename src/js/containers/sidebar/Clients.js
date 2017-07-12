import React from "react"
import {connect} from 'react-redux'
import {render} from "react-dom"
import {hashHistory} from 'react-router'
import Raven from 'raven-js'
import moment from 'moment'
import autoBind from 'react-autobind'
import {raiseError, cleanError} from '../../actions/errors'
import UserList from '../../components/sidebar/UserList'
import Footer from '../../components/sidebar/Footer'
import ClientProfile from '../../components/sidebar/ClientProfile'
import EditClient from '../../components/sidebar/EditClient'
import EditPatchTest from '../../components/sidebar/EditPatchTest'
import {fetchClient, saveClientData, fetchClientsBySalon} from '../../actions/salon'
import {fetchBookingsByClient, cleanBookingData, cleanBookings} from '../../actions/booking'
class Clients extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      view: 'list',
      client: null,
      bookings: null,
      loaded: false
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
    if (!this.props.isEditing && prevProps.isEditing) {
      hashHistory.goBack()
      if (!this.state.loaded) {
        this.receiveClient(nextProps)
      }
    }
  }
  checkView(_props) {
    const {params, routes} = _props
    if (params['client_id']) {
      // this is a client
      if (routes[6] && routes[6].path == 'edit') {
        this.setState({view: 'edit'});
      } else if (routes[6] && routes[6].path == 'patch') {
        this.setState({view: 'patch'});
      } else {
        this.setState({view: 'profile'});
      }
      if (!this.state.loaded) {
        this.receiveClient(_props);
      }
    } else {
      if (routes[5] && routes[5].path == 'new') {
        this.setState({view: 'edit'})
      } else if (routes[5] && routes[5].path == 'stylist') {
        this.setState({view: 'stylist'})
      } else {
        this.setState({view: 'list'})
      }
    }
  }
  receiveClient(nextProps) {
    const {dispatch, params, clients, bookings_date, bookings_client} = nextProps
    // check if the client is on the clients list, fetch it otherwise
    if (params['client_id']) {
      let client = clients.filter(function(obj) {
        return obj.id == params['client_id'];
      })
      if (client.length > 0) {
        client = client[0]
        if (client.patch_test_stylist_id) {
          client['patch_test_stylist'] = this.getStylist(client.patch_test_stylist_id)
        }
        this.setState({client: client, loaded: true});
      } else {
        // fetch the client
        dispatch(fetchClient(params.id, {id: params['client_id']}));
      }
      if (!bookings_client || bookings_client != params['client_id'] || bookings_date < moment().add(-5, 'minutes')) {
        dispatch(fetchBookingsByClient(params['client_id'], params['id']));
      }
    } else {
      this.setState({client: null})
    }
  }
  openProfile(_user) {
    const {params} = this.props
    hashHistory.push(`/salon/${params.id}/menu/client/${_user['client']}`);
  }
  editProfile() {
    const {params, dispatch} = this.props
    dispatch(cleanError())
    hashHistory.push(`/salon/${params.id}/menu/client/${params.client_id}/edit`);
  }
  editPatchTest() {
    const {params, dispatch} = this.props
    dispatch(cleanError())
    hashHistory.push(`/salon/${params.id}/menu/client/${params.client_id}/patch`);
  }
  addNewClient() {
    const {params, dispatch} = this.props
    dispatch(cleanError())
    this.setState({client: null})
    hashHistory.push(`/salon/${params.id}/menu/client/new`);
  }
  pickStylist() {
    const {params} = this.props
    hashHistory.push(`/salon/${params.id}/menu/client/stylist`);
  }
  setStylist(_data) {
    const {dispatch} = this.props
    dispatch(cleanError())
    this.setState({
      client: {
        ...this.state.client,
        patch_test_stylist_id: _data["stylist"],
        patch_test_stylist: this.getStylist(_data["stylist"])
      }
    })
    hashHistory.goBack()
  }
  getStylist(stylist_id) {
    const {stylists} = this.props
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
  saveProfile() {
    const {dispatch, params} = this.props
    this.setState({loaded: false})
    let new_client_data = {
      email: this.editClientForm.state['email'],
      first_name: this.editClientForm.state['first_name'],
      last_name: this.editClientForm.state['last_name'],
      birthday: this.editClientForm.state['birthday'],
      notifications: this.editClientForm.state['notifications'],
      drink: this.editClientForm.state['drink'],
      gender: this.editClientForm.state['gender'],
      phone: this.editClientForm.state['phone'],
      magazine: this.editClientForm.state['magazine'],
      status: "active",
      salon_id: parseInt(params.id)
    }
    if (this.state.client) {
      new_client_data['patch_test_notes'] = this.state.client.patch_test_notes,
      new_client_data['patch_test_date'] = this.state.client.patch_test_date
        ? this.state.client.patch_test_date.toISOString()
        : null
      new_client_data['patch_test_stylist_id'] = this.state.client.patch_test_stylist_id
    }
    dispatch(cleanError())
    if (params['client_id']) {
      // update the client
      new_client_data['id'] = params['client_id']
      dispatch(fetchClient(params.id, new_client_data, 'PUT')).catch((err) => {
        Raven.captureException(err)
      })
    } else {
      dispatch(fetchClient(params.id, new_client_data, 'POST')).catch((err) => {
        Raven.captureException(err)
      })
    }
  }
  savePatchTest() {
    const {dispatch, params} = this.props
    this.setState({loaded: false})
    let new_client_data = {
      email: this.state.client.email,
      first_name: this.state.client.first_name,
      last_name: this.state.client.last_name,
      birthday: this.state.client.birthday,
      notifications: this.state.client.notifications,
      drink: this.state.client.drink,
      gender: this.state.client.gender,
      phone: this.state.client.phone,
      magazine: this.state.client.magazine,
      patch_test_notes: this.editPatchTestForm.state['patch_test_notes'],
      patch_test_date: this.editPatchTestForm.state['patch_test_date']
        ? this.editPatchTestForm.state['patch_test_date'].toISOString()
        : null,
      patch_test_stylist_id: this.editPatchTestForm.state['patch_test_stylist_id'],
      status: "active",
      salon_id: parseInt(params.id)
    }
    dispatch(cleanError())
    if (params['client_id']) {
      // update the client
      new_client_data['id'] = params['client_id']
      dispatch(fetchClient(params.id, new_client_data, 'PUT')).catch((err) => {
        Raven.captureException(err)
      })
    } else {
      dispatch(fetchClient(params.id, new_client_data, 'POST')).catch((err) => {
        Raven.captureException(err)
      })
    }
  }
  rightButton() {
    switch (this.state.view) {
      case 'list':
        return this.addNewClient()
      case 'profile':
        return this.editProfile()
      case 'patch':
        return this.savePatchTest()
      case 'edit':
        return this.saveProfile()
      case 'new':
        return this.saveProfile()
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
      case 'patch':
        return "SAVE"
      case 'new':
        return "SAVE"
      default:
        return
    }
  }
  deleteProfile() {
    const {dispatch, params} = this.props
    let delete_client_data = this.state.client
    delete_client_data['status'] = "deleted"
    dispatch(fetchClient(params.id, delete_client_data, 'DELETE')).then(() => {
      dispatch(cleanBookings())
      hashHistory.goBack()
    }).catch((err) => {
      Raven.captureException(err)
    })
  }
  leftButton() {
    switch (this.state.view) {
      case 'profile':
        return this.deleteProfile()
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
  checkDOB(_date) {
    const {dispatch} = this.props
    var today = moment()
    var is_valid = true
    dispatch(cleanError())
    if (_date.isAfter(today)) {
      is_valid = false
      dispatch(raiseError({
        code: 400,
        fields: {
          birthday: ["This field cannot be in the future"]
        }
      }))
    }
    return is_valid
  }
  render() {
    const {
      params,
      isFetchingClient,
      isFetchingBookings,
      isError,
      bookings,
      stylists,
      errorFields
    } = this.props
    return <div className="sidebar-clients">
      {this.state.view == 'list' && <div className="view_list">
        <UserList id={params.id} type="client" click={this.openProfile}/>
      </div>}
      {(this.state.view == 'edit' || this.state.view == 'new') && <div className="view_edit">
        <EditClient ref={(editClientForm) => {
          this.editClientForm = editClientForm
        }} check_dob={this.checkDOB} errors={errorFields} isError={isError} client={this.state.client} onClickStylist={this.pickStylist}/>
      </div>}
      {this.state.view == 'patch' && <div className="view_edit">
        <EditPatchTest ref={(editPatchTestForm) => {
          this.editPatchTestForm = editPatchTestForm
        }} client={this.state.client} onClickStylist={this.pickStylist}/>
      </div>}
      {this.state.view == 'stylist' && <div className="view_stylist">
        <UserList users={stylists} type="stylist" click={this.setStylist}/>
      </div>}
      {this.state.view == 'profile' && <div className="view_new">
        <ClientProfile errors={errorFields} isError={isError} client={this.state.client} bookings={bookings} stylists={stylists} onClickPatchTest={this.editPatchTest}/>
      </div>}
      <Footer id={params.id} left_name={this.getLeftButtonName()} left={this.leftButton} right_name={this.getRightButtonName()} right={this.rightButton}/>
    </div>;
  }
}
function mapStateToProps(state) {
  const {salon, booking, errors} = state
  const {
    stylistsBySalon: stylists,
    clientsBySalon: {
      clients: clients,
      isFetching: isFetchingClient
    },
    edit_client: {
      isFetching: isEditing,
      data: edit_client
    }
  } = salon
  const {
    bookingsByClient: {
      bookings: bookings,
      isFetching: isFetchingBookings,
      client_id: bookings_client,
      date: bookings_date
    },
    persist_booking: fromBooking
  } = booking
  const {isError: isError, fields: errorFields} = errors || {
    isError: false,
    fields: {},
    message: ''
  }
  return {
    fromBooking,
    isFetchingClient,
    isFetchingBookings,
    bookings,
    bookings_client,
    bookings_date,
    clients,
    stylists,
    edit_client,
    isEditing,
    isError,
    errorFields
  }
}
export default connect(mapStateToProps)(Clients);
