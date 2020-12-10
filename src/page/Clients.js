import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { AuthContext } from '../utils/AuthContext';
import { useTenantsQuery } from '../utils/ApolloAPI';

const Clients = (props) => {
  const [state] = useContext(AuthContext);
  const history = useHistory();
  const [ clients, setClients ] = useState([])

  let tenant = state && state.tenant ? state.tenant : null;

  let filter = {}
  if (tenant != null) {
    filter = {
      where: {
        parent_id: tenant.code
      }
    }
  }
  const { loading: loadingCompany } = useTenantsQuery({
    variables: {
      filter: filter
    },
    skip: tenant == null,
    onCompleted: (result) => {
      if (result && result.tenants) {
        setClients(result.tenants)
      }
    },
    onError: (err) => {

    }
  })

  return (
    <div className="base-page loginContainer">
      <div className="clientList">
        <ol>
          {
            clients.map((aClient,index)=>{
              return (
                <li key={index} onClick={()=>{history.push({
                    pathname: `/receipts/${aClient.code}`,
                    state: { client: aClient }
                  })}}
                >
                  {aClient.name}
                </li>
              )
            })
          }
        </ol>
      </div>
    </div>
  )
}

export default Clients;