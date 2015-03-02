/* global Controller */

/* global AddonService */

export default class SettingsController extends Controller {
  constructor(options) {
    super(options);
  }

  open() {
    this.view.modal.open();

    AddonService.getAddons(window.location.host).then((addons) => {
      this.view.setAddons(addons);
    });
  }

  close() {
    this.view.modal.close();
  }

  addons() {
    var activity = new window.MozActivity({
      name: 'configure',
      data: {
        target: 'device',
        section: 'addons'
      }
    });

    activity.onerror = (e) => {
      console.error('Error opening Settings Add-ons panel', e);
    };
  }

  uninstall(addon) {
    AddonService.uninstall(addon.origin).then(() => {
      AddonService.getAddons(window.location.host).then((addons) => {
        this.view.setAddons(addons);
      });
    });
  }

  enableAddon(addon) {
    AddonService.getAddon(addon.origin).then((addon) => {
      navigator.mozApps.mgmt.setEnabled(addon, true);
    });
  }

  disableAddon(addon) {
    AddonService.getAddon(addon.origin).then((addon) => {
      navigator.mozApps.mgmt.setEnabled(addon, false);
    });
  }
}
