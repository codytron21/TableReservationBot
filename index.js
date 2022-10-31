const restify = require('restify');
const path = require('path');
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

const { ConversationState, MemoryStorage, BotFrameworkAdapter } = require('botbuilder');

const { RootDialog } = require('./dialogs/RootDialog');
const { BotActivityHandler } = require('./BotActivityHandler');

const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);

const rootDialog = new RootDialog(conversationState);
const mainBot = new BotActivityHandler(conversationState, rootDialog);
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
})
// console.log("======>", process.env.MicrosoftAppId);
adapter.onTurnError = async (context, error) => {
    console.log("Error occured ==>", error);

    await context.sendActivity('Bot encountered an error');
}

//create server
const server = restify.createServer();



server.post("/api/messages", (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await mainBot.run(context);
    });
});


server.listen(process.env.PORT || 3978, () => {
    console.log(`${server.name} is running on ${server.url}`);
});