# Flip WordPress Starter

🚀 Starter project to quickly set up a WordPress site using **Bedrock**, a custom **theme**, and **plugin** from your Git SSH repositories.

---

## Features

-  ✅ Bedrock WordPress boilerplate
-  🎨 Custom theme (`flip`) cloned from Git SSH repo
-  🔌 Custom plugin (`flip-gutenberg-blocks`) cloned from Git SSH repo
-  📦 Automatic `npm install` if theme/plugin has `package.json`
-  🛠 Modern project structure and workflow
-  ⚡ Quick installation with `npx`

---

## Requirements

-  [Node.js](https://nodejs.org/) (v16+ recommended)
-  [npm](https://www.npmjs.com/)
-  [Composer](https://getcomposer.org/) (for Bedrock)
-  [Git](https://git-scm.com/)
-  SSH key configured on your machine and added to GitHub
-  PHP >= 8.0 (Bedrock requirement)

---

## Quick Installation (via npx)

You can run the installer directly with `npx` without manually cloning the repo:

```bash
# Run installer with npx
npx github:weareflip/agency-bedrock-wp-cli my-project
```

Replace my-project with your desired project folder name.

The script will automatically:

1. Create a new Bedrock project in my-project

2. Clone your theme via SSH to web/app/themes/your-theme

3. Clone your plugin via SSH to web/app/plugins/your-plugin

4. Run npm install in theme/plugin if package.json exists
