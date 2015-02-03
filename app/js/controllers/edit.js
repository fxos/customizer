/* global Controller */

export default class EditController extends Controller {
  constructor(options) {
    super(options);
  }

  open(target) {
    this.target = target;

    this.view.setTarget(target);
    this.view.modal.open();
  }

  close() {
    this.view.modal.close();
  }
}
