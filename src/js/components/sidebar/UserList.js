import React from "react";
import {render} from "react-dom";
// import Popover from "react-popover"
import {connect} from 'react-redux'
// import Smartsearch from "../../containers/sidebar/smartsearch"
import {fetchSearchClientsBySalon} from '../../actions/salon'
// class UserPopOver extends React.Component {
//     render(){
//         const { user } = this.props
//         return <div>
//             <span>{user.first_name} {user.last_name}</span>
//             <span>{user.phone}</span>
//             <span>{user.email}</span>
//         </div>
//     }
// }
// class UserRow extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             show: false
//         }
//         this.toggleOpen = this.toggleOpen.bind(this)
//         this.toggleClose = this.toggleClose.bind(this)
//     }
//     toggleOpen(){
//         const   { show } = this.props
//         if(show == "True"){
//             this.setState({show: true})
//         }
//     }
//     toggleClose(){
//         this.setState({show: false})
//     }
//     render(){
//         const { user } = this.props
//         return <Popover isOpen={this.state.show} body={<UserPopOver user={user}/>} className="popover">
//                 <div onClick={this.props.click} className="user-name" onMouseEnter={this.toggleOpen} onMouseLeave={this.toggleClose}>{user.title}
//                 </div>
//             </Popover>
//     }
// }
class UserList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchTerm: '',
      currentlyDisplayed: []
      // ,
      // isPopover: false
    }
    this.sendBack = this.sendBack.bind(this)
    this.search = this.search.bind(this)
  }
  componentDidMount() {
    const {clients, stylists, type} = this.props
    if (type == "stylist") {
      this.setState({currentlyDisplayed: stylists})
    } else {
      this.setState({currentlyDisplayed: clients})
    }
  }
  sendBack(_user) {
    const {click, type} = this.props
    let data = {}
    data[type] = _user
      ? _user.id
      : undefined //check with data coming in
    data[type + "_name"] = _user
      ? _user.title
      : "Walk-in" //check with data coming in
    click(data)
  }
  search(event) {
    const {type, id, dispatch, users} = this.props
    this.setState({searchTerm: event.target.value})
    if (type == "stylist") {
      let newlyDisplayed = users.filter((person) => {
        return person.title.toLowerCase().includes(event.target.value.toLowerCase())
      })
      this.setState({currentlyDisplayed: newlyDisplayed})
    } else {
      dispatch(fetchSearchClientsBySalon(id, event.target.value.toLowerCase())).then((_received) => {
        this.setState({currentlyDisplayed: _received})
      })
    }
  }
  render() {
    const {click, in_booking, add_new} = this.props
    return <div className="user-list">
      <div className="form-header">
        <input type='text' ref='text' className="form-control input-lg" placeholder='Search' id="InputSearch" value={this.state.searchTerm} onChange={this.search} autoFocus/>
        <i className="zmdi zmdi-search"></i>
      </div>
      {in_booking && in_booking == "True" && <div className="btn-justify">
        <div onClick={() => this.sendBack(undefined)} className="btn btn-neutral btn-small">Walk-in</div>
        <div onClick={add_new} className="btn btn-neutral btn-small">Create new client</div>
      </div>}
      {this.state.currentlyDisplayed && this.state.currentlyDisplayed.map((user, i) => {
        if (user.status == "active")
          return <div key={i} onClick={() => this.sendBack(user)} className="user-name">{user.title}
            <span className="user-phone">({user.phone})</span>
          </div>
      })}
    </div>;
  }
}
function mapStateToProps(state) {
  const {salon} = state
  const {
    stylistsBySalon: {
      stylists: stylists
    },
    clientsBySalon: {
      clients: clients
    }
  } = salon || {
    clientsBySalon: {
      clients: []
    },
    stylistsBySalon: {
      stylists: []
    }
  }
  return {clients, stylists}
}
export default connect(mapStateToProps)(UserList);
