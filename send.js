#!/usr/bin/env node
require('dotenv').config()
const admin = require("firebase-admin");
const commander = require('commander');

/**
 * Argument Parsing with commander
 */
commander
    .version('0.1.0')
    .description('FCM Push Notification Service')
    .option('--title <title>', 'The title of the message')
    .option('--message <message>', 'The message of the message')
    .option('--device-id [device-id]', 'Send to a single device')
    .option('--topic [topic]', 'The topic to send to (if no device-id is used)')
    .option('--notification-id [notification-id]', 'Optional notification id', '1')
    .option('--dry', 'Dry-run, do not send the message')
    .option('--jsondata [jsondata]', 'Stringified json to pass in otherData')
    .parse(process.argv);


/** 
 * Validate JSON Data 
 * */
let otherData = {};
if(commander.jsondata) otherData = JSON.parse(commander.jsondata);
otherData = JSON.stringify(otherData);



/**
 * Setup FCM admin
 */
const serviceAccount = require(process.env.SERVICE_ACCOUNT_JSON);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
});




/** 
 * Define Payload for Android + iOS
 */
let message = {
    android: {
        ttl: 3600 * 1000, // 1 hour in milliseconds
        priority: 'normal',
        data: {
            title: commander.title,
            body: commander.message,
            notId: commander.notificationId,
            otherData: otherData
        }
    },
    apns: {
        headers: {
            'apns-priority': '10'
        },
        payload: {
            aps: {
                alert: {
                    title: commander.title,
                    body: commander.message,
                },
                "content-available": '1'
            },
            notId: commander.notificationId,
            otherData: otherData,
        }, 
    },
}



/**
 * Define if send to topic (if set) or device
 */
if (commander.deviceId) {
    // This registration token comes from the client FCM SDKs.
    message.token = commander.deviceId;
}
else if(commander.topic) {
    message.topic = commander.topic;
}



// Send a message to the device or topic
admin.messaging().send(message, commander.dry)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
    process.exit()
})
.catch((error) => {
    console.log('Error sending message:', error);
    process.exit()
  });