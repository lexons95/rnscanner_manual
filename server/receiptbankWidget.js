const request = require('request').defaults({ encoding: null });;
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config()

const username = process.env.RB_USERNAME;
const password = process.env.RB_PASSWORD;
const accountId = process.env.RB_ACCOUNTID;
const RB_URL = "https://app.receipt-bank.com/"

function parseCookies(rawCookie) {
  const raw = rawCookie;
  return raw.map((entry) => {
    const parts = entry.split(';');
    const cookiePart = parts[0];
    return cookiePart;
  }).join(';');
}
console.log('accountId',accountId)
console.log('password',password)

const receiptBankAccount = {
  email: username,
  password: password,
  accountId: accountId
}

function rbLoginRequest(email=receiptBankAccount.email, password=receiptBankAccount.password) {

  const url = 'https://app.receipt-bank.com/login';


  let options = {
    'method': 'POST',
    'url': url,
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': "*"
    },
    'form': {
      'user_login[email]': email,
      'user_login[password]': password
    }
  };
  return new Promise(function (resolve, reject) {
    request(options, function (error, res) {
      if (error) {
        console.log('login err', error)
        reject(error)
        // throw new Error(error)
      }
      else {
        var rawCookie = res.headers['set-cookie'];
        var cookie = parseCookies(rawCookie);
        resolve(cookie)
        console.log("rbLoginRequest", cookie);
        // var rawCookie = res.headers['set-cookie'];
        // rbGetInboxRequest(parseCookies(rawCookie));
      }
    });
  })
}

 function rbGetInboxRequest(cookie, filter={}) {
  const url = 'https://app.receipt-bank.com/graph/api';

  var options = {
    'method': 'POST',
    'url': url,
    'headers': {
      'Content-Type': 'application/json',
      'Cookie': cookie
    },
    body: JSON.stringify({
      query: 'query CostsQuery($accountId: ID!, $section: ReceiptStatus!, $order: ReceiptOrder, $reversed: Boolean, $filter: ReceiptFilter) { \n  account(id: $accountId) { \n    id \n    receipts(first: 50, section: $section, order: $order, reversed: $reversed, filter: $filter) { \n      edges { \n        node { \n          ...ReceiptFragment \n        __typename \n        } \n        __typename \n      } \n      pageInfo { \n        endCursor \n        hasNextPage \n        __typename \n      } \n      totalCount \n        __typename \n      } \n      __typename \n    } \n  } \n  fragment ReceiptFragment on Receipt { \n    description \n    id \n    archived \n    readyForExport \n    kind \n    ledger \n    date \n    dueDate \n    code \n    totalAmount \n    taxAmount \n    baseTotalAmount \n    baseTaxAmount \n    primaryTaxAmount \n    secondaryTaxAmount \n    hasSecondaryTax \n    invoiceNumber \n    netAmount \n    note \n    imageUrl2 \n    downloadUrl \n    flagged \n    createdAt \n    exportedOn \n    exporterName \n    archivedOn \n    archiverName \n    unarchivedOn \n    unarchiverName \n    editedOn \n    editorName \n    currencyCode \n    integration \n    integrationDisplayName \n    read publishingStatus2 \n    publishingError \n    publishedOn \n    receivedVia \n    inExpenseReport \n    isMerged \n    dataExtractionErrors \n    rebillableToClient \n    supplierCategory { \n      id \n      name \n      __typename \n    } \n    partnerPermalink \n    conversation { \n      id \n      unreadCount \n      lastReadMessageId \n      __typename \n    } \n    validationData { \n      id \n      hasErrors \n      category \n      supplier \n      client \n      date \n      totalAmount \n      taxAmount \n      lineItems \n      paymentMethod \n      currencyCode \n      kind \n      project \n      integration \n      invoiceNumber \n      productService \n      __typename \n    } \n    paymentMethod { \n      id \n      displayName \n      reference \n      paymentAccounts { \n        id \n        name \n        integration \n        __typename \n      } \n      __typename \n    } \n    category { \n      id \n      displayName \n      __typename \n    } \n    categorySuggestion { \n      id \n      displayName \n      __typename \n    } \n    tax { \n      id \n      name \n      rate \n      __typename \n    } \n    client { \n      id \n      name \n      integration \n      __typename \n    } \n    project { \n      id \n      displayName \n      __typename \n    } \n    project2 { \n      id \n      displayName \n      __typename \n    } \n    supplier { \n      id \n      name \n      integrationName \n      hasTax \n      integrations { \n        identifier \n        __typename \n      } \n      __typename \n    } \n    user { \n      id \n      fullName \n      usingMobileApp\n      __typename \n    } \n    productService { \n      id \n      name \n      __typename \n    } \n    expenseReports { \n      id \n      code \n      name \n      date \n      user { \n        id \n        fullName \n        __typename \n      } \n      __typename \n    } \n    paperworkMatch { \n      id \n      amount \n      date \n      integrationName \n      reference \n      supplierName \n      __typename \n    } \n    assignedBankMatch { \n      id \n      amount \n      bankAccountName \n      date \n      description \n      currencyCode \n      integrationName \n      __typename \n    } \n    bankMatches { \n      id \n      amount \n      bankAccountName \n      bankName \n      date \n      description \n      currencyCode \n      integrationName \n      integrationMatch \n      __typename \n    } \n    __typename \n  }\n',
      variables: { 
        "accountId": receiptBankAccount.accountId, 
        "filter": filter, 
        "order": "DEFAULT", 
        "reversed": false, 
        "section": "INBOX" 
      }
    })
  };
  return new Promise(function (resolve, reject) {
    request(options, function (error, res) {
      if (error) {
        console.log('getInbox err', error)
        reject(error)
        throw new Error(error)
      }

      resolve(res.body);
    });
  })

}

function rbGetProcessingRequest(cookie) {
  const url = 'https://app.receipt-bank.com/graph/api';

  var options = {
    'method': 'POST',
    'url': url,
    'headers': {
      'Content-Type': 'application/json',
      'Cookie': cookie
    },
    body: JSON.stringify({
      query: 'query InProcessingQuery($accountId: ID!) { \n  account(id: $accountId) { \n    id receipts(first: 50, section: IN_PROCESSING) { \n      edges { \n        node { \n          ...InProcessingReceiptFragment __typename \n        } \n        __typename \n      } \n      pageInfo { \n        endCursor \n        hasNextPage \n        __typename \n      } \n      totalCount \n      __typename \n    } \n    __typename \n  } \n} \nfragment InProcessingReceiptFragment on Receipt { \n  id \n  flagged \n  receivedVia \n  extractionLimitReached \n  downloadUrl \n  imageUrl2 \n  user { \n    id \n    fullName \n    __typename \n  } \n  dataExtraction { \n    kind \n    kindState \n    date \n    dateState \n    supplier \n    supplierState \n    invoiceNumber \n    invoiceNumberState \n    currencyCode \n    currencyCodeState \n    totalAmount \n    totalAmountState\n    taxAmount \n    taxAmountState \n    secondaryTaxAmount \n    secondaryTaxAmountState \n    clientName \n    clientNameState \n    paymentReference \n    paymentReferenceState \n    paymentType \n    paymentTypeState \n    boosted \n    submissionFilename \n    remainingProcessingHours \n    __typename \n  } \n  __typename \n}',
      variables: { 
        "accountId": receiptBankAccount.accountId 
      }
    })
  };
  return new Promise(function (resolve, reject) {
    request(options, function (error, res) {
      if (error) {
        console.log('getProcessing err', error)
        reject(error)
        throw new Error(error)
      }
      resolve(res);
    });
  })

}

 function rbDeleteReceiptsRequest(cookie, ids=[]) {
  const url = 'https://app.receipt-bank.com/graph/api';

  var options = {
    'method': 'POST',
    'url': url,
    'headers': {
      'Content-Type': 'application/json',
      'Cookie': cookie
    },
    body: JSON.stringify({
      query:"mutation DeleteReceiptsMutation($receiptIds: [ID!]!) {\n  deleteReceipts(input: {receiptIds: $receiptIds}) {\n    receipts {\n      id\n      __typename\n    }\n    __typename\n  }\n}\n",
      variables: { 
        "receiptIds": ids
      }
    })
  };
  return new Promise(function (resolve, reject) {
    request(options, function (error, res) {
      if (error) {
        console.log('deleteReceipts err', error)
        reject(error)
        throw new Error(error)
      }
      resolve(res);
    });
  })
}

function rbGetImageRequest(cookie, url) {

  var options = {
    method: 'GET',
    url: url,
    headers: {
      Cookie: cookie,
      'Access-Control-Allow-Origin': "*"
    },
    credentials: 'include'
  };
  return new Promise(function (resolve, reject) {
    request(options, function (error, res) {
      if (error) {
        console.log('getImage err', error)
        reject(error)
        throw new Error(error)
      }
      else {
        let fileType = res.headers["content-type"];
        
        var filename = "";
        let contentDisposition = res.headers['content-disposition'];

        if (contentDisposition && contentDisposition.indexOf('inline') !== -1) {
            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            var matches = filenameRegex.exec(contentDisposition);
            if (matches != null && matches[1]) { 
              filename = matches[1].replace(/['"]/g, '');
            }
        }

        let buffer = Buffer.from(res.body).toString('base64')
        let imageURI = "data:" + fileType + ";base64," + buffer;
        // console.log(imageURI);
        resolve({
          data: imageURI,
          type: fileType,
          filename: filename
        });
        // let blob = res.blob()
        // resolve({
        //   data: blob,
        //   type: fileType
        // });
      }
    });
  }) 

  // var requestOptions = {
  //   method: 'GET',
  //   headers: {
  //     Cookie: cookie,
  //     'Access-Control-Allow-Origin': "*"
  //   },
  //   credentials: 'include'
  // };
    // return new Promise((resolve, reject) => {
  //   fetch(url, requestOptions).then(async (response) => {

  //     // const buffer = await response.buffer();
  //     const arrayBuffer = await response.arrayBuffer();
  //     const buffer = Buffer.from(arrayBuffer);
  //     // const fileType = await FileType.fromBuffer(buffer);
  //     // resolve({
  //     //   buffer,
  //     //   type: fileType
  //     // })
  //     let imagedata = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(response.body).toString('base64');
  //       console.log("responseresponse",imagedata);
  //     resolve(response)
  //     // fs.writeFile(`./image.jpg`, buffer, () => console.log('finished downloading!'));
  //   }).catch(err=>{
  //     console.log('err',err)
  //     reject(err)
  //   });
  // })


  // return new Promise(function (resolve, reject) {
  //   fetch(url,requestOptions)
  //   .then(res => {
  //     let x = res.blob()
  //     // resolve(x)
  //     return x
  //   }) // Gets the response and returns it as a blob
  //   .then(async blob => {
  //     // Here's where you get access to the blob
  //     // And you can use it for whatever you want
  //     // Like calling ref().put(blob)

  //     // Here, I use it to make an image appear on the page

  //     // let dataUrl = await new Promise(resolve => {
  //     //   let reader = new FileReader();
  //     //   reader.onload = () => resolve(reader.result);
  //     //   reader.readAsDataURL(blob);
  //     // });

  //     // let objectURL = global.URL.createObjectURL(blob);
  //     // let myImage = new Image();
  //     // myImage.src = objectURL;
  //     // document.getElementById('myImg').appendChild(myImage)
  //     resolve(blob)
  //   })
  //   .catch(err=>{
  //     reject(err)
  //   })
  // })


}

// function rbGetUsersRequest(cookie) {
//   const url = 'https://app.receipt-bank.com/settings/users';

//   var options = {
//     'method': 'GET',
//     'url': url,
//     'headers': {
//       'Cookie': cookie
//     }
//   };
//   return new Promise(function (resolve, reject) {
//     request(options, function (error, res) {
//       if (error) {
//         console.log('getUsers err', error)
//         reject(error)
//         throw new Error(error)
//       }
//       resolve(res);
//     });
//   })
// }


 function sendImageAsEmail(attachments=[], account) {
  const {
    email, 
    password, 
    receiverEmail, 
    service="hotmail",
    ccEmail=null,
    subject="Images to ReceiptBank"
  } = account;

  var transporter = nodemailer.createTransport({
    service: service,
    auth: {
      user: email,
      pass: password
    }
  });
  
  var mailOptions = {
    from: email,
    to: receiverEmail,
    subject: subject,
    attachments: attachments
  };
  if (ccEmail != null) {
    mailOptions['cc'] = ccEmail;
  }

  return new Promise(function (resolve, reject) {
    if (attachments.length > 0 && email && password && receiverEmail) {
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log("email error",error);
          reject(error)
        } else {
          console.log('Email sent: ' + info.response);
          resolve(info)
        }
      });
    }
    else {
      reject("Required data not provided")
    }
  })
  
}

async function main() {
  try {
    var loginResult = await rbLoginRequest();
    var rawCookie = loginResult.headers['set-cookie'];
    var cookie = parseCookies(rawCookie);
    var getInboxResult = await rbGetInboxRequest(cookie);
    var getProcessingResult = await rbGetProcessingRequest(cookie);

    // sample output in sampleInbox.json
    console.log('getInboxResult', getInboxResult.body)
    // sample output in sampleProcessing.json
    console.log('getProcessingResult',getProcessingResult.body)

    // filter {userIds: ["VXNlci0yMzg0Nzcy"]}

    // UmVjZWlwdC00MjA2NTAyNjY=
    // upload by email

    const filePath = path.join(__dirname, "samplereceipt_3.jpg");

    // var sendEmailResult = await sendImageAsEmail(attachments);
    // console.log('sendEmailResult',sendEmailResult)

    // var deleteReceiptsResult = await rbDeleteReceiptsRequest(cookie, ["UmVjZWlwdC00MjA2NjE5MDU="]);
    // console.log('deleteReceiptsResult', deleteReceiptsResult.body)

    // var getUserseResult = await rbGetUsersRequest(cookie);
    // console.log('getUserseResult', getUserseResult.body)

  }
  catch (e) {
    console.log("error", e)
  }

}

module.exports = {
  rbLoginRequest,
  rbGetInboxRequest,
  rbDeleteReceiptsRequest,
  sendImageAsEmail,
  rbGetImageRequest
}