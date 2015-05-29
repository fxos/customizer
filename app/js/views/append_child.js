/* global View */

var appendChildViewTemplate = `
<style scoped>
.shadow-host {
  z-index: 10000001;
}
</style>
<gaia-dialog-prompt>Enter new element name, e.g. "div"</gaia-dialog-prompt>
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

    // Automatically set focus to the input box when the
    // <gaia-dialog-prompt> is opened.
    this.dialog.addEventListener('opened', () => {
      this.dialog.els.input.focus();
    });

    // Reset the <gaia-dialog-prompt> value when closed.
    this.dialog.addEventListener('closed', () => {
      this.dialog.els.input.value = '';
    });

    // Submit the new element tag name when the
    // <gaia-dialog-prompt> is submitted.
    this.dialog.els.submit.addEventListener('click', () => {
      this.controller.submit(this.dialog.els.input.value);
    });
  }

  template() {
    return appendChildViewTemplate;
  }

  open() {
    this.dialog.open();
  }
}
