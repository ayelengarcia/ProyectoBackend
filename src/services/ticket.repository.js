export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createTicket = async (data) => {
    return await this.dao.createTicket(data);
  };

  getTickets = async (limit) => {
    return await this.dao.getTickets(limit);
  };

  getTicketById = async (id) => {
    return await this.dao.getTicketById(id);
  };

  updateTicketById = async (id, updatedTicket) => {
    return await this.dao.updateTicketById(id, updatedTicket);
  };

  deleteTicket = async (id) => {
    return await this.dao.deleteTicket(id);
  };
}
