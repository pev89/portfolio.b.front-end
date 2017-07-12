import { hashHistory } from 'react-router';
import { connect } from 'react-redux'
import React from "react";
import { recoveryUser } from '../../actions/authentication'
import { cleanError } from '../../actions/errors'
class ChangePassword extends React.Component {
  constructor( props ) {
    super( props )
    this.handleClick = this.handleClick.bind( this )
  }
  handleClick( ) {
    const { dispatch } = this.props
    dispatch(cleanError( ))
    dispatch(recoveryUser( {
      phone: this.refs.phone.value.trim( ),
      code: this.refs.code.value.trim( ),
      password: this.refs.password.value.trim( )
    }, 'POST' )).then(( ) => {
      hashHistory.push( `/` );
    })
  }
  render( ) {
    return <div className='login-wrapper'>
      <div className='login-container'>
        <div className='login'>
          <div className='logo'></div>
          <p>Insert your phone number, the code that we just sent to your phone and your new password.</p>
          <div className="form-group">
            <label htmlFor="InputPhone1">Phone number</label>
            <input ref='phone' placeholder="Phone" className="form-control input-lg" id="InputPhone1" defaultValue={this.props.params.phone}/>
          </div>
          <div className="form-group">
            <label htmlFor="InputCode">Code</label>
            <input type='text' ref='code' placeholder="Code" className="form-control input-lg" id="InputCode"/>
          </div>
          <div className="form-group">
            <label htmlFor="InputPassword">New Password</label>
            <input ref='password' type='password' placeholder="New Password" className="form-control input-lg" id="InputPassword"/>
          </div>
          <button onClick={this.handleClick} className="btn btn-primary btn-shadow">
            Save new password
          </button>
        </div>
      </div>
    </div>
  }
}
function mapStateToProps( state ) {
  return { }
}
export default connect( mapStateToProps )( ChangePassword );
