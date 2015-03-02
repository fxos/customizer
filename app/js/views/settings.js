/* global View */

var settingsViewTemplate =
`<gaia-modal class="settings">
  <gaia-header>
    <button data-action="close">Close</button>
    <h1>Settings</h1>
    <button data-action="addons">All Add-ons</button>
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

    // this.on('change', 'gaia-switch', this._handleChange.bind(this));
  }

  template() {
    return settingsViewTemplate;
  }

  setAddons(addons) {
    this.addons.innerHTML = '';

    addons.forEach((addon) => {
      var installTime = new Date(addon.installTime);
console.log(addon);
      this.addons.innerHTML +=
`<li flexbox>
  <span flex>
    <gaia-switch data-origin="${addon.origin}" data-enabled="${addon.enabled}"></gaia-switch>
  </span>
  <span flex>
    ${installTime.toLocaleDateString()}
    <span class="addon-time">
      ${installTime.toLocaleTimeString()}
    </span>
  </span>
  <span flex>
    <gaia-button circular data-action="uninstall" data-origin="${addon.origin}">
      <i data-icon="delete"></i>
    </gaia-button>
  </span>
</li>`;
    });

    [].forEach.call(this.addons.querySelectorAll('gaia-switch'), (gs) => {
      if (gs.dataset.enabled === 'true') {
        gs.setAttribute('checked', true);
      }

      delete gs.dataset.enabled;
    });

    // XXX - Shouldn't have to do this, but 'change' is not propagating
    [].forEach.call(document.querySelectorAll('gaia-switch'), (gs) => {
      gs.addEventListener('change', this._handleChange.bind(this));
    });
  }

  _handleClick(evt) {
    var action = this.controller[evt.target.dataset.action];
    if (typeof action === 'function') {
      action.call(this.controller, evt.target.dataset);
    }
  }

  _handleChange(evt) {
    var gaiaSwitch = evt.target;
    if (gaiaSwitch.checked) {
      this.controller.enableAddon(gaiaSwitch.dataset);
    }

    else {
      this.controller.disableAddon(gaiaSwitch.dataset);
    }
  }
}
