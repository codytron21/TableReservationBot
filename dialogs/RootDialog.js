const { ComponentDialog, DialogSet, DialogTurnStatus,
    WaterfallDialog } = require('botbuilder-dialogs');
const { HelpDialog, BookingDialog, GetBookingDialog, UpdateBookingDialog, CancelBookingDialog } = require('./dialogIndex');
const { rootDialog, helpDialog, bookingDialog, getBookingDialog, updateBookingDialog, cancelBookingDialog } = require('../Constants/DialogIds');
const { BookingDetails } = require('../models/dataSchema');
const parseMessage = 'parseMessage';
class RootDialog extends ComponentDialog {
    constructor(conversationState) {
        super(rootDialog);
        if (!conversationState) throw new Error('ConversationState not found!');
        this.conversationState = conversationState;
        this.bookingDetails = this.conversationState.createProperty('bookingDetails');
        this.bookingDetails = [];
        // this.modelBooking = new BookingDetails(2, 5, 6);
        // this.modelBooking.saveBooking();

        this.addDialog(new WaterfallDialog(parseMessage, [
            this.routeMessage.bind(this),
            this.summaryMessage.bind(this)
        ]));
        this.addDialog(new BookingDialog(conversationState));
        this.addDialog(new GetBookingDialog(conversationState));
        this.addDialog(new UpdateBookingDialog(conversationState));
        this.addDialog(new CancelBookingDialog(conversationState));
        this.addDialog(new HelpDialog(conversationState));
        this.initialDialogId = parseMessage;
    }

    async run(context, accessor) {
        try {
            const dialogSet = new DialogSet(accessor);
            dialogSet.add(this);
            const dialogContext = await dialogSet.createContext(context);
            const results = await dialogContext.continueDialog();
            if (results && results.status === DialogTurnStatus.empty) {
                await dialogContext.beginDialog(this.id);
            }
        }
        catch (err) {
            console.log('Error in script==>', err);
        }
    }
    async routeMessage(stepContext) {
        switch (stepContext.context.activity.text) {
            case 'booking': return await stepContext.beginDialog(bookingDialog, this.bookingDetails);
            case 'getbooking': return await stepContext.beginDialog(getBookingDialog, this.bookingDetails);
            case 'updatebooking': return await stepContext.beginDialog(updateBookingDialog, this.bookingDetails);
            case "cancelbooking": return await stepContext.beginDialog(cancelBookingDialog, this.bookingDetails);
            case 'help': return await stepContext.beginDialog(helpDialog);
            default:
                // await stepContext.context.sendActivity(stepContext.context.activity.value);
                // // console.log(stepContext.context.activity);
                return await stepContext.next();
        };
    }
    async summaryMessage(stepContext) {
        if (stepContext.result != undefined) {

            this.bookingDetails = (stepContext.result);
        }
        return await stepContext.endDialog();
    }
}
module.exports.RootDialog = RootDialog;
