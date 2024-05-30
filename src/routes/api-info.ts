import { FastifyInstance } from "fastify";

export async function apiInfo(fastify: FastifyInstance, opts: any) {
  fastify.get("/info", (request, reply) => {
    return "NodeJS app utilizes Fastify Bearer";
  });
}
