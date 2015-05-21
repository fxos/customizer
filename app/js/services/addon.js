/* global MozActivity */

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
    var activity = new MozActivity({
      name: 'import-app',
      data: {
        blob: blob
      }
    });

    activity.onsuccess = () => {
      this.getAddon(activity.result.manifestURL)
        .then(addon => resolve(addon))
        .catch((error) => {
          console.error('Unable to get the addon after importing', error);
          reject(error);
        });
    };

    activity.onerror = (error) => {
      console.error('Unable to install the addon', error);
      reject(error);
    };
  });
};
