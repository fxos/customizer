/* global View */

var mainViewTemplate =
`<style scoped>
  .fxos-customizer-main-view {
    font-size: 14px;

    /** Grey Colors
     ---------------------------------------------------------*/

    --color-alpha: #333333;
    --color-beta: #ffffff;
    --color-gamma: #4d4d4d;
    --color-delta: #5f5f5f;
    --color-epsilon: #858585;
    --color-zeta: #a6a6a6;
    --color-eta: #c7c7c7;
    --color-theta: #e7e7e7;
    --color-iota: #f4f4f4;

  /** Brand Colors
   ---------------------------------------------------------*/

    --color-darkblue: #00539f;
    --color-blue: #00caf2;
    --color-turquoise: #27c8c2;
    --color-darkorange: #e66000;
    --color-orange: #ff9500;
    --color-yellow: #ffcb00;
    --color-violet: #c40c84;

    --color-warning: #fbbd3c;
    --color-destructive: #e2443a;
    --color-preffered: #00ba91;

    /** Background
     ---------------------------------------------------------*/

    --background: var(--color-alpha);
    --background-plus: var(--color-gamma);
    --background-minus: #2B2B2B;
    --background-minus-minus: #1a1a1a;

    /** Borders
     ---------------------------------------------------------*/

    --border-color: var(--color-gamma);

    /** Highlight Color
     ---------------------------------------------------------*/

    --highlight-color: var(--color-blue);

    /** Text Color
     ---------------------------------------------------------*/

    --text-color: var(--color-beta);
    --text-color-minus: var(--color-eta);

    /** Button
     ---------------------------------------------------------*/

    --button-background: var(--background-plus);

    /** Links
     ---------------------------------------------------------*/

    --link-color: var(--highlight-color);

    /** Inputs
     ---------------------------------------------------------*/

    --input-background: var(--background-plus);
    --input-color: var(--color-alpha);
    --input-clear-background: #909ca7;

    /** Buttons
     ---------------------------------------------------------*/

     --button-box-shadow: none;
     --button-box-shadow-active: none;

    /** Header
     ---------------------------------------------------------*/

    --header-background: var(--background);
    --header-icon-color: var(--text-color);
    --header-button-color: var(--highlight-color);
    --header-disabled-button-color: rgba(255,255,255,0.3);

    /** Text Input
     ---------------------------------------------------------*/

    --text-input-background: var(--background-minus);

    /** Switch
     ---------------------------------------------------------*/

    --switch-head-border-color: var(--background-minus-minus);
    --switch-background: var(--background-minus-minus);

    /** Checkbox
     ---------------------------------------------------------*/

    --checkbox-border-color: var(--background-minus-minus);
  }
</style>
<fxos-customizer></fxos-customizer>
<fxos-customizer-highlighter></fxos-customizer-highlighter>`;

export default class MainView extends View {
  constructor(options) {
    super(options);

    // Give this view a unique ID.
    this.el.id = 'customizer-' + Date.now();
    this.el.className = 'fxos-customizer-main-view';

    this.render();
  }

  init(controller) {
    super(controller);

    this.customizer = this.$('fxos-customizer');
    this.highlighter = this.$('fxos-customizer-highlighter');

    // Hide this view from the DOM tree.
    this.customizer.gaiaDomTree.filter = '#' + this.el.id;

    this.on('menu', 'fxos-customizer', (evt) => {
      this.customizer.unwatchChanges();
      this.controller.settingsController.open();

      setTimeout(this.customizer.watchChanges.bind(this.customizer), 1000);
    });

    this.on('action', 'fxos-customizer', (evt) => {
      this.customizer.unwatchChanges();
      this.controller.actionMenuController.open(evt.detail);

      setTimeout(this.customizer.watchChanges.bind(this.customizer), 1000);
    });

    this.on('selected', 'fxos-customizer', (evt) => {
      this.highlighter.highlight(evt.detail);
    });
  }

  template() {
    return mainViewTemplate;
  }

  render() {
    super();

    this.el.appendChild(this.actionMenuView.el);
    this.el.appendChild(this.editView.el);
    this.el.appendChild(this.settingsView.el);
    this.el.appendChild(this.viewSourceView.el);
    this.el.appendChild(this.appendChildView.el);
    this.el.appendChild(this.moveView.el);
  }
}
