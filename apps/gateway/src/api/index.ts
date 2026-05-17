/**
 * API Routes
 *
 * Mounts all routes on the Express app.
 */

import type { Server } from "node:http";
import type { Express } from "express";
import type { HubManager } from "../hub";
import type { GatewayEnv } from "../lib/env";
import { createBreezeHttpRoutes } from "./breeze/http";
import { createBreezeWsHandler } from "./breeze/ws";
import { createTerminalWsProxy } from "./breeze/ws/devtools/terminal";
import { createVscodeWsProxy } from "./breeze/ws/devtools/vscode";
import healthRouter from "./health";
import { createGatewayProxyRoutes } from "./proxy";
import { WsMultiplexer } from "./ws-multiplexer";

export function mountRoutes(app: Express, hubManager: HubManager, env: GatewayEnv): void {
	// Health check
	app.use(healthRouter);

	// Daemon proxy routes MUST be mounted before breeze HTTP routes.
	// Daemon routes now live under breeze/http/daemon and are mounted by createBreezeHttpRoutes.
	app.use("/breeze", createBreezeHttpRoutes(hubManager, env));

	// Proxy domains
	app.use("/proxy", createGatewayProxyRoutes(hubManager, env));
}

export function setupWebSocket(server: Server, hubManager: HubManager, env: GatewayEnv): void {
	const mux = new WsMultiplexer();

	// Session WS domain
	const breezeWs = createBreezeWsHandler(hubManager, env);
	mux.addHandler(breezeWs.handleUpgrade);

	// Devtools WS domains
	const terminalWs = createTerminalWsProxy(hubManager, env);
	mux.addHandler(terminalWs.handleUpgrade);

	const vscodeWs = createVscodeWsProxy(hubManager, env);
	mux.addHandler(vscodeWs.handleUpgrade);

	mux.attach(server);
}
