/*global EditView*/
/*global ViewSourceView*/
/*global ActionMenuView*/
/*global SettingsView*/
/*global AppendChildView*/
/*global MoveView*/
/*global MainView*/

/*global EditController*/
/*global ViewSourceController*/
/*global ActionMenuController*/
/*global SettingsController*/
/*global AppendChildController*/
/*global MoveController*/
/*global MainController*/

const BLOCKED_APPS = [
  'app://system.gaiamobile.org/manifest.webapp',
  'app://keyboard.gaiamobile.org/manifest.webapp'
];

window.addEventListener('DOMContentLoaded', () => {
  var request = navigator.mozApps.getSelf();
  request.onsuccess = function() {
    var manifestURL = request.result.manifestURL;
    if (BLOCKED_APPS.find(a => a === manifestURL)) {
      console.log(`[Customizer] BLOCKING injection into ${manifestURL}`);
      return;
    }

    console.log(`[Customizer] Injecting into ${manifestURL}`);
    boot();
  };
  request.onerror = function() {
    console.error('[Customizer] An error occurred getting the manifestURL');
  };

  /**
   * TODO: Bug 1148218 - [Customizer] Undo inline stylesheets from Bug 1148139
   */
  function styleHack() {
    /*jshint maxlen:false*/
    var style = document.createElement('style');
    style.innerHTML =
`@import '../components/gaia-icons/gaia-icons-embedded.css';

gaia-dialog {
  z-index: 10000002 !important;
}

gaia-modal {
  z-index: 10000001 !important;
  background: white;
}

.settings gaia-list gaia-button {
  /* XXX/drs: Why do we have to make this !important? It's very specific. */
  margin: 0 0 0 auto !important;

  --button-background: red;
  text-align: center;
}

.settings gaia-list .addon-time {
  color: #aaa;
}`;
    document.head.appendChild(style);
  }

  function boot() {
    var editView = new EditView();
    var actionMenuView = new ActionMenuView();
    var settingsView = new SettingsView();
    var viewSourceView = new ViewSourceView();
    var appendChildView = new AppendChildView();
    var moveView = new MoveView();
    var mainView = new MainView({
      editView: editView,
      actionMenuView: actionMenuView,
      settingsView: settingsView,
      viewSourceView: viewSourceView,
      appendChildView: appendChildView,
      moveView: moveView
    });

    var editController = new EditController({
      view: editView
    });

    var viewSourceController = new ViewSourceController({
      view: viewSourceView
    });

    var appendChildController = new AppendChildController({
      view: appendChildView
    });

    var moveController = new MoveController({
      view: moveView
    });

    var actionMenuController = new ActionMenuController({
      view: actionMenuView,
      editController: editController,
      viewSourceController: viewSourceController,
      appendChildController: appendChildController,
      moveController: moveController
    });

    var settingsController = new SettingsController({
      view: settingsView
    });

    var mainController = new MainController({
      view: mainView,

      actionMenuController: actionMenuController,
      settingsController: settingsController
    });

    editController.mainController = mainController;
    viewSourceController.mainController = mainController;
    actionMenuController.mainController = mainController;
    settingsController.mainController = mainController;
    appendChildController.mainController = mainController;
    moveController.mainController = mainController;

    styleHack();
  }
});
