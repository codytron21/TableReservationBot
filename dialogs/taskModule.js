module.exports = {
    taskModule: (context, taskModuleRequest) => {
        return {
            handleTeamsTaskModuleFetch(context, taskModuleRequest) {
                // Called when the user selects an options from the displayed HeroCard or
                // AdaptiveCard.  The result is the action to perform.

                const cardTaskFetchValue = taskModuleRequest.data.data;
                var taskInfo = {}; // TaskModuleTaskInfo

                if (cardTaskFetchValue === TaskModuleIds.YouTube) {
                    // Display the YouTube.html page
                    taskInfo.url = taskInfo.fallbackUrl = this.baseUrl + '/' + TaskModuleIds.YouTube + '.html';
                    this.setTaskInfo(taskInfo, TaskModuleUIConstants.YouTube);
                } else if (cardTaskFetchValue === TaskModuleIds.CustomForm) {
                    // Display the CustomForm.html page, and post the form data back via
                    // handleTeamsTaskModuleSubmit.
                    taskInfo.url = taskInfo.fallbackUrl = this.baseUrl + '/' + TaskModuleIds.CustomForm + '.html';
                    this.setTaskInfo(taskInfo, TaskModuleUIConstants.CustomForm);
                } else if (cardTaskFetchValue === TaskModuleIds.AdaptiveCard) {
                    // Display an AdaptiveCard to prompt user for text, and post it back via
                    // handleTeamsTaskModuleSubmit.
                    taskInfo.card = this.createAdaptiveCardAttachment();
                    this.setTaskInfo(taskInfo, TaskModuleUIConstants.AdaptiveCard);
                }

                return TaskModuleResponseFactory.toTaskModuleResponse(taskInfo);
            },

            async handleTeamsTaskModuleSubmit(context, taskModuleRequest) {
                // Called when data is being returned from the selected option (see `handleTeamsTaskModuleFetch').

                // Echo the users input back.  In a production bot, this is where you'd add behavior in
                // response to the input.
                await context.sendActivity(MessageFactory.text('handleTeamsTaskModuleSubmit: ' + JSON.stringify(taskModuleRequest.data)));

                // Return TaskModuleResponse
                return {
                    // TaskModuleMessageResponse
                    task: {
                        type: 'message',
                        value: 'Thanks!'
                    }
                };
            },

            setTaskInfo(taskInfo, uiSettings) {
                taskInfo.height = uiSettings.height;
                taskInfo.width = uiSettings.width;
                taskInfo.title = uiSettings.title;
            }
        }
    }
}
//     ,
// {
//     "type": "Action.Submit",
//     "title": "To-Do's",
//     "data": {
//         "msteams": {
//             "type": "task/fetch"
//         },
//         "data": {
//             "type": "AdaptiveCard",
//             "body": [
//                 {
//                     "type": "ColumnSet",
//                     "columns": [
//                         {
//                             "type": "Column",
//                             "width": "stretch",
//                             "items": [
//                                 {
//                                     "type": "Image",
//                                     "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSC41cOW3uPnzNpCqG0JokoF-yHb3P52-cpQ&usqp=CAU",
//                                     "size": "Large"
//                                 }
//                             ]
//                         },
//                         {
//                             "type": "Column",
//                             "width": "stretch",
//                             "items": [
//                                 {
//                                     "type": "TextBlock",
//                                     "text": "\nBook your Table.",
//                                     "wrap": true,
//                                     "size": "Large",
//                                     "weight": "Bolder",
//                                     "isSubtle": true,
//                                     "color": "Dark",
//                                     "separator": true,
//                                     "horizontalAlignment": "Right"
//                                 }
//                             ],
//                             "separator": true,
//                             "horizontalAlignment": "Center"
//                         }
//                     ]
//                 },
//                 {
//                     "type": "TextBlock",
//                     "text": "Enter Your Booking Details.",
//                     "wrap": true,
//                     "weight": "Bolder",
//                     "separator": true
//                 },
//                 {
//                     "type": "Input.Number",
//                     "placeholder": "Enter Number of Persons",
//                     "id": "numOfPerson"
//                 },
//                 {
//                     "type": "Input.Number",
//                     "placeholder": "Enter Number of Tables",
//                     "id": "numOfTable"
//                 },
//                 {
//                     "type": "TextBlock",
//                     "text": "Date of Booking:",
//                     "wrap": true,
//                     "id": "dateText",
//                     "weight": "Bolder",
//                     "separator": true
//                 },
//                 {
//                     "type": "Input.Date",
//                     "id": "bookingDate",
//                     "separator": true
//                 }
//             ],
//             "actions": [
//                 {
//                     "type": "Action.Submit",
//                     "title": "OK"
//                 }
//             ]
//         }
//     }
// },
// {
//     "type": "Action.OpenUrl",
//     "title": "Suggest Item",
//     "url": "https://teams.microsoft.com/l/task/2a05d07c-d194-400e-8122-cad64cfe1cef?url=https%3A%2F%2Flocalhost%3A44349%2Fteams%2F%23%2Fsuggest%2Fee31b3aa-f60f-4594-a964-a01fcc461ceb%3Ffrom%3Dcard&height=540&width=800&title=*Suggest%20item"
// }