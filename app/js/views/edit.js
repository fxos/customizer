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
  .tab-pane {
    box-sizing: padding-box;
    position: absolute;
    padding: 10px;
    top: 50px;
    bottom: 46px;
    left: 0;
    width: 100%;
    opacity: 0;
    transition: opacity 0.1s;
    pointer-events: none;
  }
  .tab-pane.active {
    opacity: 1;
    pointer-events: auto;
  }
  textarea {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
  }
  </style>
  <gaia-header>
    <button data-action="cancel">Cancel</button>
    <h1>Edit</h1>
    <button data-action="save">Save</button>
  </gaia-header>
  <section class="tab-pane active" data-id="html">
    <textarea></textarea>
  </section>
  <section class="tab-pane" data-id="attributes">
    <h3>Attributes</h3>
  </section>
  <section class="tab-pane" data-id="properties">
    <h3>Properties</h3>
    <gaia-property-inspector data-textarea="textarea"></gaia-property-inspector>
  </section>
  <section class="tab-pane" data-id="events">
    <h3>Events</h3>
  </section>
  <gaia-tabs selected="0">
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

    this.htmlTextarea = this.$('section[data-id="html"] > textarea');
    this.propertyInspector = this.$('gaia-property-inspector');

    this.tabPanes = [].slice.apply(this.$$('.tab-pane'));

    this.on('click', 'button[data-action="cancel"]', (evt) => {
      this.controller.close();
    });

    this.on('click', 'button[data-action="save"]', (evt) => {
      this.controller.save();
      this.controller.close();
    });

    this.tabs.addEventListener('change', (evt) => {
      this.tabPanes.forEach((tabPane, index) => {
        if (index === this.tabs.selected) {
          tabPane.classList.add('active');
        } else {
          tabPane.classList.remove('active');
        }
      });
    });

    this.htmlTextarea.addEventListener('keyup', (evt) => {
      this.controller.changes.innerHTML = this.htmlTextarea.value;
    });
  }

  template() {
    return editViewTemplate;
  }

  setTarget(target) {
    this.htmlTextarea.value = target.innerHTML;
    this.propertyInspector.set(target);
  }
}
