const { ActivityHandler, CardFactory } = require('botbuilder');
const WelcomeCard = require('./resource/welcomeCard.json');
const { optionCard } = require('./resource/adaptiveCard');
class BotActivityHandler extends ActivityHandler {

    constructor(conversationState, rootDialog) {
        super();
        if (!conversationState) throw new Error('conversation state required!');
        this.conversationState = conversationState;
        this.rootDialog = rootDialog;
        this.accessor = this.conversationState.createProperty('DialogAccesor');
        this.onMessage(async (context, next) => {

            await this.rootDialog.run(context, this.accessor);
            // await context.sendActivity("Hello there!");
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

    async run(context) {
        await super.run(context);
        await this.conversationState.saveChanges(context, false);
    }
}
module.exports.BotActivityHandler = BotActivityHandler;