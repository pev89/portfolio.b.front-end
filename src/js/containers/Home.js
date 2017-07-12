import { render } from "react-dom";
import { connect } from 'react-redux'
import React from "react";
import { hashHistory } from 'react-router'
import { logoutUser } from '../actions/authentication'
import SalonButton from '../components/SalonButton'
import { fetchSalonsByUser } from '../actions/user'
import { cleanError } from '../actions/errors'
import { cleanAllData } from '../actions/salon'
import autoBind from 'react-autobind'
class Home extends React.Component {
  constructor( props ) {
    super( props )
    autoBind( this )
  }
  componentDidMount( ) {
    const { dispatch, auth_infos } = this.props
    dispatch(cleanError( ))
    dispatch(fetchSalonsByUser( )).then(( received ) => {
      if ( received.length == 1 ) {
        hashHistory.push( `/salon/${ received[0].id }/` );
      }
    })
  }
  onClickLink( ) {
    const { dispatch } = this.props
    dispatch(cleanAllData( ))
  }
  render( ) {
    const { isError, errorMessage, salons, isFetchingUser, dispatch } = this.props
    return <div className='login-wrapper'>
      <div className='login-container'>
        <div className='login'>
          <div className='logo'></div>
          <p>Choose a salon</p>
          {!isFetchingUser && <div className='list-group'>
            {salons.length == 0
              ? <div>There are no salons to be displayed!</div>
              : salons.map( ( salon, i ) => <SalonButton salon={salon} key={"salon-" + i} onClickLink={this.onClickLink}/> )}
          </div>}
          {isError && errorMessage && <p>{errorMessage}</p>}
          <p>
            <button onClick={( ) => {
              dispatch(logoutUser( ))
            }} className="btn btn-primary btn-shadow">
              Logout
            </button>
          </p>
        </div>
      </div>
      <div className="bg-pic">
        <h1>Welcome to the Future of Salon Software</h1>
      </div>
    </div>;
  }
}
function mapStateToProps( state ) {
  const { authentication, user, errors } = state
  const { user: auth_infos } = authentication || {
    user: {}
  }
  const {
    salonsByUser: {
      isFetching: isFetchingUser,
      data: salons
    }
  } = user || {
    salonsByUser: {
      isFetching: true,
      data: [ ]
    }
  }
  const { isError: isError, message: errorMessage } = errors || {
    isError: false,
    message: ''
  }
  return { isFetchingUser, auth_infos, salons, isError, errorMessage }
}
export default connect( mapStateToProps )( Home );
