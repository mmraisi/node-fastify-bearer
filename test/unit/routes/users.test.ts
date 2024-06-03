import { it, describe } from "node:test";
import assert from "node:assert/strict";

import sinon from "sinon";
import { users } from "../../../src/routes/users";

describe("API /users", () => {
  it("should return users", async () => {
    // Mock Fastify instance and options
    const fastify: any = {
      get: sinon.stub().callsFake((route: string, handler: any) => {
        // Simulate handling GET request
        handler(null, { send: (message: string) => message });
      }),
    };
    const opts = {};

    // Call the users function
    await users(fastify, opts);

    // Assert that the route handler returns the expected message
    assert(fastify.get.calledOnce);
    assert(fastify.get.args[0][0], "/users");
    const handler = fastify.get.args[0][1];
    const reply = handler(null, { send: (message: string) => message });
    assert(
      reply,
      JSON.stringify([
        { user_id: 1, name: "John", email: "john@example.com" },
        { user_id: 2, name: "Sarah", email: "sarah@example.com" },
        { user_id: 3, name: "Mark", email: "mark@example.com" },
      ])
    );
  });
});
