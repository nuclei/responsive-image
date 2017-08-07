# Responsive Image

## Load when in viewport


This packages uses the `IntersectionObserver` to detect if an image is in the viewport or not. If you want to use this in browsers that do [not support the `IntersectionObserver`](http://caniuse.com/#search=IntersectionObserver) it is recommended to include the following polyfill: https://github.com/WICG/IntersectionObserver/tree/gh-pages/polyfill

## known issues
### ES5 vs ES2015
