/* global View */

var copyMoveViewTemplate =
`<gaia-modal>
  <gaia-header>
    <button type="button" data-action="cancel">Cancel</button>
    <h1>Copy/Move</h1>
    <button type="button" data-action="select">Select</button>
  </gaia-header>
  <gaia-tabs selected="0">
    <a href="#" data-mode="Copy">Copy</a>
    <a href="#" data-mode="Move">Move</a>
  </gaia-tabs>
  <section>
    <gaia-dom-tree></gaia-dom-tree>
  </section>
  <gaia-dialog>
    <button type="button" data-action="before">Insert Before</button>
    <button type="button" data-action="after">Insert After</button>
    <button type="button" data-action="prepend">Prepend</button>
    <button type="button" data-action="append">Append</button>
    <button type="button" on-click="close">Cancel</button>
  </gaia-dialog>
</gaia-modal>`;

export default class CopyMoveView extends View {
  constructor(options) {
    super(options);

    this.el.className = 'fxos-customizer-copy-move-view';

    this.render();
  }

  init(controller) {
    super(controller);

    this.modal   = this.$('gaia-modal');
    this.tabs    = this.$('gaia-tabs');
    this.domTree = this.$('gaia-dom-tree');
    this.dialog  = this.$('gaia-dialog');

    this.tabs.addEventListener('change', this._handleModeChange.bind(this));

    this.on('click', 'button', this._handleClick.bind(this));
    this.on('contextmenu', 'gaia-dom-tree', (evt) => {
      evt.stopPropagation();
    });
  }

  template() {
    return copyMoveViewTemplate;
  }

  _handleModeChange(evt) {
    this.controller.setMode(this.tabs.selectedChild.dataset.mode);
  }

  _handleClick(evt) {
    var action = this.controller[evt.target.dataset.action];
    if (typeof action === 'function') {
      action.call(this.controller, evt.target.dataset);
    }
  }
}
