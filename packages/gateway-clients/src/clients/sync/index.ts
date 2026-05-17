/**
 * SyncClient
 *
 * Real-time client for WebSocket + HTTP communication with the gateway.
 * Used by web UI and other real-time consumers.
 */

import type { ClientSource } from "@breeze/shared";
import type { GatewayAuth, TokenGetter } from "../../auth";
import { createTokenGetter } from "../../auth";
import { createVerificationTools } from "../../capabilities/tools";
import type { Client, ClientTools } from "../../client";
import type {
	ConnectionOptions,
	CreateSessionRequest,
	CreateSessionResponse,
	HealthCheckResult,
	HttpClient,
	PostMessageOptions,
	SandboxInfo,
	SessionStatusResponse,
} from "../../types";
import {
	checkHealth,
	createHttpClient,
	createSession,
	eagerStart,
	getInfo,
	getSessionStatus,
	postCancel,
	postMessage,
} from "./http";
import { type SyncWebSocket, SyncWebSocketImpl, type WebSocketOptions } from "./websocket";

/**
 * Options for creating a SyncClient
 */
export interface SyncClientOptions {
	/** Base URL of the gateway (e.g., "https://gateway.example.com") */
	baseUrl: string;
	/** Auth configuration - either service auth (JWT signing) or user token */
	auth: GatewayAuth;
	/** Source of messages from this client (used for filtering in receivers) */
	source?: ClientSource;
}

/**
 * SyncClient interface - real-time WebSocket + HTTP client
 */
export interface SyncClient extends Client {
	readonly type: "sync";

	/**
	 * Create a new session via the gateway
	 */
	createSession(
		request: CreateSessionRequest,
		options?: { idempotencyKey?: string },
	): Promise<CreateSessionResponse>;

	/**
	 * Connect to a session via WebSocket
	 */
	connect(breezeSessionId: string, options: WebSocketOptions): SyncWebSocket;

	/**
	 * Post a message to a session via HTTP
	 */
	postMessage(breezeSessionId: string, options: PostMessageOptions): Promise<void>;

	/**
	 * Cancel the current operation via HTTP
	 */
	postCancel(breezeSessionId: string, userId?: string): Promise<void>;

	/**
	 * Get session/sandbox info via HTTP
	 */
	getInfo(breezeSessionId: string): Promise<SandboxInfo>;

	/**
	 * Get session status via HTTP
	 */
	getSessionStatus(
		breezeSessionId: string,
		organizationId?: string,
	): Promise<SessionStatusResponse>;

	/**
	 * Trigger eager session start (boot sandbox + send initial prompt)
	 */
	eagerStart(breezeSessionId: string): Promise<void>;
}

/**
 * Internal implementation of SyncClient
 */
class SyncClientImpl implements SyncClient {
	readonly type = "sync" as const;
	readonly tools: ClientTools;

	private baseUrl: string;
	private getToken: TokenGetter;
	private source?: ClientSource;
	private http: HttpClient;

	constructor(options: SyncClientOptions) {
		this.baseUrl = options.baseUrl.replace(/\/$/, "");
		this.getToken = createTokenGetter(options.auth);
		this.source = options.source;
		this.http = createHttpClient(this.baseUrl, this.getToken);

		// Attach capabilities
		this.tools = {
			verification: createVerificationTools(this.http),
		};
	}

	async createSession(
		request: CreateSessionRequest,
		options?: { idempotencyKey?: string },
	): Promise<CreateSessionResponse> {
		return createSession(this.http, request, options);
	}

	connect(breezeSessionId: string, options: WebSocketOptions): SyncWebSocket {
		return new SyncWebSocketImpl(this.baseUrl, breezeSessionId, this.getToken, options);
	}

	async postMessage(breezeSessionId: string, options: PostMessageOptions): Promise<void> {
		return postMessage(this.http, breezeSessionId, options, this.source);
	}

	async postCancel(breezeSessionId: string, userId?: string): Promise<void> {
		return postCancel(this.http, breezeSessionId, userId);
	}

	async getInfo(breezeSessionId: string): Promise<SandboxInfo> {
		return getInfo(this.http, breezeSessionId);
	}

	async getSessionStatus(
		breezeSessionId: string,
		organizationId?: string,
	): Promise<SessionStatusResponse> {
		return getSessionStatus(this.http, breezeSessionId, organizationId);
	}

	async eagerStart(breezeSessionId: string): Promise<void> {
		return eagerStart(this.http, breezeSessionId);
	}

	async checkHealth(): Promise<HealthCheckResult> {
		return checkHealth(this.http);
	}
}

/**
 * Create a SyncClient instance
 */
export function createSyncClient(options: SyncClientOptions): SyncClient {
	return new SyncClientImpl(options);
}

// Re-export types
export type { WebSocketOptions, SyncWebSocket, ConnectionOptions };
