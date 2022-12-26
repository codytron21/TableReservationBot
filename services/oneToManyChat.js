const axios = require('axios');

// const access = ``

async function createOneToManyChat(accessToken) {
    // Set the API endpoint and headers
    const endpoint = `https://graph.microsoft.com/v1.0/chats`;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    };

    // Create the chat
    const chat = await axios.post(endpoint, {
        "chatType": "group",
        "topic": "Testing Group",
        "members": [
            {
                "@odata.type": "#microsoft.graph.aadUserConversationMember",
                "roles": [
                    "owner"
                ],
                "user@odata.bind": "https://graph.microsoft.com/v1.0/users('2c3a9605-59bb-41f2-a40f-242ee81a0fdf')"
            },
            {
                "@odata.type": "#microsoft.graph.aadUserConversationMember",
                "roles": [
                    "owner"
                ],
                "user@odata.bind": "https://graph.microsoft.com/v1.0/users('b7b2b566-28e8-47b8-937a-37b46acf2a32')"
            },
            {
                "@odata.type": "#microsoft.graph.aadUserConversationMember",
                "roles": [
                    "owner"
                ],
                "user@odata.bind": "https://graph.microsoft.com/v1.0/users('01b9ca85-b8f1-4b60-8e52-86d725977a46')"
            }
        ]
    }, { headers });

    // Return the chat details
    // console.log("--->--->", chat.data.webUrl);
    return chat.data;
}


module.exports.createOneToManyChat = createOneToManyChat