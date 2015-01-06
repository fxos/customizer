import { Controller } from 'components/fxos-mvc/dist/mvc';

import EditView from 'js/view/edit_view';

export default class EditController extends Controller {
	constructor() {
		this.view = new EditView();
	}

	main() {
		this.view.render();
		document.body.appendChild(this.view.el);
	}
}
