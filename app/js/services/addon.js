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
