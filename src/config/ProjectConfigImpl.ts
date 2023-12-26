import { ProjectConfig } from "@DSU/types/ProjectConfig";

export class ProjectConfigImpl implements ProjectConfig {
	public watchFolder: string;
	public uploadInterval: number;
	public botToken: string;
	public baseGuildName: string;
	public invitesChannel: string;

	public constructor(config: ProjectConfig) {
		if (!config.watchFolder) throw new Error("No watch folder specified");
		if (!config.uploadInterval) throw new Error("No upload interval specified");
		if (!config.botToken) throw new Error("No bot token specified");
		if (!config.baseGuildName) throw new Error("No base guild name specified");
		if (!config.invitesChannel) throw new Error("No invites channel specified");

		this.watchFolder = config.watchFolder;
		this.uploadInterval = config.uploadInterval;
		this.botToken = config.botToken;
		this.baseGuildName = config.baseGuildName;
		this.invitesChannel = config.invitesChannel;
	}
}