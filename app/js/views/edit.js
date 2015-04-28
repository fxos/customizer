/* global View */

/* global html_beautify */

var editViewTemplate =
`<gaia-modal>
  <style scoped>
    .gaia-modal {
      background: var(--background, #fff);
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .gaia-modal.active {
      display: block;
    }
    .tab-pane {
      box-sizing: padding-box;
      display: none;
      position: absolute;
      top: 96px;
      bottom: 0;
      left: 0;
      width: 100%;
      height: auto;
    }
    .tab-pane.active {
      display: block;
    }
    textarea {
      border: none;
      font-family: Consolas,Monaco,"Andale Mono",monospace;
      width: 100%;
      height: 100%;
    }
    textarea,
    input {
      -moz-user-select: text !important;
    }
    gaia-property-inspector {
      --background: #000;
      --header-background: #000;
    }
    textarea,
    gaia-tabs,
    .tab-pane {
      background: #000;
      color: #fff;
    }
  </style>
  <gaia-header>
    <button data-action="cancel" data-icon="close"></button>
    <h1>Edit</h1>
    <button data-action="save">Save</button>
  </gaia-header>
  <gaia-tabs selected="0">
    <a href="#">HTML</a>
    <a href="#">Script</a>
    <a href="#">Attributes</a>
    <a href="#">Properties</a>
  </gaia-tabs>
  <section class="tab-pane active" data-id="html">
    <textarea></textarea>
  </section>
  <section class="tab-pane" data-id="script">
    <textarea></textarea>
  </section>
  <section class="tab-pane" data-id="attributes">
    <gaia-property-inspector root-property="attributes" data-textarea="textarea"></gaia-property-inspector>
  </section>
  <section class="tab-pane" data-id="properties">
    <gaia-property-inspector data-textarea="textarea"></gaia-property-inspector>
  </section>
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
    this.scriptTextarea = this.$('section[data-id="script"] > textarea');
    this.attributeInspector = this.$('section[data-id="attributes"] > gaia-property-inspector');
    this.propertyInspector = this.$('section[data-id="properties"] > gaia-property-inspector');

    this.tabPanes = [].slice.apply(this.$$('.tab-pane'));

    this.on('click', 'button[data-action="cancel"]', (evt) => {
      this.controller.close();
    });

    this.on('click', 'button[data-action="save"]', (evt) => {
      this.controller.save();
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

    this.scriptTextarea.addEventListener('keyup', (evt) => {
      this.controller.changes.script = this.scriptTextarea.value;
    });

    this.on('save', 'gaia-property-inspector', (evt) => {
      var keyPath = [];
      var parts = evt.detail.path.substr(1).split('/');
      parts.forEach((part) => keyPath.push(part));
      keyPath = keyPath.join('.');

      this.controller.changes.properties = this.controller.changes.properties || {};
      this.controller.changes.properties[keyPath] = evt.detail.newValue;
    });

    this.el.addEventListener('contextmenu', (evt) => {
      evt.stopPropagation();
    });
  }

  template() {
    return editViewTemplate;
  }

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  setTarget(target) {
    var clonedTarget = target.cloneNode(true);
    var html = html_beautify(clonedTarget.innerHTML.trim(), {
      indent_size: 2
    });

    this.htmlTextarea.value = html;
    this.scriptTextarea.value =
`/**
 * You can edit a script to be inserted
 * in the generated add-on here.
 *
 * Globals:
 *   selector [String]
 *   el       [HTMLElement]
 *   mo       [MutationObserver]
 */

 //el.addEventListener('click', function(evt) {
 //  alert('Clicked!');
 //});
`;

    this.attributeInspector.set(clonedTarget);
    this.propertyInspector.set(clonedTarget);
  }
}
