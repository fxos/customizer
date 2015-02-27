/* global Controller */

export default class MainController extends Controller {
  constructor(options) {
    super(options);

    window.addEventListener('contextmenu', this.onContextMenu.bind(this));
  }

  attachView() {
    document.body.appendChild(this.view.el);
  }

  removeView() {
    document.body.removeChild(this.view.el);
  }

  onContextMenu() {
    this.view.customizer.setRootNode(document.body);
    this.attachView();
  }
}
