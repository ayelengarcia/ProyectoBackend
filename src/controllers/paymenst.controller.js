import { paymentService, cartService } from "../services/index.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartService.getCartById(cid);

    const session = await paymentService.createCheckoutSession(
      cart.products,
      cid
    );
    return res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la sesión de pago" });
  }
};

export const paymentSuccess = async (req, res) => {
  try {
    const cid = req.params.cid;
    const { email } = req.user.user;

    const newTicket = await paymentService.paymentSuccess(cid, email);
    console.log("ticket controller", newTicket);
    res.render("success", newTicket);
  } catch (error) {
    res.status(500).send("Error al procesar el pago");
  }
};

export const paymentCancel = async (req, res) => {
  res.send("cancel");
};
