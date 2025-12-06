// utils/generateToken.js
import jwt from "jsonwebtoken";

export default function generateToken(id, role) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
}
