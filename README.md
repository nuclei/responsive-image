# Responsive Image
## Installation
Simply  install the responsive image component using npm.
```
$ npm i responsive-image -S
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

### Ratio

### Active

### Threshold & IntersectionObserver

### Load when in viewport

This packages uses the `IntersectionObserver` to detect if an image is in the viewport or not. If you want to use this in browsers that do [not support the `IntersectionObserver`](http://caniuse.com/#search=IntersectionObserver) you need to include a polyfill: https://github.com/WICG/IntersectionObserver/tree/gh-pages/polyfill
