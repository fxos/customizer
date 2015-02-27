/* global Controller */

export default class AppendChildController extends Controller {
  constructor(options) {
    super(options);
  }

  open(target) {
    this.target = target;

    this.customizer = document.body.querySelector('fxos-customizer');

    this.view.open();
  }

  submit(tagName) {
    var child = document.createElement(tagName);
    if (!child) {
      window.alert(`Error creating ${tagName}`);
      return;
    }

    this.target.appendChild(child);
    this.customizer.select(child);
  }
}
