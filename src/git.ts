import * as github from "@actions/github";

import { exec, getExecOutput } from "@actions/exec";

export class Git {
	public static get branchName() {
		return this.getBranchName(true);
	}

	public static getBranchName(replace?: boolean) {
		if (github.context.eventName === "push") {
			return github.context.ref.replace("refs/heads/", "").replace("/", "-");
		} else if (
			github.context.payload.pull_request &&
			github.context.payload.pull_request.head &&
			github.context.payload.pull_request.head.ref
		) {
			const ref: string = github.context.payload.pull_request.head.ref;
			return replace ? ref.replace("/", "-") : ref;
		}
		return null;
	}

	public static async setupUser() {
		await exec("git", ["config", "user.name", `"github-actions[bot]"`]);
		await exec("git", ["config", "user.email", `"github-actions[bot]@users.noreply.github.com"`]);
	}

	public static async checkoutBranch(branch: string) {
		const { stderr } = await getExecOutput("git", ["checkout", branch], {
			ignoreReturnCode: true
		});
		const isCreatingBranch = !stderr.toString().includes(`Switched to a new branch '${branch}'`);
		if (isCreatingBranch) {
			await exec("git", ["checkout", "-b", branch]);
		}
	}

	public static async reset(pathSpec: string, mode: "hard" | "soft" | "mixed" = "hard") {
		await exec("git", ["reset", `--${mode}`, pathSpec]);
	}

	public static async commitAll(message: string) {
		await exec("git", ["add", "."]);
		await exec("git", ["commit", "-m", message]);
	}

	public static async pushAll(branchName: string, force?: boolean) {
		await exec(
			"git",
			["push", "origin", `HEAD:${branchName}`, force ? "--force" : null].filter(
				(value) => value !== null
			)
		);
	}
}
