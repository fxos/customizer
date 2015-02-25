/* global View */

var settingsViewTemplate =
`<gaia-modal class="settings">
  <gaia-header>
   <button data-action="close">Close</button>
    <h1>Settings</h1>
  </gaia-header>
  <section>
    <gaia-sub-header>Installed Add-ons</gaia-sub-header>
    <gaia-list></gaia-list>
  </section>
</gaia-modal>`;

export default class SettingsView extends View {
  constructor(options) {
    super(options);

    this.el.className = 'fxos-customizer-settings-view';

    this.render();
  }

  init(controller) {
    super(controller);

    this.modal  = this.$('gaia-modal');
    this.addons = this.$('gaia-list');

    this.on('click', 'gaia-button', this._handleClick.bind(this));
    this.on('click', 'button', this._handleClick.bind(this));
  }

  template() {
    return settingsViewTemplate;
  }

  setAddons(addons) {
    this.addons.innerHTML = '';

    addons.forEach((addon) => {
      var installTime = new Date(addon.installTime);

      this.addons.innerHTML +=
`<a flexbox>
  <span flex>
    ${installTime.toLocaleDateString()}
    <span class="addon-time">
      ${installTime.toLocaleTimeString()}
    </span>
  </span>
  <span flex>
    <gaia-button circular data-action="uninstall" data-origin="${addon.origin}">
      <i data-icon="close"></i>
    </gaia-button>
  </span>
</a>`;
    });
  }

  _handleClick(evt) {
    var action = this.controller[evt.target.dataset.action];
    if (typeof action === 'function') {
      action.call(this.controller, evt.target.dataset);
    }
  }
}
