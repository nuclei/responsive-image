(function () {
'use strict';

var ready = function (fn) {
    if (document.readyState !== 'loading') {
        fn();
    }
    else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};

let template = document.createElement('template');
template.innerHTML = `<style>
    :host{
      display: flex;
    }
    img{
      width: 100%;
      height: auto;
      vertical-align: top;
      float: left;
      max-width: none;
      min-width: none;
      max-height: none;
      min-height: none;
    }
    :host([resizing]) img[fillmode="height"]{
      height: 100%;
      width: auto;
    }
    :host([resizing]) img[fillmode="width"]{
      height: auto;
      width: 100%;
    }
    :host([align="center"]) img{
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    :host([align="right"]) img{
      position: absolute;
      right: 0;
    }
    figure{
      margin: 0;
      display: block;
      overflow: hidden;
      width: 100%;
      height: 100%;
    }
    :host([ratio]) figure{
      height: 0;
      width: 100%;
    }
  </style>
  <figure>
    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" />
  </figure>
`;
class ResponsiveImage extends HTMLElement {
    constructor() {
        super();
        this._src = null;
        this._placeholder = null;
        this._active = undefined;
        this._img = null;
        this._figure = null;
        this._aspectRatio = null;
        this._observer = null;
        this._threshold = 0.5;
        let shadowRoot = this.attachShadow({ mode: 'open' });
        if (typeof ShadyCSS !== 'undefined') {
            ShadyCSS.prepareTemplate(template, 'responsive-image');
            ShadyCSS.styleElement(this);
        }
        shadowRoot.appendChild(document.importNode(template.content, true));
    }
    static get observedAttributes() {
        return ['src', 'placeholder', 'active', 'threshold', 'ratio'];
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        this[attrName] = newVal;
    }
    connectedCallback() {
        this._setAspectRatio();
        this._loadPlaceholder();
        this._createObserver();
        this._figure = this.shadowRoot.querySelector('figure');
        this._img = this.shadowRoot.querySelector('img');
        if (typeof window.nucleiResponsiveImages === 'undefined' || window.nucleiResponsiveImages.length <= 0) {
            window.nucleiResponsiveImages = [];
            window.addEventListener('resize', this._debounce(this._resizeEvent, 50));
        }
        window.nucleiResponsiveImages.push(this);
        setTimeout(() => {
            this._checkOrientation(this);
        }, 10);
        setTimeout(() => {
            this._checkOrientation(this);
        }, 300);
    }
    _resizeEvent() {
        window.nucleiResponsiveImages.forEach((element, index) => {
            if (!document.body.contains(element))
                return window.nucleiResponsiveImages.splice(index, 1);
            element._checkOrientation(element);
        });
    }
    _checkOrientation(element) {
        if (element.clientWidth > element.clientHeight) {
            element.setAttribute('orientation', 'landscape');
        }
        else {
            element.setAttribute('orientation', 'portrait');
        }
        this._fillmode();
    }
    _debounce(callback, time) {
        let timeout;
        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(callback, time);
        };
    }
    _loadImage() {
        if (this._src === null || this._active !== 'true')
            return;
        let _img = document.createElement('img');
        _img.addEventListener('load', () => {
            this._img.setAttribute('src', this._src);
            this._fillmode();
        });
        ready(() => {
            _img.setAttribute('src', this._src);
            this._destroyObserver();
        });
    }
    _loadPlaceholder() {
        if (this._placeholder === null)
            return;
        this.shadowRoot.querySelector('img').setAttribute('src', this._placeholder);
    }
    _fillmode() {
        if (this._img.clientWidth < this._figure.clientWidth) {
            this._img.setAttribute('fillmode', 'width');
        }
        if (this._img.clientHeight < this._figure.clientHeight) {
            this._img.setAttribute('fillmode', 'height');
        }
    }
    _createObserver() {
        if (this._active !== undefined)
            return;
        this._observer = new IntersectionObserver((changes) => {
            changes.forEach((change) => {
                if (change.isIntersecting) {
                    change.target.setAttribute('active', 'true');
                }
            });
        }, {
            threshold: this.threshold
        });
        this._observer.observe(this);
    }
    _destroyObserver() {
        if (this._observer === null)
            return;
        this._observer.unobserve(this);
    }
    _setAspectRatio() {
        if (this._aspectRatio) {
            this.shadowRoot.querySelector('figure').style.paddingBottom = this._aspectRatio + '%';
        }
    }
    set src(src) {
        if (this._src === src)
            return;
        this._src = src;
        if (document.readyState !== 'loading') {
            this._loadImage();
        }
    }
    get src() {
        return this._src;
    }
    set placeholder(placeholder) {
        if (this._placeholder === placeholder)
            return;
        this._placeholder = placeholder;
    }
    get placeholder() {
        return this._placeholder;
    }
    set active(active) {
        active = (active === 'true' || active === true).toString();
        if (this._active === active)
            return;
        this._active = active;
        this.setAttribute('active', this._active);
        this._loadImage();
    }
    get active() {
        return this._active;
    }
    set threshold(threshold) {
        threshold = parseFloat(parseFloat(threshold + '').toFixed(2));
        if (isNaN(threshold) || threshold > 1 || threshold < 0)
            threshold = 1;
        if (this._threshold === threshold)
            return;
        this._threshold = threshold;
    }
    get threshold() {
        return this._threshold;
    }
    set ratio(aspectRatio) {
        if (this._aspectRatio === aspectRatio)
            return;
        let ratios = aspectRatio.split(':');
        let ratio = null;
        if (ratios.length > 1) {
            ratio = 100 * (parseInt(ratios[1]) / parseInt(ratios[0]));
        }
        else {
            ratio = parseInt(ratios[0]);
        }
        if (!isNaN(ratio)) {
            this._aspectRatio = ratio;
            this._setAspectRatio();
        }
    }
    get ratio() {
        return this._aspectRatio;
    }
}
window.customElements.define('responsive-image', ResponsiveImage);

}());
//# sourceMappingURL=responsiveImage.js.map
