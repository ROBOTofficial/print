//import * as github from "@actions/github";

import { exec, getExecOutput } from "@actions/exec";

export class Git {
	public static async setupUser() {
		await exec("git", ["config", "user.name", `"github-actions[bot]"`]);
		await exec("git", ["config", "user.email", `"github-actions[bot]@users.noreply.github.com"`]);
	}

	public static async checkoutBranch(branch: string) {
		const { stderr } = await getExecOutput("git", ["checkout", branch]);
		const isCreatingBranch = !stderr.toString().includes(`Switched to a new branch '${branch}'`);
		if (isCreatingBranch) {
			await exec("git", ["checkout", "-b", branch]);
		}
	}

	public static async commitAll(message: string) {
		await exec("git", ["add", "."]);
		await exec("git", ["commit", "-m", message]);
	}

	public static async pushAll() {
		await exec("git", ["push", "origin", "main"]);
	}
}
