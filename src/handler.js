'use strict';

const fetch = require('node-fetch');

const RESOURCE_TYPE = 'Custom::CodebuildGithubWebhook';

module.exports.handle = async (event, context) => {
  console.log(event);
  if (event.ResourceType !== RESOURCE_TYPE) {
    return {
      message: 'Invalid ResourceType, expected : ' + RESOURCE_TYPE,
      input: event,
    };
  }

  const response = await fetch(decodeURIComponent(event.ResponseURL), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "Status": "SUCCESS",
      "PhysicalResourceId": event.PhysicalResourceId,
      "StackId": event.StackId,
      "RequestId": event.RequestId,
      "LogicalResourceId": event.LogicalResourceId,
      "Data": {
        "OutputName1": "Value1",
        "OutputName2": "Value2",
      }
    })
  }).then(res => res.text());

  console.log(response);

  return {
    message: 'Go Serverless v1.0! Your function executed successfully!',
    input: response,
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
