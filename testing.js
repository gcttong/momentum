let AWS = require('aws-sdk');
const aws = {
    accessKeyId: '',
    secretAccessKey: '',
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
//console.log(data.Items);  
let arr=data.Items;
let newArray=[];
let extraArray=[]
for(let i=0; i<arr.length;i++)
{
    let stuff=arr[i];
    newArray[i]=new Date(parseInt(stuff.Timestamp.S));
    extraArray[i]= newArray[i].getDate() +" "+stuff.Phrase.S;
   
}
var hist = {};
extraArray.map( function (a) { if (a in hist) hist[a] ++; else hist[a] = 1; } );
console.log(hist);

var parsed = hist;

var array = [];

for(var x in parsed){
  array.push(parsed[x]);
}
console.log(array);

console.log(Math.max.apply(null, array));
  }         // successful response
});
