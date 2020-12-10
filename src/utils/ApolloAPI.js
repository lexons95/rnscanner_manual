import { useQuery, useLazyQuery, useMutation, gql } from '@apollo/client';

// gql
// fragment
const USER_FRAGMENT = gql`
  fragment userFragment on User {
    businessUnit_id
    email
    name
    reportTo_id
    updateCtr
    username
    changePasswordRequired
    _label
    businessUnit_label
    reportTo_label
  }
`;

const TENANT_FRAGMENT = gql`
  fragment tenantFragment on Tenant {
    code
    name
    status
    updateCtr
    email
    contactPerson
    allowUsers
    parent_id
    businessUnit_id
    receiptBank_id
    _label
    status_label
    parent_label
    businessUnit_label
    receiptBank_label
  }
`;

const RECEIPT_FRAGMENT = gql`
  fragment receiptFragment on Receipt {
    id
    status
    updateCtr
    bucket
    createdAt
    createdBy_id
    encoding
    filename
    mimetype
    originalFilename
    updatedAt
    updatedBy_id
    url
    tenant_id
    receiptDate
    description
    total
    receiptCategory
    receiptCurrency
    supplier_id
    _label
    status_label
    receiptCategory_label
    receiptCurrency_label
    createdBy_label
    updatedBy_label
    tenant_label
    supplier_label
  }
`;

const RECEIPT_BANK_FRAGMENT = gql`
  fragment receiptBankFragment on ReceiptBank {
    code
    name
    status
    updateCtr
    _label
    status_label
  }
`;

// const LISTGROUP_FRAGMENT = gql`
//   fragment listGroupFragment on ListGroup {
//     code
//     description
//     hasLevel
//     name
//     updateCtr
//     createdAt
//     updatedAt
//     _label
//     createdAt_year
//     createdAt_quarter
//     createdAt_month
//     createdAt_week
//     createdAt_day
//     createdAt_weekday
//     createdAt_hour
//     createdAt_minute
//     updatedAt_year
//     updatedAt_quarter
//     updatedAt_month
//     updatedAt_week
//     updatedAt_day
//     updatedAt_weekday
//     updatedAt_hour
//     updatedAt_minute
//     lists {
//       ...listFragment
//     }
//   }
//   ${LIST_FRAGMENT}
// `;

// const LIST_FRAGMENT = gql`
//   fragment listFragment on List {
//     id
//     listGroup_id
//     name
//     order
//     parent_id
//     selectable
//     updateCtr
//     value
//     _label
//     listGroup_label
//     listGroup
//     parent_label
//   }
// `;

// mutation
const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!){
    login(username: $username, password: $password){
      ...userFragment
    }
  }
  ${USER_FRAGMENT}
`
const LOGOUT_MUTATION = gql`
  mutation {
    logout
  }
`

const CHECK_WHOAMI_MUTATION = gql`
  mutation {
    whoami {
      businessUnit_id
      email
      name
      reportTo_id
      updateCtr
      username
      changePasswordRequired
      _label
      businessUnit_label
      reportTo_label
    }
  }
`;

const REGISTER_TENANT_MUTATION = gql`
  mutation registerTenant($code: String!, $name: String!, $email: String!, $contactPerson: String!, $password: String!) {
    registerTenant(code: $code, name: $name, email: $email, contactPerson: $contactPerson, password: $password) {
      ...tenantFragment
    }
  }
  ${TENANT_FRAGMENT}
`;

const UPLOAD_RECEIPT_MUTATION = gql`
  mutation uploadReceipt($file: Upload!, $bucket: String!, $tenant_id: String!, $receiptDate: DateTime, $description: String, $total: Float, $receiptCategory: String, $receiptCurrency: String, $supplier_id: String) {
    uploadReceipt(file: $file, bucket: $bucket, tenant_id: $tenant_id, receiptDate: $receiptDate, description: $description, total: $total, receiptCategory: $receiptCategory, receiptCurrency: $receiptCurrency, supplier_id: $supplier_id) {
      id
      status
      updateCtr
      bucket
      createdAt
      createdBy_id
      encoding
      filename
      mimetype
      originalFilename
      updatedAt
      updatedBy_id
      url
      tenant_id
      receiptDate
      description
      total
      receiptCategory
      receiptCurrency
      supplier_id
      _label
      status_label
      receiptCategory_label
      receiptCurrency_label
      createdBy_label
      updatedBy_label
      tenant_label
      supplier_label
    }
  }
`;

const UPDATE_RECEIPT_MUTATION = gql`
  mutation updateReceipt($id: String!, $updateCtr: Int!, $bucket: String, $url: String, $receiptDate: DateTime, $description: String, $total: Float, $receiptCategory: String, $receiptCurrency: String, $supplier_id: String){
    updateReceipt(id: $id, updateCtr: $updateCtr, bucket: $bucket, url: $url, receiptDate: $receiptDate, description: $description, total: $total, receiptCategory: $receiptCategory, receiptCurrency: $receiptCurrency, supplier_id: $supplier_id) {
      id
      status
      updateCtr
      bucket
      createdAt
      createdBy_id
      encoding
      filename
      mimetype
      originalFilename
      updatedAt
      updatedBy_id
      url
      tenant_id
      receiptDate
      description
      total
      receiptCategory
      receiptCurrency
      supplier_id
      _label
      status_label
      receiptCategory_label
      receiptCurrency_label
      createdBy_label
      updatedBy_label
      tenant_label
      supplier_label
    }
  }
`;

const DELETE_RECEIPT_MUTATION = gql`
  mutation deleteReceipt($id: String!, $updateCtr: Int!) {
    deleteReceipt(id: $id, updateCtr: $updateCtr)
  }
`;

const CREATE_TENANT_MUTATION = gql`
  mutation createTenant($code: String!, $name: String!, $email: String!, $contactPerson: String, $allowUsers: Boolean!, $parent_id: String, $receiptBank_id: String) {
    createTenant(code: $code, name: $name, email: $email, contactPerson: $contactPerson, allowUsers: $allowUsers, parent_id: $parent_id, receiptBank_id: $receiptBank_id) {
      code
      name
      status
      updateCtr
      email
      contactPerson
      allowUsers
      parent_id
      businessUnit_id
      receiptBank_id
      _label
      status_label
      parent_label
      businessUnit_label
      receiptBank_label
    }
  }
`;

const ADD_TENANT_CLIENT_MUTATION = gql`
  mutation addTenantClient($tenant_id: String!, $code: String!, $name: String!, $email: String!, $contactPerson: String!) {
    addTenantClient(tenant_id: $tenant_id, code: $code, name: $name, email: $email, contactPerson: $contactPerson) {
      ...tenantFragment
    }
  }
  ${TENANT_FRAGMENT}
`;

const CHANGE_STATE_RECEIPT_MUTATION = gql`
  mutation changeStateReceipt($id: String!, $updateCtr: Int!, $fromState: String!, $toState: String!) {
    changeStateReceipt(id: $id, updateCtr: $updateCtr, fromState: $fromState, toState: $toState)
  }
`;

const CREATE_RECEIPT_BANK_MUTATION = gql`
  mutation createReceiptBank($code: String!, $name: String!) {
    createReceiptBank(code: $code, name: $name) {
      code
      name
      status
      updateCtr
      _label
      status_label
    }
  }
`;


// query
const TENANTS_QUERY = gql`
  query tenants($filter: JSON!) {
    tenants(filter: $filter) {
      code
      name
      status
      updateCtr
      email
      contactPerson
      allowUsers
      parent_id
      businessUnit_id
      receiptBank_id
      _label
      status_label
      parent_label
      businessUnit_label
      receiptBank_label
    }
  }

`;

const RECEIPTS_QUERY = gql`
  query receipts($filter: JSON!) {
    receipts(filter: $filter) {
      id
      status
      updateCtr
      bucket
      createdAt
      createdBy_id
      encoding
      filename
      mimetype
      originalFilename
      updatedAt
      updatedBy_id
      url
      tenant_id
      receiptDate
      description
      total
      receiptCategory
      receiptCurrency
      supplier_id
      _label
      status_label
      receiptCategory_label
      receiptCurrency_label
      createdBy_label
      updatedBy_label
      tenant_label
      supplier_label
    }
  }
`;

const LISTS_QUERY = gql`
  query lists($filter: JSON!) {
    lists(filter: $filter) {
      id
      listGroup_id
      name
      order
      parent_id
      selectable
      updateCtr
      value
      _label
      listGroup_label
      parent_label
    }
  }
`;

// defaults
const defaultMutationOptions = (label=null) => {
  let name = label ? label : 'mutation'
  return {
    onCompleted: (result) => {
      console.log(`${name} result`, result)
    },
    onError: (err) => {
      const { graphQLErrors, networkError } = err;
      // console.log(`${name} err`, err)
      console.log(`${name} graphQLErrors`, JSON.stringify(graphQLErrors))
      console.log(`${name} networkError`, JSON.stringify(networkError))
    }
  }
}

const defaultQueryOptions = (label) => {
  let name = label ? label : 'query'
  return {
    fetchPolicy: 'cache-and-network',
    onCompleted: (result) => {
      console.log(`${name} result`, result)
    },
    onError: (err) => {
      const { graphQLErrors, networkError } = err;
      console.log(`${name} err`, err)
      // console.log(`${name} graphQLErrors`, graphQLErrors)
      // console.log(`${name} networkError`, networkError)
    }
  }
}

// mutations
export const useLoginMutation = (options={}) => {
  const mutationResult = useMutation(LOGIN_MUTATION,{
    ...defaultMutationOptions("useLoginMutation"),
    ...options
  });
  
  return mutationResult;
}

export const useLogoutMutation = (options={}) => {
  const mutationResult = useMutation(LOGOUT_MUTATION,{
    ...defaultMutationOptions("useLogoutMutation"),
    ...options
  });
  
  return mutationResult;
}

export const useCheckWhoamiMutation = (options={}) => {
  const mutationResult = useMutation(CHECK_WHOAMI_MUTATION,{
    ...defaultMutationOptions("useCheckWhoamiMutation"),
    ...options
  });
  
  return mutationResult;
}

export const useRegisterTenantMutation = (options={}) => {
  const mutationResult = useMutation(REGISTER_TENANT_MUTATION,{
    ...defaultMutationOptions("useRegisterTenantMutation"),
    ...options
  });
  
  return mutationResult;
}

export const useUploadReceiptMutation = (options={}) => {
  const mutationResult = useMutation(UPLOAD_RECEIPT_MUTATION,{
    ...defaultMutationOptions("useUploadReceiptMutation"),
    ...options
  });
  
  return mutationResult;
}

export const useUpdateReceiptMutation = (options={}) => {
  const mutationResult = useMutation(UPDATE_RECEIPT_MUTATION,{
    ...defaultMutationOptions("useUpdateReceiptMutation"),
    ...options
  });
  
  return mutationResult;
}

export const useDeleteReceiptMutation = (options={}) => {
  const mutationResult = useMutation(DELETE_RECEIPT_MUTATION,{
    ...defaultMutationOptions("useDeleteReceiptMutation"),
    ...options
  });
  
  return mutationResult;
}

export const useCreateTenantMutation = (options={}) => {
  const mutationResult = useMutation(CREATE_TENANT_MUTATION,{
    ...defaultMutationOptions("useCreateTenantMutation"),
    ...options
  });
  
  return mutationResult;
}

export const useAddTenantClientMutation = (options={}) => {
  const mutationResult = useMutation(ADD_TENANT_CLIENT_MUTATION,{
    ...defaultMutationOptions("useAddTenantClientMutation"),
    ...options
  });
  
  return mutationResult;
}

export const useChangeStateReceiptMutation = (options={}) => {
  const mutationResult = useMutation(CHANGE_STATE_RECEIPT_MUTATION,{
    ...defaultMutationOptions("useChangeStateReceiptMutation"),
    ...options
  });
  
  return mutationResult;
}

export const useCreateReceiptBankMutation = (options={}) => {
  const mutationResult = useMutation(CREATE_RECEIPT_BANK_MUTATION,{
    ...defaultMutationOptions("useCreateReceiptBankMutation"),
    ...options
  });
  
  return mutationResult;
}



// query
export const useTenantsLazyQuery = (options={}) => {
  const lazyQueryResult = useLazyQuery(TENANTS_QUERY,{
    ...defaultQueryOptions("useTenantsLazyQuery"),
    ...options
  });
  
  return lazyQueryResult;
}

export const useTenantsQuery = (options={}) => {
  const queryResult = useQuery(TENANTS_QUERY,{
    ...defaultQueryOptions("useTenantsQuery"),
    ...options
  });
  
  return queryResult;
}

export const useReceiptsQuery = (options={}) => {
  const queryResult = useQuery(RECEIPTS_QUERY,{
    ...defaultQueryOptions("useReceiptsQuery"),
    ...options
  });
  
  return queryResult;
}

export const useListsQuery = (options={}) => {
  const queryResult = useQuery(LISTS_QUERY,{
    ...defaultQueryOptions("useListsQuery"),
    ...options
  });
  
  return queryResult;
}
