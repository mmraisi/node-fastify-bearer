import bearerAuthPlugin, {
  FastifyBearerAuthOptions,
} from "@fastify/bearer-auth";
import { FastifyInstance } from "fastify";

export default async function plugin(
  fastify: FastifyInstance,
  opts: FastifyBearerAuthOptions
) {
  const tokens = process.env.SECRET_TOKENS?.split(",") ?? [];

  const bearerOpts: FastifyBearerAuthOptions = {
    keys: new Set(tokens),
    auth: undefined,
    verifyErrorLogLevel: "debug",
  };
  fastify.register(bearerAuthPlugin, bearerOpts);
}
