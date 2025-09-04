> ### [English Version](./README.md)

# Embed Vimeo Web Component

> Un Web Component per includere video Vimeo nel proprio sito rispettando la normativa GDPR. Impostando alcuni parametri specifici è possibile non scaricare nulla dai server Vimeo fin quando l'utente non clicca Play sul video.

![](https://img.shields.io/badge/Made%20with%20love%20and-javascript-blue)
[![MIT license](https://img.shields.io/badge/License-MIT-green.svg)](https://lbesson.mit-license.org/)

## Sommario

- [Demo](#demo)
- [Caratteristiche](#caratteristiche)
- [Installazione](#installazione)
- [Parametri globali](#parametri-globali)
- [Utilizzo web component](#utilizzo-web-component)
- [Lista proprietà](#lista-proprieta)
- [Configurazione di default](#configurazione-di-default)
- [GDPR](#gdpr)
- [Eventi](#eventi)
- [Stili CSS](#stili-css)
- [DevTeam](#devteam)
- [Licenza](#license)

## Demo

[Pagina demo](https://saiballo.github.io/embed-vimeo-component/)

## Caratteristiche

* Web Component senza dipendenze esterne.
* Possibilità di personalizzare l'erogazione del video utilizzando la lista dei parametri disponibili. Alcuni di questi possono essere impostati globalmente senza bisogno di doverli ripetere su ogni webcomponent.
* Codice ottimizzato per il SEO / Rich Results attraverso l'erogazione di uno snippet Schema.org (JSON-LD).
* Codice incapsulato per non interferire con il sito ospite.
* Video responsive in formato 16:9
* Possibilità di mostrare una immagine personalizzata (poster) per ogni video al posto di quella originale Vimeo. In caso di errore verrà mostrata una immagine di default in formato svg.

### Installazione

È possibile installare lo script in 3 modi diversi. Per i dettagli sui parametri globali vedi sezione "Parametri globali".

1) **Script in pagina del file compilato**

In questo caso è possibile aggiungere alcuni `data-*` che verranno utilizzati come parametri globali.
```
<script src="embed-vimeo.min.js"></script>
```

2) **Script in pagina del file module**

In questo caso si usa il file sorgente con `type="module"` e non sarà possibile aggiungere `data-*` allo script come parametri globali ma potrà essere raggiunto lo stesso risultato aggiungendoli al tag `body` della pagina.

**N.B.** Utilizzando il file come modulo è necessario mettere nella stesso path del file anche la cartella `include`. (vedi cartella `/docs/assets/js/module`)
```
<script type="module" src="module/embed-vimeo.js"></script>
```

3) **Importare lo script, come "side-effect import"**

È possibile importare il codice in qualsiasi altro entrypoint javascript. In questo caso i parametri globali andranno impostati sullo script "entrypoint" (tag `<script>`) se non si utilizza `type="module"` oppure sul tag `body` se si imposta `type="module"`.
```
// script master.js
import './embed-vimeo.js';
```
### Parametri globali

Sono disponibili i seguenti parametri globali da inserire come data-*:

* **`data-autoload`**: istanzia automaticamente l'iframe Vimeo per ogni video presente in pagina. GDPR compliant: No.
* **`data-autoplay`**: funziona solo se **data-autoload** è impostato. Fa partire il video al caricamento della pagina in modalità muta (obbligatorio). GDPR compliant: No.
* **`data-autopause`**: blocca il video quando il player esce dal viewport della pagina (esemmpio: scrollando la pagina).
* **`data-mute`**: imposta a muto l'audio del video quando viene fatto partire manualmente dall'utente.
* **`data-no-tracking`**: imposta il video senza cookie di tracciamento.
* **`data-no-preconnect`**: di default vengono inseriti dei tag "preconnect" per le risorse Vimeo. Con questo parametro i tag non vengono aggiunti (utile in quei casi in cui i codici sono già presenti nel codice del sito)
* **`data-no-schema`**: non stampa lo schema JSON-LD per ogni video. Lo schema è utile sia per finalità SEO che di accessibilità.

Esempio di script con i parametri globali impostati:

```
<!DOCTYPE html>
<html lang="it">

	<head>

		<script defer src="embed-vimeo.min.js" data-autoload data-autoplay data-autopause></script>

	</head>

	<body>

		<embed-vimeo video-id="347119375"></embed-vimeo>

	</body>
</html>
```

Nel caso di script `type="module"` i parametri vanno impostati sul `body` della pagina:

```
<!DOCTYPE html>
<html lang="it">

	<head>

		<script type="module" src="module/embed-vimeo.js"></script>

	</head>

	<body data-autoload data-autoplay data-autopause data-no-preconnect data-no-schema>

		<embed-vimeo video-id="347119375"></embed-vimeo>

	</body>
</html>
```

### Utilizzo web component

Una volta caricato il javascript principale si può inserire uno o più web component in pagina. L'unico dato **realmente obbligatorio** è l'ID del video:

```
<embed-vimeo video-id="347119375"></embed-vimeo>
<br>
<embed-vimeo video-id="449787858"></embed-vimeo>
```

In questo caso specifico verrà mostrata la copertina ufficiale del video ma non verrà creato automaticamente l'iframe di Vimeo. Anche se al caricamento della pagina non c'è interazione dell'utente con il video, in questa modalità non si avrà piena adesione al GDPR perchè il poster del video è comunque scaricato dai server di Vimeo.

Per avere una piena e totale compatibilità con la normativa GDPR si può impostare il tag `embed-vimeo` in questa maniera:

```
<embed-vimeo video-id="347119375" poster-url="path/to/custom-poster.jpg"></embed-vimeo>
```

In questo caso viene visualizzata una immagine custom. Se non si ha a disposizione una immagine per ogni video si può raggiungere lo stesso risultato in questa maniera:

```
<embed-vimeo video-id="347119375" poster-fallback></embed-vimeo>
```

Al posto del poster originale del video viene mostrata una immagine SVG già presente nel component.
In tutti e due i casi appena visti, una volta che l'utente clicca "Play" si verifica una interazione consapevole e il video parte come in qualsiasi altro caso.

Un'altra opzione disponibile per migliorare ulteriormente la privacy dell'utente è utilizzare "do not track" messo a disposizione da Vimeo:

```
<embed-vimeo video-id="347119375" poster-url="path/to/custom-poster.jpg" no-tracking></embed-vimeo>
```

In questo caso non verranno utilizzati script o cookie traccianti.

Di default i parametri dll'iframe passati a Vimeo sono gestiti in automatico dallo script. In caso si volesse utilizzare una lista parametri totalmente custom si può inserire l'attributo `param-list`:

```
<embed-vimeo video-id="347119375" param-list="dnt=1&transparent=0&title=1&autoplay=1"></embed-vimeo>
```

> **Note:**: `param-list` potrebbe interferire con alcuni attributi come "autoload" e "autoplay" che non avrebbero effetto. Vedi tutti [tutti i parametri](https://help.vimeo.com/hc/en-us/articles/12426260232977-About-Player-parameters).

### Lista proprietà

<table style="width:100%; border-collapse: collapse;">
	<thead>
		<tr>
			<th style="border: 1px solid #ddd; padding: 8px;">Proprietà</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Descrizione</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Default</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">video-id</td>
			<td style="border: 1px solid #ddd; padding: 8px;">ID del video Vimeo da includere. Parametro obbligaotrio. Se vuoto o mancante verrà mostrato un messaggio di errore.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">""</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">video-title</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Indica il titolo del video. Viene utilizzato sul testo del bottone e nello snippet di Schema.org.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"Video Vimeo"</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">description</td>
			<td style="border: 1px solid #ddd; padding: 8px;">La descrizione del video. Viene utilizzato nello snippet di Schema.org.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"Guarda questo video incorporato nel sito da Vimeo"</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">play-text</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Indica il testo alternativo e l'attributo "aria-label" sul bottone Play.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"Riproduci"</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">video-start-at</td>
			<td style="border: 1px solid #ddd; padding: 8px;">I secondo da cui far iniziare il video. Ad esempio "50" indica 50 secondi oppure "1m20s" sta per 1 minuto e 20 secondi</td>
			<td style="border: 1px solid #ddd; padding: 8px;">0</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">autoload</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Se impostato questo parametro, l'iframe Vimeo verrà inizializzato al caricamento della pagina. Il controllo viene fatto con un Observer. Se il video sarà fuori dal viewport della pagina verrà istanziato solo una volta visibile.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">autoload-margin</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Indica la distanza, in pixel o percentuale, per attivare l'Observer. Più la misura è grande (es. 1000px) e prima verrà attivato l'iframe del video quando ci si avvicina al component.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">0</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">autoplay</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Avvia il video al caricamento della pagina ma solo se è impostato anche l'attributo "autoload". Il video verrà sempre attivato senza audio.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">autopause</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Se il video è in riproduzione, questo parametro blocca automaticamente lo streaming se l'utente, scrollando la pagina, fa uscire il player dal viewport.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">mute</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Imposta a muto l'audio del video quando viene fatto partire manualmente dall'utente.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">no-lazyload</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Disabilita il caricamento "lazy" delle immagini originali del video (poster) oppure di quelle custome.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">no-schema</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Disabilita il caricamento dello snippet Schema.org.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">no-preconnect</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Disabilita l'inserimento dei tag "preconnect" legati ai domini Vimeo quando ci si sposta con il mouse sopra uno qualsiasi dei video.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">poster-fallback</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Se impostato mostra una SVG come poster per il video. Il parametro ha priorità anche se viene impostato "poster-url".</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">poster-url</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Utilizza l'immagine passata come poster al posto di quelle originali del video. Può essere inserito un path o un url assoluto.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">poster-quality</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Indica la qualità di default da utilzzare per le immagini originali del video. Non ha effetto se viene impostato "poster-url" oppure "poster-fallback". Se l'immagine non viene trovata verrà utilizzato il poster SVG di default.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"hqdefault"</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">poster-width</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Indica la larghezza dell'immagine poster richiesta a Vimeo.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">1024</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">param-list</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Azzera la lista dei parametri utilizzati dallo script e passati a Vimeo in favore di quelli inseriti nell'attributo.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">spinnerColor</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Indica il colore dello spinner.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"#ff0000"</td>
		</tr>
	</tbody>
</table>

### Configurazione di default

Alcuni parametri di default, nella maggior parte dei casi sono testi, possono essere sovrascritti creando una variabile globale chiamata `embedVimeoConfig`. La lista dei parametri che possono essere sovrascritti è la seguente:

```
<script>
	window.embedVimeoConfig = {
		"activeIframeClass": "isactive",
		"textVideoTitle": "Video da Vimeo",
		"textVideoDescription": "Guarda questo video incorporato nel sito da Vimeo",
		"textMissingVideoId": "ID video errato o mancante",
		"textBtn": "Riproduci",
		"textVideo": "video",
		"spinnerColor": "#ff0000",
		"videoStartAt": 0,
		"posterQuality": 80,
		"posterWidth": 1024
	};
</script>
```

### GDPR

Per essere completamente aderenti alla normativa GDPR (quando l'utente non ha ancora dato il consenso o lo ha rifiutato) è necessario non utilizzare **mai** il parametro `autoload` e non scaricare mai le immagini dal sito Vimeo. Per esempio questi 2 component sono validi anche senza consenso:

```
<embed-vimeo video-id="347119375" poster-url="path/to/custom-poster.jpg"></embed-vimeo>

<embed-vimeo video-id="449787858" poster-fallback></embed-vimeo>
```

### Eventi

Quando viene creato l'iframe di un video (anche in modalità `autload`) viene emesso un evento con i seguenti dati relativi al video:

* videoId
* videoTitle
* posterUrl

Può essere intercettato con un eventListener delegato. Ciò significa che vale per 1 o più video nella stessa pagina:

```
<script>
	document.addEventListener("embedVimeoLoaded", (e) => {
		console.log(e.target);
		console.log("VideoId:", e.detail.videoId, "videoTitle:", e.detail.videoTitle, "posterUrl:", e.detail.posterUrl);
	});
</script>
```

È possibile aggiornare dinamicamente i componenti video modificando uno o più attributi in questa lista: `video-id`, `video-title`, `play-text`, `poster-url`, `poster-fallback`, `mute`. Esempio:

```
<script>
	setTimeout(() => {
		const videoEl = document.getElementById("myVideo1");
		// cambia id del video
		videoEl.setAttribute("video-id", "449787858");
		// imposta la modalità muta
		videoEl.setAttribute("mute", "");
		// rimuove eventuali copertine di vimeo e imposta il poster SVG
		videoEl.setAttribute("poster-fallback", "");
		console.log("video aggiornato");
	}, 1000);
</script>
```

### Stili CSS

Alcuni elementi del component sono disponibili per eventuali personalizzazioni CSS:

```
<style>
	/* immagine poster del video */
	embed-vimeo::part(poster)
	{
		object-fit: contain;
	}

	/* bottone play */
	embed-vimeo::part(play-button)
	{
		margin-block: 1rem;
	}

	/* spinner */
	embed-vimeo::part(spinner)
	{
		display: none;
	}
</style>
```

## DevTeam

### ARMADA 429
<img src="https://raw.githubusercontent.com/saiballo/saiballo/refs/heads/master/armada429.png" width="80" height="80">
<br><br>

**Lorenzo "Saibal" Forti**

## License

[![MIT license](https://img.shields.io/badge/License-MIT-green.svg)](https://lbesson.mit-license.org/)
![](https://img.shields.io/badge/License-Copyleft%20Saibal%20--%20All%20Rights%20Reserved-red)
