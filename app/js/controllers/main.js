/* global Controller */

const ADDON_FILENAME = 'addon-temp.zip';

export default class MainController extends Controller {
  constructor(options) {
    super(options);

    this.attached = false;

    window.addEventListener('contextmenu', (evt) => {
      if (this.attached) {
        this.removeView();
      } else {
        this.attachView();
      }
    });
  }

  attachView() {
    if (this.attached) {
      return;
    }

    this.view.customizer.setRootNode(document.documentElement);
    document.body.appendChild(this.view.el);

    var padding = this.view.el.querySelector('fxos-customizer').offsetHeight;
    this._styleEl = document.createElement('style');
    this._styleEl.textContent = `
    html, body {
      overflow: initial !important;
    }

    body {
      padding-bottom: ${padding}px !important;
    }`;
    document.head.appendChild(this._styleEl);

    this.attached = true;
  }

  removeView() {
    if (!this.attached) {
      return;
    }

    document.body.removeChild(this.view.el);
    document.head.removeChild(this._styleEl);
    this._styleEl = null;

    this.attached = false;
  }

  installAddon(addonBlob) {
    console.log('installAddon()', addonBlob);

    // Save the blob to a file because we don't support importing memory blobs.
    var sdcard = navigator.getDeviceStorage('sdcard');

    var deleteRequest = sdcard.delete(ADDON_FILENAME);
    deleteRequest.onsuccess = deleteRequest.onerror = () => {
      var addNamedRequest = sdcard.addNamed(addonBlob, ADDON_FILENAME);
      addNamedRequest.onsuccess = () => {
        var getRequest = sdcard.get(ADDON_FILENAME);
        getRequest.onsuccess = () => {
          var addonFile = getRequest.result;
          navigator.mozApps.mgmt.import(addonFile)
            .then((addon) => {
              navigator.mozApps.mgmt.setEnabled(addon, true);
              console.log('SUCCESS', addon);
            })
            .catch((error) => {
              console.log('ERROR', error);
            });
        };
        getRequest.onerror = (error) => {
          console.error('Unable to get addon from DeviceStorage', error);
        };
      };
      addNamedRequest.onerror = (error) => {
        console.error('Unable to save addon to DeviceStorage', error);
      };
    };
  }
}
