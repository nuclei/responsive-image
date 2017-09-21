(function () {
'use strict';

const makeTemplate = function (strings) {
    let html = strings[strings.length - 1];
    let template = document.createElement('template');
    template.innerHTML = html;
    return template;
};

var ready = function (fn) {
    if (document.readyState !== 'loading') {
        fn();
    }
    else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};

let template = makeTemplate `<style>
    :host{
      display: block;
    }
    img{
      width: 100%;
      height: auto;
      vertical-align: top;
    }
    figure{
      margin: 0;
      display: block;
      position: relative;
      overflow: hidden;
      height: 100%;
      width: 100%;
    }
    :host([ratio]) figure{
      height: 0;
      width: 100%;
    }
  </style>
  <figure>
    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" />
  </figure>`;
class ResponsiveImage extends HTMLElement {
    constructor() {
        super();
        this._src = null;
        this._placeholder = null;
        this._active = undefined;
        this._img = null;
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
    }
    _loadImage() {
        if (this._src === null || this._active !== 'true')
            return;
        let _img = document.createElement('img');
        _img.addEventListener('load', () => {
            this._img = this.shadowRoot.querySelector('img');
            this._img.setAttribute('src', this._src);
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
