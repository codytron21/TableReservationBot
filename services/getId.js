const axios = require('axios');

async function getId(userMail, accessToken) {

    const apiEndpoint = `https://graph.microsoft.com/v1.0/users/${userMail}`;

    axios.get(apiEndpoint, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
        .then(response => {
            console.log(response.data.id);
            return response.data.id;
        })
        .catch(error => {
            console.error(error);
        });

}

module.exports.getId = getId