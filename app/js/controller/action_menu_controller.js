/* global ActionMenuView */

/* global Controller */

export default class ActionMenuController extends Controller {
  constructor() {
    this.view = new ActionMenuView();
  }

  main() {
    this.view.render();
    document.body.appendChild(this.view.el);
  }
}
