import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const verifyToken = (req, res, next) => {
  const cookieToken = req.cookies.accessToken;
  const authHeader = req.headers.authorization || "";
  const headerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const token = cookieToken || headerToken;
  if (!token) {
    return next(createError(401, "Unauthorized Please Login"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return next(createError(403, "Invalid or Expired Token"));
    }
    req.userId = payload.id;
    req.isSeller = payload.isSeller;
    next();
  });
};
