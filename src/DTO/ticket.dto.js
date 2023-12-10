export default class TicketDTO {
  constructor(ticketData) {
    this.code = ticketData.code;
    this.purchase_datetime = ticketData.purchase_datetime;
    this.amount = ticketData.amount;
    this.purchaser = ticketData.purchaser;
  }
}
