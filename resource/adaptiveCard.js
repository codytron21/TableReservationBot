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
    }

}