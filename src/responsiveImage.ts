/* global HTMLElement IntersectionObserver CustomEvent */
'use strict'

import { ready } from '../node_modules/readyjs/dist/ready.js'

declare const ShadyCSS // eslint-disable-line no-unused-vars

let template = document.createElement('template')
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
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
    :host([align="top"]) img{
      object-position: center top;
    }
    :host([align="bottom"]) img{
      object-position: center bottom;
    }
    :host([align="left"]) img{
      object-position: left center;
    }
    :host([align="right"]) img{
      object-position: right center;
    }
    :host([align="top-left"]) img{
      object-position: left top;
    }
    :host([align="top-right"]) img{
      object-position: right top;
    }
    :host([align="bottom-left"]) img{
      object-position: left bottom;
    }
    :host([align="bottom-right"]) img{
      object-position: right bottom;
    }
    :host([resizing="false"]) img{
      object-fit: none;
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
`

class ResponsiveImage extends HTMLElement { // eslint-disable-line no-unused-vars
  /* Typescript: declare variables */
  private _src: string = null // eslint-disable-line no-undef
  private _srcset: string = null // eslint-disable-line no-undef
  private _placeholder: string = null // eslint-disable-line no-undef
  private _active: string = undefined // eslint-disable-line no-undef
  private _img = null // eslint-disable-line no-undef
  private _figure = null // eslint-disable-line no-undef
  private _aspectRatio = null // eslint-disable-line no-undef
  private _observer = null // eslint-disable-line no-undef
  private _threshold: number = 0 // eslint-disable-line no-undef
  private _offset: string = `100px` // eslint-disable-line no-undef

  constructor () {
    // If you define a ctor, always call super() first!
    // This is specific to CE and required by the spec.
    super()
    // create shadowRoot
    let shadowRoot = this.attachShadow({ mode: 'open' })
    // check if polyfill is used
    if (typeof ShadyCSS !== 'undefined') {
      ShadyCSS.prepareTemplate(template, 'responsive-image') // eslint-disable-line no-undef
      // apply css polyfill
      ShadyCSS.styleElement(this) // eslint-disable-line no-undef
    }
    // add content to shadowRoot
    shadowRoot.appendChild(document.importNode(template.content, true))
  }
  /**
   * @method observedAttributes
   * @description return attributes that should be watched for updates
    */
  static get observedAttributes () {
    return ['src', 'srcset', 'placeholder', 'active', 'threshold', 'offset', 'ratio']
  }
  /**
   * @method attributeChangedCallback
   * @description runs once an attribute is changed
   */
  attributeChangedCallback (attrName: string, oldVal, newVal) {
    this[attrName] = newVal
  }
  /**
   * @method connectedCallback
   * @description When element is added to DOM
   */
  connectedCallback () {
    this._setAspectRatio()
    this._loadPlaceholder()
    this._createObserver()
    this._figure = this.shadowRoot.querySelector('figure')
    this._img = this.shadowRoot.querySelector('img')
  }
  /**
   * @method _loadImage
   * @description lazy load the image
   */
  private _loadImage () {
    if (this._src === null || this._active !== 'true') return

    let _img = document.createElement('img')
    _img.addEventListener('load', () => {
      this._img.setAttribute('src', this._src)
      if (this._srcset !== null) {
        this._img.setAttribute('srcset', this._srcset)
      }
    })

    ready(() => {
      _img.setAttribute('src', this._src)
      if (this._srcset !== null) {
        _img.setAttribute('srcset', this._srcset)
      }
      // fire event when image is loaded
      this.dispatchEvent(new CustomEvent('loaded'))
      // desctroy observer once image is loaded
      this._destroyObserver()
    })
  }
  /**
   * @method _loadPlaceholder
   * @description load the placeholder
   */
  private _loadPlaceholder () {
    if (this._placeholder === null) return

    this.shadowRoot.querySelector('img').setAttribute('src', this._placeholder)
  }
  /**
   * @method _createObserver
   * @description create the observer
   */
  private _createObserver () {
    if (this._active !== undefined || typeof IntersectionObserver !== 'function') return

    this._observer = new IntersectionObserver((changes) => {
      changes.forEach((change) => {
        if (change.isIntersecting) {
          change.target.setAttribute('active', 'true')
        }
      })
    }, {
      rootMargin: this.offset,
      threshold: this.threshold
    })
    this._observer.observe(this)
  }
  /**
   * @method _destroyObserver
   * @description destroy the observer
   */
  private _destroyObserver () {
    if (this._observer === null) return

    this._observer.unobserve(this)
  }
  /**
   * @method _setAspectRatio
   * @description set the aspect ratio
   */
  private _setAspectRatio () {
    if (this._aspectRatio) {
      this.shadowRoot.querySelector('figure').style.paddingBottom = this._aspectRatio + '%'
    }
  }
  /**
  * @method setter src
  * @description set the src property
   */
  set src (src: string) {
    if (this._src === src) return
    this._src = src
    if (document.readyState !== 'loading') {
      this._loadImage()
    }
  }
  /**
  * @method getter src
  * @description get the src property
   */
  get src () {
    return this._src
  }
  /**
  * @method setter srcset
  * @description set the srcset property
   */
  set srcset (srcset: string) {
    if (this._srcset === srcset) return
    this._srcset = srcset
  }
  /**
  * @method getter srcset
  * @description get the srcset property
   */
  get srcset () {
    return this._srcset
  }
  /**
  * @method setter placeholder
  * @description set the placeholder property
   */
  set placeholder (placeholder: string) {
    if (this._placeholder === placeholder) return

    this._placeholder = placeholder
  }
  /**
  * @method getter placeholder
  * @description get the placeholder property
   */
  get placeholder () {
    return this._placeholder
  }
  /**
  * @method setter active
  * @description set the active property
   */
  set active (active: any) {
    active = (active === 'true' || active === true).toString()
    if (this._active === active) return
    this._active = active
    // set the attribute so its available for styling.
    this.setAttribute('active', this._active)
    this._loadImage()
  }
  /**
  * @method getter active
  * @description get the active property
   */
  get active () {
    return this._active
  }
  /**
  * @method setter threshold
  * @description set the threshold property
   */
  set threshold (threshold: number) {
    // convert to float
    threshold = parseFloat(parseFloat(threshold + '').toFixed(2))
    if (isNaN(threshold) || threshold > 1 || threshold < 0) threshold = 1

    if (this._threshold === threshold) return
    this._threshold = threshold
  }
  /**
  * @method getter threshold
  * @description get the threshold property
   */
  get threshold () {
    return this._threshold
  }
  /**
  * @method setter offset
  * @description set the offset property
   */
  set offset (offset: string) {
    if (this._offset === offset) return
    this._offset = offset
  }
  /**
  * @method getter offset
  * @description get the offset property
   */
  get offset () {
    return this._offset
  }
  /**
  * @method setter aspectRatio
  * @description set the aspectRatio property
   */
  set ratio (aspectRatio: string) {
    if (this._aspectRatio === aspectRatio) return
    let ratios = aspectRatio.split(':')
    let ratio : number = null
    if (ratios.length > 1) {
      ratio = 100 * (parseInt(ratios[1]) / parseInt(ratios[0]))
    } else {
      ratio = parseInt(ratios[0])
    }
    if (!isNaN(ratio)) {
      this._aspectRatio = ratio
      this._setAspectRatio()
    }
  }
  /**
  * @method getter aspectRatio
  * @description get the aspectRatio property
   */
  get ratio () {
    return this._aspectRatio
  }
}

window.customElements.define('responsive-image', ResponsiveImage)
