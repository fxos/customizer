/* global View */

var mainViewTemplate =
`<fxos-customizer></fxos-customizer>
<fxos-customizer-highlighter></fxos-customizer-highlighter>`;

export default class MainView extends View {
	constructor(options) {
		super(options);

		this.render();
	}

	init(controller) {
		super(controller);

		this.customizer = this.$('fxos-customizer');
		this.highlighter = this.$('fxos-customizer-highlighter');

		this.on('action', 'fxos-customizer', (evt) => {
			this.controller.actionMenuController.open(evt.detail);
		});
	}

	template() {
		return mainViewTemplate;
	}

	render() {
		super();

		this.el.appendChild(this.actionMenuView.el);
		this.el.appendChild(this.editView.el);
	}
}
