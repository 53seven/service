// util.js
const AWS = require('aws-sdk');

/* istanbul ignore next */
if (process.env.DYNAMODB_URL) {
  AWS.config.update({
    region: 'us-west-2',
    endpoint: process.env.DYNAMODB_URL
  });
}

const docClient = new AWS.DynamoDB.DocumentClient();

let get_token = async (id, done) => {
  try {
    let user = await docClient.get({
      TableName: 'auth',
      Key: {
        id
      }
    }).promise();
    if (!user) {
      done(null, false);
    } else {
      done(null, user.Item);
    }
  } catch (err) {
    // lets just *assume* try-catch works
    /* istanbul ignore next */
    done(err);
  }
};

module.exports = {
  get_token
};
