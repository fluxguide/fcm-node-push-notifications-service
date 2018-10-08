
require('dotenv').config()
const admin = require("firebase-admin");


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
    ['-t', '--title'],
    {
        help: 'The title of the message',
        required: true,
        defaultValue: ""
    }
);
parser.addArgument(
    ['-m', '--message'],
    {
        help: 'The message of the message',
        required: true,
        defaultValue: ""
    }
);
parser.addArgument(
    ['--topic'],
    {
        help: 'The topic to send to',
    }
);
parser.addArgument(
    ['--device-id'],
    {
        help: 'Send to a single device (no topic)',
    }
);
parser.addArgument(
    ['--dry', '--dry-run'],
    {
        help: 'dry run (do not send)',
        defaultValue: false
    }
);

var args = parser.parseArgs();

// use dryRun? (do not send message)
var dryRun = (args.dry == 'true') ? true : false;



/**
 * Setup FCM admin
 */
var serviceAccount = require(process.env.SERVICE_ACCOUNT_JSON);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
});





/** 
 * Define Payload
 */

// See documentation on defining a message payload.
// ANDROID:
// var message = {
//     data: {
//         "title": args.title,
//         "body": args.message,
//         "notId": "10",
//         "otherData": "blabla"
//     },
//     // token: registrationToken
//     // topic: args.topic
// };

// // iOS:
// var message = {
//     "notification": {
//         "title": args.title,
//         "body": args.message
//     },
//     "data": {
//         // "title": args.title,
//         // "body": args.message,
//         "key1": "data 1",
//         "key2": "data 2",
//         "notId": "10",
//         "content-available": "1"
//     },
// }

// BOTH
var message = {
    android: {
        ttl: 3600 * 1000, // 1 hour in milliseconds
        priority: 'normal',
        data: {
            "title": args.title,
            "body": args.message,
            "notId": "10",
            "otherData": "blabla"
        }
    },
    apns: {
        headers: {
            'apns-priority': '10'
        },
        payload: {
            aps: {
                alert: {
                    title: args.title,
                    body: args.message,
                },
                "content-available": '1'
            },
            "otherData": "blabla",
            "notId": "10",
        },
        
    },
}


/**
 * Define if send to topic (if set) or device
 */
if (args.device_id) {
    // This registration token comes from the client FCM SDKs.
    message.token = args.device_id;
}
else if(args.topic) {
    message.topic = args.topic;
}



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