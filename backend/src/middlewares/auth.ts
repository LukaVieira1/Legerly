import { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../helpers/utils";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.status(401).send({ message: "Token not provided" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = await verifyToken(token);
    request.user = decoded;
  } catch (error) {
    return reply.status(401).send({ message: "Invalid token" });
  }
}
