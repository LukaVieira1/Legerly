import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const envs = {
  JWT_SECRET: process.env.JWT_SECRET || "secret123",
  PORT: process.env.PORT || 5050,
} as const;

export const prisma = new PrismaClient();

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcryptjs.compare(password, hashedPassword);
  } catch (error) {
    return false;
  }
};

interface TokenPayload {
  storeId: number;
  id: number;
  role: string;
  [key: string]: any;
}

export const createAccessToken = async (
  data: TokenPayload
): Promise<string | null> => {
  try {
    return jwt.sign(data, envs.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const verifyToken = async (
  token: string | undefined
): Promise<TokenPayload> => {
  if (!token) {
    throw new Error("Token not provided");
  }

  try {
    const decoded = jwt.verify(token, envs.JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
