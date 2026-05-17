/**
 * Sandbox-MCP environment adapter.
 *
 * This package runs inside sandboxes with sandbox-specific env vars
 * that are NOT part of the main @breeze/environment schema.
 * This module centralizes all process.env reads for the sandbox context.
 */
export const sandboxEnv = {
	authToken: process.env.SANDBOX_MCP_AUTH_TOKEN || process.env.SERVICE_TO_SERVICE_AUTH_TOKEN,
	baseUrl: process.env.BREEZE_SANDBOX_MCP_URL || "http://127.0.0.1:4000",
	workspaceDir: process.env.WORKSPACE_DIR ?? "/home/user/workspace",
	gatewayUrl: process.env.BREEZE_GATEWAY_URL,
	sessionId: process.env.BREEZE_SESSION_ID,
} as const;
