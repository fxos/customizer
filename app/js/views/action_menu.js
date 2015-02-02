/* global View */

var actionMenuViewTemplate =
`<gaia-dialog>
  <button type="button" data-action="edit">Edit</button>
  <button type="button" data-action="remove">Remove</button>
  <button type="button" data-action="move">Move</button>
  <button type="button" data-action="cancel">Cancel</button>
</gaia-dialog>`;

export default class ActionMenuView extends View {
  constructor(options) {
    super(options);

    this.el.className = 'fxos-customizer-action-view';

    this.render();
  }

  init(controller) {
    super(controller);

    this.dialog = this.$('gaia-dialog');

    this.on('click', 'button', (evt) => {
      var action = this.controller[evt.target.dataset.action];
      if (typeof action === 'function') {
        action.call(this.controller);
      }

      this.dialog.close();
    });
  }

  template() {
    return actionMenuViewTemplate;
  }
}
