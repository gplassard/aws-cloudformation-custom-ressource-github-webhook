'use strict';

const fetch = require('node-fetch');
const utf8 = require('utf8');
const url = require('url');
const request = require('request');

const RESOURCE_TYPE = 'Custom::CodebuildGithubWebhook';

module.exports.handle = async (event, context) => {
  console.log(event);
  if (event.ResourceType !== RESOURCE_TYPE) {
    return {
      message: 'Invalid ResourceType, expected : ' + RESOURCE_TYPE,
      input: event,
    };
  }

  console.log(event.ResponseURL);
  console.log(decodeURIComponent(event.ResponseURL));
  console.log(utf8.encode(decodeURIComponent(event.ResponseURL)));
  console.log(url.parse(decodeURIComponent(event.ResponseURL)));

  const body = JSON.stringify({
    "Status": "SUCCESS",
    "PhysicalResourceId": event.PhysicalResourceId,
    "StackId": event.StackId,
    "RequestId": event.RequestId,
    "LogicalResourceId": event.LogicalResourceId,
    "PhysicalResourceId": event.LogicalResourceId
  });

  console.log(body);

  const response = await fetch(event.ResponseURL , {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: body
  }).then(res => res.text());

  /*const response = await new Promise((success) => {
    request(event.ResponseURL, {method: 'PUT', body: body, headers: { 'Content-Type': 'application/json' } })
      .on('response', function(response) {
        console.log(response.statusCode) // 200
        console.log(response.headers) // 'image/png'
        console.log(response.body)
        //success(response.statusCode)
      })
      .on('body', (error, response, body) => {
        console.log(error);
        console.log(response);
        console.log(body);
        success(body)
      })
      .on('error', (error) => {
        console.log(error);
        success(error)
      })
  })*/
  
  console.log(response);

  return {
    message: 'Go Serverless v1.0! Your function executed successfully!',
    input: response,
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
