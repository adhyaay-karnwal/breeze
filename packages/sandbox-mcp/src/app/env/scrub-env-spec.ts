import { existsSync, unlinkSync } from "node:fs";
import { resolveWorkspacePath, safePath } from "../../domain/env/path-policy.js";
import { sandboxEnv } from "../../env.js";
import type { EnvFileSpec } from "./types.js";

const BREEZE_ENV_FILE = "/tmp/.breeze_env.json";

export function scrubEnvSpec(spec: EnvFileSpec[]): { scrubbed: string[] } {
	const scrubbed: string[] = [];
	const workspaceDir = sandboxEnv.workspaceDir;

	for (const entry of spec) {
		if (entry.mode !== "secret") continue;
		const repoDir = resolveWorkspacePath(workspaceDir, entry.workspacePath);
		const filePath = safePath(repoDir, entry.path);
		if (!existsSync(filePath)) continue;
		unlinkSync(filePath);
		scrubbed.push(entry.path);
	}

	if (existsSync(BREEZE_ENV_FILE)) {
		unlinkSync(BREEZE_ENV_FILE);
		scrubbed.push(BREEZE_ENV_FILE);
	}

	return { scrubbed };
}
