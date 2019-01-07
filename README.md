# FCM Push Notification Service

## Purpose

Send push notifications via FCM (Firebase Cloud Messaging). Created specifically to work with [Phonegap Push Notifications Plugin](https://github.com/phonegap/phonegap-plugin-push/). You might need to alter the payload if using a different plugin/system in your app.


## Installation

### 1. Install node modules. In this directory, run: 

```
npm install
```

### 2. Get service_account.json file

Download service_accounts.json file from [Firebase Console](https://console.firebase.google.com) → Your Project → Settings → Service Accounts → **Generate new private key**

Copy this file (`service_account.json`) to this directory.

Copy the `databaseURL` and save it somewhere temporarily (used in step 3)

### 3. Create .env file

Duplicate the sample.env and rename it to `.env`

Set these values:

- `SERVICE_ACCOUNT_JSON`: path to the service_accounts.json file
- `DATABASE_URL`: databaseURL copied in step 2


## Usage

### Output help

```
node send.js -h
```

will output: 

```
FCM Push Notification Service

Options:

  -V, --version                        output the version number
  --title <title>                      The title of the message
  --message <message>                  The message of the message
  --device-id [device-id]              Send to a single device
  --topic [topic]                      The topic to send to (if no device-id is used)
  --notification-id [notification-id]  Optional notification id (default: 1)
  --dry                                Dry-run, do not send the message
  --jsondata [jsondata]                Stringified json to pass in otherData
  -h, --help                           output usage information

```

### Example: Sending to all users of one topic

```
node send.js --message "My Message" --title "My Title" --topic "my_topic"
```


### Example: Sending to one specific device

if you know the registrationID of your device, you can send a message to this device specifically.

```
node send.js --message "My Message" --title "My Title" --device-id "clUtNR_APoo:AP.........."
```

### Other options

**Custom Payload:** `--jsondata "{\"foo\": \"bar\"}"`

Will be available in event-data as `data.additionalData.otherData.foo = "bar"`

**Notification ID:** `--notification-id "142"`

Will be available in event-data as `data.additionalData.notId`


**Dry Run:** `--dry`

Will not send the notification.

