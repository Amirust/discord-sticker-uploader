import { AvailableServer } from "@DSU/types/AvailableServer";
import { GuildPremiumTier } from "discordoo/src/constants/entities/guild/GuildPremiumTier";
import { premiumTierStickers } from "@DSU/constants/premiumTierStickers";
import { ChannelTypes, Guild, GuildTextChannel } from "discordoo";
import { PlaceholderFiller } from "@DSU/utils/PlaceholderFiller";

export class ServerManager {
	static async getAvailableServers(): Promise<AvailableServer[]> {
		const guilds = await dsu.discordService.getAllServers();
		return await Promise.all(guilds.map(async (guild: Guild) => {
			let guildStickers = (await dsu.discordService.getStickersFromGuild(guild.id))?.size;
			if (!guildStickers) guildStickers = 0;
			try {
				return {
					guild: guild,
					invite: (await dsu.discordService.getInviteOrCreate(guild)).code,
					availablePlaces: premiumTierStickers[guild.premiumTier as GuildPremiumTier] - guildStickers
				};
			} catch (e) { return; }
		})).then(res => res.filter(Boolean)) as AvailableServer[];
	}

	static async createServer(): Promise<AvailableServer> {
		const name = await this.resolveNewServerName();
		const guild = await dsu.discordService.createServer(name);

		if (!guild) throw new Error("Unknown error when trying create new guild");

		const channel = await guild.channels.createChannel({
			name: config.invitesChannel,
			type: ChannelTypes.GuildText
		}) as GuildTextChannel | undefined;

		if (!channel) throw new Error("Unknown error  when trying create invite channel");

		const allServers = await this.getAvailableServers();

		if (allServers.filter(g => g.guild.id !== guild.id).length > 0)
			await channel.send(allServers.filter(g => g.guild.id !== guild.id).map(server => `discord.gg/${server.invite}`).join("\n"));

		const invite= (await dsu.discordService.getInviteOrCreate(guild)).code;

		await this.sendInviteToAllServers(invite);

		console.log(`Created new server with name ${name} and invite discord.gg/${invite}`);

		return {
			guild,
			invite,
			availablePlaces: premiumTierStickers[guild.premiumTier as GuildPremiumTier]
		};
	}

	static async sendInviteToAllServers(invite: string) {
		const guilds = await dsu.discordService.getAllServers();

		for (const guild of guilds) {
			const channel = await guild.channels.cache.find(e => {
				return e.name === config.invitesChannel && e.type === ChannelTypes.GuildText;
			}) as GuildTextChannel | undefined;

			if (!channel) continue;

			await channel.send(`discord.gg/${invite}`);
		}
	}

	static async resolveNewServerName(): Promise<string> {
		const guilds = await dsu.discordService.getAllServers();
		const baseGuildName = config.baseGuildName;

		const number = guilds.length + 1;

		const filler = new PlaceholderFiller();
		filler.addPlaceholder("number", number.toString());

		return filler.fill(baseGuildName);
	}
}