import Stripe from "stripe";
import config from "../config/config.js";
import { ticketService, cartService } from "./index.js";
import { sent_success } from "../controllers/mailing.controller.js";

export default class PaymentRepository {
  constructor() {
    this.stripe = new Stripe(config.secretKeyStripe);
  }

  createCheckoutSession = async (items, cid) => {
    const lineItems = items
      .filter((item) => item.pid.stock > 0)
      .map((item) => ({
        price_data: {
          product_data: {
            name: item.pid.title,
          },
          currency: "usd",
          unit_amount: item.pid.price,
        },
        quantity: item.quantity,
      }));

    const session = await this.stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `https://proyectobackend-production-a5d4.up.railway.app/api/payments/success/${cid}`,
      cancel_url: `https://proyectobackend-production-a5d4.up.railway.app/api/payments/cancel/${cid}`,
    });

    return session;
  };

  paymentSuccess = async (cid, email) => {
    const cart = await cartService.getCartById(cid);
    const purchaseData = await cartService.finishPurchase(cart);

    if (purchaseData && purchaseData.amountTotalBuy !== undefined) {
      const amountTotalBuy = purchaseData.amountTotalBuy;
      const buyProducts = purchaseData.buyProducts;

      const products = buyProducts.map((product) => ({
        pid: {
          title: product.pid.title,
          price: product.pid.price,
        },
        quantity: product.quantity,
      }));

      const ticketData = {
        amount: amountTotalBuy,
        purchaser: email,
        products: products,
      };

      const newTicket = await ticketService.createTicket(ticketData);
      console.log(newTicket);

      await sent_success(email, amountTotalBuy, products, newTicket);

      return newTicket;
    } else {
      throw new Error("Error al finalizar la compra");
    }
  };

  paymentCancel = async () => {};
}
