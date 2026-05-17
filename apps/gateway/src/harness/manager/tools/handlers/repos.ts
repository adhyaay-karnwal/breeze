import type { Logger } from "@breeze/logger";
import { configurations } from "@breeze/services";
import type { ManagerToolContext } from "../types";

export async function handleListRepos(ctx: ManagerToolContext, log: Logger): Promise<string> {
	try {
		const orgConfigurations = await configurations.listConfigurations(ctx.organizationId);

		const repos = orgConfigurations.flatMap((config) =>
			(config.configurationRepos ?? [])
				.filter((cr) => cr.repo)
				.map((cr) => ({
					configurationId: config.id,
					configurationName: config.name,
					repoName: cr.repo!.githubRepoName,
					repoUrl: cr.repo!.githubUrl,
					repoId: cr.repo!.id,
				})),
		);

		log.debug({ count: repos.length }, "Listed org repos");
		return JSON.stringify({ repos });
	} catch (err) {
		return JSON.stringify({ error: `Failed to list repos: ${String(err)}` });
	}
}
