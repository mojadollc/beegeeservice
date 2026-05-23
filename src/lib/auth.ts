import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "fallback-secret";

export function signToken(username: string) {
  return jwt.sign({ username }, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}
