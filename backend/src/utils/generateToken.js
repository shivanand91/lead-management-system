import jwt from "jsonwebtoken";
import Token from "../models/token.model.js";

const generateToken = async (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });

  await Token.create({
    userId,
    token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  return token;
};

export default generateToken;
