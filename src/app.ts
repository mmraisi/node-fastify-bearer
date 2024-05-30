import dotenv from "dotenv";
dotenv.config();

import fastify, { FastifyInstance } from "fastify";
import { join } from "node:path";
import autoload from "@fastify/autoload";
import { errorHandler } from "./lib/error-handler";
import { handler } from "./routes";

const PORT = process.env.PORT ?? 8080;

export let server: FastifyInstance;

export default class Server {
  fastifyInstance: FastifyInstance;

  constructor(private opts: any) {
    // fastify default options
    const defaultOptions = {
      routing: {
        publicRoutes: [],
      },
      db: {},
      logger: {},
      server: {
        keepAliveTimeout: 5000,
        mode: "api",
        ignoreTrailingSlash: false,
      },
      development: {
        security: true,
      },
      featureFlags: {},
    };

    this.opts = {
      routing: {
        ...defaultOptions.routing,
        ...(opts.routing || {}),
      },
      db: {
        ...defaultOptions.db,
        ...(opts.db || {}),
      },
      logger: {
        ...defaultOptions.logger,
        ...(opts.logger || {}),
      },
      server: {
        ...defaultOptions.server,
        ...(opts.server || {}),
      },
      development: {
        ...defaultOptions.development,
        ...(opts.development || {}),
      },
      featureFlags: {
        ...defaultOptions.featureFlags,
        ...(opts.featureFlags || {}),
      },
    };

    this.fastifyInstance = fastify({
      ...this.opts,
    }) as any;

    // add plugins
    this.fastifyInstance.register(autoload, {
      dir: join(__dirname, "plugins"),
      encapsulate: false,
      options: this.opts,
    });
    this.fastifyInstance.setErrorHandler(errorHandler);

    // Register routes
    Object.values(handler).forEach((value) => {
      this.fastifyInstance.register(value);
    });
  }

  async start() {
    const instance = this.fastifyInstance;
    try {
      await instance.listen({
        port: PORT as number,
        host: "0.0.0.0",
      });
      console.log("app is listening on port:", PORT);
      return instance;
    } catch (error) {
      instance.log.error(error);
      process.exit(1);
    }
  }
}
