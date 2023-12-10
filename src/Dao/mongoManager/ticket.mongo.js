import TicketModel from "./models/ticketModel.js";

export default class Ticket {
  createTicket = async (ticketData) => {
    const currentDateTime = new Date().toLocaleString();
    const ticket = {
      ...ticketData,
      purchase_datetime: currentDateTime,
    };
    return await TicketModel.create(ticket);
  };

  getTickets = async (limit) => {
    if (limit) {
      const tickets = await TicketModel.find();
      return tickets.slice(0, limit);
    } else {
      return TicketModel.find();
    }
  };

  getTicketById = async (id) => {
    return await TicketModel.findOne(id);
  };

  updateTicketById = async (id, updatedTicket) => {
    return await TicketModel.findByIdAndUpdate(id, updatedTicket);
  };

  deleteTicket = async (id) => {
    return await TicketModel.findByIdAndDelete(id);
  };
}
