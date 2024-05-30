import traps from "@dnlup/fastify-traps";

export default async function plugin(fastify: any, opts: any) {
	const { log } = fastify;

	fastify.register(traps, {
		strict: false,
		onSignal(signal: any) {
			log.debug(`Received signal ${signal}`);
		},
		onClose() {
			log.info("Server closed");
		},
		onTimeout(timeout: any) {
			log.error(`Forcing close after ${timeout} ms`);
		},
		onError(error: { message: any }) {
			log.error(`shutting down error: ${error.message}`);
		},
	});
}
