# Responsive Image
# Installation

# Usage
This web component uses the `fetch` api. If you want to support browsers that do not ship with `fetch` you need to load a polyfill. I recommend the github polyfill https://github.com/github/fetch.

## Load when in viewport

This packages uses the `IntersectionObserver` to detect if an image is in the viewport or not. If you want to use this in browsers that do [not support the `IntersectionObserver`](http://caniuse.com/#search=IntersectionObserver) you need to include a polyfill: https://github.com/WICG/IntersectionObserver/tree/gh-pages/polyfill

## known issues
### ES5 vs ES2015
