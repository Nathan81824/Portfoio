import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

const PORT = 5000;


/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(
  express.json()
);


/* =========================================================
   EMAIL CONFIGURATION
========================================================= */

const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },

  });


/* =========================================================
   TEST EMAIL CONNECTION
========================================================= */

transporter.verify(
  (error, success) => {

    if (error) {

      console.error(
        "❌ Email configuration error:"
      );

      console.error(error);

    } else {

      console.log(
        "✅ Email server is ready."
      );

    }

  }
);


/* =========================================================
   CONTACT API
========================================================= */

app.post(
  "/api/contact",
  async (req, res) => {

    try {

      const {
        name,
        email,
        message,
        recipient,
      } = req.body;


      /* ===================================================
         VALIDATION
      =================================================== */

      if (!name) {

        return res.status(400).json({
          success: false,
          message: "Name is required.",
        });

      }


      if (!email) {

        return res.status(400).json({
          success: false,
          message: "Email is required.",
        });

      }


      if (!message) {

        return res.status(400).json({
          success: false,
          message: "Message is required.",
        });

      }


      if (!recipient) {

        return res.status(400).json({
          success: false,
          message: "Recipient email is missing.",
        });

      }


      /* ===================================================
         EMAIL
      =================================================== */

      const mailOptions = {

        from: process.env.EMAIL_USER,

        to: recipient,

        replyTo: email,

        subject:
          `New portfolio message from ${name}`,

        text:
`You received a new message from your portfolio.

Name:
${name}

Email:
${email}

Message:
${message}
`,

        html:
`
<!DOCTYPE html>

<html>

<body
  style="
    margin:0;
    padding:30px;
    background:#090909;
    color:#ffffff;
    font-family:Arial,sans-serif;
  "
>

  <div
    style="
      max-width:600px;
      margin:auto;
      padding:30px;
      background:#151515;
      border:1px solid #292929;
      border-radius:16px;
    "
  >

    <h2
      style="
        margin-top:0;
        color:#ff9f00;
      "
    >
      New Portfolio Message
    </h2>

    <p>
      You received a new message from your portfolio.
    </p>

    <hr
      style="
        border:none;
        border-top:1px solid #292929;
        margin:24px 0;
      "
    />

    <p>
      <strong>Name:</strong>
      ${escapeHtml(name)}
    </p>

    <p>
      <strong>Email:</strong>
      ${escapeHtml(email)}
    </p>

    <p>
      <strong>Message:</strong>
    </p>

    <p
      style="
        white-space:pre-wrap;
        color:#cccccc;
        line-height:1.7;
      "
    >
      ${escapeHtml(message)}
    </p>

  </div>

</body>

</html>
`,

      };


      /* ===================================================
         SEND
      =================================================== */

      await transporter.sendMail(
        mailOptions
      );


      /* ===================================================
         SUCCESS
      =================================================== */

      console.log(
        `✅ Message from ${name} sent successfully.`
      );


      return res.status(200).json({

        success: true,

        message:
          "Message sent successfully.",

      });


    } catch (error) {

      /* ===================================================
         SERVER ERROR
      =================================================== */

      console.error(
        "❌ Contact API error:"
      );

      console.error(error);


      return res.status(500).json({

        success: false,

        message:
          error?.message ||
          "Unable to send message right now.",

      });

    }

  }
);


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(value) {

  return String(value)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   TEST ROUTE
========================================================= */

app.get(
  "/",
  (req, res) => {

    res.json({

      success: true,

      message:
        "Portfolio email server is running.",

    });

  }
);


/* =========================================================
   START SERVER
========================================================= */

app.listen(
  PORT,
  () => {

    console.log(
      `🚀 Email server running on http://localhost:${PORT}`
    );

  }
);