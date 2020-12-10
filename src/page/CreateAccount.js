import React, { useState, useEffect, useContext } from 'react';
import { Input, Form } from 'antd';

import { AuthContext } from '../utils/AuthContext';
import { useCreateReceiptBankMutation, useAddTenantClientMutation } from '../utils/ApolloAPI';

const CreateAccount = (props) => {
  const [ state, { signUp } ] = useContext(AuthContext);

  let tenantCode = state && state.tenant && state.tenant.code ? state.tenant.code : null
  return (
    <div className="base-page createAccount">
      <ReceipBankForm/>
      <NewTenantForm signUp={signUp}/>
      <NewClientForm tenant_id={tenantCode} />
    </div>
  )
}

const ReceipBankForm = () => {
  const [ newReceiptBank, setNewReceiptBank ] = useState("");

  const [ createReceiptBank ] = useCreateReceiptBankMutation();

  const handleCreateReceiptBank = () => {
    createReceiptBank({
      variables: {
        code: newReceiptBank,
        name: newReceiptBank
      }
    })
  }

  return (
    <div className="receiptsSection">
      <h3>Create ReceiptBank Form</h3>
      <input type="text" onChange={(e)=>{setNewReceiptBank(e.target.value)}}/>
      <button onClick={handleCreateReceiptBank}>Add receipt bank</button>
    </div>
  )
}

const NewTenantForm = (props) => {
  const { signUp=null } = props;
  const [ formValue, setFormValue ] = useState({
    code: "zxc",
    name: "zxc FIRM KL",
    email: "zxc@hotmail.com",
    password: "password",
    contactPerson: "012345678"
  })

  const handleSetFormValue = (e,key) => {
    setFormValue({
      ...formValue,
      [key]: e.target.value
    })
  }

  const createTenant = () => {
    if (signUp != null) {
      signUp(formValue)
    }
    else {
      console.log('signUp not found')
    }
  }

  return (
    <div style={{marginBottom: "10px", width:"50%", display:"flex",flexDirection:'column', position: 'relative'}}>
      <h3>Create Tenant Form</h3>
      <input placeholder="code" type="text" value={formValue['code']} onChange={(e)=>{handleSetFormValue(e,"code")}} />
      <input placeholder="name" type="text" value={formValue['name']} onChange={(e)=>{handleSetFormValue(e,"name")}} />
      <input placeholder="email" type="text" value={formValue['email']} onChange={(e)=>{handleSetFormValue(e,"email")}} />
      <input placeholder="password" type="text" value={formValue['password']} onChange={(e)=>{handleSetFormValue(e,"password")}} />
      <input placeholder="contact" type="text" value={formValue['contactPerson']} onChange={(e)=>{handleSetFormValue(e,"contactPerson")}} />
      <button onClick={createTenant}>Create Tenant</button>
    </div>
  )
}

const NewClientForm = (props) => {
  const { tenant_id=null } = props;
  const [ formValue, setFormValue ] = useState({
    code: "clientBofzxc",
    name: "Client B zxc",
    email: "clientb.zxc@hotmail.com",
    contactPerson: "0166666666"
  })

  const handleSetFormValue = (e,key) => {
    setFormValue({
      ...formValue,
      [key]: e.target.value
    })
  }

  const [ addTenantClient ] = useAddTenantClientMutation({
    onCompleted: (result) => {

    },
    onError: (err) => {
      console.log('addTenantClient err', err)
    }
  });

  const handleCreateClient = () => {
    if (tenant_id != null) {
      addTenantClient({
        variables: {
          ...formValue,
          tenant_id: tenant_id
        }
      })

    }
    else {
      console.log("tenant_id not found")
    }
  }

  return (
    <div style={{marginBottom: "10px", width:"50%", display:"flex",flexDirection:'column', position: 'relative'}}>
      <h3>Create Client Form</h3>
      <input placeholder="code" type="text" value={formValue['code']} onChange={(e)=>{handleSetFormValue(e,"code")}} />
      <input placeholder="name" type="text" value={formValue['name']} onChange={(e)=>{handleSetFormValue(e,"name")}} />
      <input placeholder="email" type="text" value={formValue['email']} onChange={(e)=>{handleSetFormValue(e,"email")}} />
      <input placeholder="contact" type="text" value={formValue['contactPerson']} onChange={(e)=>{handleSetFormValue(e,"contactPerson")}} />
      <button onClick={handleCreateClient}>Create Client</button>
    </div>
  )
}

export default CreateAccount;