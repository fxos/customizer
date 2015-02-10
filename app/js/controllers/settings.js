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
}
