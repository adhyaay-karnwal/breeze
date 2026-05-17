// Default folder where agents build verification evidence
export const VERIFICATION_FOLDER = ".breeze/.verification";

export interface VerificationArgs {
	folder?: string; // Defaults to .breeze/.verification
}

export interface VerificationResult {
	key: string; // S3 prefix where files were uploaded (e.g., "sessions/{sessionId}/verification/{timestamp}")
}

// VerificationFile type is defined in contracts/verification.ts; re-exported here for the named package sub-path
export type { VerificationFile } from "./contracts/verification";
