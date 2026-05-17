import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import type { State } from "../../types.js";

export const STATE_FILE = "/tmp/breeze/state.json";

export function loadState(): State {
	try {
		if (existsSync(STATE_FILE)) {
			return JSON.parse(readFileSync(STATE_FILE, "utf-8")) as State;
		}
	} catch {
		// Ignore read and parse failures and use defaults.
	}
	return { services: {}, exposedPort: null };
}

export function saveState(state: State): void {
	mkdirSync("/tmp/breeze", { recursive: true });
	writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}
