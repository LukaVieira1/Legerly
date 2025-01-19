import { FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
  export interface FastifyRequest {
    user?: {
      storeId: number;
      id: number;
      role: string;
    };
  }
}
