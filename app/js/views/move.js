/* global View */

var moveViewTemplate =
`<gaia-modal class="move">
  <gaia-header>
    <button data-action="cancel">Cancel</button>
    <h1>Move</h1>
    <button data-action="action">Action</button>
  </gaia-header>
  <section>
    <gaia-dom-tree></gaia-dom-tree>
  </section>
</gaia-modal>`;

export default class MoveView extends View {
  constructor(options) {
    super(options);

    this.el.className = 'fxos-customizer-move-view';

    this.render();
  }

  init(controller) {
    super(controller);

    this.modal   = this.$('gaia-modal');
    this.domTree = this.$('gaia-dom-tree');

    this.on('click', 'button', this._handleClick.bind(this));
    this.on('longpressed', 'gaia-dom-tree', this._handleLongPressed.bind(this));
    this.on('contextmenu', 'gaia-dom-tree', (evt) => {
      evt.stopPropagation();
    });
  }

  template() {
    return moveViewTemplate;
  }

  _handleClick(evt) {
    var action = this.controller[evt.target.dataset.action];
    if (typeof action === 'function') {
      action.call(this.controller, evt.target.dataset);
    }
  }

  _handleLongPressed(evt) {

  }
}
