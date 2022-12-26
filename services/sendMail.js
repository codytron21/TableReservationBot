const axios = require('axios');

// const access = ``

async function sendMail(accessToken, mailId, subject, desc) {
    // Set the API endpoint and headers
    const endpoint = `https://graph.microsoft.com/v1.0/me/sendMail`;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    };

    // Create the chat
    const chat = await axios.post(endpoint, {
        "message": {
            "subject": `${subject}`,
            "body": {
                "contentType": "Text",
                "content": `${desc}`
            },
            "toRecipients": [
                {
                    "emailAddress": {
                        "address": `${mailId}`
                    }
                }
            ]
        }
    }, { headers });

}


module.exports.sendMail = sendMail