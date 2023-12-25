import { AvailableServer } from "@DSU/types/AvailableServer";
import { GuildPremiumTier } from "discordoo/src/constants/entities/guild/GuildPremiumTier";
import { premiumTierStickers } from "@DSU/constants/premiumTierStickers";
import { Guild } from "discordoo";

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
		})).then(res => res.filter(Boolean));
	}
}