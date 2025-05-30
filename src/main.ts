import * as core from "@actions/core";
import * as github from "@actions/github";
import { join } from "path";
import { readFile } from "fs-extra";

import { generateBot, generatePRBody } from "./bot.js";
import { Git } from "./git.js";
import { createFile } from "./file.js";
import { runCommand } from "./run.js";

async function getContents(): Promise<string | null> {
	try {
		const run = core.getInput("run");
		if (run) {
			return await runCommand(run);
		}
		const inputFilePath = core.getInput("input-file");
		if (inputFilePath) {
			return await readFile(join(process.cwd(), inputFilePath), "utf-8");
		}
		return core.getInput("contents");
	} catch {
		return null;
	}
}

async function getInputFileOption() {
	const inputFilePath = core.getInput("input-file");
	return inputFilePath ? join(process.cwd(), inputFilePath) : null;
}

export async function run() {
	const outputFile = core.getInput("output-file");
	const ghToken = core.getInput("github-token");
	const ignoreInputFile = core.getBooleanInput("ignore-input-file");
	const contents = await getContents();

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
		core.setFailed(Error("please set input-file or contents or run"));
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
	if (
		!(await Git.commitAll(
			title,
			ignoreInputFile ? [await getInputFileOption()].filter((value) => value !== null) : []
		))
	) {
		core.info("No changes in this branch");
		return;
	}
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
