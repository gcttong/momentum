/**
 
 Copyright 2016 Brian Donohue.
 
*/

'use strict';

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

exports.handler = function (event, context) {
    try {
        
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
		 
//     if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.05aecccb3-1461-48fb-a008-822ddrt6b516") {
//         context.fail("Invalid Application ID");
//      }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    var cardTitle = "Hello, World!"
    var speechOutput = "You can tell Hello, World! to say Hello, World!"
    //callback(session.attributes, make());
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == 'AskIntent') {
        handleAskIntent(intent, session, callback);
    }
    else if (intentName == 'SaveIntent'){
        handleSaveIntent(intent, session, callback);
    }
    else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}

function handleAskIntent(intent, session, callback) {
    //var response = make_ask_request();
    make_ask_request(intent, session.attributes, callback);
}

function handleSaveIntent(intent, session, callback) {
    //var response = make_ask_request();
    make_save_request(intent, session.attributes, callback);
}


// ------- Helper functions to build responses -------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

function dynamoPutItem(phrase){
    console.log('putting item in dynamo..')
    var datetime = new Date().getTime().toString();
    var prefix = 'What is ';
    
    var params = {
        TableName: "DynamoData",
        Item: {
           "CustomerId": {
             S: "Customer1"
            }, 
           "Timestamp": {
             S: datetime
            }, 
           "Phrase": {
             S: prefix + phrase
            }
          }, 
          
    }
 dynamodb.putItem(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log(data);  
    });
}

function make_ask_request(intent, attr, callback){
    console.log('calling make_ask_request');
    var request = require('request');

    var headers = {
        'Authorization': 'Bearer d0614ab12e084437b026849c80254eb7'
    };
    
    var prefix = 'What is ';
    var options = {
        url: 'https://api.api.ai/api/query?v=20150910&query='+ prefix + intent.slots.phrase.value +'&lang=en&sessionId=c1814f10-f438-4067-9af4-0825b51aa01b&timezone=2017-03-04T16:33:15-0500',
        headers: headers
    };
    
    //buildSpeechletResponseWithoutCard("before", "", "true");
    
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            const result= JSON.parse(body);
            console.log(intent);
            dynamoPutItem(intent.slots.phrase.value)
            callback(attr, buildSpeechletResponseWithoutCard(result.result.fulfillment.speech, "", "true"));
        }
        //buildSpeechletResponseWithoutCard("Error status", "", "true");
    });
}

function make_save_request(intent, attr, callback){
    console.log('calling make_save_request');
    var request = require('request');

    var headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer 61c1fdd73cf149ceb049cf12a94795e4'
    };

    var subject = intent.slots.subject.value;
    var object = intent.slots.object.value;

    var data = 
    {
        "name": subject,
        "auto": true,
        "contexts": [],
        "templates": [
            "what is my " + subject ,
            subject
        ],
        "userSays": [
            {
                "data": [
                    {
                        "text": "What is my " + subject
                    }
                ],
                "isTemplate": false,
                "count": 0
            },
            {
                "data": [
                    {
                    "text": subject
                    }
                ],
                "isTemplate": false,
                "count": 0
            }
        ],
        "responses": [
            {
                "resetContexts": false,
                "speech": object
            }
        ],
        "priority": 500000
    };

    var options = {
        url: 'https://api.api.ai/v1/intents?v=20150910',
        method: 'POST',
        headers: headers,
        body: data,
        json: true
    };

    console.log('just before');
    request(options, function (error, response, body) {
        console.log(response);
        if (!error && response.statusCode == 200) {
            console.log(body);
            callback(attr, buildSpeechletResponseWithoutCard("Got it!", "", "true"));
        }
    });
}

 /*const event= {
  "session": {
    "sessionId": "SessionId.2dbe991b-4c79-4ecb-bf2a-298f45ac76d7",
    "application": {
      "applicationId": "amzn1.ask.skill.29670d91-534d-40b3-a617-aaee2b5b8caa"
    },
    "attributes": {},
    "user": {
      "userId": "amzn1.ask.account.AGLPG66JCGCAWXT5AGMETSSLI52GCAY7HHKCPFSQJEXSNIAPWJMOHWAXLIML4EAVBVRUNWZZGA37NPETP5RC3AZTSGSGQVRL3O2FO5YF7P2BPZHOFSECXQLQOTSBW6IFZD24BGNSWPRSQBGVQ6KNUE4ZU4L65Q4AIOXKRAQX6SDGY3ZOH7INNP6JUFJH6Y2JRDHJOHU4EEZJDTY"
    },
    "new": true
  },
  "request": {
    "type": "IntentRequest",
    "requestId": "EdwRequestId.b2e5e756-df77-4935-afe7-5bc8933f5796",
    "locale": "en-US",
    "timestamp": "2017-03-04T21:21:24Z",
    "intent": {
      "name": "TestIntent",
      "slots": {}
    }
  },
  "version": "1.0"
};

const context = {
    succeed: function(data) {
        console.log(data);
    }
};
exports.handler(event, context);
*/