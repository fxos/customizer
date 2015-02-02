/* global Controller */

export default class MainController extends Controller {
  constructor(options) {
    super(options);

    this.attached = false;

    window.addEventListener('contextmenu', this.attachView.bind(this));
  }

  attachView() {
    if (this.attached) {
      return;
    }

    this.view.customizer.setRootNode(document.documentElement);
    document.body.appendChild(this.view.el);

    this.attached = true;
  }

  removeView() {
    if (!this.attached) {
      return;
    }

    document.body.removeChild(this.view.el);

    this.attached = false;
  }
}
