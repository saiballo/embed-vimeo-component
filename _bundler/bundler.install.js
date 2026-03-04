/**
 * @preserve
 * Filename: bundler.install.js
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

const bundleUtil = require("./bundler.util.js");
const pkg = require("../package.json");
const { spawnSync } = require("node:child_process");

bundleUtil.toLog("e{info} [bundler manager] inizio operazioni\n", true, "fg{green}");

const groups = {
	"linter": pkg.devOptionalLinter || {},
	"linter-remove": pkg.devOptionalLinter || {}
};

// serve per differenziare installazione o rimozione
const removeGroups = new Set(["linter-remove"]);

const arg = process.argv[2] || "linter";
const isRemove = removeGroups.has(arg);

if (!groups[arg]) {

	bundleUtil.toLog(`e{forbidden} [bundler manager] gruppo "${arg}" non valido. Possibili scelte: ${Object.keys(groups).join(", ")}`, true, "bg{red}");

	throw new Error("esecuzione interrotta");
}

// restitutisce array con nome pacchetto e versione "nomenpm@^9.0.0" (usato per install)
const pkgList = Object.entries(groups[arg]).map(([name, version]) => `${name}@${version}`);
// restituisce solo il nome pacchetto "nomenpm" (usato per uninstall)
const pkgNamedList = Object.keys(groups[arg]);
// formatta la lista con a capo e trattino
const formatConsoleList = (list) => {
	if (Array.isArray(list) === false || list.length === 0) return "(vuoto)";
	return "- " + list.join("\n- ");
};

if (pkgList.length === 0) {

	bundleUtil.toLog(`e{package} [bundler manager] nessun pacchetto da processare nel gruppo "${arg}"`, true, "fg{yellow}");

	throw new Error("esecuzione interrotta");
}

if (!isRemove) {

	bundleUtil.toLog(`e{package} [bundler manager] installazione dei pacchetti:\n${formatConsoleList(pkgList)}`, true, "fg{cyan}");

	const res = spawnSync("npm", ["install", "--save-dev", ...pkgList], {
		"stdio": "inherit",
		"shell": false
	});

	if (res.status === 0) {

		bundleUtil.toLog("\ne{checkmark} [bundler manager] installazione avvenuta con successo\n", true, "fg{green}");
	}

	process.exit(typeof res.status === "number" ? res.status : 1);

} else {

	bundleUtil.toLog(`e{package} [bundler manager] rimozione dei pacchetti:\n${formatConsoleList(pkgNamedList)}`, true, "fg{yellow}");

	const res = spawnSync("npm", ["uninstall", ...pkgNamedList], {
		"stdio": "inherit",
		"shell": false
	});

	if (res.status === 0) {

		bundleUtil.toLog(`\ne{checkmark} [bundler manager] rimozione di "${arg}" avvenuta con successo\n`, true, "fg{green}");
	}

	process.exit(typeof res.status === "number" ? res.status : 1);
}
