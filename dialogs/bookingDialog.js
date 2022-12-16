const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { InputHints, MessageFactory, CardFactory } = require('botbuilder');
const { ConfirmPrompt, DialogTurnStatus, TextPrompt, ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');
const { DateResolverDialog } = require('./dateResolverDialog');
const CONFIRM_PROMPT = 'confirmPrompt';
const DATE_RESOLVER_DIALOG = 'dateResolverDialog';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';
const { confirmReservation } = require('../resource/confirmationCard');
const { BookingDetails } = require("../models/dataSchema");
const { bookingDialog } = require('../Constants/DialogIds');
const { optionCard } = require('../resource/adaptiveCard');
const { InterruptHandler } = require("./InterruptHandler");
class BookingDialog extends InterruptHandler {
    constructor(conversationState) {
        super(bookingDialog, conversationState);
        if (!conversationState) throw new Error('conversation state required!');
        this.conversationState = conversationState;
        this.bookingDetail = this.conversationState.createProperty('bookingDetail');
        this.addDialog(new TextPrompt(TEXT_PROMPT))
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
        this.addDialog(new DateResolverDialog(DATE_RESOLVER_DIALOG))
        // this.addDialog(new GetBookingDialog(this.conversationState))
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.numberOfPersonStep.bind(this),
            this.numberOfTableStep.bind(this),
            this.bookingDateStep.bind(this),
            this.confirmStep.bind(this),
            this.finalStep.bind(this),
            // this.summaryStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * If a destination city has not been provided, prompt for one.
     */
    async numberOfPersonStep(stepContext) {
        // const bookingDetails = stepContext.options;
        if (!this.bookingDetail.numberOfPerson) {
            const messageText = 'For how many person you want to make reservation.';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }

        return await stepContext.next(this.bookingDetail.numberOfPerson);
    }

    async numberOfTableStep(stepContext) {

        this.bookingDetail.numberOfPerson = stepContext.result;
        if (!this.bookingDetail.numberOfTables) {
            const messageText = 'How many tables you want to book?';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            // console.log('+++++++++>', stepContext.result);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        return await stepContext.next(this.bookingDetail.numberOfTable);
    }

    async bookingDateStep(stepContext) {


        // Capture the results of the previous step
        this.bookingDetail.numberOfTable = stepContext.result;
        if (!this.bookingDetail.bookingDate || this.isAmbiguous(this.bookingDetail.bookingDate)) {
            return await stepContext.beginDialog(DATE_RESOLVER_DIALOG, { date: this.bookingDetail.bookingDate });
        }
        return await stepContext.next(this.bookingDetail.bookingDate);
    }

    /**
     * Confirm the information the user has provided.
     */
    async confirmStep(stepContext) {

        this.bookingDetail.bookingDate = stepContext.result;
        await stepContext.context.sendActivity({ attachments: [CardFactory.adaptiveCard(confirmReservation(this.bookingDetail.numberOfPerson, this.bookingDetail.numberOfTable, this.bookingDetail.bookingDate))] });
        // Offer a YES/NO prompt.
        return await stepContext.prompt(CONFIRM_PROMPT);
    }

    /**
     * Complete the interaction and end the dialog.
     */
    async finalStep(stepContext) {
        if (stepContext.result === true) {

            const result = this.bookingDetail;
            const timeProperty = new TimexProperty(result.bookingDate);
            const bookingDateMsg = timeProperty.toNaturalLanguage(new Date(Date.now()));
            const msg = `Booking made of ${result.numberOfTable} ${result.numberOfTable == 1 ? "table" : "tables"} for ${result.numberOfPerson} ${result.numberOfPerson == 1 ? "person" : "persons"} for the date: ${bookingDateMsg}.`;
            await stepContext.context.sendActivity(msg, msg, InputHints.IgnoringInput);
            await stepContext.context.sendActivity(optionCard());
            const date = new Date();
            const dateOfBooking = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}  at ${date.toLocaleTimeString()}`;
            this.bookingDetail.dateOfBooking = dateOfBooking;
            const newBookings = stepContext.options;
            BookingDetails.saveBooking(this.bookingDetail.numberOfPerson, this.bookingDetail.numberOfTable, this.bookingDetail.bookingDate, this.bookingDetail.dateOfBooking);
            newBookings.push(this.bookingDetail);
            this.bookingDetail = {};
            return await stepContext.endDialog(newBookings);
        }
        return await stepContext.endDialog();
    }
    isAmbiguous(timex) {
        const timexPropery = new TimexProperty(timex);
        return !timexPropery.types.has('definite');
    }
}

module.exports.BookingDialog = BookingDialog;
