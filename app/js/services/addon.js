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
