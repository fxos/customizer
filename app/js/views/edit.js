/* global View */

/* global esprima */
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
    fxos-code-editor {
      display: block;
      width: 100%;
      height: 100%;
    }
    .errors {
      background: #e51e1e;
      color: #fff;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 20px;
      overflow: hidden;
      z-index: 2;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
    }
    .errors.active {
      opacity: 1;
    }
    .errors.active + fxos-code-editor {
      height: calc(100% - 20px);
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
    <fxos-code-editor></fxos-code-editor>
  </section>
  <section class="tab-pane" data-id="script">
    <div class="errors"></div>
    <fxos-code-editor></fxos-code-editor>
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

    this.htmlCodeEditor = this.$('section[data-id="html"] > fxos-code-editor');
    this.scriptCodeEditor = this.$('section[data-id="script"] > fxos-code-editor');
    this.attributeInspector = this.$('section[data-id="attributes"] > gaia-property-inspector');
    this.propertyInspector = this.$('section[data-id="properties"] > gaia-property-inspector');

    this.scriptErrors = this.$('section[data-id="script"] > .errors');

    this.tabPanes = [].slice.apply(this.$$('.tab-pane'));

    this.on('click', 'button[data-action="cancel"]', () => {
      this.controller.close();
    });

    this.on('click', 'button[data-action="save"]', () => {
      this.controller.save();
    });

    this.tabs.addEventListener('change', () => {
      this.tabPanes.forEach((tabPane, index) => {
        if (index === this.tabs.selected) {
          tabPane.classList.add('active');
        } else {
          tabPane.classList.remove('active');
        }
      });
    });

    this.htmlCodeEditor.addEventListener('change', () => {
      this.controller.changes.innerHTML = this.htmlCodeEditor.value;
    });

    this.scriptCodeEditor.addEventListener('change', () => {
      this.controller.changes.script = this.scriptCodeEditor.value;

      clearTimeout(this.validateScriptTimeout);
      this.validateScriptTimeout = setTimeout(this.validateScript.bind(this), 2000);
    });

    this.scriptCodeEditor.addEventListener('touchstart', () => {
      clearTimeout(this.validateScriptTimeout);
    });

    this.scriptCodeEditor.addEventListener('touchend', () => {
      clearTimeout(this.validateScriptTimeout);
      this.validateScriptTimeout = setTimeout(this.validateScript.bind(this), 2000);
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

    this.htmlCodeEditor.value = html;
    this.scriptCodeEditor.value =
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

  validateScript() {
    var error;

    try {
      var syntax = esprima.parse(this.controller.changes.script);
      if (syntax.errors && syntax.errors.length > 0) {
        error = syntax.errors[0];
      }
    }

    catch (e) {
      error = e;
    }

    if (error) {
      this.scriptErrors.textContent = error.message;
      this.scriptErrors.classList.add('active');
    }

    else {
      this.scriptErrors.textContent = '';
      this.scriptErrors.classList.remove('active');
    }
  }
}
