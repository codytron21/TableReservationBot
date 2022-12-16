// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { InputHints } = require('botbuilder');
const { ComponentDialog, DialogTurnStatus } = require('botbuilder-dialogs');
const { GetBookingDialog } = require('./getBookingDialog');
// const { getBookingDialog, bookingDialog } = require('../Constants/DialogIds');
/**
 * This base class watches for common phrases like "help" and "cancel" and takes action on them
 * BEFORE they reach the normal bot logic.
 */
const { BookingDetails } = require('../models/dataSchema');
class InterruptHandler extends ComponentDialog {

    constructor(id, conversationState) {
        super(id);
        this.addDialog(new GetBookingDialog(conversationState));

    }
    async onContinueDialog(innerDc) {
        const result = await this.interrupt(innerDc);

        if (result) {
            return result;
        }
        return await super.onContinueDialog(innerDc);
    }

    async interrupt(innerDc) {
        if (innerDc.context.activity.text) {
            // console.log("=====>interrupt", innerDc._info);
            const text = innerDc.context.activity.text.toLowerCase();

            switch (text) {

                case 'mybookings': {
                    // await innerDc.beginDialog(getBookingDialog);
                    const helpMessageText = 'Here are your bookings';
                    await innerDc.context.sendActivity(helpMessageText, helpMessageText, InputHints.ExpectingInput);
                    await innerDc.beginDialog('getBookingDialog', BookingDetails.bookingDetails)
                    return { status: DialogTurnStatus.waiting };
                }
                case 'cancel':
                case 'quit': {
                    const cancelMessageText = 'Cancelling...';
                    await innerDc.context.sendActivity(cancelMessageText, cancelMessageText, InputHints.IgnoringInput);
                    return await innerDc.cancelAllDialogs();
                }
            }
        }
    }
}

module.exports.InterruptHandler = InterruptHandler;
