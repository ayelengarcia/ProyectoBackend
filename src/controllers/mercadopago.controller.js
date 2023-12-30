import { MercadoPagoConfig, Preference } from "mercadopago";
import config from "../config/config.js";

const client = new MercadoPagoConfig({
  accessToken: config.access_token_nave,
});

export const createPreferenceMp = async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.price),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: "https://navefundacion.com.ar/",
        failure: "https://navefundacion.com.ar/",
        pending: "https://navefundacion.com.ar/",
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });
    res.json({
      id: result.id,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ e: "Error al crear la preferencia" });
  }
};
