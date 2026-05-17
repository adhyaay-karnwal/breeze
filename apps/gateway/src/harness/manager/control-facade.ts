import type { ClientSource } from "@breeze/shared";

export interface ManagerControlFacade {
	eagerStartSession(sessionId: string): Promise<void>;
	sendPromptToSession(input: {
		sessionId: string;
		content: string;
		userId: string;
		source?: ClientSource;
		images?: string[];
	}): Promise<void>;
	cancelSession(sessionId: string): Promise<void>;
}
