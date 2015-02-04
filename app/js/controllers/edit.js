/* global Controller */

/* global AddonGenerator */

export default class EditController extends Controller {
  constructor(options) {
    super(options);
  }

  open(target) {
    this.target = target;

    this.changes = {};

    this.view.setTarget(target);
    this.view.modal.open();
  }

  close() {
    this.view.modal.close();
  }

  save() {
    var generator = new AddonGenerator(this.target);

    generator.manifest.customizations = [{
      filter: window.location.origin,
      scripts: ['main.js']
    }];

    if (this.changes.innerHTML) {
      generator.innerHTML(this.changes.innerHTML);
    }

    this.mainController.installAddon(generator.generate());
  }
}
