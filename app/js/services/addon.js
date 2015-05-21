/* global AddonGenerator */

var AddonService = {};

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

AddonService.getAddon = function(manifestURL) {
  return new Promise((resolve, reject) => {
    this.getAddons().then((addons) => {
      var addon = addons.find(addon => addon.manifestURL === manifestURL);
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
    this.getAddons(window.location.host).then((addons) => {
      var name = window.prompt('Enter a name for this add-on', `Addon ${addons.length + 1}`);
      if (!name) {
        reject();
        return;
      }

      var generator = new AddonGenerator({
        target: target,
        name: name
      });

      resolve(generator);
    }).catch(reject);
  });
};

AddonService.generate = function(target, callback) {
  if (typeof callback !== 'function') {
    return;
  }

  return AddonService.getGenerator(target)
    .then((generator) => {
      callback(generator);

      var addonBlob = new Blob([generator.generate()], { type: 'application/zip' });
      AddonService.install(addonBlob);
    });
};

AddonService.install = function(blob) {
  return new Promise((resolve, reject) => {
    // Import the addon using the tempfile.
    navigator.mozApps.mgmt.import(blob)
      .then((addon) => {

        // Enable the addon by default.
        navigator.mozApps.mgmt.setEnabled(addon, true);
        resolve(addon);
      })
      .catch((error) => {
        console.error('Unable to install the addon', error);
        reject(error);
      });
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
