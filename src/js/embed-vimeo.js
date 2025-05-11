/**
* @preserve
* Filename: embed-vimeo.js
*
* Created: 08/05/2025 (12:55:59)
* Created by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Last update: 11/05/2025 (20:02:35)
* Updated by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Copyleft: 2025 - Tutti i diritti riservati
*
* Comments:
*/

import { defaultConfig } from "./include/config.js";
import { initShadowDom } from "./include/initShadowDom.js";
import { preloadConnection, injectSchema, setLabel, fetchTimeout, hideElem, getVimeoPosterUrl, missingVideoId } from "./include/util.js";

(() => {

	"use strict";

	// prendo il currentScript per leggere alcuni parametri globali ma solo se non è type="module" atrlimenti leggo il body
	const globalParamHook = document.currentScript || document.getElementsByTagName("body")[0];

	class embedVimeo extends HTMLElement {

		constructor() {

			super();

			// merge della possibile configurazione globale con quella di default
			this.config = {
				...defaultConfig,
				...window.embedVimeoConfig || {}
			};

			this.scheduleUpdate;
			this.isIframeLoaded = false;
			this.globalParam = globalParamHook;
			// inizializzo il codice e gli stili css
			initShadowDom(this);
		}

		static get observedAttributes() {

			return ["video-id", "video-title", "play-text", "poster-url", "poster-fallback"];
		}

		connectedCallback() {

			// se non c'è l'id del video allora non carico il component
			if (missingVideoId(this)) return;

			// setup del componente
			this.setupComponent();

			// evento click per creare l'iframe
			this.addEventListener("click", () => {

				this.loadIframe();
			});

			// preload delle connessioni
			this.addEventListener("pointerover", () => {

				preloadConnection(this);

			}, {

				"once": true
			});
		}

		// get attributi locali del component
		get videoId() {
			return encodeURIComponent(this.getAttribute("video-id") || "");
		}

		get videoTitle() {
			return this.getAttribute("video-title") || this.config.textVideoTitle;
		}

		get description() {
			return this.getAttribute("description");
		}

		get playText() {

			return this.getAttribute("play-text");
		}

		get videoStartAt() {
			return this.getAttribute("video-start-at") || this.config.videoStartAt;
		}

		get autoLoadMargin() {
			return this.getAttribute("autoload-margin") || "0px";
		}

		get posterUrl() {
			return this.getAttribute("poster-url");
		}

		get posterQuality() {
			return this.getAttribute("poster-quality") || this.config.posterQuality;
		}

		get posterWidth() {
			return this.getAttribute("poster-width") || this.config.posterWidth;
		}

		get paramList() {
			return this.getAttribute("param-list");
		}
		// get attributi locali del component

		// has attributi locali e globali del component
		get autoLoad() {
			return this.hasAttribute("autoload") || this.globalParam.hasAttribute("data-autoload");
		}

		get autoPlay() {
			return this.hasAttribute("autoplay") || this.globalParam.hasAttribute("data-autoplay");
		}

		get autoPause() {
			return this.hasAttribute("autopause") || this.globalParam.hasAttribute("data-autopause");
		}

		get noTracking() {
			return this.hasAttribute("no-tracking") || this.globalParam.hasAttribute("data-no-tracking");
		}

		get noSchema() {
			return this.hasAttribute("no-schema") || this.globalParam.hasAttribute("data-no-schema");
		}

		get noPreconnect() {
			return this.hasAttribute("no-preconnect") || this.globalParam.hasAttribute("data-no-preconnect");
		}

		get noLazyLoad() {
			return this.hasAttribute("no-lazyload");
		}

		get posterFallback() {
			return this.hasAttribute("poster-fallback");
		}
		// has attributi locali del component

		/**
		 * The `setupComponent` sets up various properties and behaviors for a video component, including setting labels, custom posters, auto-loading iframes etc.
		 */
		setupComponent() {

			// costruisco la label a seconda dei dati presenti
			const label = setLabel(this);

			// imposto la label sul bottone e sul component
			this.domPlayButton.setAttribute("aria-label", label);
			this.setAttribute("title", label);
			// ottimizzazione per quando viene impostato il poster-url esternamente dopo il caricamento del component. evita un effetto fout
			this.domImgPoster.src = "";

			// rimuovo attributo lazy se necessario
			if (this.noLazyLoad) {

				this.domImgPoster.removeAttribute("loading");
			}

			// custom fallback svg
			if (this.posterFallback) {

				this.setPosterFallback();

			// imposto il custom poster
			} else if (this.posterUrl) {

				this.setPosterCustom();

			// utilizzo le immagini del video
			} else {

				this.setPoster();
			}

			// autocaricamento iframe
			if (this.autoLoad) {

				this.autoLoadIframe();
			}

			// autopausa
			if (this.autoPause) {

				this.autoPauseVideo();
			}

			// creazione schema json per seo
			if (!this.noSchema) {

				injectSchema(this);
			}
		}

		createIframe() {

			let videoParam;

			// se ci sono parametri custom tutti i default vengono azzerati
			if (this.paramList && this.paramList !== "") {

				videoParam = this.paramList;

			} else {

				// gestione parametri
				const noTRacking = this.noTracking ? 1 : 0;
				const autoplay = this.autoPlay && this.autoLoad || !this.autoPlay && !this.autoLoad ? 1 : 0;
				const mute = autoplay ? 1 : 0;
				const startAt = this.videoStartAt;

				videoParam = `dnt=${noTRacking}&transparent=1&title=0&${videoParam}&autoplay=${autoplay}`;

				// la gestione dell'autoplay di vimeo è diversa da youtube
				if (autoplay && this.autoPlay) {

					videoParam = `${videoParam}&muted=${mute}`;

				} else {

					videoParam = `${videoParam}&muted=0`;
				}

				videoParam = `${videoParam}#t=${startAt}`;
			}

			const iframeCode = `
				<iframe title="vimeo-player" src="https://player.vimeo.com/video/${this.videoId}?${videoParam}" frameborder="0" allowfullscreen allow="autoplay; fullscreen; picture-in-picture"></iframe>
			`;

			return iframeCode;
		}

		/**
		 * The function `loadIframe` checks if an iframe is already loaded, creates and inserts an iframe if not, and dispatches a custom event once the iframe is loaded.
		 */
		loadIframe() {

			if (!this.isIframeLoaded) {

				const iframeCode = this.createIframe();
				this.domContainer.insertAdjacentHTML("beforeend", iframeCode);
				this.domContainer.classList.add(this.config.activeIframeClass);
				this.isIframeLoaded = true;

				this.dispatchEvent(new CustomEvent("embedVimeoLoaded", {
					"detail": {
						"videoId": this.videoId,
						"videoTitle": this.videoTitle,
						"posterUrl": this.posterUrl
					},
					"bubbles": true,
					"cancelable": true
				}));
			}
		}

		/**
		 * `autoLoadIframe` sets up an IntersectionObserver to monitor when an iframe element becomes visible in the viewport.
		 * When the iframe intersects with the viewport and has not been loaded yet, it triggers `preloadConnection` and `loadIframe(true)` to load the iframe content.
		 * Once the iframe is loaded, the observer stops observing the iframe element.
		 */
		autoLoadIframe() {

			const options = {
				"root": null,
				"rootMargin": this.autoLoadMargin,
				"threshold": 0
			};

			const observerIframe = new IntersectionObserver((entryList, observer) => {

				entryList.forEach((entry) => {

					if (entry.isIntersecting && !this.isIframeLoaded) {

						preloadConnection(this);
						this.loadIframe(true);
						observer.unobserve(this);
					}
				});

			}, options);

			observerIframe.observe(this);
		}

		/**
		 * `autoPauseVideo` uses the Intersection Observer API to automatically pause a video when it is not in the viewport.
		 */
		autoPauseVideo() {

			const observerVideo = new IntersectionObserver((entryList) => {

				entryList.forEach((entry) => {

					if (!entry.isIntersecting) {

						this.shadowRoot.querySelector("iframe")?.contentWindow?.postMessage("{\"method\": \"pause\"}", "*");
					}
				});

			}, {
				"threshold": 0
			});

			observerVideo.observe(this);
		}

		/**
		 * The function `setPosterFallback` removes loading attribute, hides play button, and sets a custom SVG image as the poster fallback.
		 */
		setPosterFallback() {

			const svg = `
				<svg part="poster-fallback" xmlns="http://www.w3.org/2000/svg" viewBox="0 48 294 198" width="294" height="198">
					<path d="M294,48 c0-8.284-6.716-15-15-15H15 C6.716,33,0,39.716,0,48v198 c0,8.284,6.716,15,15,15h264 c8.284,0,15-6.716,15-15V48z" fill="black"/>
					<path transform="translate(0,6)" d="M124,113 L124,155 L161,134 Z" fill="white"/>
					<g transform="translate(0,-35)">
						<rect x="30.333" y="232" width="233" height="1" fill="white"/>
  						<rect x="74" y="228" width="15" height="10" fill="white"/>
					</g>
					<text x="147" y="95" fill="white" font-family="Verdana, sans-serif" font-size="18" font-weight="bold" text-anchor="middle">Play video</text>
				</svg>
			`;

			// mi serve come semaforo
			if (!this.getAttribute("poster-fallback")) {

				this.setAttribute("poster-fallback", "");
			}

			hideElem(this.domPlayButton, true);
			this.domPlayButton.setAttribute("aria-hidden", "true");

			// rimuovo eventuali immagini webp e jpg
			this.domPosterContainer.querySelector("#img-webp")?.remove();
			this.domPosterContainer.querySelector("#img-jpg")?.remove();

			// imposto l'immagine svg
			const uri = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
			this.domImgPoster.src = uri;
			this.domImgPoster.removeAttribute("loading");
			this.domImgPoster.setAttribute("alt", "");
		}

		/**
		 * The function `setPosterCustom` sets the `src` and `alt` attributes of an image element based on the provided `posterUrl` and `videoTitle` properties.
		 */
		setPosterCustom() {

			this.domImgPoster.src = this.posterUrl;

			this.domImgPoster.onload = () => {

				if (!this.posterFallback) {

					this.domImgPoster.setAttribute("alt", this.videoTitle);

					hideElem(this.domPlayButton, false);
				}
			};

			this.domImgPoster.onerror = () => {

				if (this.posterUrl) {

					this.setPosterFallback();
				}
			};
		}

		/**
		 * The `setPoster` function dynamically sets the poster image for a video element by checking for the availability of webp image and adjusting the quality accordingly.
		 */
		async setPoster() {

			try {

				// url api v2 per recuperare le immagini
				const apiUrl = `https://vimeo.com/api/v2/video/${this.videoId}.json`;

				const apiResponse = await fetchTimeout(apiUrl);

				// se l'immagine non esiste utilizzo un fallback
				if (!apiResponse.ok) {

					this.setPosterFallback();

					return;
				}

				const [responseData] = await apiResponse.json();

				// lavoro sull'immagine thumbnail per creare l'url necessario
				const posterUrlBase = getVimeoPosterUrl(responseData.thumbnail_large, this.posterWidth);

				// url immagini webp e jpg da scaricare
				const webpUrl = `${posterUrlBase}.webp?mw=1280&mh=720&q=${this.posterQuality}`;
				const jpgUrl = `${posterUrlBase}.jpg?mw=1280&mh=720&q=${this.posterQuality}`;

				const img = new Image();
				img.src = webpUrl;
				// solo dopo img.src scatta onload
				img.onload = () => {

					// se non è un fallback poster creo i source necessari
					const sourceWebp = document.createElement("source");
					sourceWebp.id = "img-webp";
					sourceWebp.setAttribute("type", "image/webp");

					const sourceJpg = document.createElement("source");
					sourceJpg.id = "img-jpg";
					sourceJpg.setAttribute("type", "image/jpeg");

					// li aggiungo in ordine corretto prima del tag img src già presente
					this.domPosterContainer.prepend(sourceWebp, sourceJpg);
					// imposto le url per le immagini
					this.domPosterContainer.querySelector("#img-webp").srcset = webpUrl;
					this.domPosterContainer.querySelector("#img-jpg").srcset = jpgUrl;
					this.domImgPoster.src = jpgUrl;

					hideElem(this.domPlayButton, false);
				};

			} catch (err) {

				console.log("Errore caricamento immagine Vimeo", err);

				this.setPosterFallback();
			}
		}

		/**
		 * The attributeChangedCallback handles attribute changes by updating the component accordingly, including cancelling any scheduled updates and reinitializing the component.
		 * @param attrname -it represents the name of the attribute that was changed on the custom element to which the callback is attached.
		 * It helps you identify which attribute triggered the callback so that you can perform specific actions based on that attribute's change.
		 * @param oldvalue -it represents the previous value of the attribute that was changed.
		 * It is compared with the `newvalue` parameter to determine what has changed in the element's attributes. If `oldvalue` is `null`, it means that the attribute
		 * @param newvalue -It  represents the new value of the attribute that triggered the callback.
		 * It is the updated value of the attribute that was changed in the element. In the provided code snippet, `newvalue` is used to check if the attribute value has
		 *
		 * metodo nativo dei web component. serve per intercettare i cambiamenti agli attributi di un elemento personalizzato.
		 */
		attributeChangedCallback(attrname, oldvalue, newvalue) {

			// al primo carimento oldvalue è sempre null
			if (oldvalue === null || oldvalue === newvalue) return;

			// annulla eventuale aggiornamento già programmato
			if (this.scheduleUpdate) cancelAnimationFrame(this.scheduleUpdate);

			// se viene cambiato l'attributo videoid allora prendo il valore prima del cambiamento
			// se viene cambiato un attributo che non è videoid allora prendo il valore presente nel codice
			// questo si è reso necessario perchè viene usato requestAnimationFrame che accorpa tutte le modifiche in una volta sola
			const videoId = attrname === "video-id" ? oldvalue : this.videoId;

			// cancello eventuali json. lo faccio sempre perchè non so quale attributo possa essere cambiato. in ogni caso viene richiamata la setup che lo riscrive
			if (!this.noSchema && this.querySelector(`#json-${videoId}`)) {

				this.querySelector(`#json-${videoId}`).remove();
			}

			// programma il nuovo aggiornamento
			this.scheduleUpdate = requestAnimationFrame(() => {

				if (this.domContainer.classList.contains(this.config.activeIframeClass)) {

					this.domContainer.classList.remove(this.config.activeIframeClass);
					this.shadowRoot.querySelector("iframe").remove();
					this.isIframeLoaded = false;
				}

				// rilancio setup
				this.setupComponent();
			});
		}
	}

	customElements.define("embed-vimeo", embedVimeo);

})();
