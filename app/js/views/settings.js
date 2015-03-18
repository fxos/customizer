/* global View */

var settingsViewTemplate =
`<style scoped>
  .hidden {
    display: none;
  }
</style>
<gaia-modal class="settings">
  <gaia-header>
    <button data-action="close">Close</button>
    <h1>Settings</h1>
    <button data-action="mergeMode">Merge</button>
    <button data-action="doneMerging" disabled hidden>Done</button>
  </gaia-header>
  <section>
    <gaia-sub-header>Installed Add-ons</gaia-sub-header>
    <gaia-list></gaia-list>
    <gaia-button data-action="addons">All Add-ons</gaia-button>
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
    this.header = this.$('gaia-header');
    this.addons = this.$('gaia-list');

    this.closeButton       = this.$('button[data-action="close"]');
    this.mergeModeButton   = this.$('button[data-action="mergeMode"]');
    this.doneMergingButton = this.$('button[data-action="doneMerging"]');

    this.on('click', 'gaia-button', this._handleClick.bind(this));
    this.on('click', 'button', this._handleClick.bind(this));
    this.on('click', 'a', this._handleClick.bind(this));

    this.on('click', 'gaia-checkbox', () => setTimeout(this._handleSelectionChange.bind(this)));
    this.addons.addEventListener('click', this._handleSelectionChange.bind(this));
  }

  template() {
    return settingsViewTemplate;
  }

  setAddons(addons, mergeMode) {
    this.addons.innerHTML = '';

    addons.forEach((addon) => {
      var installTime = new Date(addon.installTime);

      this.addons.innerHTML += mergeMode ?
`<li flexbox>
  <span flex>
    <gaia-checkbox id="${addon.origin}"></gaia-checkbox>
  </span>
  <label for="${addon.origin}" flex>
    ${addon.manifest.name}
    <span class="addon-time">
      ${installTime.toLocaleDateString()}
      ${installTime.toLocaleTimeString()}
    </span>
  </label>
</li>` :
`<li flexbox>
  <a flex data-action="addonDetail" data-origin="${addon.origin}">
    ${addon.manifest.name}
    <span class="addon-time">
      ${installTime.toLocaleDateString()}
      ${installTime.toLocaleTimeString()}
    </span>
  </a>
  <i data-icon="forward-light"></i>
</li>`;
    });
  }

  setMergeMode(mergeMode) {
    this.mergeModeButton.hidden = mergeMode;
    this.doneMergingButton.hidden = !mergeMode;

    this.closeButton.textContent = mergeMode ? 'Cancel' : 'Close';
    this.header.querySelector('h1').textContent =
      mergeMode ? 'Merge Add-ons' : 'Settings';
  }

  getSelectedAddons() {
    return [].map.call(this.addons.querySelectorAll('gaia-checkbox[checked]'), gc => gc.id);
  }

  _handleClick(evt) {
    var action = this.controller[evt.target.dataset.action];
    if (typeof action === 'function') {
      action.call(this.controller, evt.target.dataset);
    }
  }

  _handleSelectionChange(evt) {
    this.doneMergingButton.disabled = this.getSelectedAddons().length === 0;
  }
}
