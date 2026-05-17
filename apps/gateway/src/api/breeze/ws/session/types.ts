import type { AuthResult } from "../../../../types";

export interface SessionWsConnectionContext {
	breezeSessionId: string;
	auth: AuthResult;
}
