const { ComponentDialog, WaterfallDialog, TextPrompt, ChoicePrompt, ChoiceFactory } = require('botbuilder-dialogs');
const { InputHints, MessageFactory } = require('botbuilder');
// const { CardFactory } = require('botbuilder');
const { updateBookingDialog, bookingDialog } = require('../Constants/DialogIds');
const { BookingDialog } = require('./bookingDialog');
const updateBookingDialogWF1 = 'updateBookingDialogWF1';
const TEXT_PROMPT = 'textPrompt';
const ChoicePromptDialog = 'ChoicePromptDialog';
const { optionCard, updateOptionCard } = require('../resource/adaptiveCard');
class UpdateBookingDialog extends ComponentDialog {
    constructor(conversationState) {
        super(updateBookingDialog)
        if (!conversationState) throw new Error('conversation state required!');
        this.conversationState = conversationState;
        this.bookingID = this.conversationState.createProperty('bookingID');
        this.addDialog(new WaterfallDialog(updateBookingDialogWF1, [
            this.sendBookingDetails.bind(this),
            this.selectBookingId.bind(this),
            this.askUpdateDetails.bind(this),
            this.updateBookingDetails.bind(this),
            this.updateSummary.bind(this)
        ]));
        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new ChoicePrompt(ChoicePromptDialog));
        this.addDialog(new BookingDialog(conversationState));
        this.initialId = updateBookingDialogWF1;
    }
    async sendBookingDetails(stepContext) {
        const bookingDetails = stepContext.options;
        if (bookingDetails.length) {
            let Msg = "You have following Bookings: \n";
            bookingDetails.map(async (bookingDetail, key) => (
                Msg += `
     Booking Id ==> ${key + 1} : booked on ${bookingDetail.dateOfBooking}.`
            )
            )
            Msg += "\n Enter ID of the Booking you want to update."

            await stepContext.context.sendActivity(Msg);
            return await stepContext.prompt(TEXT_PROMPT);
        }
        else {
            await stepContext.context.sendActivity("You have No Booking. Please make a Booking.")
            await stepContext.context.sendActivity(optionCard());
            return stepContext.endDialog();
        }

        return await stepContext.next();
    }
    async selectBookingId(stepContext) {
        this.bookingID = stepContext.result - 1;
        return await stepContext.next();
    }
    async askUpdateDetails(stepContext) {
        await stepContext.context.sendActivity(updateOptionCard());
        return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        // prompt(ChoicePromptDialog, {
        //     prompt: 'Please Select what you want to Update.',
        //     choices: ChoiceFactory.toChoices(['Number of Person', 'Number of Table', 'date of booking', 'make Fresh Booking'])
        // });
    }

    async updateBookingDetails(stepContext) {
        const bookingDetails = stepContext.options[this.bookingID];
        switch (stepContext.result) {
            case 'Number of Person':
                bookingDetails.targetUpdate = "numberOfPerson";
                if (bookingDetails.numberOfPerson) {
                    const messageText = 'Enter Your new Number of Persons.';
                    const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
                    return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
                }
                return await stepContext.next(bookingDetails.numberOfPerson);
            case 'Number of Table':
                bookingDetails.targetUpdate = "numberOfTable";
                if (bookingDetails.numberOfTable) {
                    const messageText = 'Enter Your new Number of Tables.';
                    const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
                    return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
                }
                return await stepContext.next(bookingDetails.numberOfTable);
            case 'Booking Date':
                bookingDetails.targetUpdate = "bookingDate";
                if (bookingDetails.bookingDate) {
                    const messageText = 'Enter Your new booking Date.';
                    const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
                    return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
                }
                return await stepContext.next(bookingDetails.bookingDate);
        }
        return await stepContext.next();
    }
    async updateSummary(stepContext) {
        const bookingDetails = stepContext.options[this.bookingID];
        const targetUpdate = bookingDetails.targetUpdate;
        bookingDetails[targetUpdate] = stepContext.result;
        const Msg = `Your updated Booking:
        Booking of ${bookingDetails.numberOfTable} tables for ${bookingDetails.numberOfPerson} person for ${bookingDetails.bookingDate}`;
        await stepContext.context.sendActivity(Msg);
        await stepContext.context.sendActivity(optionCard());
        stepContext.options[this.bookingID] = bookingDetails;
        return await stepContext.endDialog(stepContext.options);
    }
}
module.exports.UpdateBookingDialog = UpdateBookingDialog;