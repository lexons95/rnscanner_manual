import React, {useContext} from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [state] = useContext(AuthContext);
  let isAuthenticated = !(state.user == null && state.tenant == null);
  const defaultRoute = "/login";
  let routeLocation = useLocation();
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route {...rest} >
      {
        isAuthenticated ?
          <Component />
          : <Redirect to={{
                    pathname: defaultRoute,
                    state: { from: routeLocation }
                }} />
      } 
    </Route>
  );
};

export default PrivateRoute;

/*
type of page route
private route = only user who logged in can see
eg. products/inventory pages

public route (not restricted) = anyone can see
eg. main page/not sensitive info

public route (restricted) = only user who is not logged in can see
eg. login page

*/