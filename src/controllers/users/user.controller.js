import { asycnHandler } from "../../utilities/asyncHandler.js";
import { connectDB } from "../../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const createUser = asycnHandler(async (req, res) => {
  try {
    const { Username, Email, Password } = req.body;
    if (!Username || !Email || !Password) {
      return res.status(400).json({
        message: "All the Fields are required for Accout Creation . . . !",
        success: false,
      });
    }
    const db = await connectDB();
    const hashedPassword = await bcrypt.hash(Password, 10);
    console.log(hashedPassword);

    const newUser = await db.query(
      `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;`,
      [Username, Email, hashedPassword]
    );
    if (newUser.rowCount == 0) {
      return res.status(400).json({
        message: "New User created",
        success: false,
      });
    }
    return res.json({ user: newUser });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      message: "Internal server Error . . !",
      success: false,
      error,
    });
  }
});

const signInUser = asycnHandler(async (req, res) => {
  const { Username, Password } = req.body;
  console.log({ Username, Password });

  if (!Username || !Password) {
    return res.status(400).json({
      message: "Username and Password is required . . . . !",
      success: false,
    });
  }
  const db = await connectDB();
  const user = await db.query(`select * from users where username=$1`, [
    Username,
  ]);

  if (!user?.rows[0]) {
    return res
      .status(400)
      .json({ message: "user not found please create a new account . . . !" });
  }
  console.log(user?.rows[0]);

  const passwordCheck = await bcrypt.compare(Password, user?.rows[0].password);
  if (!passwordCheck) {
    return res.status(400).json({ message: "invalid password . . . !" });
  }

  const token = jwt.sign(
    {
      id: user?.rows[0]._id,
      username: user?.rows[0].username,
    },
    process.env.JWT_SECRETE,
    { expiresIn: process.env.TOKEN_EXPIRY }
  );
  const option = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  };
  if (!token) {
    return res.status(400).json({
      message: "Authentication Token generation failed . . . . !",
      success: false,
    });
  }
  return res
    .cookie("token", token, option)
    .json({ user: user?.rows[0], token });
});

const userAssets = asycnHandler(async (req, res) => {
  const db = await connectDB();
  const user = req.user;
  if (!user) {
    return res.status(400).json({
      message: "user not authenticated . . . !",
      success: false,
    });
  }
  const userAssets = await db.query(`select * from assets where user_id=$1`, [
    user.id,
  ]);
  return res.json({
    assets: userAssets?.rows,
  });
});

const emailservice = asycnHandler(async (req, res) => {
  const { email, name, message } = req.body;
  console.log({ email, name, message });

  if (!email || !name || !message) {
    return res.json({
      message: "all the fields are required.....!",
      success: false,
    });
  }
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD,
    },
  });
  const mailPayload = {
    from: email,
    to: process.env.USER,
    subject: "New message from your portfolio website",
    text: `Message from ${name} (${email}): ${message}`,
    html: `
  <div style="
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  ">
    <!-- Header Section -->
    <div style="
      background-color: #4A90E2;
      color: #ffffff;
      text-align: center;
      padding: 20px 10px;
    ">
      <h1 style="margin: 0; font-size: 24px;">Welcome to Wonder Craft!</h1>
    </div>

    <!-- Body Content -->
    <div style="padding: 20px;">
      <p style="font-size: 16px; line-height: 1.6; color: #333333;">
        Hello <strong>${name}</strong>,
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #555555;">
        We’re excited to have you onboard at <strong>Wonder Craft</strong>, your go-to platform for creativity and innovation.
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #555555;">
        Explore our platform, connect with fellow creators, and take your ideas to the next level!
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href=${process.env.CORS_URL}" 
          style="
            text-decoration: none;
            padding: 10px 20px;
            background-color: #4A90E2;
            color: #ffffff;
            font-weight: bold;
            border-radius: 5px;
            font-size: 16px;
            display: inline-block;
          ">
          Get Started
        </a>
      </div>

      <!-- Thank You Note -->
      <p style="font-size: 16px; line-height: 1.6; color: #555555;">
        If you have any questions, feel free to reach out to us at 
        <a href="mailto:${
          process.env.USER
        }" style="color: #4A90E2; text-decoration: none;">
          ${process.env.USER}
        </a>.
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #555555;">
        Best Regards, <br />
        <strong>The Wonder Craft Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="
      background-color: #f4f4f4;
      text-align: center;
      padding: 10px 20px;
      color: #777777;
      font-size: 14px;
    ">
      <p style="margin: 0;">
        © ${new Date().getFullYear()} Wonder Craft. All Rights Reserved.
      </p>
    </div>
  </div>
  `,
  };
  transport.sendMail(mailPayload, (error, info) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to send email.",
        error: error.message,
      });
    }
    return res.status(201).json({
      success: true,
      message: "Email sent successfully!",
      info,
    });
  });
});

const subscription = asycnHandler(async (req, res) => {
  const userId = req?.user?.id;
  console.log("userId : ", userId);

  if (!userId) {
    return res.json({
      message: "userId not Found . . .!",
      success: false,
    });
  }
  const db = await connectDB();
  const current = Date.now();
  const nextMonth = new Date(current).setMonth(
    new Date(current).getMonth() + 1
  );
  const subscription = await db.query(
    "UPDATE users SET subscription = $2 WHERE _id = $1 RETURNING *",
    [userId, nextMonth]
  );
  if (!subscription.rows[0]) {
    return res.json({
      message: "user subscription failed",
      success: false,
    });
  }
  return res.json({
    message: "user subscribed successfully.",
    success: true,
    description:'',
    user: subscription.rows[0],
  });
});

export { createUser, signInUser, userAssets, emailservice, subscription };
