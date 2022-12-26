module.exports.currentDateInIST = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    // var ampm = today.getHours() >= 12 ? 'PM' : 'AM';
    var minutes = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
    var hours = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
    var time = hours + ":" + minutes /*+ ampm*/;
    today = `${dd}/${mm}/${yyyy} ${time}`;
    return today;

}