
const { CardFactory } = require('botbuilder');
const { ComponentDialog, WaterfallDialog, Dialog } = require('botbuilder-dialogs');


const WATERFALL_DIALOG_WITH_CARD = 'waterfallDialogwithcard';

const { bookingDialogWithCard } = require('../Constants/DialogIds');
const { bookingCard } = require('../resource/adaptiveCard');
class BookingDialogWithCard extends ComponentDialog {
    constructor(conversationState) {
        super(bookingDialogWithCard)
        if (!conversationState) throw new Error('conversation state required!');
        this.conversationState = conversationState;

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG_WITH_CARD, [
            this.showCard.bind(this),
            this.processUserInput.bind(this)

        ]));

        this.initialDialogId = WATERFALL_DIALOG_WITH_CARD;
    }

    /**
     * If a destination city has not been provided, prompt for one.
     */
    async showCard(stepContext) {
        await stepContext.context.sendActivity({
            attachments: [CardFactory.adaptiveCard(bookingCard())]
        });
        return Dialog.EndOfTurn;
    }
    async processUserInput(stepContext) {
        console.log(stepContext.context.activity.value);
        const {
            numOfPerson,
            numOfTable,
            bookingDate } = stepContext.context.activity.value;
        const bookingDetails = {
            numberOfPerson: numOfPerson,
            numberOfTable: numOfTable,
            bookingDate: bookingDate
        }
        return await stepContext.endDialog(bookingDetails);
    }
}

module.exports.BookingDialogWithCard = BookingDialogWithCard;
