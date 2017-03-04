var express = require('express'),
    app = express.createServer();
var twilioAPI = require('twilio-api'),
    cli = new twilioAPI.Client(ACCOUNT_SID, AUTH_TOKEN);
app.use(cli.middleware() );
app.listen(PORT_NUMBER);
//Get a Twilio application and register it 
cli.account.getApplication(APPLICATION_SID, function(err, app) {
    if(err) throw err;
    app.register();
    app.on('incomingCall', function(call) {
        //Use the Call object to generate TwiML 
        call.say("This is a test. Goodbye!");
    });
    app.makeCall("+12225551234", "+13335551234", function(err, call) {
        if(err) throw err;
        call.on('connected', function(status) {
            //Called when the caller picks up 
            call.say("This is a test. Goodbye!");
        });
        call.on('ended', function(status, duration) {
            //Called when the call ends 
        });
    });
});
/*
... more sample code coming soon...
For now, check the /tests folder
*/