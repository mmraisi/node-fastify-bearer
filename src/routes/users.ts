import { FastifyInstance } from "fastify";

export async function users(fastify: FastifyInstance, opts: any) {
  fastify.get("/users", (request, reply) => {
    return [
      { user_id: 1, name: "John", email: "john@example.com" },
      { user_id: 2, name: "Sarah", email: "sarah@example.com" },
      { user_id: 3, name: "Mark", email: "mark@example.com" },
    ];
  });
}
