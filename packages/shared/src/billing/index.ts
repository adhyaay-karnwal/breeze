/**
 * Billing module exports.
 *
 * @module @breeze/shared/billing
 */

// Types
export * from "./types";
export * from "./autumn-types";

// State machine (V2)
export * from "./state";

// Unified gating (V2)
export * from "./gating";

// Autumn API client
export {
	autumnGetCustomer,
	autumnAttach,
	autumnBillingPortal,
	autumnCreateCustomer,
	autumnSetupPayment,
	autumnCheck,
	autumnTrack,
	autumnCheckCredits,
	autumnDeductCredits,
	autumnGetBalance,
	autumnGetLimit,
	autumnAutoTopUp,
	type AutoTopUpResult,
} from "./autumn-client";

// Database-backed billing workflows now live in @breeze/services/billing.
