const sdk = require('api')('@gupshup/v1.0#3gxw8k3vl6xmaps4');
function sendText(recepientNumber, yourtext) {
    sdk.postMsg({
            channel: "whatsapp",
            source: "917834811114",
            destination: `${recepientNumber}`,
            "src.name": process.env.GUPSHUP_APP_NAME,
            message: {
                isHSM: "false",
                type: "text",
                text: `${yourtext}`,
            },
        },
        {
  accept: 'application/json',
  apikey: `${process.env.GUPSHUP_API_KEY}`
})
        .then((response) => {
            console.log("Text message sent", response);
        })
        .catch((err) => {
            console.log("Text message err:", err);
        });
}
function sendImage(recepientNumber, imageUrl, imageCaption) {
sdk.postMsg({
  message: {
    "originalUrl":imageUrl,
    "type":"image",
    "previewUrl":imageUrl,
    "caption":imageCaption
  },
  channel: 'whatsapp',
  source: 917834811114,
  destination: `${recepientNumber}`,
  'src.name': 'TableReservationWhatsapp'
}, {
  accept: 'application/json',
  apikey: `${process.env.GUPSHUP_API_KEY}`
})
  .then(({ data }) => console.log(data))
  .catch(err => console.error(err));
}

module.exports = {
    sendText: sendText,
    sendImage: sendImage
}