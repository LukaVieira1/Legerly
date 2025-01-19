import { FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
  export interface FastifyRequest {
    user?: {
      id: number;
      role: string;
    };
  }
}
