/* global Controller */

/* global AddonService */

export default class SettingsController extends Controller {
  constructor(options) {
    super(options);

    this.merging = false;

    this._refreshAddons = this._refreshAddons.bind(this);
  }

  open() {
    this.view.modal.open();

    this._refreshAddons();

    ['install', 'uninstall', 'enabledstatechange'].forEach((e) => {
      navigator.mozApps.mgmt.addEventListener(e, this._refreshAddons);
    });
  }

  close() {
    this.view.modal.close();

    ['install', 'uninstall', 'enabledstatechange'].forEach((e) => {
      navigator.mozApps.mgmt.removeEventListener(e, this._refreshAddons);
    });

    this.merging = false;
  }

  toggleMerging() {
    this.merging = !this.merging;

    this.view.setMerging(this.merging);
  }

  addonManager() {
    var activity = new window.MozActivity({
      name: 'configure',
      data: {
        target: 'device',
        section: 'addons'
      }
    });

    activity.onerror = (e) => {
      console.error('Error opening "Settings > Add-ons" panel', e);
    };
  }

  showAddon(manifestURL) {
    var activity = new window.MozActivity({
      name: 'configure',
      data: {
        target: 'device',
        section: 'addon-details',
        options: {
          manifestURL: manifestURL
        }
      }
    });

    activity.onerror = (e) => {
      this._refreshAddons();

      console.error('Error opening "Settings > Add-on Details" panel', e);
    };
  }

  _refreshAddons() {
    AddonService.getAddons(window.location.host).then((addons) => {
      this.view.setAddons(addons);
    });
  }
}
