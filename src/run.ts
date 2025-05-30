import { getExecOutput } from "@actions/exec";

export async function runCommand(command: string) {
	const { stdout } = await getExecOutput(command);
	return stdout;
}
