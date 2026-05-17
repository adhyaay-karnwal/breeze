/**
 * BullMQ processor: billing outbox.
 *
 * Runs every 60s. Retries failed Autumn API calls.
 */

import type { Logger } from "@breeze/logger";
import type { Job } from "@breeze/queue";
import type { BillingOutboxJob } from "@breeze/queue";
import { billing } from "@breeze/services";

export async function processOutboxJob(_job: Job<BillingOutboxJob>, logger: Logger): Promise<void> {
	try {
		await billing.processOutbox();
	} catch (err) {
		logger.error({ err }, "Outbox processing error");
		throw err;
	}
}
