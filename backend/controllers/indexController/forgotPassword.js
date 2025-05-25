const userModel = require("../../models/user");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// Mailer setup (Mailtrap or real SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.mailtrap.io",
  port: process.env.SMTP_PORT ?? 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD
  }
});

const requestForgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "Email not found" });
  }

  // Generate reset token and expiration
  const token = crypto.randomBytes(32).toString("hex");
  const tokenExpiration = Date.now() + 3600000; // 1 hour

  user.resetToken = token;
  user.resetTokenExpiration = tokenExpiration;
  await user.save();

  const resetLink = `http://localhost:5173/reset-password/${token}`;

  const mailOptions = {
    from: 'no-reply@profitview.com',
    to: user.email,
    subject: 'Reset your password',
    html: `<p>You requested a password reset.</p>
           <p>Click this <a href="${resetLink}">Link</a> to reset your password.</p>
           <p>This link is valid for 1 hour.</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ status: "success" , message: "Password reset email sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status : "success" , message: "Email sending failed" });
  }
};

const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const token = req.params.token;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required" });
  }

  try {
    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    return res.status(200).json({ status: "success", message: "Password has been reset" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "fail", message: "Something went wrong" });
  }
};

module.exports = {
  requestForgotPassword,
  resetPassword
};
