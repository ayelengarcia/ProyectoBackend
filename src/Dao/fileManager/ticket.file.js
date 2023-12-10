import FileManager from "./managers/FileManager.js";

export default class Ticket extends FileManager {
  constructor(filename = "./ddbb/tickets.json") {
    super(filename);
  }

  createTicket = async (ticketData) => {
    const ticketsAll = await this.getObjects();
    const currentDateTime = new Date();
    const newIndex = ticketsAll.length;

    if (!ticketData.amount || !ticketData.purchaser) {
      return res.status(400).send("Error falta info.");
    }

    const newTicket = {
      id: newIndex + 1,
      code: this.generarCode(newIndex),
      purchase_datetime: currentDateTime,
      ...ticketData,
    };

    const idExiste = ticketsAll.some((ticket) => ticket.id === newTicket.id);
    if (idExiste) newTicket.id = +(newTicket.id + "0");

    ticketsAll.push(newTicket);
    await this.writeObjects(ticketsAll);
    return newTicket;
  };

  getTickets = async (limit) => {
    if (limit) {
      const tickets = await this.getObjects();
      return tickets.slice(0, limit);
    } else {
      return this.getObjects();
    }
  };

  getTicketById = async (id) => {
    const ticketsAll = await this.getObjects();
    const ticket = ticketsAll.find((ticket) => ticket.id === id);
    if (!ticket) throw new Error("No se encuentra.");
    return ticket;
  };

  updateTicketById = async (id, updateTicket) => {
    return await this.updateTicketById(id, updateTicket);
  };

  deleteTicket = async (id) => {
    return await this.deleteTicket(id);
  };
}
