import React, { useContext, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { Button } from 'antd';

import AuthContextProvider, { AuthContext } from './utils/AuthContext';
import PublicRoute from './utils/PublicRoute';
import PrivateRoute from './utils/PrivateRoute';
import Login from './page/Login';
import Receipts from './page/Receipts';
import Converter from './page/Converter';
import Clients from './page/Clients';
import CreateAccount from './page/CreateAccount';

import './App.css';
import './base.css';
require('dotenv').config()

const API_URL = "http://graphql.lollipoplab.io:4000/graphql";
const uploadLink = createUploadLink({
  uri: API_URL,
  credentials: "include"
});
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: uploadLink
});

const AppContent = () => {
  const [state, {signOut}] = useContext(AuthContext);
  let loggedIn = !(state.user == null && state.tenant == null);


  return (
    <div className="App">

      <Router>
        <div className="headerLinks">
          {
            loggedIn ? (
              <>
                <div>
                  <Link to="/">Clients</Link>
                </div>
                <div>
                  <Link to="/createaccount">Create Account</Link>
                </div>
                {/* <div>
                  <Link to="/converter">Converter</Link>
                </div> */}
                <div>
                  <Button onClick={()=>{signOut()}}>Logout</Button>
                </div>
              </>
            ) : (
              <div>
                <Link to="/login">Login</Link>
              </div>
            )
          }

        </div>
        <Switch>
          {/* {
            state.user == null && state.tenant == null ? (
              <Route path="/login">
                <Login/>
              </Route>
            ) : (
              <>
                <Route path="/receipts">
                  <Receipts/>
                </Route>
              </>
            )
          } */}
          <PublicRoute exact={true} restricted={true} path="/login" component={Login} />
          <PrivateRoute exact={true} path="/" component={Clients} />
          <PrivateRoute exact={true} path="/createaccount" component={CreateAccount} />
          <PrivateRoute exact={true} path="/receipts/:code" component={Receipts} />
          <PrivateRoute exact={true} path="/converter" component={Converter} />
        </Switch>
      </Router>
    </div>
  );
}

function App() {

  return (
    <ApolloProvider client={client}>
      <AuthContextProvider>
        <AppContent/>
     </AuthContextProvider>
    </ApolloProvider>
  )
}

export default App;
