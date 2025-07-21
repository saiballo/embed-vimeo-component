> ### [Italian Version](./README-it.md)

# Embed Vimeo Web Component

> A Web Component to embed Vimeo videos on your website while complying with GDPR regulations. By setting some specific parameters, it's possible to download nothing from Vimeo servers until the user clicks Play on the video.

![](https://img.shields.io/badge/Made%20with%20love%20and-javascript-blue)
[![MIT license](https://img.shields.io/badge/License-MIT-green.svg)](https://lbesson.mit-license.org/)

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Installation](#installation)
- [Global Parameters](#global-parameters)
- [Web Component Usage](#web-component-usage)
- [Parameter List](#parameter-list)
- [Default Configuration](#default-configuration)
- [GDPR](#gdpr)
- [Events](#events)
- [CSS Styles](#css-styles)
- [DevTeam](#devteam)
- [License](#license)

## Demo

[Demo Page](https://saiballo.github.io/embed-vimeo-component/)

## Features

* Web Component with no external dependencies.
* Ability to customize video delivery using the list of available parameters. Some of these can be set globally without having to repeat them on each webcomponent.
* Code optimized for SEO / Rich Results through the delivery of a Schema.org snippet (JSON-LD).
* Encapsulated code that doesn't interfere with the host site.
* Responsive video in 16:9 format
* Ability to show a custom image (poster) for each video instead of the original Vimeo one. In case of error, a default SVG image will be shown.

### Installation

The script can be installed in 3 different ways. For details on global parameters see the "Global Parameters" section.

1) **In-page script of the compiled file**

In this case, you can add some `data-*` attributes that will be used as global parameters.
```
<script src="embed-vimeo.min.js"></script>
```

2) **In-page script of the module file**

In this case, you use the source file with `type="module"` and it won't be possible to add `data-*` to the script as global parameters, but the same result can be achieved by adding them to the page's `body` tag.

**N.B.** When using the file as a module, you need to put the `include` folder in the same path as the file. (see `/docs/assets/js/module` folder)
```
<script type="module" src="module/embed-vimeo.js"></script>
```

3) **Import the script as a "side-effect import"**

You can import the code in any other javascript entrypoint. In this case, global parameters should be set on the "entrypoint" script (`<script>` tag) if you're not using `type="module"`, or on the `body` tag if you set `type="module"`.
```
// script master.js
import './embed-vimeo.js';
```
### Global Parameters

The following global parameters are available to be inserted as data-*:

* **`data-autoload`**: automatically instantiates the Vimeo iframe for each video present on the page. GDPR compliant: No.
* **`data-autoplay`**: only works if **data-autoload** is set. Starts the video when the page loads in muted mode (mandatory). GDPR compliant: No.
* **`data-autopause`**: stops the video when the player exits the page viewport (example: scrolling the page).
* **`data-mute`**: Mutes the audio when the user manually plays the video.
* **`data-no-tracking`**: sets the video without tracking cookies.
* **`data-no-preconnect`**: by default, "preconnect" tags are inserted for Vimeo resources. With this parameter, the tags are not added (useful in cases where the codes are already present in the site code)
* **`data-no-schema`**: doesn't print the JSON-LD schema for each video. The schema is useful for both SEO and accessibility purposes.

Example of script with global parameters set:

```
<!DOCTYPE html>
<html lang="en">

	<head>

		<script defer src="embed-vimeo.min.js" data-autoload data-autoplay data-autopause></script>

	</head>

	<body>

		<embed-vimeo video-id="347119375"></embed-vimeo>

	</body>
</html>
```

In the case of `type="module"` scripts, the parameters must be set on the page's `body`:

```
<!DOCTYPE html>
<html lang="en">

	<head>

		<script type="module" src="module/embed-vimeo.js"></script>

	</head>

	<body data-autoload data-autoplay data-autopause data-no-preconnect data-no-schema>

		<embed-vimeo video-id="347119375"></embed-vimeo>

	</body>
</html>
```

### Web Component Usage

Once the main javascript is loaded, you can insert one or more web components on the page. The only **truly required** data is the video ID:

```
<embed-vimeo video-id="347119375"></embed-vimeo>
<br>
<embed-vimeo video-id="449787858"></embed-vimeo>
```

In this specific case, the official video cover will be shown but the Vimeo iframe will not be created automatically. Even if there's no user interaction with the video when the page loads, this mode won't have full GDPR compliance because the video poster is still downloaded from Vimeo servers.

To have full and complete GDPR compliance, you can set the `embed-vimeo` tag like this:

```
<embed-vimeo video-id="347119375" poster-url="path/to/custom-poster.jpg"></embed-vimeo>
```

In this case, a custom image is displayed. If you don't have an image available for each video, you can achieve the same result like this:

```
<embed-vimeo video-id="347119375" poster-fallback></embed-vimeo>
```

Instead of the original video poster, an SVG image already present in the component is shown.
In both cases just seen, once the user clicks "Play", a conscious interaction occurs and the video starts as in any other case.

Another option available to further improve user privacy is to use "do not track" provided by Vimeo:

```
<embed-vimeo video-id="347119375" poster-url="path/to/custom-poster.jpg" no-tracking></embed-vimeo>
```

In this case, no tracking scripts or cookies will be used.

By default, the iframe parameters passed to Vimeo are managed automatically by the script. If you want to use a completely custom parameter list, you can insert the `param-list` attribute:

```
<embed-vimeo video-id="347119375" param-list="dnt=1&transparent=0&title=1&autoplay=1"></embed-vimeo>
```

> **Note:**: `param-list` might interfere with some attributes like "autoload" and "autoplay" which would have no effect. See all [all parameters](https://help.vimeo.com/hc/en-us/articles/12426260232977-About-Player-parameters).

### Parameter List

<table style="width:100%; border-collapse: collapse;">
	<thead>
		<tr>
			<th style="border: 1px solid #ddd; padding: 8px;">Parameter</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Description</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Default</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">video-id</td>
			<td style="border: 1px solid #ddd; padding: 8px;">ID of the Vimeo video to embed. Required parameter. If empty or missing, an error message will be shown.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">""</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">video-title</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Indicates the video title. Used on the button text and in the Schema.org snippet.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"Vimeo Video"</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">description</td>
			<td style="border: 1px solid #ddd; padding: 8px;">The video description. Used in the Schema.org snippet.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"Watch this video embedded in the site from Vimeo"</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">play-text</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Indicates the alternative text and "aria-label" attribute on the Play button.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"Play"</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">video-start-at</td>
			<td style="border: 1px solid #ddd; padding: 8px;">The second from which to start the video. For example "50" indicates 50 seconds or "1m20s" means 1 minute and 20 seconds</td>
			<td style="border: 1px solid #ddd; padding: 8px;">0</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">autoload</td>
			<td style="border: 1px solid #ddd; padding: 8px;">If this parameter is set, the Vimeo iframe will be initialized when the page loads. The control is done with an Observer. If the video is outside the page viewport, it will be instantiated only when visible.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">autoload-margin</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Indicates the distance, in pixels or percentage, to activate the Observer. The larger the measure (e.g. 1000px), the earlier the video iframe will be activated when approaching the component.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">0</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">autoplay</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Starts the video when the page loads but only if the "autoload" attribute is also set. The video will always be activated without audio.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">autopause</td>
			<td style="border: 1px solid #ddd; padding: 8px;">If the video is playing, this parameter automatically stops the streaming if the user, by scrolling the page, makes the player exit the viewport.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">mute</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Mutes the video audio when manually started by the user.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">no-lazyload</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Disables "lazy" loading of original video images (poster) or custom ones.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">no-schema</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Disables loading of the Schema.org snippet.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">no-preconnect</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Disables the insertion of "preconnect" tags related to Vimeo domains when hovering over any of the videos.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">poster-fallback</td>
			<td style="border: 1px solid #ddd; padding: 8px;">If set, shows an SVG as poster for the video. This parameter has priority even if "poster-url" is set.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">poster-url</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Uses the passed image as poster instead of the original video ones. A path or absolute URL can be inserted.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">poster-quality</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Indicates the default quality to use for original video images. Has no effect if "poster-url" or "poster-fallback" is set. If the image is not found, the default SVG poster will be used.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"hqdefault"</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">poster-width</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Indicates the width of the poster image requested from Vimeo.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">1024</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">param-list</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Resets the list of parameters used by the script and passed to Vimeo in favor of those inserted in the attribute.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">spinnerColor</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Indicates the spinner color.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"#ff0000"</td>
		</tr>
	</tbody>
</table>

### Default Configuration

Some default parameters, which in most cases are texts, can be overridden by creating a global variable called `embedVimeoConfig`. The list of parameters that can be overridden is as follows:

```
<script>
	window.embedVimeoConfig = {
		"activeIframeClass": "isactive",
		"textVideoTitle": "Video from Vimeo",
		"textVideoDescription": "Watch this video embedded in the site from Vimeo",
		"textMissingVideoId": "Incorrect or missing video ID",
		"textBtn": "Play",
		"textVideo": "video",
		"spinnerColor": "#ff0000",
		"videoStartAt": 0,
		"posterQuality": 80,
		"posterWidth": 1024
	};
</script>
```

### GDPR

To be completely compliant with GDPR regulations (when the user has not yet given consent or has refused it), you must **never** use the `autoload` parameter and never download images from the Vimeo site. For example, these 2 components are valid even without consent:

```
<embed-vimeo video-id="347119375" poster-url="path/to/custom-poster.jpg"></embed-vimeo>

<embed-vimeo video-id="449787858" poster-fallback></embed-vimeo>
```

### Events

When a video iframe is created (even in `autoload` mode), an event is emitted with the following data related to the video:

* videoId
* videoTitle
* posterUrl

It can be intercepted with a delegated eventListener. This means it works for 1 or more videos on the same page:

```
<script>
	document.addEventListener("embedVimeoLoaded", (e) => {
		console.log(e.target);
		console.log("VideoId:", e.detail.videoId, "videoTitle:", e.detail.videoTitle, "posterUrl:", e.detail.posterUrl);
	});
</script>
```

You can dynamically update video components by modifying one or more attributes in this list: `video-id`, `video-title`, `play-text`, `poster-url`, `poster-fallback`, `mute`. Example:

```
<script>
	setTimeout(() => {
		const videoEl = document.getElementById("myVideo1");
		// change video id
		videoEl.setAttribute("video-id", "449787858");
		// set mute mode
		videoEl.setAttribute("mute", "");
		// remove any vimeo covers and set SVG poster
		videoEl.setAttribute("poster-fallback", "");
		console.log("video updated");
	}, 1000);
</script>
```

### CSS Styles

Some component elements are available for possible CSS customizations:

```
<style>
	/* video poster image */
	embed-vimeo::part(poster)
	{
		object-fit: contain;
	}

	/* play button */
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