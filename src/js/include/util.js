/**
* Filename: util.js
*
* Created: 30/04/2025 (17:20:44)
* Created by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Last update: 21/07/2025 (10:49:44)
* Updated by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Copyleft: 2025 - sss diritti riservati
*
* Comments:
*/

/**
 * The `preloadConnection` function is a module that preloads specific URLs for YouTube videos.
 * It uses a module pattern with a closure to encapsulate the `isPreconnected` variable and the `addPrefetch` function.
 * When the function is called with a `context` parameter, it checks certain conditions before preloading the URLs using the `addPrefetch` function.
 * Once the preloading is done, it sets the `isPreconnected` flag to true to prevent duplicate preloading.
 *
 * uso modulo + closure. è l'equivalente della iife classica in js. usata perchè c'è isPreconnected altrimenti si poteva evitare e mettere fuori sempre in questo file.
 */
export const preloadConnection = (() => {

	let isPreconnected = false;

	const addPrefetch = (type, url) => {

		const linkElem = document.createElement("link");
		linkElem.rel = type;
		linkElem.href = url;
		linkElem.crossOrigin = "true";
		document.head.append(linkElem);
	};

	return (context) => {

		if (isPreconnected || context.noPreconnect) return;

		addPrefetch("preconnect", "https://player.vimeo.com");
		addPrefetch("preconnect", "https://i.vimeocdn.com");
		addPrefetch("preconnect", "https://f.vimeocdn.com");

		isPreconnected = true;
	};

})();

/**
 * The function `normalizeVideoId` takes a raw video ID or URL as input and returns the normalized video ID by extracting it from the URL if it's a Vimeo embed URL.
 * @param rawid - it is the input value that may contain either a video ID or a video URL. The `normalizeVideoId` function is designed to extract and return the video
 * ID from the input, whether it is provided as a direct ID or embedded within a URL. If the input is
 * @returns it returns the normalized video ID extracted from the raw input. If the raw input is a URL containing a Vimeo ID, it extracts and returns the Vimeo video ID.
 * If the raw input is already a video ID, it returns the same video ID after decoding it. If the raw input is empty or not a valid URL, an empty string is returned.
 */
export const normalizeVideoId = (rawid) => {

	if (!rawid) return "";

	const videoId = decodeURIComponent(rawid);
	const isUrl = /^(?:https?:\/\/|www\.)/.test(rawid);

	if (isUrl) {

		// se è un URL di embed YouTube, prendo il parametro dell'id
		if (videoId.includes("player.vimeo")) {

			try {

				const url = new URL(videoId);
				const segments = url.pathname.split("/");
				// l'ultimo segmento è sempre l'ID
				return segments.pop() || "";

			} catch {

				return "";
			}
		}

		return "";
	}

	// altrimenti è già l'ID
	return videoId;
};

/**
 * The function `missingVideoId` checks if a video ID is provided and displays an error message if it is missing.
 * @param context - it contains information related to the current state or environment of the application.
 * @returns it returns a boolean value. It returns `true` if there is no `videoId` in the `context` object or if the `videoId` is an empty string, and it returns `false` otherwise.
 */
export const missingVideoId = (context) => {

	// se non c'è l'id del video allora non carico il component
	if (!context.videoId || context.videoId === "") {

		hideElem(context.shadowRoot.getElementById(context.config.idSpinnerContainer), true);

		const h2 = document.createElement("h2");
		h2.id = "error-message";
		h2.textContent = context.config.textMissingVideoId;
		context.domContainer.appendChild(h2);

		console.log(context.config.textMissingVideoId);

		return true;
	}

	return false;
};

/**
 * The `injectSchema` function creates a JSON-LD script element for embedding Vimeo videos with schema.org metadata.
 * @param context - The `context` parameter in the `injectSchema` function contains the following properties:
 *
 * usata principalmente per indicizzazione
 */
export const injectSchema = (context) => {

	const { config } = context;
	const { videoId } = context;

	const videoTitle = context.videoTitle || config.textVideoTitle;
	const description = context.description || config.textVideoDescription;

	const script = document.createElement("script");
	script.id = `json-${videoId}`;
	script.type = "application/ld+json";
	script.text = JSON.stringify({
		"@context": "https://schema.org",
		"@type": "VideoObject",
		"name": `${videoTitle}`,
		"description": `${description}`,
		"contentUrl": `https://vimeo.com/${videoId}`,
		"embedUrl": `https://player.vimeo.com/video/${videoId}`
	});

	context.prepend(script);
};

/**
 * The `setLabel` function concatenates two input strings with a default text if one of the inputs is missing.
 * @param playtext - it is the text that will be displayed on a button or link to play a video.
 * @param titletext - The `titletext` parameter is a string that represents the title of a video.
 * @returns it returns a string based on the provided `playtext` and `titletext` parameters.
 * If both `playtext` and `titletext` are provided, it returns a combination of the two. If only `playtext` is provided, it returns `playtext`.
 * If only `titletext` is provided, it returns a combination of "Riproduci".
 */
export const setLabel = (context) => {

	const { config } = context;

	if (context.playText && context.videoTitle) {

		return `${context.playText} ${context.videoTitle}`;
	}

	if (context.playText) {

		return context.playText;
	}

	if (context.videoTitle) {

		return `${config.textBtn} ${context.videoTitle}`;
	}

	return `${config.textBtn} ${config.textVideo}`;
};

/**
 * `hideElem` that takes a boolean parameter `hide`. Inside the function, it checks the value of `hide`.
 * If `hide` is true, it sets the `hidden` property of the `domPlayButton` element to true, effectively hiding the play button.
 * If `hide` is false, it sets a timeout of 250 milliseconds before setting the `hidden` property of the `domPlayButton` element to false
 */
export const hideElem = (btn, hide = true, timeout = 250) => {

	if (hide) {

		btn.hidden = true;

	} else {

		setTimeout(() => {
			btn.hidden = false;
		}, timeout);
	}
};

/**
 * The function `getVimeoPosterUrl` extracts and modifies a Vimeo video poster URL to adjust its dimensions and remove any file extension if present.
 * @param imgurl - it takes in an image URL as a parameter and processes it to generate a Vimeo poster URL. It performs the following steps:
 * @returns The function `getVimeoPosterUrl` returns the modified Vimeo poster URL after resizing and potentially removing the file extension ".jpg".
 */
export const getVimeoPosterUrl = (imgurl, posterminwidth) => {

	// destrutturo l'url e prendo solo la parte prima del "?""
	const [imgUrl] = imgurl.split("?");

	// cambio le dimensioni di default dato che vimeo le realizza onfly
	const imgResizeUrl = imgUrl.replace(/d_\d+$/, `d_${posterminwidth}`);

	// le vecchie api legacy hanno l'estensione .jpg nel nome del file. devo fare un controllo ed eventualmente levare l'estensione
	const posterUrlBase = imgResizeUrl.endsWith(".jpg") ? imgResizeUrl.substring(0, imgResizeUrl.lastIndexOf(".")) : imgResizeUrl;

	return posterUrlBase;
};

/**
 * The `fetchTimeout` function is a JavaScript function that fetches data from a URL with a specified timeout duration.
 * @param url - The `url` parameter is the URL of the resource you want to fetch data from.
 * @param [option] - it is an object that can contain additional settings for the fetch request.
 * @returns The `fetchTimeout` function returns a Promise that resolves to the response from the `fetch` request made to the specified URL with the provided options.
 */
export const fetchTimeout = async (url, option = {}) => {

	const { timeout = 1000 } = option;
	const controller = new AbortController();

	const timer = setTimeout(() => {

		controller.abort();

	}, timeout);

	const response = await fetch(url, {
		...option,
		"signal": controller.signal
	});

	clearTimeout(timer);

	return response;
};
