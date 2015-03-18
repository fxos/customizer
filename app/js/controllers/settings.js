/* global Controller */

/* global AddonService */

export default class SettingsController extends Controller {
  constructor(options) {
    super(options);
  }

  open() {
    this.view.modal.open();

    this._setMergeMode(false);
  }

  close() {
    if (this._mergeMode) {
      this._setMergeMode(false);
      return;
    }

    this.view.modal.close();
  }

  mergeMode() {
    this._setMergeMode(true);
  }

  doneMerging() {
    this._setMergeMode(false);

    AddonService.merge(this.view.getSelectedAddons()).then(() => {

    });
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

  addonDetail(addon) {
    console.log('addonDetail()', addon);

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

  _setMergeMode(mergeMode) {
    this._mergeMode = mergeMode;

    this.view.setMergeMode(this._mergeMode);

    AddonService.getAddons(window.location.host).then((addons) => {
      this.view.setAddons(addons, this._mergeMode);
    });
  }
}
