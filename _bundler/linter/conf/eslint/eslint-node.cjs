/**
 * @preserve
 * Filename: eslint-node.cjs
 *
 * Created: 04/03/2026 (17:54:36)
 * Created by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
 *
 * Last Updated: 04/03/2026 (17:54:36)
 * Updated by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
 *
 * Copyleft: 2026 - Tutti i diritti riservati
 *
 * Comments: provvisoriamente eliminato babelParser
 */

const globals = require("globals");
const [commonExtend] = require("./eslint-common.cjs");

// disattivo i globals jquery
const jqueryOff = Object.fromEntries(
	Object.keys(globals.jquery).map((name) => {

		return [name, "off"];
	})
);

// disattivo i globals browser
const browserOff = Object.fromEntries(
	Object.keys(globals.browser).map((name) => {

		return [name, "off"];
	})
);

module.exports = [

	commonExtend,

	{
		"languageOptions": {
			"globals": {
				...globals["node"],
				...jqueryOff,
				...browserOff
			},
			"sourceType": "module"
		},
		"rules": {
			"dot-location": ["error", "property"],
			"no-continue": 0,
			"no-process-exit": 0,
			"object-property-newline": 0
		}
	}
];
