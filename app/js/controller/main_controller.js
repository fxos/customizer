/* global EditController */
/* global MainView */

/* global Controller */

export default class MainController extends Controller {
  constructor() {
    this.view = new MainView({el: document.body});
    this.controllers = {
      'edit': new EditController()
    };
    this.activeController = null;
  }

  main() {
    // Add the listener for entering edit mode.
    window.addEventListener('touchstart', () => {
      window.alert('Got touch on: ' + location.href);
    });

    this.view.render();
    window.addEventListener('hashchanged', this.route.bind(this));
    this.route();
  }

  route() {
    var route = window.location.hash;
    switch (route) {
      default: this.activeController = this.controllers.edit;
      break;
    }
    this.activeController.main();
  }
}
