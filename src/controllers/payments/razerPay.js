import { asycnHandler } from "../../utilities/asyncHandler.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZERPAY_KEYID,
  key_secret: process.env.RAZERPAY_KEY_SECRETE,
});

const createOrders = asycnHandler(async (req, res) => {
  console.log(req.body.amount);
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: "receipt#1",
    };
    const order = await razorpayInstance.orders.create(options);
    console.log(order);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

const verifyPayments = asycnHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  console.log(req.body);

  const hmac = crypto.createHmac("sha256", process.env.RAZERPAY_KEY_SECRETE);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});
export { createOrders, verifyPayments };
