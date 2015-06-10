/* global Controller */

export default class ViewSourceController extends Controller {
  constructor(options) {
    super(options);
  }

  teardown() {
    this.view = null;

    this.target = null;
  }

  open(target) {
    console.log('view source controller open');
    this.target = target;
    var url = target.src || target.href;
    var filename = url.substring(url.lastIndexOf('/') + 1);
    this.view.setTitle(filename);
    this.view.setSource('Loading...');
    this.fetchAndDisplay(url);
    this.view.open();
  }

  close() {
    this.view.close();
    this.view.setSource('');
  }

  fetchAndDisplay(url) {
    var self = this;
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'text';
      xhr.send();
      xhr.onload = function() {
        if (xhr.status === 200) {
          self.view.setSource(xhr.response);
        }
        else {
          self.view.setSource(xhr.status + ':' + xhr.statusText);
        }
      };
      xhr.onerror = function() {
        self.view.setSource(xhr.error.name);
      };
    }
    catch(e) {
      // Surprisingly, the xhr.send() call above can throw an exception
      // if the URL is malformed.
      self.view.setSource(e.toString());
    }
  }
}
