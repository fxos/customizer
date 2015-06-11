/* global Controller */

/* global AddonService */

export default class CopyMoveController extends Controller {
  constructor(options) {
    super(options);
  }

  teardown() {
    this.view = null;

    this.target = null;
  }

  open(target) {
    this.target = target;

    this.view.domTree.filter = '#' + window.__customizer__.mainController.view.el.id;
    this.view.domTree.setRoot(document.documentElement);
    this.view.domTree.render();

    this.view.modal.open();
  }

  cancel() {
    this.view.modal.close();
  }

  select() {
    this.destination = this.view.domTree.selectedNode;
    this.view.dialog.open();
  }

  /**
   * Sets the mode to either 'Copy' or 'Move'.
   */
  setMode(mode) {
    this.mode = mode;
  }

  before() {
    AddonService.generate(this.target, (generator) => {
      var op = generator['op' + this.mode + 'Before'];
      op.call(generator, this.destination);

      this.view.dialog.close();
      this.view.modal.close();
    });
  }

  after() {
    AddonService.generate(this.target, (generator) => {
      var op = generator['op' + this.mode + 'After'];
      op.call(generator, this.destination);

      this.view.dialog.close();
      this.view.modal.close();
    });
  }

  prepend() {
    AddonService.generate(this.target, (generator) => {
      var op = generator['op' + this.mode + 'Prepend'];
      op.call(generator, this.destination);

      this.view.dialog.close();
      this.view.modal.close();
    });
  }

  append() {
    AddonService.generate(this.target, (generator) => {
      var op = generator['op' + this.mode + 'Append'];
      op.call(generator, this.destination);

      this.view.dialog.close();
      this.view.modal.close();
    });
  }
}
