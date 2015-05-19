/*global Controller*/

// When injected in the System app, this selector can identify
// the currently-focused <iframe> (app window).
const ACTIVE_WINDOW_SELECTOR = '#windows > .active iframe';

export default class TouchForwarderController extends Controller {
  constructor(options) {
    super(options);

    var firstTouchStartEvt = null;
    var isForwarding = false;

    window.addEventListener('touchstart', (evt) => {
      if (evt.touches.length === 1) {
        firstTouchStartEvt = evt;
        return;
      }

      if (evt.touches.length !== 2) {
        return;
      }

      var iframe = document.querySelector(ACTIVE_WINDOW_SELECTOR);
      iframe.sendTouchEvent.apply(iframe, unsynthesizeEvent(firstTouchStartEvt));
      iframe.sendTouchEvent.apply(iframe, unsynthesizeEvent(evt));

      isForwarding = true;
    });

    window.addEventListener('touchmove', (evt) => {
      if (!isForwarding) {
        return;
      }

      var iframe = document.querySelector(ACTIVE_WINDOW_SELECTOR);
      iframe.sendTouchEvent.apply(iframe, unsynthesizeEvent(evt));
    });

    window.addEventListener('touchend', (evt) => {
      if (!isForwarding) {
        return;
      }

      if (evt.touches.length === 0) {
        isForwarding = false;
      }

      var iframe = document.querySelector(ACTIVE_WINDOW_SELECTOR);
      iframe.sendTouchEvent.apply(iframe, unsynthesizeEvent(evt));
    });

    console.log('[Customizer] Initialized TouchForwarderController', this);
  }
}

/**
 * Taken from System app:
 * https://github.com/mozilla-b2g/gaia/blob/600fd8249960b8256af9de67d9171025bb9a3ff3/apps/system/js/touch_forwarder.js#L93
 */
function unsynthesizeEvent(e) {
  var type = e.type;
  var relevantTouches = (e.type === 'touchend') ?
                          e.changedTouches : e.touches;
  var identifiers = [];
  var xs = [];
  var ys = [];
  var rxs = [];
  var rys = [];
  var rs = [];
  var fs = [];
  var modifiers = 0;

  for (var i = 0; i < relevantTouches.length; i++) {
    var t = relevantTouches[i];

    identifiers.push(t.identifier);
    xs.push(t.pageX);
    ys.push(t.pageY);
    rxs.push(t.radiusX);
    rys.push(t.radiusY);
    rs.push(t.rotationAngle);
    fs.push(t.force);
  }

  return [type, identifiers, xs, ys, rxs, rys, rs, fs, xs.length, modifiers];
}
