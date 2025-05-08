import { describe, expect, test } from "@jest/globals";
import { readFile } from "fs-extra";
import { join } from "path";

import { createFile } from "../src/file";

describe("File funcs test", () => {
	test("createFile", async () => {
		const filePath = join(__dirname, "./testDir/a/b.txt");
		await createFile(filePath, "this is a test");
		const isCreated = await (async () => {
			try {
				await readFile(filePath);
				return true;
			} catch {
				return false;
			}
		})();
		expect(isCreated).toBe(true);
	});
});
