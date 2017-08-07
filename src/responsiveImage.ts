/* global HTMLElement IntersectionObserver */
'use strict'

import { makeTemplate } from './makeTemplate'
import { ready } from '../node_modules/readyjs/dist/ready.js'

declare const ShadyCSS // eslint-disable-line no-unused-vars

let template = makeTemplate`<style>
    :host{
      display: block;
    }
    img{
      width: 100%;
      height: auto;
    }
    figure{
      margin: 0;
      display: block;
      position: relative;
      height: 0;
      width: 100%;
      overflow: hidden;
    }
  </style>
  <figure>
    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" />
  </figure>`

class ResponsiveImage extends HTMLElement { // eslint-disable-line no-unused-vars
  /* Typescript: declare variables */
  private _src: string = null // eslint-disable-line no-undef
  private _placeholder: string = null // eslint-disable-line no-undef
  private _active: string = undefined // eslint-disable-line no-undef
  private _img = null // eslint-disable-line no-undef
  private _aspectRatio = null // eslint-disable-line no-undef
  private _observer = null // eslint-disable-line no-undef
  private _threshold: number = 0.5 // eslint-disable-line no-undef

  constructor () {
    // If you define a ctor, always call super() first!
    // This is specific to CE and required by the spec.
    super()
    // create shadowRoot
    let shadowRoot = this.attachShadow({mode: 'open'})
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
    return ['src', 'placeholder', 'active', 'threshold', 'ratio']
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
  }
  /**
   * @method _loadImage
   * @description lazy load the image
   */
  private _loadImage () {
    if (this._src === undefined || this._active !== 'true') return

    ready(() => {
      let _img = document.createElement('img')
      _img.addEventListener('load', () => {
        this._img = this.shadowRoot.querySelector('img')
        this._img.setAttribute('src', this._src)
        if (this._aspectRatio === null) {
          this.setAttribute('ratio', (100 * (this._img.naturalHeight / this._img.naturalWidth)) + '%')
        }
      })
      _img.setAttribute('src', this._src)
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
    if (this._active !== undefined) return

    this._observer = new IntersectionObserver((changes) => {
      changes.forEach((change) => {
        if (change.isIntersecting) {
          change.target.setAttribute('active', 'true')
        }
      })
    }, {
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
  }
  /**
  * @method getter src
  * @description get the src property
   */
  get src () {
    return this._src
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
