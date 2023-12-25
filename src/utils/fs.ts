import fs from "node:fs/promises";
import { Dirent } from "fs";
import path from "path";

async function readFile(path: string): Promise<string> {
	return await fs.readFile(path)
		.then(f => f.toString("utf8"))
		.catch(() => { throw new Error("file not found"); });
}

async function readDir(path: string): Promise<Dirent[]> {
	return await fs.readdir(path, { withFileTypes: true })
		.catch(() => { throw new Error("directory not found"); });
}

async function *walkAsync(dir: string): AsyncGenerator<string | Dirent, void, unknown>
{
	const files = await fs.readdir(dir, { withFileTypes: true });
	for (const file of files) {
		if (file.isDirectory()) yield* walkAsync(path.join(dir, file.name));
		else yield file;
	}
}

async function readDirRecursive(path: string): Promise<Dirent[]> {
	const files: Dirent[] = [];
	for await (const f of walkAsync(path))
		files.push(f as Dirent);
	return files;
}

export {
	readFile,
	readDir,
	readDirRecursive
};