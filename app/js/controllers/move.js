/* global Controller */

export default class MoveController extends Controller {
  constructor(options) {
    super(options);
  }

  open(target) {
    this.target = target;

    this.view.domTree.filter = '#' + this.mainController.view.el.id;
    this.view.domTree.setRoot(document.documentElement);
    this.view.domTree.render();
    this.view.domTree.unwatchChanges();

    this.view.modal.open();
  }

  cancel() {
    this.view.modal.close();
  }

  action() {

  }
}
