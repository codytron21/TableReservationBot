const { ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');
const { CardFactory } = require('botbuilder');
const { helpDialog } = require('../Constants/DialogIds');
const { optionCard } = require('../resource/adaptiveCard');
const helpDialogWF1 = 'helpDialogWF1';
class HelpDialog extends ComponentDialog {
    constructor(conversationState) {
        super(helpDialog)
        if (!conversationState) throw new Error('conversation state required!');
        this.conversationState = conversationState;

        this.addDialog(new WaterfallDialog(helpDialogWF1, [
            this.sendHelpSuggestions.bind(this),
        ]));

        this.initialId = helpDialogWF1;
    }
    async sendHelpSuggestions(stepContext) {
        await stepContext.context.sendActivity('Please select from below options!');
        await stepContext.context.sendActivity(optionCard());
        // console.log("====> conversationState", this.conversationState);
        return await stepContext.endDialog();
    }

}
module.exports.HelpDialog = HelpDialog;