# Responsive Image
[![Spec Custom Elements V1](https://img.shields.io/badge/spec-custom%20elements%20v1-F52757.svg?style=flat-square)](https://www.w3.org/TR/custom-elements/)
[![Build Status](https://img.shields.io/travis/nuclei/responsive-image/master.svg?style=flat-square)](https://travis-ci.org/nuclei/responsive-image) [![npm](https://img.shields.io/npm/v/responsive-image.svg?style=flat-square)](https://www.npmjs.com/package/responsive-image)
[![Known Vulnerabilities](https://snyk.io/test/github/nuclei/responsive-image/badge.svg?style=flat-square)](https://snyk.io/test/github/nuclei/responsive-image) [![npm](https://img.shields.io/npm/dt/@nuclei-components/responsive-image.svg?style=flat-square)](https://www.npmjs.com/package/responsive-image) [![license](https://img.shields.io/github/license/nuclei/responsive-image.svg?style=flat-square)](https://github.com/nuclei/responsive-image/blob/master/LICENSE)

## Installation
Simply  install the responsive image component using npm.
```
$ npm i -S @nuclei-components/responsive-image
```
## Usage
To use the webcomponent you need to load it into your page, either by bundling it into your js bundle or by simply loading it via a script tag.

```html
<script src="../dist/responsiveImage.js"></script>
```

As the support for web components is currently still pretty spotty, you probably want to load a polyfill before loading the web component.

I recommend the [webcomponentsjs](https://github.com/webcomponents/webcomponentsjs). To make sure the webcomponent is only loaded once the polyfill is done (when using the `webcomponents-loader.js`) you will want to wait for the `WebComponentsReady` event before loading the web component. This event is always fired, even in browser that fully support web components.

```html
<script type="text/javascript" async>
  window.addEventListener('WebComponentsReady', function () {
    let script = document.createElement('script')
    script.setAttribute('src', '../dist/responsiveImage.js')
    document.head.appendChild(script)
  })
</script>
```

### Placeholder
This image will be used as a fill in until the real image is downloaded. It could be something like a very small version of the image or any other fill in.

```html
<responsive-image src="image.jpg" placeholder="placeholder.png"></responsive-image>
```

### Ratio
The ratio is used to properly scale your image. If you set your `responsive-image` to have a width of `100%` it will always be resized using the provided ratio, even when the image is not yet loaded.

A ratio can be defined as width to height, e.g. `4:3` or as a percentage value that is calculated like this:`100 * (height / width)` e.g. `100 * (3/4)` which is `75%`.

```html
<responsive-image src="image.jpg" ratio="4:3"></responsive-image>
```

### Resizing
When the `resizing` attribute is set to none on a `<responsive-image>` the image will not resize to fit the container.

### Align
**Warning:** [`object-fit`](https://caniuse.com/#search=object-fit) and [`object-position`](https://caniuse.com/#search=object-fit) is used for the align options, so make sure the support fits with your target audience.

This property is used to indicate how the image should be positioned when part of it is cropped, e.g. position it in the `bottom left` corner so that it will overflow on the top and right. The default is `center center`

Available options are: `top`, `bottom`, `left`, `right`, `top-right`, `top-left`, `bottom-right`, `bottom-left`.

### src, srcset & sizes
Just like on any image you can use the `src` attribute to define the image src, as well as a combination of `srcset` and `sizes` to define responsive media.

### Active
If `active` is set to true the image will be lazy-loaded immediately, even when not in view.

### Threshold
If you use the *load when in viewport* functionality, you can use the `threshold` property to define how much of the image needs to be visible in the viewport to trigger a load event. The default is `0`, so as soon as 1px of the the offset is in the viewport, the image will be loaded.

### Offset
The `offset` property defines at what distance from the visible viewport, the image will be loaded. The default offset of `100px` means that as soon as the images is within `100px` of the viewport, it will be loaded. Set the offset to `0` to disable it.

## Events
### loaded
When an image is loaded it fires the `loaded` event.

## Polyfill for IntersectionObserver
This packages uses the `IntersectionObserver` to detect if an image is in the viewport or not. If you want to use this in browsers that do [not support the `IntersectionObserver`](http://caniuse.com/#search=IntersectionObserver) you need to include a polyfill: https://github.com/WICG/IntersectionObserver/tree/gh-pages/polyfill

If you want to use this package just for its lazy-loading or if you build your own detection which triggers loading by setting `active` to true, you do not need to use the polyfill.
