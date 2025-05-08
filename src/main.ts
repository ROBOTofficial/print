import * as core from "@actions/core";
import * as github from "@actions/github";
import { join } from "path";

import { generateBot, generatePRBody } from "./bot.js";
import { Git } from "./git.js";
import { createFile } from "./file.js";

export async function run() {
	const outputFile = core.getInput("output-file");
	const ghToken = core.getInput("github-token");
	const contents = core.getInput("contents");

	const branch = Git.branchName;
	const baseBranch = Git.getBranchName(false);
	const printerBranch = `gh-printer/${branch}`;
	const title = `Print a result of ${branch}`;

	if (!outputFile) {
		core.setFailed(Error("output-file is not set"));
		return;
	}
	if (!ghToken) {
		core.setFailed(Error("github-token is not set"));
		return;
	}
	if (!contents) {
		core.setFailed(Error("contents is not set"));
		return;
	}

	if (!branch || !baseBranch) {
		core.setFailed(Error(`Unsupported event type: ${github.context.eventName}`));
		return;
	}

	const filePath = join(process.cwd(), outputFile);

	await Git.setupUser();
	await Git.checkoutBranch(printerBranch);
	await createFile(filePath, contents);
	await Git.commitAll(title);
	await Git.pushAll(printerBranch, true);

	const octokit = generateBot(ghToken);
	const prs = await octokit.rest.pulls.list({
		...github.context.repo,
		state: "open",
		head: `${github.context.repo.owner}:${printerBranch}`,
		base: baseBranch
	});

	if (!prs.data.length) {
		await octokit.rest.pulls.create({
			owner: github.context.repo.owner,
			repo: github.context.repo.repo,
			base: baseBranch,
			head: `${github.context.repo.owner}:${printerBranch}`,
			title,
			body: generatePRBody()
		});
	} else {
		const [pr] = prs.data;
		await octokit.rest.pulls.update({
			owner: github.context.repo.owner,
			repo: github.context.repo.repo,
			pull_number: pr.number,
			title,
			body: generatePRBody(),
			state: "open"
		});
	}
}
