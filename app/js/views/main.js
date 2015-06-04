/* global View */

/* global AddonService */

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

  div.fxos-customizer-container {
    background-color: var(--background);
    position: fixed;
    left: 0;
    right: 0;
    top: 100%; /* off-screen by default, animated translate to show and hide */
    height: 50vh;
    border-top: 1px solid #ccc;
    /*
     * this needs to go on top of the regular app, but below
     * gaia-modal and gaia-dialog which we override elsewhere.
     */
    z-index: 10000000;

    /* We show and hide this with an animated transform */
    transition: transform 150ms;
  }

  /*
   * Add this show class to animate the container onto the screen,
   * and remove it to animate the container off.
   */
  .fxos-customizer-container.show {
    transform: translateY(-100%);
  }
</style>
<style>
/*
 * These styles need to be applied globally to the app when the customizer
 * is displayed so that the user can scroll to see all of the app even
 * with the customizer taking up the bottom half of the screen.
 *
 * Note that this stylesheet is not scoped and is disabled by default.
 */
html, body {
  overflow-y: initial !important;
}

body {
  padding-bottom: 50vh !important;
}
</style>
<div class="fxos-customizer-container"><fxos-customizer></fxos-customizer></div>
<div class="fxos-customizer-child-views">
<fxos-customizer-highlighter></fxos-customizer-highlighter>
</div>`;

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

    this.container = this.$('div.fxos-customizer-container');
    this.childViews = this.$('div.fxos-customizer-child-views');
    this.customizer = this.$('fxos-customizer');
    this.highlighter = this.$('fxos-customizer-highlighter');

    // We put all of the other view elements that the app needs into the
    // childViews container, so that we can add and remove them all at once.
    this.childViews.appendChild(this.editView.el);
    this.childViews.appendChild(this.viewSourceView.el);
    this.childViews.appendChild(this.appendChildView.el);
    this.childViews.appendChild(this.copyMoveView.el);

    // Hide this view from the DOM tree.
    this.customizer.gaiaDomTree.filter = '#' + this.el.id;

    this.on('menu', 'fxos-customizer', () => this.controller.openAddonManager());

    this.on('action:edit', 'fxos-customizer', (evt) => {
      this.controller.editController.open(evt.detail);
    });

    this.on('action:copyOrMove', 'fxos-customizer', (evt) => {
      this.controller.copyMoveController.open(evt.detail);
    });

    this.on('action:append', 'fxos-customizer', (evt) => {
      this.controller.appendChildController.open(evt.detail);
    });

    this.on('action:remove', 'fxos-customizer', (evt) => {
      AddonService.generate(evt.detail, (generator) => {
        generator.opRemove();
      });
    });

    this.on('action:viewSource', 'fxos-customizer', (evt) => {
      this.controller.viewSourceController.open(evt.detail);
    });

    this.on('selected', 'fxos-customizer', (evt) => {
      this.highlighter.highlight(evt.detail);
    });
  }

  template() {
    return mainViewTemplate;
  }

  _addToBody() {
    document.body.appendChild(this.el);
  }

  _removeFromBody() {
    document.body.removeChild(this.el);
  }

  open() {
    // Add the fxos-customizer element and the other elements we need
    this._addToBody();

    return new Promise((resolve, reject) => {
      window.requestAnimationFrame(() => {
        // Start the opening animation for the customizer
        this.container.classList.add('show');
      });

      // Wait for the animation to end, then:
      var listener = () => {
        this.container.removeEventListener('transitionend', listener);
        // Resolve the promise
        resolve();
      };

      this.container.addEventListener('transitionend', listener);
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      window.requestAnimationFrame(() => {
        // Start hiding the customizer with an animated transition
        this.container.classList.remove('show');
        // Erase any highlight right away
        this.highlighter.highlight(null);
        // Scroll the app to the top before beginning the transition
        // so we don't see the blank white padding as the panel slides down
        document.body.scrollIntoView();
      });

      // Wait for the transition to end, then:
      var listener = () => {
        this.container.removeEventListener('transitionend', listener);
        // Remove all the unnecessary elements from the document
        this._removeFromBody();
        // And resolve the promise
        resolve();
      };

      this.container.addEventListener('transitionend', listener);
    });
  }
}
