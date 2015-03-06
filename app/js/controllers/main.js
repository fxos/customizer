/* global Controller, Gesture */

export default class MainController extends Controller {
  constructor(options) {
    super(options);

    // We insert the main view into the document on startup.  This adds a
    // small disabled stylesheet and a minimal offscreen element to the
    // DOM. The mainView keeps the rest of the customizer out of the DOM
    // until its open() method is called.
    document.body.appendChild(this.view.el);

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

  // These private _wait methods call each other. If you try to call them
  // directly, you'll end up with more than one gesture detector listening
  // at a time.
  _waitToBeOpened() {
    Gesture.detect(this.openGesture)
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
