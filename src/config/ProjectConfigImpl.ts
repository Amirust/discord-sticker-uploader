import { ProjectConfig } from "@DSU/types/ProjectConfig";

export class ProjectConfigImpl implements ProjectConfig {
	public watchFolder: string;
	public uploadInterval: number;
	public botToken: string;

	public constructor(config: ProjectConfig) {
		this.watchFolder = config.watchFolder;
		this.uploadInterval = config.uploadInterval;
		this.botToken = config.botToken;
	}
}