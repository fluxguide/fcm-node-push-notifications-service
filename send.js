
require('dotenv').config()
const admin = require("firebase-admin");

// use dryRun? (do not send message)
var dryRun = true;


/**
 * ArgumentParser
 */
var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Node Push Server'
});
parser.addArgument(
    ['-title', '--title'],
    {
        help: 'The title of the message'
    }
);
parser.addArgument(
    ['-message', '--message'],
    {
        help: 'The message of the message'
    }
);
parser.addArgument(
    ['--topic'],
    {
        help: 'The topic to send to'
    }
);

var args = parser.parseArgs();
console.dir({arguments: args});

process.exit();

/**
 * Setup FCM admin
 */
var serviceAccount = require(process.env.SERVICE_ACCOUNT_JSON);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
});

// This registration token comes from the client FCM SDKs.
var registrationToken = 'clUtNR_APoo:APA91bEQjpDhF03GBmyLrrGyQ4Pp7CFYg9d1YSx4CmxDZR3Gdbq67GKNgbAmqMxU7Dwt0Gi2xVq3kALQTh7qartecBJNS2w_dqOFhn_QKgOP30_9R5syUBXsUtSNNQGzbRTq6jx0iStf';

// See documentation on defining a message payload.
var message = {
    data: {
        title: "MyServerPush",
        score: '850',
        time: '2:45'
    },
    // token: registrationToken
    topic: topic
};

// Send a message to the device corresponding to the provided
// registration token.
admin.messaging().send(message, dryRun)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
    process.exit()
})
.catch((error) => {
    console.log('Error sending message:', error);
    process.exit()
  });