/* global EditController */
/* global MainView */

export default class MainController extends Controller {
	constructor() {
		this.view = new MainView({el: document.body});
		this.controllers = {
			'edit': new EditController()
		};
		this.activeController = null;
	}

	main() {
		window.alert('omg got main!!!');
		this.view.render();
		window.addEventListener('hashchanged', this.route.bind(this));
		this.route();
		document.body.classList.remove('loading');
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
