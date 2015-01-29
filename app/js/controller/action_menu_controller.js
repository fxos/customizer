/* global ActionMenuView */

/* global Controller */

export default class ActionMenuController extends Controller {
  constructor() {
    this.view = new ActionMenuView();
  }

  main(target) {
    this.view.render(target);
    document.body.appendChild(this.view.el);
  }
}
