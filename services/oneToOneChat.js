const axios = require('axios');

const access = ``

async function createOneToOneChat(accessToken, user1Id, user2Id) {
    // Set the API endpoint and headers
    const endpoint = `https://graph.microsoft.com/v1.0/chats`;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    };

    // Create the chat
    const chat = await axios.post(endpoint, {
        "chatType": "oneOnOne",
        "members": [
            {
                "@odata.type": "#microsoft.graph.aadUserConversationMember",
                "roles": ["owner"],
                "user@odata.bind": "https://graph.microsoft.com/v1.0/users('2c3a9605-59bb-41f2-a40f-242ee81a0fdf')"
            },
            {
                "@odata.type": "#microsoft.graph.aadUserConversationMember",
                "roles": ["owner"],
                "user@odata.bind": "https://graph.microsoft.com/v1.0/users('b7b2b566-28e8-47b8-937a-37b46acf2a32')"
            }
        ]
    }, { headers });

    // Return the chat details
    //console.log("--->--->",chat.data.webUrl);
    return chat.data;
}


module.exports.createOneToOneChat = createOneToOneChat