/* global Controller */

/* global AddonService */

export default class EditController extends Controller {
  constructor(options) {
    super(options);
  }

  teardown() {
    this.view = null;

    this.target = null;
    this.changes = null;
  }

  open(target) {
    this.target = target;

    this.changes = {};

    this.view.setTarget(target);
    this.view.open();
  }

  close() {
    if (this.changes.innerHTML        ||
        this.changes.script           ||
        this.changes.createAttributes ||
        this.changes.removeAttributes ||
        this.changes.properties) {
      if (window.confirm('Are you sure you want to discard your changes?')) {
        this.view.close();
      }
    }

    else {
      this.view.close();
    }
  }

  save() {
    AddonService.generate(this.target, (generator) => {
      if (this.changes.innerHTML) {
        generator.opInnerHTML(this.changes.innerHTML);
      }

      if (this.changes.script) {
        generator.opScript(this.changes.script);
      }

      if (this.changes.createAttributes) {
        generator.opCreateAttributes(this.changes.createAttributes);
      }

      if (this.changes.removeAttributes) {
        generator.opRemoveAttributes(this.changes.removeAttributes);
      }

      if (this.changes.properties) {
        generator.opSetProperties(this.changes.properties);
      }

      this.changes = {};
      this.close();
    });
  }
}
