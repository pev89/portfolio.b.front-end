import { render } from "react-dom";
import { connect } from 'react-redux'
import React from "react";
import { Link, hashHistory } from 'react-router';
import { loginUser } from '../actions/authentication'
import { cleanError } from '../actions/errors'
class Login extends React.Component {
  constructor( props ) {
    super( props )
  }
  componentDidMount( ) {
    const { isAuthenticated } = this.props
    if ( isAuthenticated ) {
      hashHistory.replace( "/" )
    }
  }
  handleClick( event ) {
    const { dispatch } = this.props
    const username = this.refs.username
    const password = this.refs.password
    const creds = {
      email: username
        .value
        .trim( ),
      password: password
        .value
        .trim( )
    }
    dispatch(cleanError( ))
    dispatch(loginUser( creds ))
  }
  render( ) {
    const { errorMessage, isError, errorFields } = this.props
    return <div className='login-wrapper'>
      <div className='login-container'>
        <div className='login'>
          <div className='logo'></div>
          <p>Login to your account</p>
          <div className="form-group">
            <label htmlFor="InputEmail1">Email</label>
            <input type='email' ref='username' className="form-control input-lg" placeholder='Email' id="InputEmail1"/> {( isError && errorFields && errorFields['email'] && errorFields['email'].length > 0 ) && <p>{errorFields['email'].map( ( validation ) => validation )}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="InputPassword1">Password</label>
            <input type='password' ref='password' className="form-control input-lg" placeholder='Password' id="InputPassword1"/> {( isError && errorFields && errorFields['password'] && errorFields['password'].length > 0 ) && <p>{errorFields['password'].map( ( validation ) => validation )}</p>}
          </div>
          <button onClick={( event ) => this.handleClick( event )} className="btn btn-primary btn-shadow">
            Login
          </button>
          <div className="form-group">
            {isError && errorFields && errorFields['non_field_errors'] && <p>{errorFields['non_field_errors']}</p>}
            {isError && errorMessage && <p>{errorMessage}</p>}
          </div>
          <div className="form-group">
            <Link to={`/login/recovery`} activeClassName="active">Forgot your password?</Link>
          </div>
        </div>
      </div>
      <div className="bg-pic">
        <h1>Welcome to the Future of Salon Software</h1>
      </div>
    </div>;
  }
}
function mapStateToProps( state ) {
  const { authentication, errors } = state
  const { isFetching: isFetchingAuth, isAuthenticated: isAuthenticated } = authentication || {
    isFetching: false,
    isAuthenticated: false
  }
  const { isError: isError, fields: errorFields, message: errorMessage } = errors || {
    isError: false,
    fields: {},
    message: ''
  }
  return { isFetchingAuth, isError, errorMessage, errorFields, isAuthenticated }
}
export default connect( mapStateToProps )( Login )
