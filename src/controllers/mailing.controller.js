import config from "../config/config.js";
import nodemailer from "nodemailer";
import twilio from "twilio";
import __dirname from "../utils.js";
import { generateTokenPass } from "../utils.js";

const client = twilio(config.twilio_sid, config.twilio_token);

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "ayelengarcia7@gmail.com",
    pass: "skglapnqwtgbonzi",
  },
});

export const sent_sms = async (req, res) => {
  try {
    const result = await client.messages.create({
      body: "REGISTRO EXITOSO. Tu usuario registrado es: ayelengarcia7@gmail.com",
      from: config.twilio_phone,
      to: "+541124979403",
    });

    console.log(result);
    res.send("Sms sent");
  } catch (error) {
    console.error(error);
    res.status(500).send("Sms send failed");
  }
};

export const sent_email = async (req, res) => {
  try {
    const userEmail = req.body.email;
    const token = generateTokenPass({ user: userEmail });
    const resetLink = `https://proyectobackend-production-a5d4.up.railway.app/resetPassConfirm?token=${token}`;

    const result = await transport.sendMail({
      from: "ayelengarcia7@gmail.com",
      to: userEmail,
      subject: "Restablecimiento de Contraseña",
      html: `
      <div>
        <h2>Restablecimiento de Contraseña</h2>
        <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>;
      </div>
      `,
    });

    console.log(result);
    res.render("resetPassOk", {});
  } catch (error) {
    console.error(error);
    res.status(500).send("Fallo al enviar el correo electrónico");
  }
};

export const sent_success = async (
  email,
  amountTotalBuy,
  products,
  newTicket
) => {
  try {
    const { code, purchase_datetime } = newTicket;
    const formattedPurchaseDate = new Date(purchase_datetime).toLocaleString();

    const result = await transport.sendMail({
      from: "ayelengarcia7@gmail.com",
      to: email,
      subject: "BIKININFA - Tu pedido",
      html: `
        <div>
          <h2>¡Gracias por tu compra!</h2>
          <h4>Resumen de compra:</h4>
          <p>Código de orden: ${code}</p>
          <p>Fecha de compra: ${formattedPurchaseDate}</p>
          <p>Productos:</p>
          <ul>
            ${products.map(
              (product) =>
                `<li>${product.quantity} ${product.pid.title} - ${product.pid.price} C/U </li>`
            )}
          </ul>
          <p>Total: $ ${amountTotalBuy}</p>

        </div>
      `,
    });

    console.log("Correo electrónico enviado:", result);
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
    throw new Error("Error al enviar el correo electrónico");
  }
};

export const sent_contacto = async (req, res) => {
  try {
    const nombre = req.body.nombre;
    const email = req.body.email;
    const telefono = req.body.telefono;
    const mensaje = req.body.mensaje;

    const result = await transport.sendMail({
      from: email,
      to: "ayelengarcia7@gmail.com",
      subject: "Mensaje de contacto",
      html: `
      <div>
        <h3>Mensaje de ${nombre}</h3>
        <p>Email: ${email}</p>
        <p>Telefono: ${telefono}</p>
        <p>Mensaje: ${mensaje}</p>
      </div>
      `,
    });

    console.log(result);
    res.render("contacto", {});
  } catch (error) {
    console.error(error);
    res.status(500).send("Fallo al enviar el correo electrónico");
  }
};

export const sent_contacto_nave = async (req, res) => {
  try {
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const email = req.body.email;
    const telefono = req.body.telefono;
    const mensaje = req.body.mensaje;

    const result = await transport.sendMail({
      from: email,
      to: "proyectonavecaba@gmail.com",
      subject: "Fundación Nave - Mensaje de contacto",
      html: `
      <div>
        <h3>Mensaje de ${nombre} ${apellido}</h3>
        <p><i>Nombre:</i> ${nombre} ${apellido}</p>
        <p><i>Email:</i> ${email}</p>
        <p><i>Telefono:</i> ${telefono}</p>
        <p><i>Mensaje:</i> <br> ${mensaje}</p>
      </div>
      `,
    });

    console.log(result);
    res.status(200).send("Mensaje enviado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Fallo al enviar el correo electrónico");
  }
};

// attachments: [
//   {
//     filename: "zorro.png",
//     path: `${__dirname}/public/img/zorro.png`,
//     cid: "img1",
//   },
// ],
