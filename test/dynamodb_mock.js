// dynamodb_mock.js
const AWS = require('aws-sdk-mock');

const id = 'this_is_an_alnum_id_1234567890';
const service_id = 'google-id';
let dynamo_db = {
  [id]: {
    Item: {
      id,
      service_id,
      name: '53seven'
    }
  }
};

AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
  callback(null, dynamo_db[params.Key.id]);
});

