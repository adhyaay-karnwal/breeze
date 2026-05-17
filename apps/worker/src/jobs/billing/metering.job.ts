/**
 * BullMQ processor: compute metering.
 *
 * Runs every 30s. Bills all running sessions for elapsed compute time.
 */

import type { Logger } from "@breeze/logger";
import type { Job } from "@breeze/queue";
import type { BillingMeteringJob } from "@breeze/queue";
import { billing } from "@breeze/services";
import { getProvidersMap } from "./providers";

export async function processMeteringJob(
	_job: Job<BillingMeteringJob>,
	logger: Logger,
): Promise<void> {
	try {
		const providers = await getProvidersMap();
		await billing.runMeteringCycle(providers);
	} catch (err) {
		logger.error({ err }, "Metering cycle error");
		throw err;
	}
}
