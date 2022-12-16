class BookingDetails {
    static bookingDetails = [];
    numberOfPerson = null;
    numberOfTable = null;
    bookingDate = null;
    dateOfBooking = null;
    // constructor(numberOfPersons, numberOfTables, bookingDate) {
    //     this.numberOfPersons = numberOfPersons
    //     this.numberOfTables = numberOfTables
    //     this.bookingDate = bookingDate
    // }
    // static saveBooking() {
    //     const numberOfPersons = this.numberOfPersons;
    //     const numberOfTables = this.numberOfTables;
    //     const bookingDate = this.bookingDate;
    //     this.bookingDetails.push({ numberOfPersons, numberOfTables, bookingDate });
    // }
    static saveBooking(numberOfPerson, numberOfTable, bookingDate, dateOfBooking) {
        this.bookingDetails.push({ numberOfPerson, numberOfTable, bookingDate, dateOfBooking });
    }
    static getBooking() {
        this.bookingDetails.forEach((detail) => {
            // console.log("======>", detail.numberOfPersons)
        })
    }
}
module.exports.BookingDetails = BookingDetails;