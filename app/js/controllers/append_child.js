/* global Controller */

/* global AddonService */

export default class AppendChildController extends Controller {
  constructor(options) {
    super(options);
  }

  teardown() {
    this.view = null;

    this.target = null;
  }

  open(target) {
    this.target = target;

    this.view.open();
  }

  submit(tagName) {
    var child = document.createElement(tagName);
    if (!child) {
      window.alert(`Error creating ${tagName}`);
      return;
    }

    AddonService.generate(this.target, (generator) => {
      generator.opAppendChild(tagName);
    });
  }
}
