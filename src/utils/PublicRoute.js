import React, {useContext} from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';


const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const [state] = useContext(AuthContext);
  let isAuthenticated = !(state.user == null && state.tenant == null);

  let routeLocation = useLocation();

  let defaultRoute = "/";
  // if (routeLocation && routeLocation.state && routeLocation.state.from && routeLocation.state.from.pathname) {
  //   defaultRoute = routeLocation.state.from.pathname;
  // }

  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route {...rest} render={props => (
      isAuthenticated && restricted ?
        <Redirect to={{
            pathname: defaultRoute,
            state: { from: routeLocation }
        }} />
        : <Component {...props}/>
    )} />
  );
};

export default PublicRoute;