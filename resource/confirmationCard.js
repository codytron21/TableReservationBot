module.exports = {
    confirmReservation: (numberOfPeople, numberOfTable, dateOfBooking) => {
        return {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.0",
            "body": [
                {
                    "type": "TextBlock",
                    "text": "Please Confirm your Booking:",
                    "wrap": true,
                    "style": "heading"
                },
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "FactSet",
                            "facts": [
                                {
                                    "title": "Number of Persons:",
                                    "value": `${numberOfPeople}`
                                },
                                {
                                    "title": "Number of Tables:",
                                    "value": `${numberOfTable}`
                                },
                                {
                                    "title": "Date of Reservation:",
                                    "value": `${dateOfBooking}`
                                }
                            ],
                            "spacing": "Small"
                        }
                    ],
                    "spacing": "Small"
                }
            ]
        }
    }
}