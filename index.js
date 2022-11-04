const restify = require('restify');
const path = require('path');
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

const { ConversationState, MemoryStorage, BotFrameworkAdapter,

    CloudAdapter,
    ConfigurationBotFrameworkAuthentication
} = require('botbuilder');

const { RootDialog } = require('./dialogs/RootDialog');
const { BotActivityHandler } = require('./BotActivityHandler');
const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const conversationReferences = {};
const rootDialog = new RootDialog(conversationState);
const mainBot = new BotActivityHandler(conversationState, rootDialog, conversationReferences);
// const adapter = new BotFrameworkAdapter({
//     appId: process.env.MicrosoftAppId,
//     appPassword: process.env.MicrosoftAppPassword
// });
const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(process.env);
// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new CloudAdapter(botFrameworkAuthentication);
adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights. See https://aka.ms/bottelemetry for telemetry
    //       configuration instructions.
    console.error(`\n [onTurnError] unhandled error: ${error}`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${error}`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

//create server
const server = restify.createServer();
server.use(restify.plugins.bodyParser());


server.listen(process.env.PORT || 3978, () => {
    console.log(`${server.name} is running on ${server.url}`);
});


server.post("/api/messages", async (req, res) => {
    await adapter.process(req, res, context => mainBot.run(context)
    );
});


server.get('/api/notify', async (req, res) => {
    for (const conversationReference of Object.values(conversationReferences)) {
        // console.log("======>", conversationReference);
        await adapter.continueConversationAsync(process.env.MicrosoftAppId, conversationReference, async (context) => {
            await context.sendActivity('Proactive Message: Thanks for visiting our webpage!');
        });
    }

    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.write('<html><body><h1>Proactive messages have been sent.</h1></body></html>');
    res.end();
});
server.get('/*', restify.plugins.serveStatic({
    directory: './pages'
}));
















// axios.post('https://celebaltech.webhook.office.com/webhookb2/7de50934-9edb-4ff9-a12b-e999fe9e2caf@e4e34038-ea1f-4882-b6e8-ccd776459ca0/IncomingWebhook/c5e9c96405a744bd94ba4ac7b9e1ca4e/b7b2b566-28e8-47b8-937a-37b46acf2a32',
//     {
//         "@type": "MessageCard",
//         "@context": "http://schema.org/extensions",
//         "themeColor": "0076D7",
//         "summary": "Rohan created a new task",
//         "sections": [{
//             "activityTitle": "Rohan created a new task",
//             "activitySubtitle": "On Project Tango",
//             "activityImage": "https://teamsnodesample.azurewebsites.net/static/img/image5.png",
//             "facts": [{
//                 "name": "Assigned to",
//                 "value": "Unassigned"
//             }, {
//                 "name": "Due date",
//                 "value": "Mon May 01 2017 17:07:18 GMT-0700 (Pacific Daylight Time)"
//             }, {
//                 "name": "Status",
//                 "value": "Not started"
//             }],
//             "markdown": true
//         }],
//         "potentialAction": [{
//             "@type": "ActionCard",
//             "name": "Add a comment",
//             "inputs": [{
//                 "@type": "TextInput",
//                 "id": "comment",
//                 "isMultiline": false,
//                 "title": "Add a comment here for this task"
//             }],
//             "actions": [{
//                 "@type": "HttpPOST",
//                 "name": "Add comment",
//                 "target": "https://learn.microsoft.com/outlook/actionable-messages"
//             }]
//         }, {
//             "@type": "ActionCard",
//             "name": "Set due date",
//             "inputs": [{
//                 "@type": "DateInput",
//                 "id": "dueDate",
//                 "title": "Enter a due date for this task"
//             }],
//             "actions": [{
//                 "@type": "HttpPOST",
//                 "name": "Save",
//                 "target": "https://learn.microsoft.com/outlook/actionable-messages"
//             }]
//         }, {
//             "@type": "OpenUri",
//             "name": "Learn More",
//             "targets": [{
//                 "os": "default",
//                 "uri": "https://learn.microsoft.com/outlook/actionable-messages"
//             }]
//         }, {
//             "@type": "ActionCard",
//             "name": "Change status",
//             "inputs": [{
//                 "@type": "MultichoiceInput",
//                 "id": "list",
//                 "title": "Select a status",
//                 "isMultiSelect": "false",
//                 "choices": [{
//                     "display": "In Progress",
//                     "value": "1"
//                 }, {
//                     "display": "Active",
//                     "value": "2"
//                 }, {
//                     "display": "Closed",
//                     "value": "3"
//                 }]
//             }],
//             "actions": [{
//                 "@type": "HttpPOST",
//                 "name": "Save",
//                 "target": "https://learn.microsoft.com/outlook/actionable-messages"
//             }]
//         }]
//     }
// );

