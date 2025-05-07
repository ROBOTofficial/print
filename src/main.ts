import * as core from "@actions/core";

export async function run() {
	const outputFile = core.getInput("output-file");
	const ghToken = core.getInput("github-token");

	if (!outputFile) {
		core.error(Error("output-file is not set"));
	}
	if (!ghToken) {
		core.error(Error("github-token is not set"));
	}
}
