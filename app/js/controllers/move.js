/* global Controller */

/* global AddonGenerator */
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
    var generator = new AddonGenerator(this.target);
    generator.manifest.customizations = [{
      filter: window.location.origin,
      scripts: ['main.js']
    }];
    generator.moveBefore(this.destination);
    AddonService.install(generator.generate());

    this.view.modal.close();
  }

  after() {
    var generator = new AddonGenerator(this.target);
    generator.manifest.customizations = [{
      filter: window.location.origin,
      scripts: ['main.js']
    }];
    generator.moveAfter(this.destination);
    AddonService.install(generator.generate());

    this.view.modal.close();
  }

  prepend() {
    var generator = new AddonGenerator(this.target);
    generator.manifest.customizations = [{
      filter: window.location.origin,
      scripts: ['main.js']
    }];
    generator.movePrepend(this.destination);
    AddonService.install(generator.generate());

    this.view.modal.close();
  }

  append() {
    var generator = new AddonGenerator(this.target);
    generator.manifest.customizations = [{
      filter: window.location.origin,
      scripts: ['main.js']
    }];
    generator.moveAppend(this.destination);
    AddonService.install(generator.generate());

    this.view.modal.close();
  }
}
