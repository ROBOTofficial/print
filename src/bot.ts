import * as github from "@actions/github";

export function generateBot(token: string) {
	return github.getOctokit(token);
}

export function generatePRBody(): string {
	const body = [
		"This pull request was created by gh printer.",
		"Please merge after confirming the contents."
	];
	return body.join("\n");
}
