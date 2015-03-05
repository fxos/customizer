/* global AddonGenerator */

var AddonService = {};

const ADDON_FILENAME = 'addon-temp.zip';

AddonService.getAddons = function(host) {
  return new Promise((resolve, reject) => {
    var request = navigator.mozApps.mgmt.getAll();
    request.onsuccess = function() {
      var addons = request.result.filter((app) => {
        var manifest = app.manifest || {};
        if (manifest.role !== 'addon') {
          return false;
        }

        if (!host) {
          return true;
        }

        return !!((manifest.customizations || []).find((customization) => {
          return (customization.filter || '').indexOf(host) !== -1;
        }));
      });

      resolve(addons);
    };
    request.onerror = function() {
      reject(request);
    };
  });
};

AddonService.getAddon = function(origin) {
  return new Promise((resolve, reject) => {
    this.getAddons().then((addons) => {
      var addon = addons.find(addon => addon.origin === origin);
      if (!addon) {
        reject();
        return;
      }

      resolve(addon);
    }).catch(reject);
  });
};

AddonService.getGenerator = function(target) {
  return new Promise((resolve, reject) => {
    var name = window.prompt('Enter a name for this add-on', 'Addon ' + new Date().toISOString());
    if (!name) {
      reject();
      return;
    }

    var generator = new AddonGenerator(target, name);
    generator.manifest.customizations = [{
      filter: window.location.origin,
      scripts: ['main.js']
    }];

    resolve(generator);
  });
};

AddonService.generate = function(target, callback) {
  if (typeof callback !== 'function') {
    return;
  }

  return AddonService.getGenerator(target)
    .then((generator) => {
      callback(generator);

      AddonService.install(generator.generate());
    });
};

AddonService.install = function(blob) {
  return new Promise((resolve, reject) => {
    // Save the blob to a file because we don't support importing memory blobs.
    var sdcard = navigator.getDeviceStorage('sdcard');

    // Delete the tempfile from the SD card.
    var deleteRequest = sdcard.delete(ADDON_FILENAME);
    deleteRequest.onsuccess = deleteRequest.onerror = () => {

      // Add the addon blob to the SD card using the temp filename.
      var addNamedRequest = sdcard.addNamed(blob, ADDON_FILENAME);
      addNamedRequest.onsuccess = () => {

        // Retrieve the new tempfile.
        var getRequest = sdcard.get(ADDON_FILENAME);
        getRequest.onsuccess = () => {
          var addonFile = getRequest.result;

          // Import the addon using the tempfile.
          navigator.mozApps.mgmt.import(addonFile)
            .then((addon) => {

              // Enable the addon by default.
              navigator.mozApps.mgmt.setEnabled(addon, true);
              resolve(addon);
            })
            .catch((error) => {
              console.error('Unable to install the addon', error);
              reject(error);
            });
        };
        getRequest.onerror = (error) => {
          console.error('Unable to get addon from DeviceStorage', error);
          reject(error);
        };
      };
      addNamedRequest.onerror = (error) => {
        console.error('Unable to save addon to DeviceStorage', error);
        reject(error);
      };
    };
  });
};

AddonService.uninstall = function(origin) {
  return new Promise((resolve, reject) => {
    this.getAddons().then((addons) => {
      var addon = addons.find(addon => addon.origin === origin);
      if (!addon) {
        reject();
        return;
      }

      var request = navigator.mozApps.mgmt.uninstall(addon);
      request.onsuccess = function() {
        resolve(request);
      };
      request.onerror = function() {
        reject(request);
      };
    }).catch(reject);
  });
};
