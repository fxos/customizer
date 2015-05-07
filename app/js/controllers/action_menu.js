/* global Controller */

/* global AddonService */

export default class ActionMenuController extends Controller {
  constructor(options) {
    super(options);
  }

  open(target) {
    this.target = target;
    // Only enable the View Source button if the element is
    // a <script> tag with a src attribute or a <link> tag with a href
    // attribute.
    // TODO: If the target is an image (or video or audio?) element, enable
    // a View Image button in the menu.
    this.view.enableViewSource(
      (target.tagName === 'SCRIPT' && target.hasAttribute('src')) ||
      (target.tagName === 'LINK' && target.hasAttribute('href')));
    this.view.dialog.open();
  }

  close() {
    this.view.dialog.close();
  }

  edit() {
    this.editController.open(this.target);
  }

  remove() {
    AddonService.generate(this.target, (generator) => {
      generator.opRemove();
    });
  }

  viewSource() {
    this.viewSourceController.open(this.target);
  }

  copyOrMove() {
    this.copyMoveController.open(this.target);
  }

  append() {
    this.appendChildController.open(this.target);
  }

  cancel() {
  }
}
