/*global MainController*/
/*global TouchForwarderController*/

const BLOCKED_APPS = [
  'app://keyboard.gaiamobile.org/manifest.webapp'
];

const SYSTEM_APP = 'app://system.gaiamobile.org/manifest.webapp';

// If injecting into an app that was already running at the time
// the Customizer was enabled, simply initialize it.
if (document.documentElement) {
  initialize();
}

// Otherwise, we need to wait for the DOM to be ready before
// starting initialization since add-ons are usually (always?)
// injected *before* `document.documentElement` is defined.
else {
  window.addEventListener('DOMContentLoaded', initialize);
}

function initialize() {
  if (document.documentElement.dataset.customizerInit) {
    console.log('[Customizer] Customizer already initialized; Aborting');
    return;
  }

  var request = navigator.mozApps.getSelf();
  request.onsuccess = function() {
    var manifestURL = request.result && request.result.manifestURL;
    if (BLOCKED_APPS.find(a => a === manifestURL)) {
      console.log(`[Customizer] BLOCKING injection into ${manifestURL}`);
      return;
    }

    console.log(`[Customizer] Injecting into ${manifestURL}`);
    boot(manifestURL);
  };
  request.onerror = function() {
    console.error('[Customizer] An error occurred getting the manifestURL');
  };

  function boot(manifestURL) {
    document.documentElement.dataset.customizerInit = true;

    if (manifestURL === SYSTEM_APP) {
      return new TouchForwarderController();
    }

    return new MainController({
      manifestURL: manifestURL
    });
  }
}
