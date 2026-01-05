import { execa } from "execa";
import simpleGit from "simple-git";
import fs from "fs";
import path from "path";

const THEME_REPO = "git@github.com:weareflip/boilerplate-theme-flip.git";
const PLUGIN_REPO = "git@github.com:weareflip/boilerplate-gutenberg-plugin.git";

const THEME_NAME = "flip";
const PLUGIN_NAME = "flip-gutenberg-blocks";

const WPACKAGIST_PLUGINS = {
	"wpackagist-plugin/duplicate-post": "*",
	"wpackagist-plugin/svg-support": "*",
	"wpackagist-plugin/wordpress-seo": "*",
	"wpackagist-plugin/alttext-ai": "*",
	"wpackagist-plugin/mailgun": "*",
};

export default async function install(projectName) {
	if (!projectName) {
		console.log("❌ Project name is required.");
		process.exit(1);
	}
	if (fs.existsSync(projectName)) {
		console.log("❌ Folder already exists. Please choose a different name.");
		process.exit(1);
	}

	// 1. Install Bedrock
	console.log("🚀 Installing Bedrock...");
	await execa("composer", ["create-project", "roots/bedrock", projectName], {
		stdio: "inherit",
	});

	console.log("📦 Adding WPackagist plugins...");
	const composerJsonPath = path.join(projectName, "composer.json");
	const composerJson = JSON.parse(fs.readFileSync(composerJsonPath, "utf8"));

	composerJson.require = {
		...composerJson.require,
		...WPACKAGIST_PLUGINS,
	};

	fs.writeFileSync(composerJsonPath, JSON.stringify(composerJson, null, 2));

	console.log("📥 Running composer install...");
	await execa("composer", ["install"], { cwd: projectName, stdio: "inherit" });

	const git = simpleGit();

	// 2. Install theme
	const themePath = path.join(projectName, "web/app/themes", THEME_NAME);
	console.log("🎨 Installing theme...");
	await git.clone(THEME_REPO, themePath);

	if (fs.existsSync(path.join(themePath, "package.json"))) {
		console.log("📦 Running npm install for theme...");
		await execa("npm", ["install"], { cwd: themePath, stdio: "inherit" });
	}

	// 3. Install plugin
	const pluginPath = path.join(projectName, "web/app/plugins", PLUGIN_NAME);
	console.log("🔌 Installing plugin...");
	await git.clone(PLUGIN_REPO, pluginPath);

	if (fs.existsSync(path.join(pluginPath, "package.json"))) {
		console.log("📦 Running npm install for plugin...");
		await execa("npm", ["install"], { cwd: pluginPath, stdio: "inherit" });
	}

	console.log("✅ Installation completed!");
	console.log(`➡ cd ${projectName}`);
}
