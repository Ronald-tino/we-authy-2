import jwt from "jsonwebtoken"
import createError from "../utils/createError.js";

export  const verifyToken= (req,res,next) =>{
  const token = req.cookies.accessToken;
  if (!token) {
    return next(createError(401,"Unauthorized Please Login"))
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
  if (!token) {
    return  next(createError(403,"Unauthorized Token"))}
   req.userId = payload.id
   req.isSeller = payload.isSeller
   next()
  }); 

}