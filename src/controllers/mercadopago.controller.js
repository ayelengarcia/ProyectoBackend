import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken:
    "APP_USR-3483111838087991-122901-b314f1a270df6f6bcda0765a651895a3-1472955514",
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
        success: "https://www.linkedin.com/in/ayelen-garc%C3%ADa-595457232/",
        failure: "https://www.linkedin.com/in/ayelen-garc%C3%ADa-595457232/",
        pending: "https://www.linkedin.com/in/ayelen-garc%C3%ADa-595457232/",
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
