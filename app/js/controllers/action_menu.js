/* global Controller */

export default class ActionMenuController extends Controller {
  constructor(options) {
    super(options);
  }

  open(target) {
    this.target = target;

    this.view.dialog.open();
  }

  close() {
    this.view.dialog.close();
  }

  edit() {
    this.editController.open(this.target);
  }

  remove() {
    this.target.remove();
  }

  move() {

  }

  cancel() {

  }
}
