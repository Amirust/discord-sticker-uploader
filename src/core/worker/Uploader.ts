import Semaphore from "@DSU/utils/Semaphore";
import { exec } from "child_process";
import crypto from "node:crypto";
import { AiResults } from "@DSU/types/AiResult";
import { AiResultParser } from "@DSU/core/parser/AiResultParser";
import path from "node:path";
import { ServerManager } from "@DSU/core/worker/ServerManager";
import fs from "node:fs/promises";

export class Uploader {
	private readonly semaphore: Semaphore;

	constructor() {
		this.semaphore = new Semaphore(1);
	}

	async addTask(files: string[]): Promise<void> {
		await this.semaphore.acquire();
		console.log("uploading");
		await this.upload(files);
		this.semaphore.release();
	}

	public async upload(files: string[]): Promise<void> {
		const pythonFile = "ai/ai.py";
		const outputFile = crypto.randomBytes(12).toString("hex");

		await new Promise((resolve) => {
			exec(`python ${pythonFile} ${path.resolve(process.cwd(), "assets/stickersClassification.pt")} "${outputFile}" ${files.map(e => `"${e}"`).join(" ")}`, resolve);
		});

		const outputFiles = files.map((e, i) => path.resolve(process.cwd(), `${outputFile}_${i}.txt`));
		const results: AiResults = {};
		await Promise.all(outputFiles.map(AiResultParser.parse)).then(e => {
			e.forEach((e, i) => {
				results[files[i]] = e;
			});
		});

		const servers = (await ServerManager.getAvailableServers())
			.sort((a, b) => b.availablePlaces - a.availablePlaces);

		const allStickerPlaces = servers.reduce((a, b) => a + b.availablePlaces, 0);

		if (allStickerPlaces < files.length) {
			for (let i = 0; i < Math.ceil(files.length / 5); i++) {
				const created = await ServerManager.createServer();
				servers.push(created);
			}
		}

		for (const server of servers) {
			if (Object.keys(results).length === 0) break;
			while(server.availablePlaces > 0) {
				if (Object.keys(results).length === 0) break;
				console.log(server.availablePlaces, "places left on", server.guild.name);

				const dirToSticker = `stickers/${server.invite}_${server.guild.id}_${server.guild.name.replaceAll(" ", "-")}`;

				await fs.mkdir(dirToSticker, { recursive: true });

				const file = Object.keys(results)[0];
				const fileExtension = file.split(".").pop();
				const emoji = results[file][0].emoji;

				console.log("uploading to", server.guild.name, "image", file, "with", emoji);
				const sticker = await dsu.discordService.createSticker(
					server.guild.id,
					`${emoji} ${crypto.randomBytes(6).toString("hex")}`,
					emoji,
					await fs.readFile(file)
				);

				await fs.rename(file, path.resolve(`${dirToSticker}/${sticker!.id}_${sticker!.name.replaceAll(" ", "_")}.${fileExtension}`));

				console.log("uploaded to", server.guild.name, "image", file, "with", emoji, "id", sticker!.id);
				server.availablePlaces--;
				delete results[file];
			}
		}
	}
}