import { DiscordService } from "@DSU/discord/DiscordService";
import { Uploader } from "@DSU/core/worker/Uploader";

export default class DSU {
	public discordService: DiscordService;
	public uploader: Uploader;

	constructor() {
		this.discordService = new DiscordService();
		this.uploader = new Uploader();
	}

	public async init(): Promise<void> {
		await this.discordService.init();
	}
}