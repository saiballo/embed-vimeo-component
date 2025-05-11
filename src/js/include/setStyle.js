/**
* @preserve
* Filename: setStyle.js
*
* Created: 30/04/2025 (16:26:32)
* Created by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Last update: 11/05/2025 (20:02:41)
* Updated by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Copyleft: 2024 - Tutti i diritti riservati
*
* Comments:
*/

"use strict";

export const setStyle = () => {

	const stylesheet = new CSSStyleSheet();

	stylesheet.replaceSync(`

		:host,
		:host *,
		:host *::before,
		:host *::after
		{
			box-sizing: border-box;
		}

		:host
		{
			contain: content;
			display: block;
			width: 100%;
			aspect-ratio: var(--aspect-ratio);
			--aspect-ratio: var(--embed-vimeo-aspect-ratio, 16 / 9);
			--aspect-ratio-short: var(--embed-vimeo-aspect-ratio-short, 9 / 16);
		}

		@media (max-width: 40em)
		{
			:host([short])
			{
				aspect-ratio: var(--aspect-ratio-short);
			}
		}

		#embed-container
		{
			position: relative;
			width: 100%;
			height: 100%;
			aspect-ratio: 16 / 9;
			overflow: hidden;
			cursor: pointer;
		}

		#embed-container.isactive::before,
		#embed-container.isactive > #btn-play
		{
			display: none;
		}

		iframe,
		#poster-img
		{
			position: absolute;
			width: 100%;
			height: 100%;
			inset: 0;
		}

		iframe
		{
			border: 0;
		}

		#poster-img
		{
			object-fit: cover;
			box-sizing: border-box;
		}

		#btn-play
		{
			width: 68px;
  			height: 38px;
  			background-color: transparent;
  			border: none;
  			z-index: 1;
			background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 68 48' preserveAspectRatio='none'><rect width='68' height='48' rx='4' ry='4' fill='%23000'/><path d='M45 24 27 14v20' fill='%23fff'/></svg>");
 			background-repeat: no-repeat;
  			background-position: center;
  			background-size: 100% 100%;
		}

		#btn-play:before
		{
			content: "";
			border-style: solid;
			border-width: 10px 0 10px 16px;
			border-color: transparent transparent transparent #fff;
		}

		#btn-play,
		#btn-play:before,
		#error-message
		{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate3d(-50%, -50%, 0);
			cursor: inherit;
		}

		.isactive
		{
			cursor: unset;
		}

		#spinner-container
		{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate3d(-50%, -50%, 0);
		}
	`);

	return stylesheet;
};
