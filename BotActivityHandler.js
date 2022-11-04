const { ActivityHandler, MessageFactory, CardFactory, TeamsActivityHandler, TurnContext, teamsNotifyUser } = require('botbuilder');
const WelcomeCard = require('./resource/welcomeCard.json');
const { optionCard, bookingForm, confirmProactiveSent } = require('./resource/adaptiveCard');
const { TaskModuleResponseFactory } = require("./models/taskmoduleresponsefactory");
const axios = require('axios');
const { setTimeout } = require('timers/promises');
class BotActivityHandler extends TeamsActivityHandler {
    constructor(conversationState, rootDialog, conversationReferences) {
        super();
        this.baseUrl = process.env.BaseUrl;
        if (!conversationState) throw new Error('conversation state required!');
        this.conversationState = conversationState;
        this.rootDialog = rootDialog;
        this.conversationReferences = conversationReferences;
        this.accessor = this.conversationState.createProperty('DialogAccesor');
        this.onMessage(async (context, next) => {
            this.addConversationReference(context.activity);
            await this.rootDialog.run(context, this.accessor);
            if (context.activity.text == "hello" || context.activity.text == "hi") {
                const conversationReference = TurnContext.getConversationReference(context.activity);
                const userMsg = context.activity.text;
                const ts = Date.now();
                // await new Promise(resolve => setTimeout(async () => resolve(
                //     await context.adapter.continueConversationAsync(process.env.MicrosoftAppId, conversationReference, async (context) => {
                //         await context.sendActivity(`Proactive Message: ${((Date.now() - ts) / 1000)}sec`);
                //         await context.sendActivity(`your name is ${conversationReference.user.name} 
                //     You sent: ${userMsg}`)
                //     })
                // ), 2000));
                const res = await setTimeout(1000, 'success');
                await context.adapter.continueConversationAsync(process.env.MicrosoftAppId, conversationReference,
                    async (context) => {
                        let message = MessageFactory.text(`Proactive Message: your name is "${conversationReference.user.name}" You messaged: "${userMsg}"
                             sent in: ${(Date.now() - ts) / 1000}sec`);
                        teamsNotifyUser(message);
                        await context.sendActivity(message);
                    })
            }
            else {
                this.addConversationReference(context.activity);
                await context.sendActivity({
                    attachments: [CardFactory.adaptiveCard(WelcomeCard)]
                }
                );
                await context.sendActivity(optionCard());
            }

            // (async () => {
            //     try {
            //         const response = await setTimeoutPromise(2000);
            //         await context.adapter.continueConversationAsync(process.env.MicrosoftAppId, conversationReference, async (context) => {
            //             await context.sendActivity(`Proactive Message: ${((Date.now() - ts) / 1000)}sec`)
            //             await context.sendActivity(`your name is ${conversationReference.user.name} You sent: ${userMsg}`)
            //         });
            //         console.log(response);
            //     }
            //     catch (err) {
            //         console.log("Error:", err);
            //     }
            // })();
            await next();
        });

        this.onConversationUpdate(async (context, next) => {
            // if (context.activity.membersAdded && context.activity.membersAdded[0].id == context.activity.from.id) {
            this.addConversationReference(context.activity);
            await context.sendActivity({
                attachments: [CardFactory.adaptiveCard(WelcomeCard)]
            }
            );
            await context.sendActivity(optionCard());
            await next();

        })

    }
    async mentionActivityAsync(context) {
        const mention = {
            mentioned: context.activity.from,
            text: `<at>${new TextEncoder().encode(
                context.activity.from.name
            )}</at>`,
            type: 'mention'
        };

        const replyActivity = MessageFactory.text(`Hi ${mention.text}`);
        replyActivity.entities = [mention];
        await context.sendActivity(replyActivity);
    }
    setTimeoutPromise(delay) {
        return new Promise((resolve, reject) => {
            if (delay < 0) return reject("Delay must be greater than 0")

            setTimeout(() => {
                resolve("done");
            }, delay)
        })
    }
    async handleTeamsTaskModuleFetch(context, taskModuleRequest) {
        var taskInfo = {};
        if (taskModuleRequest.data.data == 'openTaskAdaptive') {
            taskInfo.card = bookingForm();
            taskInfo.width = 600;
            taskInfo.height = 500;
            taskInfo.title = "This card is called using task module.";
            return TaskModuleResponseFactory.toTaskModuleResponse(taskInfo);

        }
        else if (taskModuleRequest.data.data == 'openTaskWebPage') {
            taskInfo.url = taskInfo.fallbackUrl = this.baseUrl + '/index.html';
            taskInfo.width = 600;
            taskInfo.height = 500;
            taskInfo.title = "This Custom HTML.";
            return TaskModuleResponseFactory.toTaskModuleResponse(taskInfo);
        }
        else {
            await axios.post(
                'https://celebaltech.webhook.office.com/webhookb2/40f08937-2ede-4e23-9fcd-e465e8504d48@e4e34038-ea1f-4882-b6e8-ccd776459ca0/IncomingWebhook/0039466eeed14b1a87f7f73008a1545a/b7b2b566-28e8-47b8-937a-37b46acf2a32'
                ,
                {
                    "@type": "MessageCard",
                    "@context": "http://schema.org/extensions",
                    "themeColor": "0076D7",
                    "summary": "Rohan succesfully sent Proactive Message to channel using Webhook!",
                    "sections": [{
                        "activityTitle": "Rohan succesfully sent Proactive Message to channel using Webhook!",
                        "activitySubtitle": "On Project Proactive messages",
                        "activityImage": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Ffreepng%2Ftick-icon_7183626.html&psig=AOvVaw2B2cmDnsyfxX7A1WJjQPCh&ust=1667413819505000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCNit-dXOjfsCFQAAAAAdAAAAABAE",
                        "facts": [{
                            "name": "Assigned to",
                            "value": "NodeJs developers"
                        }, {
                            "name": "Status",
                            "value": "Completed!"
                        }],
                        "markdown": true
                    }],
                    "potentialAction": [{
                        "@type": "ActionCard",
                        "name": "Add a comment",
                        "inputs": [{
                            "@type": "TextInput",
                            "id": "comment",
                            "isMultiline": false,
                            "title": "Add a comment here for this task"
                        }],
                        "actions": [{
                            "@type": "HttpPOST",
                            "name": "Add comment",
                            "target": "https://learn.microsoft.com/outlook/actionable-messages"
                        }]
                    }, {
                        "@type": "ActionCard",
                        "name": "Set due date",
                        "inputs": [{
                            "@type": "DateInput",
                            "id": "dueDate",
                            "title": "Enter a due date for this task"
                        }],
                        "actions": [{
                            "@type": "HttpPOST",
                            "name": "Save",
                            "target": "https://learn.microsoft.com/outlook/actionable-messages"
                        }]
                    }, {
                        "@type": "OpenUri",
                        "name": "Learn More",
                        "targets": [{
                            "os": "default",
                            "uri": "https://learn.microsoft.com/outlook/actionable-messages"
                        }]
                    }, {
                        "@type": "ActionCard",
                        "name": "Change status",
                        "inputs": [{
                            "@type": "MultichoiceInput",
                            "id": "list",
                            "title": "Select a status",
                            "isMultiSelect": "false",
                            "choices": [{
                                "display": "In Progress",
                                "value": "1"
                            }, {
                                "display": "Active",
                                "value": "2"
                            }, {
                                "display": "Closed",
                                "value": "3"
                            }]
                        }],
                        "actions": [{
                            "@type": "HttpPOST",
                            "name": "Save",
                            "target": "https://learn.microsoft.com/outlook/actionable-messages"
                        }]
                    }]
                });
            taskInfo.card = confirmProactiveSent();
            // taskInfo.card = bookingForm();

            return TaskModuleResponseFactory.toTaskModuleResponse(taskInfo);
        }

    }
    async handleTeamsTaskModuleSubmit(context, taskModuleRequest) {
        await context.sendActivity(MessageFactory.text('Your details are: ' + JSON.stringify(taskModuleRequest.data, null, 2)));
        await context.sendActivity({
            attachments: [CardFactory.adaptiveCard(WelcomeCard)]
        }
        );
        await context.sendActivity(optionCard());

        // Return TaskModuleResponse
        return {
            // TaskModuleMessageResponse
            task: {
                type: 'message',
                value: 'Thanks for filling the form!'
            }
        };
    }

    addConversationReference(activity) {
        const conversationReference = TurnContext.getConversationReference(activity);
        this.conversationReferences[conversationReference.conversation.id] = conversationReference;
    }
    async run(context) {
        await super.run(context);
        await this.conversationState.saveChanges(context, false);
    }
}
module.exports.BotActivityHandler = BotActivityHandler;