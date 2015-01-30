/* global View */

var editViewTemplate =
`<gaia-modal>Editor goes here</gaia-modal>`;

export default class EditView extends View {
  constructor(options) {
  	super(options);

  	this.render();
  }

  init(controller) {
  	super(controller);

  	this.modal = this.$('gaia-modal');
  }

  template() {
  	return editViewTemplate;
  }
}
