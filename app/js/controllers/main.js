/* global Controller, Gesture */

const ADDON_FILENAME = 'addon-temp.zip';

export default class MainController extends Controller {
  constructor(options) {
    super(options);
    this.attached = false;
    this.waitToBeOpened();
  }

  waitToBeOpened() {
    var openGesture = {
      type: 'swipe',    // Swipe:
      numFingers: 1,    // with one finger,
      startRegion: {    // from bottom 10% of the screen,
        x0: 0, y0: 0.9, x1: 1, y1: 1
      },
      endRegion: {      // up into the top 80% of the screen,
        x0: 0, y0: 0, x1: 1, y1: 0.80
      },
      maxTime: 1000,    // in less than 1 second.
    };

    Gesture.detect(openGesture).then(() => {
      this.attachView();
      this.waitToBeClosed();
    });
  }

  waitToBeClosed() {
    var closeGesture = {
      type: 'swipe',    // Swipe:
      numFingers: 1,    // with one finger,
      startRegion: {    // from the middle of the screen
        x0: 0, y0: 0.4, x1: 1, y1: 0.6
      },
      endRegion: {      // down into the bottom quarter of the screen
        x0: 0, y0: 0.65, x1: 1, y1: 1.0
      },
      maxTime: 1000,    // in less than 1 second.
    };

    Gesture.detect(closeGesture).then(() => {
      this.removeView();
      this.waitToBeOpened();
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

    body::after {
      content: "";
      height: ${padding}px;
      display: block;
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
