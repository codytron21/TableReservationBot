const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { InputHints, MessageFactory, CardFactory } = require('botbuilder');
const { ConfirmPrompt, TextPrompt, ComponentDialog, WaterfallDialog, Dialog } = require('botbuilder-dialogs');
const { DateResolverDialog } = require('./dateResolverDialog');
const CONFIRM_PROMPT = 'confirmPrompt';
const DATE_RESOLVER_DIALOG = 'dateResolverDialog';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG_CANCEL = 'waterfallDialogcancel';
const { confirmReservation } = require('../resource/confirmationCard');
const { cancelBookingDialog } = require('../Constants/DialogIds');
const { bookingCard, optionCard } = require('../resource/adaptiveCard');
class CancelBookingDialog extends ComponentDialog {
    constructor(conversationState) {
        super(cancelBookingDialog)
        if (!conversationState) throw new Error('conversation state required!');
        this.conversationState = conversationState;
        this.bookingID = this.conversationState.createProperty('bookingID');
        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new DateResolverDialog(DATE_RESOLVER_DIALOG))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG_CANCEL, [
                this.sendBookingDetails.bind(this),
                this.selectBookingId.bind(this),
                this.confirmCancel.bind(this),
                this.cancelBooking.bind(this)

            ]));

        this.initialDialogId = WATERFALL_DIALOG_CANCEL;
    }

    /**
     * If a destination city has not been provided, prompt for one.
     */
    async sendBookingDetails(stepContext) {
        const bookingDetails = stepContext.options;
        if (bookingDetails.length) {
            let Msg = "You have following Bookings: \n";
            bookingDetails.map(async (bookingDetail, key) => (
                Msg += `
     Booking Id ==> ${key + 1} : booked on ${bookingDetail.dateOfBooking}.`
            )
            )
            Msg += "\n Enter ID of the Booking you want to Cancel."

            await stepContext.context.sendActivity(Msg);
            return await stepContext.prompt(TEXT_PROMPT);
        }
        else {
            await stepContext.context.sendActivity("You have No Booking. Please make a Booking.")
            await stepContext.context.sendActivity(optionCard());
            return await stepContext.endDialog();
        }

        return await stepContext.next();
    }
    async selectBookingId(stepContext) {
        this.bookingID = stepContext.result - 1;
        return await stepContext.next();
    }
    async confirmCancel(stepContext) {
        await stepContext.context.sendActivity("Do you really want to cancel your booking?");
        return await stepContext.prompt(CONFIRM_PROMPT);
    }
    async cancelBooking(stepContext) {
        const bookingDetails = stepContext.options;

        if (stepContext.result == true) {
            const updatedBooking = bookingDetails.filter((booking, key) => key != this.bookingID);
            await stepContext.context.sendActivity("Your booking has been cancelled!");
            await stepContext.context.sendActivity(optionCard());
            return await stepContext.endDialog(updatedBooking);
        }
        await stepContext.context.sendActivity(optionCard());
        return await stepContext.endDialog(bookingDetails);
    }

}

module.exports.CancelBookingDialog = CancelBookingDialog;
