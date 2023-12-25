export default class Semaphore {
	readonly maxCount: number;
	private count: number;
	private queue: (() => void)[] = [];

	constructor(maxCount = 1) {
		this.maxCount = maxCount;
		this.count = maxCount;
	}

	acquire(): Promise<void> {
		return new Promise<void>((resolve) => {
			if (this.count > 0) {
				this.count--;
				resolve();
			}
			else {
				this.queue.push(resolve);
			}
		});
	}

	release(): void {
		if (this.queue.length > 0) {
			this.queue.shift()?.();
		}
		else {
			this.count++;
		}
	}
}