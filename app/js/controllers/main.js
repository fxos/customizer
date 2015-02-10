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

    this.attached = true;
  }

  removeView() {
    if (!this.attached) {
      return;
    }

    document.body.removeChild(this.view.el);

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
