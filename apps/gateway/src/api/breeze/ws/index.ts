import type { Server } from "node:http";
import type { HubManager } from "../../../hub";
import type { GatewayEnv } from "../../../lib/env";
import { createBreezeWsHandler as createSessionHandler } from "./session";

export function createBreezeWsHandler(hubManager: HubManager, env: GatewayEnv) {
	return createSessionHandler(hubManager, env);
}

export function setupBreezeWebSocket(server: Server, hubManager: HubManager, env: GatewayEnv) {
	const { handleUpgrade, wss } = createSessionHandler(hubManager, env);
	server.on("upgrade", async (req, socket, head) => {
		const handled = await handleUpgrade(req, socket, head);
		if (!handled) {
			socket.destroy();
		}
	});
	return wss;
}
