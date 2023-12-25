import { AiResult } from "@DSU/types/AiResult";
import { readFile } from "@DSU/utils/fs";
import { unlink } from "node:fs/promises";

export class AiResultParser {
	static async parse(path: string): Promise<AiResult[]> {
		const file = await readFile(path);
		const results: AiResult[] = [];

		for (const line of file.split("\n")) {
			const [probability, emojiCode] = line.split(" ");
			if (probability && emojiCode) {
				results.push({ probability: parseFloat(probability), emoji: AiResultParser.convertCodeToEmoji(emojiCode) });
			}
		}

		await unlink(path);
		return results;
	}

	static convertCodeToEmoji(emojiCode: string): string {
		return String.fromCodePoint(parseInt(emojiCode.replace("U+", ""), 16));
	}
}