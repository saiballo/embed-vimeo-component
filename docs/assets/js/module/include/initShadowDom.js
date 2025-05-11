/**
* @preserve
* Filename: initShadowDom.js
*
* Created: 30/04/2025 (16:48:32)
* Created by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Last update: 11/05/2025 (19:41:03)
* Updated by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Copyleft: 2025 - Tutti i diritti riservati
*
* Comments:
*/

"use strict";

import { setStyle } from "./setStyle.js";

/**
 * The `initShadowDom` function sets up a shadow DOM for a given context and initializes specific elements within it for displaying a video player.
 * @param context - it represents the element to which the Shadow DOM will be attached.
 */
export const initShadowDom = (context) => {

	const { config } = context;

	context.attachShadow({
		"mode": "open"
	});

	// stili css
	context.shadowRoot.adoptedStyleSheets = [setStyle()];

	// codice di partenza prima dell'iframe video
	context.shadowRoot.innerHTML = `

		<div id="${config.idEmbedContainer}">
			<div id="${config.idSpinnerContainer}" part="spinner">
				<svg width="60" height="60" viewBox="0 0 44 44">
					<circle cx="50%" cy="50%" r="20" fill="none" stroke="#E5E7EB" stroke-width="4"></circle>
					<circle cx="50%" cy="50%" r="20" fill="none" stroke="${config.spinnerColor}" stroke-width="4" stroke-dasharray="125.6" stroke-dashoffset="125.6">
						<animate attributeName="stroke-dashoffset" values="125.6;0" dur="1.5s" repeatCount="indefinite"></animate>
					</circle>
				</svg>
			</div>
			<picture id="${config.idPosterContainer}">
				<img id="${config.idPosterImg}" part="poster" referrerpolicy="origin" loading="lazy" fetchpriority="low" alt="">
			</picture>
			<button id="${config.idBtnPlay}" part="play-button" hidden></button>
		</div>
	`;

	context.domContainer = context.shadowRoot.getElementById(config.idEmbedContainer);
	context.domPosterContainer = context.shadowRoot.getElementById(config.idPosterContainer);
	context.domImgPoster = context.shadowRoot.getElementById(config.idPosterImg);
	context.domPlayButton = context.shadowRoot.getElementById(config.idBtnPlay);
};
