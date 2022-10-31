const { ActivityHandler, MessageFactory, CardFactory, TeamsActivityHandler } = require('botbuilder');
const WelcomeCard = require('./resource/welcomeCard.json');
const { optionCard, bookingForm } = require('./resource/adaptiveCard');
const { TaskModuleResponseFactory } = require("./models/taskmoduleresponsefactory");

class BotActivityHandler extends TeamsActivityHandler {

    constructor(conversationState, rootDialog) {
        super();
        if (!conversationState) throw new Error('conversation state required!');
        this.conversationState = conversationState;
        this.rootDialog = rootDialog;
        this.accessor = this.conversationState.createProperty('DialogAccesor');
        this.onMessage(async (context, next) => {
            await this.rootDialog.run(context, this.accessor);
            await next();
        });

        this.onConversationUpdate(async (context, next) => {
            // if (context.activity.membersAdded && context.activity.membersAdded[0].id == context.activity.from.id) {
            await context.sendActivity({
                attachments: [CardFactory.adaptiveCard(WelcomeCard)]
            }
            );
            await context.sendActivity(optionCard());
            await next();

        })

    }
    handleTeamsTaskModuleFetch(context, taskModuleRequest) {
        var taskInfo = {};
        taskInfo.card = bookingForm();
        return TaskModuleResponseFactory.toTaskModuleResponse(taskInfo);
    }
    async handleTeamsTaskModuleSubmit(context, taskModuleRequest) {
        // Called when data is being returned from the selected option (see `handleTeamsTaskModuleFetch').

        // Echo the users input back.  In a production bot, this is where you'd add behavior in
        // response to the input.
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
    async run(context) {
        await super.run(context);
        await this.conversationState.saveChanges(context, false);
    }
}
module.exports.BotActivityHandler = BotActivityHandler;