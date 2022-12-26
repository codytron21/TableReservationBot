const { CardFactory } = require('botbuilder');
module.exports = {
    optionCard: () => {
        return {
            attachments: [CardFactory.heroCard(
                'Select what you want to do.', null,
                CardFactory.actions([
                    {
                        type: 'imBack',
                        title: 'Make a booking',
                        value: 'booking'
                    },
                    {
                        type: 'imBack',
                        title: 'Get your booking',
                        value: 'getbooking'
                    },
                    {
                        type: 'imBack',
                        title: 'Update your booking',
                        value: 'updatebooking'
                    },
                    {
                        type: 'imBack',
                        title: 'Cancel your booking',
                        value: 'cancelbooking'
                    },
                    {
                        type: 'postBack',
                        title: 'Help',
                        value: 'help'
                    }
                ])
            )]
        }
    },
    updateOptionCard: () => {
        return {
            attachments: [CardFactory.heroCard(
                'Please Select what you want to update.', null,
                CardFactory.actions([
                    {
                        type: 'imBack',
                        title: 'Number of Person',
                        value: 'Number of Person'
                    },
                    {
                        type: 'imBack',
                        title: 'Number of Table',
                        value: 'Number of Table'
                    },
                    {
                        type: 'imBack',
                        title: 'Booking Date',
                        value: 'Booking Date'
                    }
                ])
            )]
        }
    },
    bookingCard: () => {
        return {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.0",
            "body": [
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "Image",
                                    "url":
                                        `https://encryptedtbn0.gstatic.com/images? 
                                       q=tbn:ANd9GcRSC41cOW3uPnzNpCqG0JokoF- 
                                        yHb3P52-cpQ&usqp=CAU`,
                                    "size": "Large"
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "\nBook your Table.",
                                    "wrap": true,
                                    "size": "Large",
                                    "weight": "Bolder",
                                    "isSubtle": true,
                                    "color": "Dark",
                                    "separator": true,
                                    "horizontalAlignment": "Right"
                                }
                            ],
                            "separator": true,
                            "horizontalAlignment": "Center"
                        }
                    ]
                },
                {
                    "type": "TextBlock",
                    "text": "Enter Your Booking Details.",
                    "wrap": true,
                    "weight": "Bolder",
                    "separator": true
                },
                {
                    "type": "Input.Number",
                    "placeholder": "Enter Number of Persons",
                    "id": "numOfPerson"
                },
                {
                    "type": "Input.Number",
                    "placeholder": "Enter Number of Tables",
                    "id": "numOfTable"
                },
                {
                    "type": "TextBlock",
                    "text": "Date of Booking:",
                    "wrap": true,
                    "id": "dateText",
                    "weight": "Bolder",
                    "separator": true
                },
                {
                    "type": "Input.Date",
                    "id": "bookingDate",
                    "separator": true
                }
            ],
            "actions": [
                {
                    "type": "Action.Submit",
                    "title": "Book Table",
                    "id": "makeBooking"
                },
                {
                    "type": "Action.Submit",
                    "title": "Cancel",
                    "id": "cancelBooking"
                }
            ]
        }
    },
    bookingForm: () => {
        return CardFactory.adaptiveCard({
            version: '1.0.0',
            type: 'AdaptiveCard',
            body: [
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "Image",
                                    "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSC41cOW3uPnzNpCqG0JokoF-yHb3P52-cpQ&usqp=CAU",
                                    "size": "Large"
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "\nBook your Table.",
                                    "wrap": true,
                                    "size": "Large",
                                    "weight": "Bolder",
                                    "isSubtle": true,
                                    "color": "Dark",
                                    "separator": true,
                                    "horizontalAlignment": "Right"
                                }
                            ],
                            "separator": true,
                            "horizontalAlignment": "Center"
                        }
                    ]
                },
                {
                    "type": "TextBlock",
                    "text": "Enter Your Booking Details.",
                    "wrap": true,
                    "weight": "Bolder",
                    "separator": true
                },
                {
                    "type": "Input.Number",
                    "placeholder": "Enter Number of Persons",
                    "id": "numOfPerson"
                },
                {
                    "type": "Input.Number",
                    "placeholder": "Enter Number of Tables",
                    "id": "numOfTable"
                },
                {
                    "type": "TextBlock",
                    "text": "Date of Booking:",
                    "wrap": true,
                    "id": "dateText",
                    "weight": "Bolder",
                    "separator": true
                },
                {
                    "type": "Input.Date",
                    "id": "bookingDate",
                    "separator": true
                }
            ],
            "actions": [
                {
                    "type": "Action.Submit",
                    "title": "Submit"
                }
            ]
        });
    },
    confirmProactiveSent: (text) => {
        return CardFactory.adaptiveCard({
            version: '1.0.0',
            type: 'AdaptiveCard',
            body: [
                {
                    "type": "TextBlock",
                    "text": `${text}`,
                    "size": "Medium",
                    "weight": "Bolder",
                    "wrap": true
                }
            ],
            "actions": [
                {
                    "type": "Action.Submit",
                    "title": "Okay"
                }
            ]

        });
    },
    whatsappText: () => {
        return CardFactory.adaptiveCard(
            {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "1.0",
                "body": [
                    {
                        "type": "Input.Text",
                        "label": "Enter Recepient Number",
                        "style": "text",
                        "id": "recepientNumber",
                        "isRequired": true,
                        "errorMessage": "Number is required"
                    },
                    {
                        "type": "Input.Text",
                        "label": "Your Message",
                        "style": "text",
                        "isMultiline": true,
                        "id": "Message"
                    }
                ],
                "actions": [
                    {
                        "type": "Action.Submit",
                        "title": "Send",
                        "data": {
                            "id": "whatsappText"
                        }
                    }
                ]
            }
        )
    },
    whatsappImage: () => {
        return CardFactory.adaptiveCard(
            {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "1.3",
                "body": [
                    {
                        "type": "Input.Text",
                        "label": "Enter Recepient Number",
                        "style": "text",
                        "id": "recepientNumber",
                        "isRequired": true,
                        "errorMessage": "Number is required",
                        "placeholder": "919568985656",
                        "isVisible": true,
                        "spacing": "Small"
                    },
                    {
                        "type": "Input.Text",
                        "label": "Enter Image Url",
                        "id": "imageUrl"
                    },
                    {
                        "type": "Input.Text",
                        "label": "Enter Caption",
                        "id": "imageCaption"
                    }
                ],
                "actions": [
                    {
                        "type": "Action.Submit",
                        "title": "Send",
                        "data": {
                            "id": "whatsappImage"
                        }
                    }
                ]
            }
        )
    },
    sendMailCard: () => {
        return CardFactory.adaptiveCard({
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.0",
            "body": [
                {
                    "type": "TextBlock",
                    "size": "Medium",
                    "weight": "Bolder",
                    "text": "Send Mail to Multiple User",
                    "horizontalAlignment": "Center",
                    "wrap": true,
                    "style": "heading"
                },
                {
                    "type": "TextBlock",
                    "text": "Emails",
                    "wrap": true
                },
                {
                    "type": "Input.Text",
                    "style": "text",
                    "id": "emailsAll",
                    "placeholder": "Enter comma separated emails",
                    "isRequired": true
                },
                {
                    "type": "TextBlock",
                    "text": "Topic",
                    "wrap": true
                },
                {
                    "type": "Input.Text",
                    "id": "topicAll",
                    "placeholder": "Meet for lunch?",
                    "style": "text",
                    "isRequired": true
                },
                {
                    "type": "TextBlock",
                    "text": "Description",
                    "wrap": true
                },
                {
                    "type": "Input.Text",
                    "id": "descriptionAll",
                    "placeholder": "The new cafeteria is open.",
                    "style": "text",
                    "isRequired": true
                }
            ],
            "actions": [
                {
                    "type": "Action.Submit",
                    "title": "Send",
                    "data": {
                        "id": "SendMail"
                    }
                }
            ]
        })
    },
    oneToOneNewChat: () => {
        return CardFactory.adaptiveCard({
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.5",
            "body": [
                {
                    "type": "TextBlock",
                    "size": "Medium",
                    "weight": "Bolder",
                    "text": " One To One Chat",
                    "horizontalAlignment": "Center",
                    "wrap": true,
                    "style": "heading"
                },
                {
                    "type": "TextBlock",
                    "text": "Email 1",
                    "wrap": true
                },
                {
                    "type": "Input.Text",
                    "style": "text",
                    "id": "email1",
                    "placeholder": "user1@celebaltech.com",
                    "isRequired": true
                },
                {
                    "type": "TextBlock",
                    "text": "Email 2",
                    "wrap": true
                },
                {
                    "type": "Input.Text",
                    "style": "text",
                    "id": "email2",
                    "placeholder": "user2@celebaltech.com",
                    "isRequired": true
                }
            ],
            "actions": [
                {
                    "type": "Action.Submit",
                    "title": "Create Chat",
                    "data": {
                        "id": "121chat"
                    }
                }
            ]
        })
    },
    scheduleEvents: () => {
        return CardFactory.adaptiveCard({
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.0",
            "body": [
                {
                    "type": "TextBlock",
                    "size": "Medium",
                    "weight": "Bolder",
                    "text": "Event Scheduler",
                    "horizontalAlignment": "Center",
                    "wrap": true,
                    "style": "heading"
                },
                {
                    "type": "TextBlock",
                    "text": "Start Date Time",
                    "wrap": true
                },
                {
                    "type": "Input.Text",
                    "style": "text",
                    "id": "startDateTime",
                    "isRequired": true,
                    "placeholder": "August 19, 1975 23:15:30 UTC"
                },
                {
                    "type": "TextBlock",
                    "text": "End Date Time",
                    "wrap": true
                },
                {
                    "type": "Input.Text",
                    "id": "endDateTime",
                    "style": "text",
                    "isRequired": true,
                    "placeholder": "August 19, 1975 23:15:30 UTC"
                },
                {
                    "type": "TextBlock",
                    "text": "Subject",
                    "wrap": true
                },
                {
                    "type": "Input.Text",
                    "id": "subject",
                    "style": "text",
                    "isRequired": true,
                    "placeholder": "Testing Meeting"
                }
            ],
            "actions": [
                {
                    "type": "Action.Submit",
                    "title": "Schedule Event",
                    "data": {
                        "id": "scheduleEvent"
                    }
                }
            ]
        })
    }
}