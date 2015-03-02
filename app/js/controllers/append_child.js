/* global Controller */

/* global AddonGenerator */

export default class AppendChildController extends Controller {
  constructor(options) {
    super(options);
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

    var generator = new AddonGenerator(this.target);

    generator.manifest.customizations = [{
      filter: window.location.origin,
      scripts: ['main.js']
    }];

    generator.appendChild(tagName);

    this.mainController.installAddon(generator.generate());
  }
}
