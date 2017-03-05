let AWS = require('aws-sdk');
const aws = {
    accessKeyId: 'AKIAJXMNICHPNEZIQAAA',
    secretAccessKey: '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',
    region: 'us-east-1'
  };

  AWS.config.update(aws);
var dynamodb = new AWS.DynamoDB();
var params = {
  TableName: 'DynamoData', /* required */
  KeyConditions:{
      "CustomerId" : {
          "AttributeValueList":[{
              S: "Customer1"
          }],
          "ComparisonOperator" : "EQ"
      }
  }
};
dynamodb.query(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     
  {
console.log(data.Items);  

  }           // successful response
});