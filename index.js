const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Email API running with Resend");
});

app.post("/send-email", async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to,
        subject,
        text,
        html,
      }),
    });

    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
