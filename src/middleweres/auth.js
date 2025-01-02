import { asycnHandler } from "../utilities/asyncHandler.js";
import jwt from "jsonwebtoken";
const { verify } = jwt;
export const validateAuth = asycnHandler(async (req, res, next) => {
  const token = req?.headers?.authorization || req.cookies.token;

  if (token) {
    const decodeToken = verify(token, process.env.JWT_SECRETE);
    const currentTime = Date.now();
    const expiryTime = decodeToken.exp * 1000;
    if (currentTime < expiryTime) {
      req.user = { id: decodeToken?.id, username: decodeToken?.username };
    } else {
      req.user = null;
    }
  }
  next();
});
