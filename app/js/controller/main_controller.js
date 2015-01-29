/* global MainView */

/* global ActionMenuController */

/* global Controller */

export default class MainController extends Controller {
	constructor() {
		this.view = new MainView({el: document.body});

		window.ActionMenuController = new ActionMenuController();
	}

	main() {
		window.addEventListener('contextmenu', this._handleContextmenu.bind(this));
	}

	_handleContextmenu(e) {
		if (!this._customizer) {
			this._customizer = document.createElement('fxos-customizer');
			document.body.appendChild(this._customizer);

			this._highlighter = document.createElement('fxos-customizer-highlighter');
			document.body.appendChild(this._highlighter);
		}
	}
}
