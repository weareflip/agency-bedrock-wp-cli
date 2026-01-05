import { execa } from "execa";
import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import chalk from "chalk";

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
		console.log(chalk.red("❌ Project name is required."));
		process.exit(1);
	}

	if (fs.existsSync(projectName)) {
		console.log(
			chalk.red("❌ Folder already exists. Please choose a different name.")
		);
		process.exit(1);
	}

	const git = simpleGit();

	try {
		// 1️⃣ Install Bedrock
		console.log(chalk.blue("🚀 Installing Bedrock..."));
		await execa(
			"composer",
			["create-project", "roots/bedrock", projectName],
			{
				stdio: "inherit",
			}
		);

		// 2️⃣ Validate composer.json
		console.log(chalk.blue("🔍 Validating composer.json..."));
		await execa("composer", ["validate"], {
			cwd: projectName,
			stdio: "inherit",
		});

		// 3️⃣ Remove composer.lock if exists
		const composerLockPath = path.join(projectName, "composer.lock");
		console.log(chalk.blue("Checking composer.lock at:"), composerLockPath);

		if (fs.existsSync(composerLockPath)) {
			console.log(
				chalk.yellow(
					"🗑 Removing existing composer.lock to avoid conflicts..."
				)
			);
			fs.unlinkSync(composerLockPath);
		} else {
			console.log(
				chalk.green("✅ No composer.lock found, safe to proceed.")
			);
		}

		// 4️⃣ Install WPackagist plugins safely
		console.log(chalk.blue("📦 Installing WPackagist plugins..."));
		for (const [pkg, version] of Object.entries(WPACKAGIST_PLUGINS)) {
			console.log(chalk.blue(`➡ Installing ${pkg}`));
			await execa("composer", ["require", `${pkg}:${version}`], {
				cwd: projectName,
				stdio: "inherit",
			});
		}

		// 5️⃣ Install theme
		const themePath = path.join(projectName, "web/app/themes", THEME_NAME);
		console.log(chalk.blue("🎨 Installing theme..."));
		await git.clone(THEME_REPO, themePath);

		// 6️⃣ Install plugin
		const pluginPath = path.join(projectName, "web/app/plugins", PLUGIN_NAME);
		console.log(chalk.blue("🔌 Installing plugin..."));
		await git.clone(PLUGIN_REPO, pluginPath);

		console.log(chalk.green("✅ Installation completed successfully!"));
		console.log(chalk.green(`➡ cd ${projectName}`));
	} catch (err) {
		console.error(chalk.red("❌ Installation failed:"));

		// Check if it's a composer merge conflict error
		if (
			err.stderr &&
			err.stderr.includes("Please resolve the merge conflict")
		) {
			console.error(
				chalk.yellow("⚠ Composer merge conflict detected. Try running:")
			);
			console.error(chalk.yellow(`  cd ${projectName} && composer install`));
			console.error(
				chalk.yellow("Then resolve conflicts manually in composer.json.")
			);
		} else {
			console.error(err.message);
		}

		process.exit(1);
	}
}
