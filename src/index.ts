import Server from "./app";

(async () => {
  try {
    const server = new Server({});
    await server.start();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
