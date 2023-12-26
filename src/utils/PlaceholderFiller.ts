export class PlaceholderFiller {
	private fields: Map<string, string> = new Map<string, string>();

	constructor() {}

	public addPlaceholder(key: string, value: string) {
		this.fields.set(key, value);
	}

	public fill(target: string) {
		return target.replace(/{(.*?)}/g, (match, placeholder) => {
			return this.fields.get(placeholder) || match;
		});
	}
}