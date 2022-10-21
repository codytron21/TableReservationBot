const { ComponentDialog, WaterfallDialog, TextPrompt } = require('botbuilder-dialogs');
// const { CardFactory } = require('botbuilder');
const { getBookingDialog } = require('../Constants/DialogIds');
const getBookingDialogWF1 = 'getBookingDialogWF1';
const TEXT_PROMPT = 'textPrompt';
const { optionCard } = require('../resource/adaptiveCard');
class GetBookingDialog extends ComponentDialog {
    constructor(conversationState) {
        super(getBookingDialog)
        if (!conversationState) throw new Error('conversation state required!');
        this.conversationState = conversationState;

        this.addDialog(new WaterfallDialog(getBookingDialogWF1, [
            this.sendBookingDetails.bind(this),
            this.sendSelectedBookingDetails.bind(this)
        ]));
        this.addDialog(new TextPrompt(TEXT_PROMPT));

        this.initialId = getBookingDialogWF1;
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
            Msg += "\n Enter Booking Id for detailed Information about your booking."

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
    async sendSelectedBookingDetails(stepContext) {
        const bookingDetails = stepContext.options;
        const id = stepContext.result;
        const bookingDetail = bookingDetails[id - 1];
        const msg = `You have  ${bookingDetail.numberOfTable} ${bookingDetail.numberOfTable == 1 ? "table" : "tables"} reserved for ${bookingDetail.numberOfPerson} ${bookingDetail.numberOfPerson == 1 ? "person" : "persons"} for the date ${bookingDetail.bookingDate}. 

                          booked on: ${bookingDetail.dateOfBooking}`
        await stepContext.context.sendActivity(msg);
        await stepContext.context.sendActivity(optionCard());
        return stepContext.endDialog();
    }
}
module.exports.GetBookingDialog = GetBookingDialog;