/**
 * @preserve
 * Filename: linter.init.js
 *
 * Created: 04/03/2026 (17:54:36)
 * Created by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
 *
 * Last Updated: 04/03/2026 (17:54:36)
 * Updated by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
 *
 * Copyleft: 2026 - Tutti i diritti riservati
 *
 * Comments:
 */

"use strict";

const bundleUtil = require("../bundler.util.js");
const { spawnSync } = require("node:child_process");

const rawArgs = process.argv.slice(2);
const args = [];
let linterExec;
let tool = "eslint";
let useNodeConfig = false;

// controllo se è richiesta la configurazione node oppure no
for (let i = 0; i < rawArgs.length; i += 1) {

	const current = rawArgs[i];

	if (current === "--eslint") {
		tool = "eslint";
		continue;
	}

	if (current === "--stylelint") {
		tool = "stylelint";
		continue;
	}

	if (current === "--node") {
		useNodeConfig = true;
		continue;
	}

	args.push(current);
}

if (args.length === 0) {

	bundleUtil.toLog("e{forbidden} [bundler manager] indicare almeno un file o pattern (path relativo dalla root)", true, "bg{red}");

	bundleUtil.toLog("\ne{info} [bundler manager] esempi di comandi validi:", true, "fg{cyan}");

	if (tool === "eslint") {

		bundleUtil.toLog("- npm run linter:js ./src/js/master.js", true, "fg{cyan}");
		bundleUtil.toLog("- npm run linter:js \"./src/**/*.js\"", true, "fg{cyan}");
	}

	if (tool === "stylelint") {

		bundleUtil.toLog("- npm run linter:scss ./src/scss/master.scss", true, "fg{cyan}");
		bundleUtil.toLog("- npm run linter:scss \"./src/scss/**/*.scss\"", true, "fg{cyan}");
	}

	bundleUtil.toLog("e{info} [bundler manager] per i glob usare sempre le virgolette\n", true, "fg{cyan}");

	process.exit(1);
}

if (tool === "eslint") {

	// scelgo il conf adattto
	const eslintConfPath = useNodeConfig === true ? "./_bundler/linter/conf/eslint/eslint-node.cjs" : "./_bundler/linter/conf/eslint/eslint-common.cjs";

	// comando eslint: uso npx così risolve il bin locale
	const eslintArgs = ["eslint", "-c", eslintConfPath, ...args];

	// avvio eslint come processo figlio usando npx
	// spawnSync esegue il comando in modo sincrono (attende la fine)
	// "stdio: inherit" fa sì che ESLint stampi direttamente nel terminale
	// "shell: false" evita l'uso della shell (più sicuro e prevedibile)
	// restituisce un oggetto con exit code (res.status)
	linterExec = spawnSync("npx", eslintArgs, {
		"stdio": "inherit",
		"shell": false
	});

} else if (tool === "stylelint") {

	const stylelintArgs = ["stylelint", "--config", "./_bundler/linter/conf/stylelint/stylelint-common.json", ...args];

	// avvio stylelint come processo figlio usando npx
	// stessa logica di eslint
	linterExec = spawnSync("npx", stylelintArgs, {
		"stdio": "inherit",
		"shell": false
	});
}

process.exit(typeof linterExec.status === "number" ? linterExec.status : 1);
