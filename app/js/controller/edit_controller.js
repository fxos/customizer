/* global EditView */

export default class EditController extends Controller {
	constructor() {
		this.view = new EditView();
	}

	main() {
		this.view.render();
		document.body.appendChild(this.view.el);
	}
}
