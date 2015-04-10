/* global View */

var appendChildViewTemplate = `
<style scoped>
.shadow-host {
  z-index: 10000001;
}
</style>
<gaia-dialog-prompt></gaia-dialog-prompt>
`;

export default class AppendChildView extends View {
  constructor(options) {
    super(options);

    this.el.className = 'fxos-customizer-append-child-view';

    this.render();
  }

  init(controller) {
    super(controller);

    this.dialog = this.$('gaia-dialog-prompt');
    this.dialog.els.input.placeholder = 'New element tagName, e.g. "div"';
    this.dialog.els.submit.addEventListener('click', this._submit.bind(this));
  }

  template() {
    return appendChildViewTemplate;
  }

  open() {
    this.dialog.open();
  }

  _submit(e) {
    this.controller.submit(this.dialog.els.input.value); // tagName
  }
}
