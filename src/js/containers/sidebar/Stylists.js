import React from "react"
import {connect} from 'react-redux'
import {render} from "react-dom"
import {hashHistory} from 'react-router'
import $ from 'jquery'
import Raven from 'raven-js'
import moment from 'moment'
import UserList from '../../components/sidebar/UserList'
import Footer from '../../components/sidebar/Footer'
import StylistProfile from '../../components/sidebar/StylistProfile'
import EditStylist from '../../components/sidebar/EditStylist'
import {fetchStylistsBySalon, fetchStylist} from '../../actions/salon'
import {raiseError, cleanError} from '../../actions/errors'
import {cleanBookings} from '../../actions/booking'
class Stylists extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      view: 'list',
      stylist: null
    }
    this.getRightButtonName = this.getRightButtonName.bind(this)
    this.rightButton = this.rightButton.bind(this)
    this.openProfile = this.openProfile.bind(this)
    this.receiveStylist = this.receiveStylist.bind(this)
    this.checkView = this.checkView.bind(this)
    this.deleteProfile = this.deleteProfile.bind(this)
    this.checkDOB = this.checkDOB.bind(this)
    this.leftButton = this.leftButton.bind(this)
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
    if (!this.props.newStylist.isFetching && prevProps.newStylist.isFetching) {
      // we are getting back from a edit/new save state
      hashHistory.goBack()
      this.receiveStylist(nextProps);
    }
  }
  checkView(_props) {
    const {params, routes} = _props
    if (params['stylist_id']) {
      // this is a client
      if (routes[6] && routes[6].path == 'edit') {
        this.setState({view: 'edit'});
      } else {
        this.setState({view: 'profile'});
      }
      this.receiveStylist(_props);
    } else {
      if (routes[5] && routes[5].path == 'new') {
        this.setState({view: 'edit'})
      } else {
        this.setState({view: 'list'})
      }
    }
  }
  receiveStylist(nextProps) {
    const {dispatch, params, stylists} = nextProps
    if (params['stylist_id']) {
      // show a particular stylist, if we can find it
      let stylist = stylists.stylists.filter(function(obj) {
        return obj.id == params['stylist_id']
      })
      if (stylist.length > 0) {
        this.setState({stylist: stylist[0]})
      } else {
        dispatch(fetchStylistsBySalon(params.id));
        this.setState({stylist: null})
      }
    } else {
      this.setState({stylist: null})
    }
  }
  openProfile(_user) {
    const {params} = this.props
    hashHistory.push(`/salon/${params.id}/menu/stylist/${_user['stylist']}`);
  }
  editProfile() {
    const {params, dispatch} = this.props
    dispatch(cleanError())
    hashHistory.push(`/salon/${params.id}/menu/stylist/${params.stylist_id}/edit`);
  }
  addNewStylist() {
    const {params, dispatch} = this.props
    dispatch(cleanError())
    this.setState({stylist: null})
    hashHistory.push(`/salon/${params.id}/menu/stylist/new`);
  }
  saveProfile() {
    const {dispatch, params} = this.props
    dispatch(cleanError())
    let new_stylist_data = {
      email: this.editStylistForm.state['email'],
      first_name: this.editStylistForm.state['first_name'],
      last_name: this.editStylistForm.state['last_name'],
      birthday: this.editStylistForm.state['dob'],
      gender: this.editStylistForm.state['gender'],
      phone: this.editStylistForm.state['phone'],
      status: "active",
      salon_id: parseInt(params.id)
    }
    if (params['stylist_id']) {
      new_stylist_data['id'] = params['stylist_id']
      dispatch(fetchStylist(params.id, new_stylist_data, 'PUT')).catch((err) => Raven.captureException(err))
    } else {
      dispatch(fetchStylist(params.id, new_stylist_data, 'POST')).catch((err) => Raven.captureException(err))
    }
  }
  rightButton() {
    switch (this.state.view) {
      case 'list':
        return this.addNewStylist()
      case 'profile':
        return this.editProfile()
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
      case 'new':
        return "SAVE"
      default:
        return
    }
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
  deleteProfile() {
    const {dispatch, params} = this.props
    let delete_stylist_data = this.state.stylist
    delete_stylist_data['status'] = "deleted"
    dispatch(fetchStylist(params.id, delete_stylist_data, 'DELETE')).then(() => {
      dispatch(cleanBookings())
      hashHistory.goBack()
    }).catch((err) => {
      Raven.captureException(err)
    })
  }
  render() {
    const {params, stylists, isError, errorFields} = this.props
    return <div className="sidebar-stylists">
      {this.state.view == 'list' && <div className="view_list">
        <UserList type="stylist" click={this.openProfile} users={stylists['stylists']}/>
      </div>}
      {(this.state.view == 'edit' || this.state.view == 'new') && <div className="view_new">
        <EditStylist ref={(editStylistForm) => {
          this.editStylistForm = editStylistForm;
        }} errors={errorFields} isError={isError} stylist={this.state.stylist} check_dob={this.checkDOB}/>
      </div>}
      {this.state.view == 'profile' && <div className="view_new">
        <StylistProfile errors={errorFields} isError={isError} stylist={this.state.stylist}/></div>}
      <Footer id={params.id} left_name={this.getLeftButtonName()} left={this.leftButton} right_name={this.getRightButtonName()} right={this.rightButton}/>
    </div>;
  }
}
function mapStateToProps(state) {
  const {booking, salon, user, errors} = state
  const {stylistsBySalon: stylists, edit_stylist: newStylist} = salon
  const {isError: isError, fields: errorFields} = errors
  return {stylists, newStylist, isError, errorFields}
}
export default connect(mapStateToProps)(Stylists);
