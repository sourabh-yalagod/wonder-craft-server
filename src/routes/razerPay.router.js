import { Router } from "express";
import { createOrders, verifyPayments } from "../controllers/payments/razerPay.js";
const router = Router();

router.route("/orders").post(createOrders);
router.route("/verify").post(verifyPayments);

export default router;
