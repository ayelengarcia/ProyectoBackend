import { Router } from "express";
import {
  createTicket,
  getTicketById,
  getTickets,
  updateTicketById,
  deleteTicket,
} from "../controllers/tickets.controller.js";

const router = Router();

router.post("/tickets", createTicket);

router.get("/tickets", getTickets);

router.get("/tickets/:id", getTicketById);

router.put("/tickets/:id", updateTicketById);

router.delete("/tickets/:id", deleteTicket);

export default router;
