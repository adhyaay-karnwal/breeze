/**
 * Breeze HTTP Routes
 *
 * Mounts all breeze HTTP endpoints under /breeze
 */

import { Router, type Router as RouterType } from "express";
import type { HubManager } from "../../../hub";
import type { GatewayEnv } from "../../../lib/env";
import { createRequireAuth } from "../../../server/middleware/auth";
import { createEnsureSessionReady } from "../../../server/middleware/session";
import { createDaemonHttpRouter } from "./daemon";
import { createActionsRouter } from "./session/actions";
import { createSessionControlRouter } from "./session/control";
import { createSessionManagerRouter } from "./session/manager";
import { createSessionMediaRouter } from "./session/media";
import { createSessionRuntimeRouter } from "./session/runtime";
import { createSourceRouter } from "./session/source";
import { createToolsRouter } from "./session/tools";
import { createSessionsRouter } from "./sessions";

export function createBreezeHttpRoutes(hubManager: HubManager, env: GatewayEnv): RouterType {
	const router: RouterType = Router();
	const requireAuth = createRequireAuth(env);
	const ensureSessionReady = createEnsureSessionReady(hubManager);

	// Endpoint class: auth-only
	router.use(requireAuth);

	// Domain: daemon HTTP bridge (auth + runtime-ready)
	router.use(createDaemonHttpRouter(hubManager, env));

	// Domain: sessions (auth-only)
	router.use("/sessions", createSessionsRouter(env, hubManager));

	// Domain: session media (auth-only)
	router.use(createSessionMediaRouter(env));

	// Endpoint class: auth + session-exists (no runtime required)
	router.use("/:breezeSessionId", createSessionControlRouter(hubManager));
	router.use("/:breezeSessionId/actions", createActionsRouter(hubManager));
	router.use("/:breezeSessionId/manager", createSessionManagerRouter(hubManager));
	router.use("/:breezeSessionId/source", createSourceRouter());
	router.use("/:breezeSessionId/tools", createToolsRouter(env, hubManager));

	// Endpoint class: auth + runtime-ready
	router.use("/:breezeSessionId", ensureSessionReady, createSessionRuntimeRouter());

	return router;
}
