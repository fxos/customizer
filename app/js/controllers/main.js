/*global MozActivity*/

/*global EditView*/
/*global ViewSourceView*/
/*global AppendChildView*/
/*global CopyMoveView*/
/*global MainView*/

/*global EditController*/
/*global ViewSourceController*/
/*global AppendChildController*/
/*global CopyMoveController*/

/*global Controller*/
/*global Gesture*/

export default class MainController extends Controller {
  constructor(options) {
    super(options);

    this._checkOpenFromLauncher();
    this._waitToBeOpened();

    window.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this._checkOpenFromLauncher();
      }
    });

    console.log('[Customizer] Initialized MainController', this);
  }

  get openGesture() {
    return {
      type: 'swipe',    // Swipe:
      numFingers: 2,    // with two fingers,
      startRegion: {    // from bottom 30% of the screen (10% for SHB),
        x0: 0, y0: 0.8, x1: 1, y1: 1.1
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
      var viewSourceView = new ViewSourceView();
      var appendChildView = new AppendChildView();
      var copyMoveView = new CopyMoveView();
      var mainView = new MainView({
        editView: editView,
        viewSourceView: viewSourceView,
        appendChildView: appendChildView,
        copyMoveView: copyMoveView
      });

      this.editController = new EditController({
        view: editView
      });

      this.viewSourceController = new ViewSourceController({
        view: viewSourceView
      });

      this.appendChildController = new AppendChildController({
        view: appendChildView
      });

      this.copyMoveController = new CopyMoveController({
        view: copyMoveView
      });

      this.view = mainView;
      mainView.init(this);

      this.editController.mainController = this;
      this.viewSourceController.mainController = this;
      this.appendChildController.mainController = this;
      this.copyMoveController.mainController = this;

      console.log('[Customizer] Lazy-initialized modules');
      resolve();
    });

    return this._loadedModules;
  }

  // These private _wait methods call each other. If you try to call them
  // directly, you'll end up with more than one gesture detector listening
  // at a time.
  _waitToBeOpened() {
    Gesture.detect(this.openGesture).then(() => this.open());
  }

  _waitToBeClosed() {
    Gesture.detect(this.closeGesture).then(() => this.close());
  }

  _checkOpenFromLauncher() {
    var requestXHR = new XMLHttpRequest();
    requestXHR.open('GET', 'http://localhost:3215/request', true);
    requestXHR.onload = () => {
      if (requestXHR.responseText !== this.manifestURL) {
        return;
      }

      this.open();

      var confirmXHR = new XMLHttpRequest();
      confirmXHR.open('GET', 'http://localhost:3215/confirm?url=' + this.manifestURL, true);

      console.log('Sending HTTP request confirmation to Customizer Launcher');
      confirmXHR.send();
    };

    console.log('Sending HTTP request check to Customizer Launcher');
    requestXHR.send();
  }

  open() {
    if (this._isOpen) {
      return;
    }

    this._isOpen = true;

    this._lazyLoadModules()
      .then(() => this.view.open())
      .then(() => {
        this.view.customizer.setRootNode(document.documentElement);
        this._waitToBeClosed();
      });
  }

  close() {
    if (!this._isOpen) {
      return;
    }

    this.view.close().then(() => this._waitToBeOpened());

    this._isOpen = false;
  }

  openAddonManager() {
    var activity = new MozActivity({
      name: 'configure',
      data: {
        target: 'device',
        section: 'addons',
        options: {
          manifestURL: this.manifestURL
        }
      }
    });

    activity.onerror = (e) => {
      console.error('Error opening "Settings > Add-ons" panel', e);
    };
  }
}
