import { render } from 'react-dom';
import React from 'react';
import { applyRouterMiddleware, hashHistory, Router, Route, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from './store';
import { useScroll } from 'react-router-scroll';
import App from './containers/App';
import Home from './containers/Home';
import Login from './containers/Login';
import EnsureLoggedIn from './containers/EnsureLoggedIn';
import Scheduler from './containers/Scheduler';
import Sidebar from './containers/Sidebar';
import Menu from './containers/sidebar/Menu';
import Clients from './containers/sidebar/Clients';
import Booking from './containers/sidebar/Booking';
import Services from './containers/sidebar/Services';
import Stylists from './containers/sidebar/Stylists';
import Recovery from './containers/login/Recovery';
import ChangePassword from './containers/login/ChangePassword';
const store = configureStore( );
const containerEl = document.getElementById( "main" );
const scroll = useScroll((prevRouterProps, { location }) => {
  if ( location.action === 'POP' || location.action === 'REPLACE' ) {
    return false;
  }
  // return true;
  return [ 0, 0 ];
});
setTimeout( ( ) => { //fixes issues with FOUC
  render( (
    <Provider store={store}>
      <Router history={hashHistory} render={applyRouterMiddleware( scroll )}>
        <Route path="/" component={App}>
          <Route path="login">
            <IndexRoute component={Login}/>
            <Route path="recovery" component={Recovery}/>
            <Route path="changepassword/:phone" component={ChangePassword}/>
          </Route>
          <Route component={EnsureLoggedIn}>
            <IndexRoute component={Home}/>
            <Route path="salon/:id" component={Scheduler}>
              <Route name="menu" path="menu" component={Sidebar}>
                <IndexRoute component={Menu}/>
                <Route path="client" component={Clients}>
                  <Route path="stylist"/>
                  <Route path="new"/>
                  <Route path=":client_id">
                    <Route path="edit"/>
                    <Route path="patch"/>
                  </Route>
                </Route>
                <Route path="service" component={Services}>
                  <Route path="new"/>
                  <Route path=":service_id">
                    <Route path="edit"/>
                  </Route>
                </Route>
                <Route path="booking" component={Booking}>
                  <Route path="client"/>
                  <Route path="stylist"/>
                  <Route path="service"/>
                  <Route path=":booking_id"/>
                </Route>
                <Route path="stylist" component={Stylists}>
                  <Route path="new"/>
                  <Route path=":stylist_id">
                    <Route path="edit"/>
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Router>
    </Provider>
  ), containerEl );
}, 0 )
