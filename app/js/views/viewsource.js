/* global View */

var viewSourceViewTemplate = `
<style scoped>
gaia-modal {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
gaia-header {
  height: 40px;
  border-bottom: solid white 1px;
}
pre {
  left: 0;
  top: 40px;
  width: 100%;
  height: calc(100% - 40px);
  overflow: scroll;
  padding: 5px;
}
</style>
<gaia-modal>
  <gaia-header>
    <button data-action="close">Close</button>
    <h1>Source View</h1>
  </gaia-header>
  <pre>
  </pre>
</gaia-modal>`;

export default class ViewSourceView extends View {

  constructor(options) {
    super(options);
    this.el.className = 'fxos-customizer-view-source-view';
    this.render();
  }

  init(controller) {
    super(controller);

    this.modal  = this.$('gaia-modal');
    this.title = this.$('h1');
    this.pre = this.$('pre');

    this.on('click', 'button', (evt) => {
      var action = this.controller[evt.target.dataset.action];
      if (typeof action === 'function') {
        action.call(this.controller, evt.target.dataset);
      }
    });
  }

  template() {
    return viewSourceViewTemplate;
  }

  setTitle(title) {
    this.title.textContent = title;
  }

  setSource(source) {
    this.pre.textContent = source;
  }

  open() { this.modal.open(); }

  close() { this.modal.close(); }
}
