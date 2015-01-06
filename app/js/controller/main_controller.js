import {Controller} from 'components/fxos-mvc/dist/mvc';
import MainView from 'js/view/main_view';
import EditController from 'js/controller/edit_controller';

export default class MainController extends Controller {
	constructor() {
		this.view = new MainView({el: document.body});
		this.controllers = {
			'edit': new EditController()
		};
		this.activeController = null;
	}

	main() {
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
