/* global Controller */

/* global AddonService */

export default class MoveController extends Controller {
  constructor(options) {
    super(options);
  }

  open(target) {
    this.target = target;

    this.view.domTree.filter = '#' + this.mainController.view.el.id;
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

  before() {
    AddonService.generate(this.target, (generator) => {
      generator.moveBefore(this.destination);

      this.view.modal.close();
    });
  }

  after() {
    AddonService.generate(this.target, (generator) => {
      generator.moveAfter(this.destination);

      this.view.modal.close();
    });
  }

  prepend() {
    AddonService.generate(this.target, (generator) => {
      generator.movePrepend(this.destination);

      this.view.modal.close();
    });
  }

  append() {
    AddonService.generate(this.target, (generator) => {
      generator.moveAppend(this.destination);

      this.view.modal.close();
    });
  }
}
