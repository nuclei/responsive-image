/* global HTMLElement IntersectionObserver */
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
`

class ResponsiveImage extends HTMLElement { // eslint-disable-line no-unused-vars
  /* Typescript: declare variables */
  private _src: string = null // eslint-disable-line no-undef
  private _placeholder: string = null // eslint-disable-line no-undef
  private _active: string = undefined // eslint-disable-line no-undef
  private _img = null // eslint-disable-line no-undef
  private _figure = null // eslint-disable-line no-undef
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
    this._figure = this.shadowRoot.querySelector('figure')
    this._img = this.shadowRoot.querySelector('img')
    // attach event handler if not present
    if (typeof window.nucleiResponsiveImages === 'undefined' || window.nucleiResponsiveImages.length <= 0) {
      window.nucleiResponsiveImages = []
      window.addEventListener('resize', this._debounce(this._resizeEvent, 50))
    }
    // add element to list for resize event
    window.nucleiResponsiveImages.push(this)
    // run element query for initial size
    this._checkOrientation(this)
  }
  /**
   * @method _resizeEvent
   * @description resize event function
   */
  private _resizeEvent () {
    window.nucleiResponsiveImages.forEach((element, index) => {
      // if element not in DOM remove from array and return
      if (!document.body.contains(element)) return window.nucleiResponsiveImages.splice(index, 1)
      // call elementQuery if element is in dom
      element._checkOrientation(element)
    })
  }
  /**
   * @method _debounce
   * @description simple debounce
   */
  private _checkOrientation (element) {
    if (element.clientWidth > element.clientHeight) {
      element.setAttribute('orientation', 'landscape')
    } else {
      element.setAttribute('orientation', 'portrait')
    }
    this._fillmode()
  }
  /**
   * @method _debounce
   * @description simple debounce
   */
  private _debounce (callback: object, time: number) {
    let timeout
    return function () {
      clearTimeout(timeout) // this clears the timeout so callback in timeout is not called
      timeout = setTimeout(callback, time)
    }
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
      this._fillmode()
    })

    ready(() => {
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
   * @method _fillmode
   * @description define the fillmode
   */
  private _fillmode () {
    if (this._img.clientWidth < this._figure.clientWidth) {
      this._img.setAttribute('fillmode', 'width')
    }
    if (this._img.clientHeight < this._figure.clientHeight) {
      this._img.setAttribute('fillmode', 'height')
    }
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
