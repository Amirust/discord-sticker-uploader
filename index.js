require("module-alias/register");

const { ProjectConfigImpl } = require("./dist/config/ProjectConfigImpl");
const { DSU } = require("./dist/core/index");
const { Uploader } = require("./dist/core/worker/Uploader");
const { Observer } = require("./dist/core/worker/Observer");

const jsonConfig = require("config.json")

(async () => {
	global.config = new ProjectConfigImpl(jsonConfig);

	global.dsu = new DSU();

	await global.dsu.init();

	global.dsu.uploader = new Uploader();

	const observer = new Observer();
	await observer.init();
})();