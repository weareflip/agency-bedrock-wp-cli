#!/usr/bin/env node

import { Command } from "commander";

const program = new Command();

program.name("agency-wp").version("1.0.0").description("Agency WordPress CLI");

program
	.command("install <projectName>")
	.description("Install Bedrock with predefined theme & plugin")
	.action(async (projectName) => {
		(await import("../commands/install.js")).default(projectName);
	});

program.parse();
