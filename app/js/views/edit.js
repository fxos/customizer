/* global View */

var editViewTemplate =
`<gaia-modal>
  <style scoped>
  gaia-tabs {
    position: absolute !important;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  </style>
  <gaia-header>
    <h1>Edit</h1>
    <button data-action="close">Done</button>
  </gaia-header>
  <gaia-tabs>
    <a href="#">HTML</a>
    <a href="#">Attributes</a>
    <a href="#">Properties</a>
    <a href="#">Events</a>
  </gaia-tabs>
</gaia-modal>`;

export default class EditView extends View {
  constructor(options) {
    super(options);

    this.el.className = 'fxos-customizer-edit-view';

    this.render();
  }

  init(controller) {
    super(controller);

    this.modal  = this.$('gaia-modal');
    this.header = this.$('gaia-header');
    this.tabs   = this.$('gaia-tabs');

    this.on('click', 'button[data-action="close"]', (evt) => {
      this.controller.close();
    });

    this.tabs.addEventListener('change', (evt) => {
      console.log('gaia-tabs::change', this.tabs.selected);
    });
  }

  template() {
    return editViewTemplate;
  }
}
