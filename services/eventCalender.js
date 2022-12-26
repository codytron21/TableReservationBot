const axios = require('axios');

async function eventCalender(accessToken, startDateTime, endDateTime, subject) {
    // Set the API endpoint and headers
    const endpoint = `https://graph.microsoft.com/v1.0/me/events`;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    };

    // Create the chat
    const chat = await axios.post(endpoint, {
        "subject": `${subject}`,
        "start": {
            "dateTime": `${startDateTime}`,
            "timeZone": "UTC"
        },
        "end": {
            "dateTime": `${endDateTime}`,
            "timeZone": "UTC"
        },
        "location": {
            "displayName": "Microsoft Teams"
        }
        ,
        "attendees": [
            {
                "emailAddress": {
                    "address": "aditya.maurya@celebaltech.com",
                    "name": "Aditya Maurya"
                },
                "type": "required"
            }, {
                "emailAddress": {
                    "address": "rohan.kumar@celebaltech.com",
                    "name": "Aditya Maurya"
                },
                "type": "required"
            }
        ],
        "isOnlineMeeting": true
    }, { headers });

}


module.exports.eventCalender = eventCalender