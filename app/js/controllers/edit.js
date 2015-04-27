/* global Controller */

/* global AddonService */

export default class EditController extends Controller {
  constructor(options) {
    super(options);
  }

  open(target) {
    this.target = target;

    this.changes = {};

    this.view.setTarget(target);
    this.view.open();
  }

  close() {
    this.view.close();
  }

  save() {
    AddonService.generate(this.target, (generator) => {
      if (this.changes.innerHTML) {
        generator.opInnerHTML(this.changes.innerHTML);
      }

      if (this.changes.properties) {
        generator.opSetProperties(this.changes.properties);
      }

      this.close();
    });
  }
}
