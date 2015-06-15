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
      box-sizing: border-box;
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
    <button aria-hidden="true" data-action="cancel" data-icon="close"></button>
    <h1>Edit</h1>
    <button data-action="save">Save</button>
  </gaia-header>
  <gaia-tabs selected="0">
    <a href="#">HTML</a>
    <a href="#">Script</a>
    <a href="#">Properties</a>
  </gaia-tabs>
  <section class="tab-pane active" data-id="html">
    <fxos-code-editor></fxos-code-editor>
  </section>
  <section class="tab-pane" data-id="script">
    <div class="errors"></div>
    <fxos-code-editor></fxos-code-editor>
  </section>
  <section class="tab-pane" data-id="properties">
    <fxos-inspector></fxos-inspector>
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
    this.propertyInspector = this.$('section[data-id="properties"] > fxos-inspector');

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

    this.propertyInspector.addEventListener('createattribute', (evt) => {
      var detail = JSON.parse(evt.detail);

      this.controller.changes.createAttributes = this.controller.changes.createAttributes || {};
      this.controller.changes.createAttributes[detail.expression] = detail.name;
    });

    this.propertyInspector.addEventListener('removeattribute', (evt) => {
      var detail = JSON.parse(evt.detail);

      this.controller.changes.removeAttributes = this.controller.changes.removeAttributes || {};
      this.controller.changes.removeAttributes[detail.expression] = detail.name;
    });

    this.propertyInspector.addEventListener('save', (evt) => {
      var detail = JSON.parse(evt.detail);

      this.controller.changes.properties = this.controller.changes.properties || {};
      this.controller.changes.properties[detail.expression] = detail.value;
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
    var html = clonedTarget.innerHTML.trim();

    this.htmlCodeEditor.value = 'Loading...';

    setTimeout(() => {
      html = html_beautify(html, {
        indent_size: 2
      });

      this.htmlCodeEditor.value = html;
    }, 1);

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

    this.propertyInspector.setRootTarget(clonedTarget);
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
