import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { Table, Button } from 'antd';
import { useApolloClient, gql } from '@apollo/client';

import { ReactNativeFile } from 'apollo-upload-client';

import { rbLogin, rbInbox, rbSendEmail, rbDeleteReceipts, rbReadImage } from '../utils/receiptBankAPI';
import { AuthContext } from '../utils/AuthContext';
import { useReceiptsQuery } from '../utils/ApolloAPI';

const Receipts = (props) => {
  const [state] = useContext(AuthContext);
  const apolloClient = useApolloClient()
  let theLocation = useLocation();
  const [ client, setClient ] = useState(null);
  // const [ receipts, setReceipts ] = useState([]);

  const [ rbCookie, setRbCookie ] = useState(null);
  const [ inboxReceipts, setInboxReceipts ] = useState(null);
  const [ convertedReceipts, setConvertedReceipts ] = useState(null);
  const [ editedReceipts, setEditedReceipts ] = useState(null);

  const [ loading, setLoading ] = useState(false);


  useEffect(() => {
    if (theLocation) {
      setClient(theLocation.state.client)
    }
  }, [theLocation])

  const { data: receiptsData, loading: loadingReceipts, refetch } = useReceiptsQuery({
    variables: {
      filter: {
        where: {
          tenant_id: client && client.code ? client.code : ""
        }
      }
    },
    skip: client == null,
    onCompleted: (result) => {
      if (result && result.receipts) {
        // let allData = JSON.parse(JSON.stringify(result.receipts))
        // setReceipts(allData);
      }
    },
    error: (err) => {
      console.log("receipts err", err)
    }
  });

  let receipts = receiptsData && receiptsData.receipts ? JSON.parse(JSON.stringify(receiptsData.receipts)) : []

  const loginRB = async () => {
    setLoading(true)
    try {
      let loginRBResult = await rbLogin();
      setRbCookie(loginRBResult)
      await getInboxRB(loginRBResult)
      // let cookies = loginRBResult.split(';')
      // cookies.forEach((aCookie)=>{
      //   document.cookie = aCookie;
      // })
      console.log('loginRBResult', loginRBResult)
    }
    catch(err) {
      console.log('login rb err', err)
    }
    setLoading(false)

  }
  const getInboxRB = async (cookie=rbCookie) => {
    setLoading(true)

    let rbUserStringArray = (client.receiptBank_id.split("@")[0]).split('.');
    let rbUser = `${rbUserStringArray[0]} ${rbUserStringArray[1]}`;

    if (cookie) {
      try {
        let inboxRBResult = await rbInbox(cookie);
        console.log('inboxRBResult', inboxRBResult)
        let inboxReceipts = []
        if (inboxRBResult.data) {
          inboxRBResult.data.account.receipts.edges.forEach((aReceiptParent)=>{
            let aReceipt = aReceiptParent.node;
            if (aReceipt.user.fullName == rbUser) {
              if (aReceipt.dataExtractionErrors.length > 0) {
                inboxReceipts.push({
                  ...aReceipt,
                  failed: true
                })
              }
              else {
                inboxReceipts.push(aReceipt)
              }
            }
            
            // return aReceipt;
          })
          setInboxReceipts(inboxReceipts)

        }

      }
      catch(err) {
        console.log('inboxRBResult err', err)
      }
    }
    setLoading(false)

  }

  const handleConvert = () => {
    let result = [];
    let failed = [];

    if (inboxReceipts) {

      inboxReceipts.forEach((aReceipt)=>{
        let receiptResult = {
          id: aReceipt.id,
          status: "processed",
          bucket: "processed",
          tenant_id: client.code,
          receiptDate: aReceipt.createdAt,
          total: aReceipt.totalAmount,
          imageUrl2: aReceipt.imageUrl2,
          downloadUrl: aReceipt.downloadUrl,
          receiptCategory: aReceipt.category,
          receiptCurrency: aReceipt.currencyCode,
          supplier: aReceipt.supplier,
          user: aReceipt.user
        }
        if (aReceipt.failed) {
          failed.push(receiptResult)
        }
        else {
          result.push(receiptResult);
        }
      });
    }

    if (result.length == 0) {
      result = null;
    }

    setConvertedReceipts(result);
    setEditedReceipts(result);
  }


  const handleClear = () => {
    setInboxReceipts(null)
    setConvertedReceipts(null)
    setEditedReceipts(null)
    setRbCookie(null)
  }

  const handleOnJSONChange = (value, index=null) => {
    // console.log('arrr', value)
    if (index != null) {
      let newEditedReceipts = [].concat(editedReceipts)
      newEditedReceipts[index] = value
      setEditedReceipts(newEditedReceipts)
    }
    else {
      setEditedReceipts(value)
    }
  }

  const handleUploadEditedReceipts = async () => {

    let uploadParams = await getUploadParams(editedReceipts, client.code, rbCookie)

    let { uploadReceipts_mutation, gqlVariables } = uploadParams;
    apolloClient.mutate({
      variables: gqlVariables,
      mutation: gql`${uploadReceipts_mutation}`
    }).then((uploadResult)=>{
      // setUploading(false)
      console.log('uploadResult',uploadResult)
      getChangeStateParams(uploadResult.data, apolloClient)
      // uploadResult.data
    }).catch(uploadErr=>{
      // setUploading(false)
      console.log('uploadErr',uploadErr)
    })
  }


  let isLoading = loadingReceipts || loading
  return (
    <div className="base-page">
      
      <ReceiptsList client={client} receipts={receipts} setLoading={setLoading} refresh={<Button onClick={()=>{refetch()}}>Refresh</Button>} />

      <br/>
      <h2>ReceiptBank API</h2>
      <div className="receiptsSection">

        <Button onClick={loginRB}>Login RB</Button>

        <Button style={{marginLeft:"100px"}} onClick={handleClear}>Clear Data</Button>
      </div>

      <div className="receiptsSection">
        <h3>Receipt Bank Inbox (data.account.receipts.edges[index].node) <Button onClick={()=>{getInboxRB()}}>Get Inbox RB</Button></h3>
        
        {
          inboxReceipts ? (
            <JSONEditor
              value={inboxReceipts}
              onChange={handleOnJSONChange}
              reset={true}
              viewOnly={true}
            />
          ) : null
        }
      </div>

      <div className="receiptsSection">
        <h3>Convert here <Button onClick={handleConvert}>Convert format</Button></h3>
        {/* {
          convertedReceipts && convertedReceipts.length > 0 && convertedReceipts.map((aReceipt,index)=>{
            return (
              <Receipt key={index} index={index} data={aReceipt} />
            )
          })
        } */}
        {/* {
          convertedReceipts && convertedReceipts.length > 0 ? (
            <JSONEditor
              value={convertedReceipts}
              onChange={handleOnJSONChange}
            />
          ) : null
        } */}
        {
          convertedReceipts && convertedReceipts.length > 0 && convertedReceipts.map((aReceipt,index)=>{
            return (
              <div key={index} style={{display: 'flex', marginBottom: '10px'}}>
                <JSONEditor
                  value={aReceipt}
                  onChange={(value)=>{handleOnJSONChange(value,index)}}
                />
                <Image cookie={rbCookie} url={aReceipt.imageUrl2} />
              </div>

            )
          })
        }
      </div>
      <div className="receiptsSection">
        {/* <Button onClick={()=>{console.log('edited',editedReceipts)}}>Log Edited</Button> */}
        <Button onClick={handleUploadEditedReceipts}>Upload edited Receipts</Button>
      </div>
      <DeleteReceiptsForm cookie={rbCookie} convertedReceipts={inboxReceipts} />
      
      {
        isLoading ? (
          <div className="loading">
            Loading
          </div>
        ) : null
      }
    </div>
  )
}













const getChangeStateParams = (data, client) => {

  const state = {
    type1: {
      from: "PENDING",
      to: "COMPLETED"
    },
    type2: {
      from: "COMPLETED",
      to: "C"
    }
  }

  let gqlParams = "";
  let gqlFunctions = "";
  let gqlVariables = {}

  let uploadedReceiptsKey = Object.keys(data);
  uploadedReceiptsKey.forEach((aReceiptKey,index)=>{
    gqlParams += `$id${index}: String!, $updateCtr${index}: Int!, $fromState${index}: String!, $toState${index}: String!`
    if (index+1 != data.length) {
      gqlParams += ","
    }

    gqlFunctions += `changeStateReceipt${index}: changeStateReceipt(id: $id${index}, updateCtr: $updateCtr${index}, fromState: $fromState${index}, toState: $toState${index})`

    gqlVariables[`id${index}`] = data[aReceiptKey].id;
    gqlVariables[`updateCtr${index}`] = 0;
    gqlVariables[`fromState${index}`] = "PENDING";
    gqlVariables[`toState${index}`] = "COMPLETED";
  })

  let changeReceiptState_mutation = `
    mutation changeStateReceipt(${gqlParams}) {
      ${gqlFunctions}
    }
  `

  client.mutate({
    variables: gqlVariables,
    mutation: gql`${changeReceiptState_mutation}`
  }).then((changeStateResult)=>{
    // setUploading(false)
    console.log('changeStateResult',changeStateResult)
    // uploadResult.data
  }).catch(changeStateErr=>{
    // setUploading(false)
    console.log('changeState err',changeStateErr)
  })
  return {
    changeReceiptState_mutation,
    gqlVariables
  }
}



async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}


const getUploadParams = async (data, clientCode, cookie) => {
  let gqlParams = "";
  let gqlFunctions = "";
  let gqlVariables = {}

  await asyncForEach(data, async (aData,index) => {
  // data.forEach(async (aData,index)=>{
    console.log('index', index)

    gqlParams += `$file${index}: Upload!, $bucket${index}: String!, $tenant_id${index}: String!, $receiptDate${index}: DateTime, $description${index}: String, $total${index}: Float, $receiptCategory${index}: String, $receiptCurrency${index}: String, $supplier_id${index}: String`
    if (index+1 != data.length) {
      gqlParams += ","
    }

    gqlFunctions += `uploadReceipt${index}: uploadReceipt(file: $file${index}, bucket: $bucket${index}, tenant_id: $tenant_id${index}, receiptDate: $receiptDate${index}, description: $description${index}, total: $total${index}, receiptCategory: $receiptCategory${index}, receiptCurrency: $receiptCurrency${index}, supplier_id: $supplier_id${index}) {
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
    }`
    // let imgURI = await rbReadImage(cookie,aData.downloadUrl)
    let imgURI = await rbReadImage(cookie,aData.imageUrl2)

    function dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(',')[1]);
    
      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    
      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);
    
      // create a view into the buffer
      var ia = new Uint8Array(ab);
    
      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
    
      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], {type: mimeString});
      return blob;
    }

    const theFile = dataURItoBlob(imgURI.data);

    // Optional, defaults to `blob`.
    theFile.name = imgURI.filename;

    // const theFile = new ReactNativeFile({
    //   uri: imgURI.data,
    //   name: imgURI.filename,
    //   type: imgURI.type
    // });

    // console.log('getImageURI(aData.downloadUrl)',getImageURI(aData.imageUrl2))
    gqlVariables[`file${index}`] = theFile;
    gqlVariables[`bucket${index}`] = "processed";
    gqlVariables[`tenant_id${index}`] = clientCode;

    gqlVariables[`receiptDate${index}`] = aData["receiptDate"];
    gqlVariables[`total${index}`] = parseFloat(aData["total"]);
    // gqlVariables[`receiptCategory${index}`] = aData["receiptCategory"];
    gqlVariables[`receiptCurrency${index}`] = aData["receiptCurrency"];
    // gqlVariables[`supplier_id${index}`] = 0;
  })

  let uploadReceipts_mutation = `
    mutation uploadReceipt(${gqlParams}) {
      ${gqlFunctions}
    }
  `
  return {
    uploadReceipts_mutation,
    gqlVariables
  }

  // return new Promise((resolve,reject)=>{
    
  //   resolve({
  //     uploadReceipts_mutation,
  //     gqlVariables
  //   })
  // })

}


const JSONEditor = (props) => {
  const { value, onChange, ...restProps } = props;
  const handleOnChange = (value) => {
    onChange(value.jsObject)
  }
  return (
    <div>
      <JSONInput
        id          = {`id${Math.random()}`}
        placeholder = {value}
        locale      = {locale}
        height      = '500px'
        onChange    = {handleOnChange}
        {...restProps}
        //reset={true}
      />
      
    </div>
  )
}

const ReceiptsList = (props) => {
  const { client, receipts, setLoading } = props;
  const [ selectedReceipts, setSelectedReceipts ] = useState([]);

  const columns = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (text, record, index) => {
        return index+1 + "."
      }
    },
    {
      title: 'Date Created',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    // {
    //   title: 'URL',
    //   dataIndex: 'url',
    //   key: 'url'
    // },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    }
  ]

  const onSelectChange = selectedRowKeys => {
    setSelectedReceipts(selectedRowKeys);
  }

  const rowSelection = {
    selectedRowKeys: selectedReceipts,
    onChange: onSelectChange,
  };

  const handleSendEmail = async () => {

    let attachments = [];

    if (selectedReceipts && selectedReceipts.length > 0) {
      selectedReceipts.forEach(aURL=>{
        attachments.push({
          path: aURL,
          // href: aURL
        })
      })
    }
    let account = {
      email: "lexons95@hotmail.com", //set in server
      password: "123098qwepoi", //set in server

      receiverEmail: client.receiptBank_id, // get from client data
      service: "hotmail",
      ccEmail: "", // optional (for checking)
      //subject: "" 
    }
    if (attachments.length > 0) {
      setLoading(true)
  
      try {
        let rbSendEmailResult = await rbSendEmail(attachments, account);
        
        console.log('rbSendEmailResult',rbSendEmailResult)
  
      }
  
      catch(err) {
        console.log('rbSendEmailResult err',err)
      }
      setLoading(false)
    }
    else {
      console.log('No attachments found')
    }

  }

  return (
    <div className="receiptsSection">
      <h3>{client ? client.name : null} Receipts</h3>
      <Table 
        dataSource={receipts} 
        columns={columns} 
        rowKey={"url"}
        rowSelection={rowSelection}
        pagination={false}
        size="small"
        scroll={{ y: 400 }} 
      />
      {client && client.receiptBank_id ? <Button onClick={handleSendEmail}>Send selected receipts to&nbsp;<b>{client.receiptBank_id}</b></Button> : "No receiptbank email found"}
    </div>
  )
}

const DeleteReceiptsForm = (props) => {
  const { cookie: rbCookie, convertedReceipts=[] } = props;
  const [ selectedReceipts, setSelectedReceipts ] = useState([]);

  const columns = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (text, record, index) => {
        return index+1 + "."
      }
    },
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'totalAmount',
      dataIndex: 'totalAmount',
      key: 'totalAmount'
    },
    {
      title: 'createdAt',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'Failed',
      dataIndex: 'failed',
      key: 'failed',
      render: (text, record, index) => {
        return text ? "True" : "False"
      }
    }
  ]

  const onSelectChange = selectedRowKeys => {
    setSelectedReceipts(selectedRowKeys);
  }

  const rowSelection = {
    selectedRowKeys: selectedReceipts,
    onChange: onSelectChange,
  };

  const deleteReceiptsRB = async () => {
    let ids = selectedReceipts;
    if (rbCookie && ids.length > 0) {
      try {
        let deleteReceiptsRBResult = await rbDeleteReceipts(rbCookie, ids);
        console.log('deleteReceiptsRBResult success', deleteReceiptsRBResult)
      }
      catch(err) {
        console.log('deleteReceiptsRBResult err', err)
      }
    }

  }
  return(
    <div className="receiptsSection">
      <h3>Delete Receipts from ReceiptBank</h3>
      <Table
        dataSource={convertedReceipts}
        columns={columns} 
        rowKey={"id"}
        rowSelection={rowSelection}
        pagination={false}
        size="small"
        scroll={{ y: 400 }} 
      />
      <Button onClick={deleteReceiptsRB} disabled={selectedReceipts.length > 0 ? false : true}>Delete Receipts</Button>
    </div>
  )
}

const Image = (props) => {
  const { cookie, url } = props;
  const[ src, setSrc ] = useState(null)
  useEffect(async ()=>{
    let imgURI = await rbReadImage(cookie,url)
    setSrc(imgURI.data)
  },[])
  let style = {
    maxHeight: '500px',
    width: '500px',
    overflow: 'hidden',
    border: '1px solid black'
  }
  let imgStyle = {
    height: "100%",
    // width: "100%"
  }
  return (
    <div style={style}>
      {
        src ? 
        (<img src={src} style={imgStyle} />)
        : null
      }
    </div>
  )
}


const Receipt = (props) => {
  const { data, index, convertedReceipts } = props;

  const handleOnChange = (value) => {
    if (convertedReceipts != null) {
      let newJson = JSON.parse(JSON.stringify(convertedReceipts))
      newJson[index] = JSON.parse(JSON.stringify(value.jsObject));
      console.log('asddd', convertedReceipts)
      // setConvertedReceipts(newJson)
    }
  }

  if (!data) {
    return (
      <div>
        No data found
      </div>
    )
  }
  return (
    <div style={{display: 'flex', marginBottom: '10px', border: "1px solid black"}}>
      <img src={data.imageUrl2} width="300" height="400" />
      <div>
        {
          data ? (
            <JSONInput
              id          = {data.id}
              placeholder = {data}
              locale      = {locale}
              height      = '400px'
              //reset={true}
              onChange={handleOnChange}
            />
          ) : null
        }
      </div>

    </div>
  )
}

export default Receipts;
