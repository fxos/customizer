/* global View */

var settingsViewTemplate =
`<gaia-modal class="settings">
  <gaia-header>
    <button data-action="close" data-icon="close"></button>
    <h1>Settings</h1>
    <button data-action="toggleMerging">Merge</button>
  </gaia-header>
  <gaia-list></gaia-list>
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
    this.list = this.$('gaia-list');
    this.mergeButton = this.$('button[data-action="toggleMerging"]');

    this.on('click', 'button', e => this._handleButtonClick(e));
    this.on('click', 'gaia-button', e => this._handleButtonClick(e));

    this.list.addEventListener('click', e => this._handleListClick(e));
  }

  template() {
    return settingsViewTemplate;
  }

  setMerging(merging) {
    if (merging) {
      this.mergeButton.textContent = 'Done';
    }

    else {
      this.mergeButton.textContent = 'Merge';
    }
  }

  setAddons(addons) {
    this.list.innerHTML = '';

    addons.forEach((addon) => {
      this.list.innerHTML +=
`<a data-manifest-url="${addon.manifestURL}">
  <div flex>
    <h3>${addon.manifest.name}</h3>
    <p>${addon.enabled ? 'Enabled' : 'Disabled'}</p>
  </div>
  <i data-icon="forward-light"></i>
</a>`;
    });

    this.list.innerHTML +=
`<div>
  <gaia-button flex data-action="addonManager">Open Add-on Manager</gaia-button>
</div>`;
  }

  _handleButtonClick(evt) {
    var action = this.controller[evt.target.dataset.action];
    if (typeof action === 'function') {
      action.call(this.controller, evt.target.dataset);
    }
  }

  _handleListClick(evt) {
    var target = evt.target.closest('a');
    if (!target) {
      return;
    }

    var manifestURL = target.dataset.manifestUrl;
    this.controller.showAddon(manifestURL);
  }
}
