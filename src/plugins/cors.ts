import cors, { FastifyCorsOptions } from "@fastify/cors";
import { FastifyInstance } from "fastify";

export default async function plugin(
  fastify: FastifyInstance,
  opts: FastifyCorsOptions
) {
  // allow all origins (specify origins for prod)
  const corsOptions = {
    origin: true,
    credentials: true,
  };
  fastify.register(cors, corsOptions);
}
