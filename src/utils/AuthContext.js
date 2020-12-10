import React, { createContext, useReducer, useMemo, useEffect } from 'react';
import { useLoginMutation, useLogoutMutation, useCheckWhoamiMutation, useRegisterTenantMutation, useTenantsLazyQuery } from './ApolloAPI';

const initialState = {
  isLoading: false,
  isSignout: true,
  userToken: null,
  user: null,
  tenant: null,
  company: null,
  categoryOptions: []
}

const reducer = (prevState, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        userToken: action.token
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        userToken: action.token,
        user: action.user
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        userToken: null,
        user: null,
        tenant: null,
        company: null,
        isLoading: false
      };
    case 'SET_USER': 
      return {
        ...prevState,
        user: action.user,
        userToken: "logged"
      }
    case 'SET_TENANT': 
      return {
        ...prevState,
        tenant: action.tenant,
        userToken: "logged"
      }
    case 'SET_LOGGEDIN': 
      return {
        ...prevState,
        user: action.user,
        tenant: action.tenant,
        userToken: "logged"
      }
    case 'SET_COMPANY': 
      return {
        ...prevState,
        company: action.company
      }
    case 'SET_CATEGORY_OPTIONS': 
      return {
        ...prevState,
        categoryOptions: action.categoryOptions
      }
    case 'SET_LOADING': 
      return {
        ...prevState,
        isLoading: action.isLoading
      }
    default: 
      return prevState;
  }
}

export const AuthContext = createContext(initialState);

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const methods = useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        try {
          let loginResult = await login({
            variables: {
              username: data.username,
              password: data.password
            }
          })
          if (loginResult && loginResult.data && loginResult.data.login && loginResult.data.login.businessUnit_id) {
            let user = loginResult.data.login;
            dispatch({ type: 'SET_USER', user: user });
            getTenants({
              variables: {
                filter: {
                  where: {
                    businessUnit_id: user.businessUnit_id
                  }
                }
              }
            })
          }
        }
        catch (err) {
          console.log('await err', err)
        }
      },
      signOut: async () => {

        logout()
      },
      signUp: async data => {
        const { code, name, email, contactPerson, password } = data;
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        registerTenant({
          variables: {
            code: code, 
            name: name, 
            email: email, 
            contactPerson: contactPerson, 
            password: password
          }
        })
      },
      checkUser: async () => {

        try {
          let userResult = await checkWhoami();
          
          if (userResult && userResult.data && userResult.data.whoami && userResult.data.whoami.businessUnit_id) {
            let user = userResult.data.whoami;
            dispatch({ type: 'SET_USER', user: user });
            getTenants({
              variables: {
                filter: {
                  where: {
                    businessUnit_id: user.businessUnit_id
                  }
                }
              }
            })

          }
        
        }
        catch(err) {

        }
      },
      setCompany: (data) => {
        
        dispatch({ type: 'SET_COMPANY', company: data });
      },
      setCategoryOptions: (data) => {
        dispatch({ type: 'SET_CATEGORY_OPTIONS', categoryOptions: data });
      }
    }),
    []
  );

  const [ login, { loading: loadingLogin } ] = useLoginMutation({
    onCompleted: (result) => {
      if (result && result.login) {
        console.log('login result',result)
        // dispatch({ type: 'SET_USER', user: result.login });
      }
    },
    onError: (err) => {
      console.log('login err',err)
    }
  })

  const [ logout, { loading: loadingLogout } ] = useLogoutMutation({
    onCompleted: (result) => {
      console.log('logout result',result)
      dispatch({ type: 'SIGN_OUT' });
    },
    onError: (err) => {
      console.log('logout err',err)
    }
  })

  const [ checkWhoami, { loading: checkingUser }] = useCheckWhoamiMutation({
    onCompleted: (result) => {
      console.log('checkUser result',result)
      // dispatch({ type: 'RESTORE_TOKEN', token: "user-token" });
    },
    onError: (err) => {
      dispatch({ type: 'SIGN_OUT' });
      console.log('checkUser err',err)
    }
  });

  const [ registerTenant, { loading: loadingRegisterTenant } ] = useRegisterTenantMutation({
    onCompleted: (result) => {
      console.log('registerTenant result',result)
      // dispatch({ type: 'RESTORE_TOKEN', token: "user-token" });
    },
    onError: (err) => {
      console.log('registerTenant err',err)
    }
  });


  const [ getTenants, { loading: loadingTenants } ] = useTenantsLazyQuery({
    fetchPolicy: "cache-and-network",
    onCompleted: (result) => {
      console.log('getTenants result',result)
      if (result && result.tenants && result.tenants.length > 0) {
        dispatch({ type: 'SET_TENANT', tenant: result.tenants[0] });
      }

    },
    onError: (err) => {
      console.log('getTenants err',err)
    }
  });

  useEffect(()=>{
    methods.checkUser()
  },[]);

  let isLoading = loadingTenants || loadingRegisterTenant || checkingUser || loadingLogout || loadingLogin
  useEffect(()=>{
    dispatch({ type: 'SET_LOADING', isLoading: isLoading });
  },[isLoading]);

  return (
    <AuthContext.Provider 
      //value={[state, dispatch]}
      value={[state, methods]}
    >
      {children}
    </AuthContext.Provider>
  )

}

export default AuthContextProvider;

  /*
    register tenant result
    {"registerTenant": {"__typename": "Tenant", "_label": null, "allowUsers": true, "businessUnit_id": "fbcd981c-c98a-4474-b1e1-6f1422c089c0", "businessUnit_label": null, "code": "FIRM123", "contactPerson": "0167890123", "email": "afk@hotmail.com", "name": "AUDIT FIRM KL", "parent_id": null, "parent_label": null, "receiptBank_id": "test", "receiptBank_label": null, "status": "A", "status_label": null, "updateCtr": 0}}
  */