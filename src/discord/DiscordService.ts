import {
	ChannelTypes,
	Collection,
	DiscordApplication,
	DiscordFactory,
	Guild, GuildTextChannel,
	IntentsUtil,
	Invite,
	Sticker
} from "discordoo";
import crypto from "node:crypto";

export class DiscordService {
	private readonly app: DiscordApplication;

	constructor() {
		this.app = DiscordFactory.create(config.botToken, {
			gateway: { intents: IntentsUtil.ALL }
		});
	}

	async init(): Promise<void> {
		return await this.app.start().then(async () => console.log("Discord client started"));
	}

	async createServer(name: string): Promise<Guild | undefined> {
		return this.app.guilds.create({ name });
	}

	async getAllServers(): Promise<Guild[]> {
		return this.app.guilds.cache.map(guild => guild);
	}

	async getServer(id: string): Promise<Guild | undefined> {
		return this.app.guilds.cache.get(id);
	}

	async getInviteOrCreate(guild: Guild): Promise<Invite> {
		const invites = await guild.invites.fetchMany();
		if (invites && invites.length > 0) return invites[0];
		const allChannels = await guild.channels.cache.map(channel => channel);
		const channel = allChannels.find(channel => channel.type === ChannelTypes.GuildText) as GuildTextChannel;
		const result = await guild.invites.create(channel, { maxAge: 0, maxUses: 0 });
		if (!result) throw new Error(`Cannot create invite on server ${guild.name}`);
		return result;
	}

	async getStickersFromGuild(guildId: string): Promise<Collection<string, Sticker> | undefined> {
		return this.app.stickers.fetchMany(guildId);
	}

	async createSticker(guildId: string, name: string, emoji: string, file: Buffer | ArrayBuffer): Promise<Sticker | undefined> {
		return this.app.stickers.create(guildId, {
			name,
			tags: emoji,
			file,
			description: `${name} ${crypto.randomBytes(6).toString("hex")}`
		});
	}
}