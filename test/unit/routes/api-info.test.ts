import { it, describe } from "node:test";
import assert from "node:assert/strict";

import sinon from "sinon";
import { apiInfo } from "../../../src/routes/api-info";

describe("API Info", () => {
  it("should return info about the NodeJS app utilizes Fastify Bearer", async () => {
    // Mock Fastify instance and options
    const fastify: any = {
      get: sinon.stub().callsFake((route: string, handler: any) => {
        // Simulate handling GET request
        handler(null, { send: (message: string) => message });
      }),
    };
    const opts = {};

    // Call the apiInfo function
    await apiInfo(fastify, opts);

    // Assert that the route handler returns the expected message
    assert(fastify.get.calledOnce);
    assert(fastify.get.args[0][0], "/info");
    const handler = fastify.get.args[0][1];
    const reply = handler(null, { send: (message: string) => message });
    assert.equal(reply, "NodeJS app utilizes Fastify Bearer");
  });
});
