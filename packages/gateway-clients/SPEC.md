# Gateway Clients

Typed clients for interacting with the Breeze Gateway.

## Overview

The SDK provides three client types:

| Client | Transport | Use Case |
|--------|-----------|----------|
| **SyncClient** | WebSocket + HTTP | Web UI, real-time |
| **AsyncClient** | BullMQ queues | Slack, Discord, async platforms |
| **OpenCodeClient** | HTTP proxy | CLI direct OpenCode access |

All clients share a common `Client` interface with capabilities (e.g. verification tools).

## File Structure

```
src/
├── index.ts                    # Browser-safe exports
├── server.ts                   # Server-only exports (AsyncClient, BullMQ)
├── client.ts                   # Base Client interface
├── types.ts                    # Shared types
├── auth/
│   └── index.ts                # Token signing, auth config
├── capabilities/
│   └── tools/
│       ├── index.ts
│       └── verify.ts           # Verification file access
└── clients/
    ├── sync/
    │   ├── index.ts            # createSyncClient()
    │   ├── websocket.ts        # WebSocket + reconnection
    │   └── http.ts             # HTTP methods
    ├── async/
    │   ├── index.ts            # AsyncClient abstract class
    │   ├── receiver.ts         # runReceiver()
    │   └── types.ts
    └── external/
        ├── base.ts             # ExternalClient base
        ├── index.ts
        └── opencode.ts         # OpenCodeClient
```

## Gateway Routes

```
WebSocket:
  /breeze/:breezeSessionId

HTTP:
  GET  /breeze/:breezeSessionId
  POST /breeze/:breezeSessionId/message
  POST /breeze/:breezeSessionId/cancel
  GET  /breeze/:breezeSessionId/verification-media

Proxy:
  /proxy/:breezeSessionId/:token/opencode/*
```

## Client Interface

All clients implement the base `Client` interface:

```typescript
interface Client {
  readonly type: "sync" | "async" | "external";

  checkHealth(): Promise<{ ok: boolean; latencyMs?: number }>;

  readonly tools: {
    verification: {
      list(breezeSessionId: string, options?: { prefix?: string }): Promise<VerificationFile[]>;
      getUrl(breezeSessionId: string, key: string): Promise<string>;
      getStream(breezeSessionId: string, key: string): Promise<{ data: ArrayBuffer; contentType: string }>;
    };
  };
}
```

Type guards: `isSyncClient()`, `isAsyncClient()`, `isExternalClient()`

## SyncClient

Real-time WebSocket + HTTP client. Browser-safe.

```typescript
import { createSyncClient } from "@breeze/gateway-clients";

const client = createSyncClient({
  baseUrl: "https://gateway.example.com",
  auth: { type: "token", token: userToken },
  source: "web", // optional: for filtering events
});

// WebSocket
const ws = client.connect(breezeSessionId, {
  onEvent: (event) => console.log(event),
  onOpen: () => console.log("connected"),
  onClose: (code, reason) => console.log("closed"),
  onReconnect: (attempt) => console.log(`reconnecting ${attempt}`),
  onReconnectFailed: () => console.log("gave up"),
});

ws.sendPrompt("Hello");
ws.sendCancel();
ws.sendPing();
ws.sendSaveSnapshot("checkpoint");
ws.close();

// HTTP
await client.postMessage(breezeSessionId, { content: "Hello" });
await client.postCancel(breezeSessionId);
const info = await client.getInfo(breezeSessionId);

// Verification files
const files = await client.tools.verification.list(breezeSessionId, { prefix: "screenshots/" });
const url = await client.tools.verification.getUrl(breezeSessionId, key);
```

### Auth Options

```typescript
// User token (browser)
{ type: "token", token: "jwt-from-api" }

// Service auth (workers, API routes) — SDK signs JWT
{ type: "service", name: "slack-worker", secret: "shared-secret" }
```

## OpenCodeClient

Passthrough to OpenCode via gateway proxy. Browser-safe.

```typescript
import { createOpenCodeClient } from "@breeze/gateway-clients";

const client = createOpenCodeClient({
  baseUrl: "https://gateway.example.com",
  auth: { type: "token", token: userToken },
});

// Get proxy URL
const url = await client.getUrl(breezeSessionId);
// → "https://gateway.example.com/proxy/{id}/{token}/opencode"

// Use directly
const response = await fetch(`${url}/session`);
const eventSource = new EventSource(`${url}/events`);

// Verification still works
const files = await client.tools.verification.list(breezeSessionId);
```

## AsyncClient

BullMQ-based client for async platforms. Server-only.

```typescript
import { AsyncClient } from "@breeze/gateway-clients/server";
import { createSyncClient } from "@breeze/gateway-clients";

class SlackClient extends AsyncClient<SlackMetadata, SlackInbound, SlackReceiver> {
  readonly clientType = "slack";

  async processInbound(job: SlackInbound): Promise<void> {
    // Handle incoming Slack message
    await this.syncClient.postMessage(sessionId, { content, userId });
  }

  async handleEvent(
    breezeSessionId: string,
    metadata: SlackMetadata,
    event: ServerMessage
  ): Promise<"continue" | "stop"> {
    // Handle gateway event, post to Slack
    const files = await this.tools.verification.list(breezeSessionId);
    return "continue"; // or "stop" to close receiver
  }
}

// Setup
const syncClient = createSyncClient({ baseUrl, auth });
const slackClient = new SlackClient({ syncClient });
slackClient.setup({
  connection: redisConnection,
  inboundConcurrency: 5,
  receiverConcurrency: 10,
});

// Wake receiver for a session
await slackClient.wake(breezeSessionId, metadata, source);
```

## Exports

### `@breeze/gateway-clients` (browser-safe)

```typescript
// Clients
createSyncClient, SyncClient, SyncClientOptions
createOpenCodeClient, OpenCodeClient, OpenCodeClientOptions
ExternalClient, ExternalClientBase

// Base interface
Client, ClientTools, VerificationTools
isSyncClient, isAsyncClient, isExternalClient

// Auth
ServiceAuth, TokenAuth, GatewayAuth

// Types
VerificationFile, ConnectionOptions, ReconnectOptions
PostMessageOptions, HealthCheckResult, SandboxInfo
SyncWebSocket, WebSocketOptions

// Message types (from @breeze/shared)
ServerMessage, ClientMessage, Message, InitMessage, TokenMessage, ...
```

### `@breeze/gateway-clients/server` (Node.js only)

```typescript
AsyncClient
runReceiver
WakeableClient
AsyncClientDeps, AsyncClientSetupOptions, ReceiverOptions
```

## Verification Files

When the agent runs the `verify` tool (screenshots), files are uploaded to S3. The SDK provides methods to list and download them:

```typescript
// List files with optional prefix filter
const files = await client.tools.verification.list(breezeSessionId, {
  prefix: "screenshots/step-1/",
});
// → [{ key, name, path, contentType, size, lastModified }, ...]

// Get presigned URL (1-hour expiry)
const url = await client.tools.verification.getUrl(breezeSessionId, key);

// Get file content directly
const { data, contentType } = await client.tools.verification.getStream(breezeSessionId, key);
```
