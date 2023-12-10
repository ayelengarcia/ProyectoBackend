import { ticketService } from "../services/index.js";
import config from "../config/config.js";
import { handleError } from "../utils.js";

export const createTicket = async (req, res) => {
  try {
    const ticketData = {
      amount: req.body.amount,
      purchaser: req.nonSensitiveUserInfo
        ? req.nonSensitiveUserInfo.email
        : req.body.purchaser,
    };

    const ticketCreate = await ticketService.createTicket(ticketData);
    res.send({ status: "success", payload: ticketCreate });
  } catch (e) {
    console.log(e);
    req.logger.error("No se pudo crear ticket");
    handleError(config.ticket_not_add, res);
  }
};

export const getTickets = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const result = await ticketService.getTickets(limit);

    res.send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error("Error al obtener tickets");
    handleError(config.ticket_not_found, res);
  }
};

export const getTicketById = async (req, res) => {
  try {
    const id = req.params.pid;
    const ticket = await ticketService.getTicketById(id);

    res.send({ message: "Ticket encontrado", payload: ticket });
  } catch (error) {
    console.error(error);
    req.logger.error("Error al obtener ticket por id");
    handleError(config.ticket_not_found, res);
  }
};

export const updateTicketById = async (req, res) => {
  const ticketId = req.params.id;
  const { purchase_datetime, amount, purchaser, products } = req.body;
  const updatedTicket = {
    purchase_datetime,
    amount,
    purchaser,
    products,
  };

  try {
    const result = await ticketService.updateTicketById(
      ticketId,
      updatedTicket
    );

    res.send({ status: "Ticket actualizado", payload: result });
  } catch (error) {
    req.logger.error("Error al actualizar ticket");
    handleError(config.ticket_not_update, res);
  }
};

export const deleteTicket = async (req, res) => {
  const ticketId = req.params.id;
  try {
    const result = await ticketService.deleteTicket(ticketId);

    if (result) {
      res.send({ status: "Ticket eliminado exitosamente", payload: result });
    } else {
      req.logger.warning("No se puso eliminar el ticket");
      res.send({ status: "No se pudo eliminar ticket" });
    }
  } catch (error) {
    req.logger.error("Error al eliminar ticket");
    handleError(config.ticket_not_delete, res);
  }
};
