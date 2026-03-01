const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("🚀 Email API is running");
});

// Send email endpoint
app.post("/send-email", async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Email API" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    res.json({ success: true, message: "Email sent successfully ✅" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
