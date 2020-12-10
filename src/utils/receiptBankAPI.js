var axios = require('axios');
const fetch = require('node-fetch');
require('dotenv').config()
const serverURL = 'http://localhost:3001';

const username = process.env.RB_USERNAME;
const password = process.env.RB_PASSWORD;

export const rbLogin = () => {
  var data = JSON.stringify({
    "email": username,
    "password": password
  });
  
  var config = {
    method: 'post',
    url: serverURL+'/login',
    headers: { 
      'Content-Type': 'application/json',
    },
    data : data
  };
  
  return new Promise((resolve, reject)=>{
    axios(config)
    .then(function (response) {
      resolve(response.data)
    })
    .catch(function (error) {
      reject(error)
    });
  })

}

export const rbInbox = (cookie,filter={}) => {
  var data = JSON.stringify({
    "cookie": cookie,
    "filter": filter
  });
  
  var config = {
    method: 'post',
    url: serverURL + '/inbox',
    headers: { 
      'Content-Type': 'application/json',
    },
    data: data
  };
    
  return new Promise((resolve, reject)=>{
    axios(config)
    .then(function (response) {
      resolve(response.data)
    })
    .catch(function (error) {
      reject(error)
    });
  })
}

export const rbDeleteReceipts = (cookie,ids=[]) => {
  var data = JSON.stringify({
    "cookie": cookie,
    "ids": ids
  });
  
  var config = {
    method: 'post',
    url: serverURL + '/deletereceipts',
    headers: { 
      'Content-Type': 'application/json', 
      //'Cookie': 'connect.sid=s%3ANWgQRRxyo54j-66VpoCYlirlftH4G9_H.4qVnanMKE0DZS3Vh%2FuBjRjeoktRMtoVVJbKSbGdUCbc'
    },
    data: data
  };
    
  return new Promise((resolve, reject)=>{
    axios(config)
    .then(function (response) {
      resolve(response.data)
    })
    .catch(function (error) {
      reject(error)
    });
  })

}

export const rbSendEmail = (attachments=[],account) => {
  var data = JSON.stringify({
    "attachments": attachments,
    "account": account
  });
  
  var config = {
    method: 'post',
    url: serverURL + '/emailrb',
    headers: { 
      'Content-Type': 'application/json', 
      //'Cookie': 'connect.sid=s%3ANWgQRRxyo54j-66VpoCYlirlftH4G9_H.4qVnanMKE0DZS3Vh%2FuBjRjeoktRMtoVVJbKSbGdUCbc'
    },
    data: data
  };
    
  return new Promise((resolve, reject)=>{
    axios(config)
    .then(function (response) {
      resolve(response.data)
    })
    .catch(function (error) {
      reject(error)
    });
  })

}

export const rbReadImage = (cookie,url) => {
  var data = JSON.stringify({
    "cookie": cookie,
    "url": url
  });
  
  var config = {
    method: 'post',
    url: serverURL + '/image',
    headers: { 
      'Content-Type': 'application/json', 
      //'Cookie': 'connect.sid=s%3ANWgQRRxyo54j-66VpoCYlirlftH4G9_H.4qVnanMKE0DZS3Vh%2FuBjRjeoktRMtoVVJbKSbGdUCbc'
    },
    data: data
  };
    
  return new Promise((resolve, reject)=>{
    axios(config)
    .then(function (response) {
      resolve(response.data)
    })
    .catch(function (error) {
      reject(error)
    });
  })

}
