import { writeFile, mkdir } from "fs-extra";

import type { WriteFileOptions } from "fs-extra";

export async function createFile(
	filePath: string,
	data: string | NodeJS.ArrayBufferView,
	options?: WriteFileOptions
) {
	try {
		await writeFile(filePath, data, options);
	} catch {
		const dir = filePath.substring(0, filePath.replaceAll("\\", "/").lastIndexOf("/"));
		await mkdir(dir, { recursive: true });
		return await createFile(filePath, data, options);
	}
}
