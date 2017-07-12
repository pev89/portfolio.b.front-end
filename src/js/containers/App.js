import {render} from "react-dom";
import {connect} from 'react-redux'
import React from "react";
import {hashHistory} from 'react-router';
class App extends React.Component {
  componentDidUpdate(prevProps) {
    const {dispatch, redirectUrl} = this.props
    const isLoggingOut = prevProps.isAuthenticated && !this.props.isAuthenticated
    const isLoggingIn = !prevProps.isAuthenticated && this.props.isAuthenticated
    if (isLoggingIn) {
      if (redirectUrl) {
        hashHistory.replace(redirectUrl)
      } else {
        hashHistory.replace("/")
      }
    } else if (isLoggingOut) {
      hashHistory.replace("/login")
    }
  }
  render() {
    return this.props.children
  }
}
function mapStateToProps(state) {
  const {authentication} = state
  const {isAuthenticated: isAuthenticated, redirectUrl: redirectUrl} = authentication || {
    isAuthenticated: false,
    redirectUrl: "/"
  }
  return {isAuthenticated, redirectUrl}
}
export default connect(mapStateToProps)(App)
