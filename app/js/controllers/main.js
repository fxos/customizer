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

/*global Controller*/
/*global Gesture*/

export default class MainController extends Controller {
  constructor(options) {
    super(options);

    this._waitToBeOpened();
  }

  get openGesture() {
    return {
      type: 'swipe',    // Swipe:
      numFingers: 2,    // with two fingers,
      startRegion: {    // from bottom 20% of the screen,
        x0: 0, y0: 0.8, x1: 1, y1: 1
      },
      endRegion: {      // up into the top 75% of the screen,
        x0: 0, y0: 0, x1: 1, y1: 0.75
      },
      maxTime: 1000,    // in less than 1 second.
    };
  }

  get closeGesture() {
    return {
      type: 'swipe',    // Swipe:
      numFingers: 2,    // with two fingers,
      startRegion: {    // from the middle ~half of the screen
        x0: 0, y0: 0.3, x1: 1, y1: 0.7
      },
      endRegion: {      // down into the bottom quarter of the screen
        x0: 0, y0: 0.75, x1: 1, y1: 1.0
      },
      maxTime: 1000,    // in less than 1 second.
    };
  }

  _lazyLoadModules() {
    this._loadedModules = this._loadedModules || new Promise((resolve, reject) => {
      /*jshint evil:true*/
      var source = window.localStorage.getItem('__CUSTOMIZER__componentsSource');
      if (!source) {
        reject();
        return;
      }

      eval.call(window, source);

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

      this.view = mainView;
      mainView.init(this);

      this.actionMenuController = actionMenuController;
      this.settingsController = settingsController;

      editController.mainController = this;
      viewSourceController.mainController = this;
      actionMenuController.mainController = this;
      settingsController.mainController = this;
      appendChildController.mainController = this;
      moveController.mainController = this;

      console.log('Lazy-initialized modules');
      resolve();
    });

    return this._loadedModules;
  }

  // These private _wait methods call each other. If you try to call them
  // directly, you'll end up with more than one gesture detector listening
  // at a time.
  _waitToBeOpened() {
    Gesture.detect(this.openGesture)
      .then(() => this._lazyLoadModules())
      .then(() => this.view.open())
      .then(() => {
        this.view.customizer.setRootNode(document.documentElement);
        this._waitToBeClosed();
      });
  }

  _waitToBeClosed() {
    Gesture.detect(this.closeGesture)
      .then(() => this.view.close())
      .then(() => this._waitToBeOpened());
  }
}
