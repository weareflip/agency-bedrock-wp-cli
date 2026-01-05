import { execa } from "execa";
import simpleGit from "simple-git";
import fs from "fs";
import path from "path";

const THEME_REPO = "https://github.com/your-org/your-theme.git";
const PLUGIN_REPO = "https://github.com/your-org/your-plugin.git";

const THEME_NAME = "your-theme";
const PLUGIN_NAME = "your-plugin";

export default async function install(projectName) {
	// Kiểm tra folder đã tồn tại
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
