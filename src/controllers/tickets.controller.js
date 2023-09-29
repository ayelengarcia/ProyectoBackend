import { ticketService } from "../services/index.js";

export const createTicket = async (req, res) => {
  try {
    if (req.user) {
      const { email } = req.user.user;
      const ticketData = {
        amount: req.body.amount,
        purchaser: email,
      };

      const ticketCreate = await ticketService.createTicket(ticketData);
      res.send({ status: "success", payload: ticketCreate });
    } else {
      const ticketData = {
        amount: req.body.amount,
        purchaser: req.body.purchaser,
      };

      const ticketCreate = await ticketService.createTicket(ticketData);
      res.send({ status: "success", payload: ticketCreate });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Error al crear ticket");
  }
};

export const getTickets = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const result = await ticketService.getTickets(limit);

    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ticket" });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const id = req.params.pid;
    const ticket = await ticketService.getTicketById(id);

    res.send({ message: "Ticket encontrado", payload: ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el ticket" });
  }
};

export const updateTicketById = async (req, res) => {
  const ticketId = req.params.id;
  const { purchase_datetime, amount, purchaser } = req.body;
  const updatedTicket = {
    purchase_datetime,
    amount,
    purchaser,
  };

  try {
    const result = await ticketService.updateTicketById(
      ticketId,
      updatedTicket
    );

    res.send({ status: "Ticket actualizado", payload: result });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar ticket" });
  }
};

export const deleteTicket = async (req, res) => {
  const ticketId = req.params.id;
  try {
    const result = await ticketService.deleteTicket(ticketId);

    if (result) {
      res.send({ status: "Ticket eliminado exitosamente", payload: result });
    } else {
      res.send({ status: "No se pudo eliminar ticket" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar ticket" });
  }
};
