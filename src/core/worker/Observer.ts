import chokidar, { FSWatcher } from "chokidar";

export class Observer {
	private readonly watcher: FSWatcher;
	private cachedFiles: string[];
	private newFiles: string[];
    
	public constructor() {
		this.watcher = chokidar.watch(config.watchFolder, {
			depth: 0
		});

		this.cachedFiles = [];
		this.newFiles = [];
	}

	async init(): Promise<void> {
		setInterval(async () => {
			await dsu.uploader.addTask(this.newFiles);
			if (this.newFiles.length > 0) this.newFiles = [];
		}, config.uploadInterval);
		await this.handleChanges();
	}

	public async handleChanges(): Promise<void> {
		this.watcher.on("add", async (path: string) => {
			if (path.endsWith(".gif")) {
				return console.log("GIFs are not supported. Convert to APNG", path);
			}
			if (path.endsWith(".png")) {
				this.newFiles.push(path);
				console.log("new file", path);
			}
			if (!path.endsWith(".png")) {
				return console.log("Unsupported file type! Valid only PNG and APNG", path);
			}
		});
		this.watcher.on("unlink", async (path: string) => {
			if (path.endsWith(".png")) {
				this.newFiles = this.newFiles.filter(file => file !== path);
				this.cachedFiles = this.cachedFiles.filter(file => file !== path);
				console.log("deleted file", path);
			}
		});
	}
}