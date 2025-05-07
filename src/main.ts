import * as core from "@actions/core";
import * as github from "@actions/github";

import { generateBot, generatePRBody } from "./bot.js";
import { Git } from "./git.js";

export async function run() {
	const outputFile = core.getInput("output-file");
	const ghToken = core.getInput("github-token");
	const branch = github.context.ref.replace("refs/heads/", "");
	const printerBranch = `gh-printer/${branch}`;
	const title = `Print a result of ${branch}`;

	if (!outputFile) {
		core.setFailed(Error("output-file is not set"));
	}
	if (!ghToken) {
		core.setFailed(Error("github-token is not set"));
	}

	await Git.setupUser();

	const octokit = generateBot(ghToken);
	const prs = await octokit.rest.pulls.list({
		...github.context.repo,
		state: "open",
		head: `${github.context.repo.owner}:${printerBranch}`,
		base: branch
	});

	if (!prs.data.length) {
		await octokit.rest.pulls.create({
			base: branch,
			head: printerBranch,
			title,
			body: generatePRBody(),
			...github.context.repo
		});
	} else {
		const [pr] = prs.data;
		await octokit.rest.pulls.update({
			...github.context.repo,
			pull_number: pr.number,
			title,
			body: generatePRBody(),
			state: "open"
		});
	}
}
