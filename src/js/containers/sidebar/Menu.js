import React from "react";
import { render } from "react-dom"
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { hashHistory } from 'react-router'
import { logoutUser } from '../../actions/authentication'
import Footer from '../../components/sidebar/Footer'
class Menu extends React.Component {
  render( ) {
    const { params, dispatch, salons } = this.props
    return <div className="sidebar-menu">
      <div className='sidebar-content'>
        <Link to={`/salon/${ params.id }/menu/client`} activeClassName="active">clients
          <i className="zmdi zmdi-accounts-list"></i>
        </Link>
        <Link to={`/salon/${ params.id }/menu/service`} activeClassName="active">services
          <i className="zmdi zmdi-scissors"></i>
        </Link>
        <Link to={`/salon/${ params.id }/menu/stylist`} activeClassName="active">staff
          <i className="zmdi zmdi-account-o"></i>
        </Link>
      </div>
      {salons.length > 1
        ? <Footer id={params.id} left_name="LOGOUT" left={( ) => {
            dispatch(logoutUser( ))
          }} right_name="Pick Salon" right={( ) => {
            hashHistory.push( `/` )
          }}/>
        : <Footer id={params.id} left_name="LOGOUT" left={( ) => {
          dispatch(logoutUser( ))
        }}/>}
    </div>;
  }
}
//DON'T TOUCH THIS!!!
function mapStateToProps( state ) {
  const { data: salons } = state.user.salonsByUser
  return { salons }
}
export default connect( mapStateToProps )( Menu )
