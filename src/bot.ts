import * as github from "@actions/github";

export function generateBot(token: string) {
	return github.getOctokit(token);
}

export function generatePRBody(): string {
	return ``;
}
