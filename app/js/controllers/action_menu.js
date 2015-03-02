/* global Controller */

/* global AddonGenerator */

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
    var generator = new AddonGenerator(this.target);

    generator.manifest.customizations = [{
      filter: window.location.origin,
      scripts: ['main.js']
    }];

    generator.remove();

    this.mainController.installAddon(generator.generate());
  }

  viewsource() {
    this.viewSourceController.open(this.target);
  }

  move() {

  }

  append() {
    this.appendChildController.open(this.target);
  }

  cancel() {
  }
}
