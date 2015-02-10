/* global View */

var settingsViewTemplate =
`<gaia-modal>
  <gaia-header>
    <button data-action="close">Close</button>
    <h1>Settings</h1>
  </gaia-header>
  <section>
    <h3>Installed Add-ons</h3>
    <ul class="addons">
    </ul>
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
    this.addons = this.$('.addons');

    this.on('click', 'button', (evt) => {
      var action = this.controller[evt.target.dataset.action];
      if (typeof action === 'function') {
        action.call(this.controller);
      }
    });
  }

  template() {
    return settingsViewTemplate;
  }

  setAddons(addons) {
    this.addons.innerHTML = '';

    addons.forEach((addon) => {
      var installTime = new Date(addon.installTime);

      this.addons.innerHTML +=
`<li>
  <span>
    ${installTime.toLocaleDateString()}
    ${installTime.toLocaleTimeString()}
  </span>
  <button type="button" data-action="uninstall" data-origin="${addon.origin}">Uninstall</button>
</li>`;
    });
  }
}
