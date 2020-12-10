const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const { rbLoginRequest, rbGetInboxRequest, rbDeleteReceiptsRequest, sendImageAsEmail, rbGetImageRequest } = require('./receiptbankWidget');
const app = express();

const HOST = "localhost";
const PORT = "3001";

app.use(cookieParser());
app.use(cors())
app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

app.post('/login',async function(req,res,next){
  let body = req.body;
  let loginResult = await rbLoginRequest(body.email, body.password)
  return res.send(loginResult)
})

app.post('/inbox',async function(req,res,next){
  let body = req.body;
  let inboxResult = await rbGetInboxRequest(body.cookie, body.filter)
  return res.send(inboxResult)
});

app.post('/deletereceipts',async function(req,res,next){
  let body = req.body;
  let deleteReceiptsResult = await rbDeleteReceiptsRequest(body.cookie,body.ids)
  return res.send(deleteReceiptsResult)
});

app.post('/emailrb',async function(req,res,next){
  let body = req.body;
  let sendEmailResult = await sendImageAsEmail(body.attachments,body.account)
  return res.send(sendEmailResult)
});

app.post('/image',async function(req,res,next){
  let body = req.body;
  console.log('bodybody',body)
  let getImageResult = await rbGetImageRequest(body.cookie,body.url)
  return res.send(getImageResult)
});


app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://${HOST}:${PORT}`)
)