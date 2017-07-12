import {render} from "react-dom";
import {connect} from 'react-redux'
import React from "react";
import {hashHistory} from 'react-router';
import {setRedirectUrl} from '../actions/authentication';
class EnsureLoggedIn extends React.Component {
  componentDidMount() {
    const {dispatch, isAuthenticated, currentURL} = this.props
    if (!isAuthenticated) {
      // set the current url/path for future redirection (we use a Redux action)
      // then redirect (we use a React Router method)
      dispatch(setRedirectUrl(currentURL))
      hashHistory.replace("/login")
    }
  }
  render() {
    const {isAuthenticated} = this.props
    if (isAuthenticated) {
      return this.props.children
    } else {
      return null
    }
  }
}
// Grab a reference to the current URL. If this is a web app and you are
// using React Router, you can use `ownProps` to find the URL. Other
// platforms (Native) or routing libraries have similar ways to find
// the current position in the app.
function mapStateToProps(state, ownProps) {
  const {authentication} = state
  const {isAuthenticated: isAuthenticated} = authentication || {
    isAuthenticated: false
  }
  return {isAuthenticated: isAuthenticated, currentURL: ownProps.location.pathname}
}
export default connect(mapStateToProps)(EnsureLoggedIn)
