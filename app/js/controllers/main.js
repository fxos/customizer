/* global Controller */

export default class MainController extends Controller {
  constructor(options) {
    super(options);

    this.attached = false;

    window.addEventListener('contextmenu', (evt) => {
      if (this.attached) {
        this.removeView();
      } else {
        this.attachView();
      }
    });
  }

  attachView() {
    if (this.attached) {
      return;
    }

    this.view.customizer.setRootNode(document.documentElement);
    document.body.appendChild(this.view.el);

    var padding = this.view.el.querySelector('fxos-customizer').offsetHeight;
    this._styleEl = document.createElement('style');
    this._styleEl.textContent = `
    html, body {
      overflow: initial !important;
    }

    body {
      padding-bottom: ${padding}px !important;
    }`;
    document.head.appendChild(this._styleEl);

    this.attached = true;
  }

  removeView() {
    if (!this.attached) {
      return;
    }

    document.body.removeChild(this.view.el);
    document.head.removeChild(this._styleEl);
    this._styleEl = null;

    this.attached = false;
  }
}
