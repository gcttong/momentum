var accountSid = 'ACbd2be9e74e61fed509df8104f20154c0'; // Your Account SID from www.twilio.com/console
var authToken = '17c74746799db6c0ce73e31ef34bfe1d';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);

client.messages.create({
    body: 'Hello from Gary',
    to: '+16472423389',  // Text this number
    from: '+12048001024' // From a valid Twilio number
}, function(err, message) {
    if(err) {
        console.error(err.message);
    }
});