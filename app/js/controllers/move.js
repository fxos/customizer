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
      generator.opMoveBefore(this.destination);

      this.view.modal.close();
    });
  }

  after() {
    AddonService.generate(this.target, (generator) => {
      generator.opMoveAfter(this.destination);

      this.view.modal.close();
    });
  }

  prepend() {
    AddonService.generate(this.target, (generator) => {
      generator.opMovePrepend(this.destination);

      this.view.modal.close();
    });
  }

  append() {
    AddonService.generate(this.target, (generator) => {
      generator.opMoveAppend(this.destination);

      this.view.modal.close();
    });
  }
}
