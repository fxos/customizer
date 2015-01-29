/* globals ActionMenuController */

/* globals FXOSCustomizer */

(function(window) {
'use strict';

var proto = Object.create(HTMLElement.prototype);

/*var template = `
<style scoped>

</style>
`;*/

proto.createdCallback = function() {
  if (window.FXOSCustomizer) {
    console.error('FXOSCustomizer is a singleton');
    return;
  }

  window.FXOSCustomizer = this.createShadowRoot();

  this.gaiaDomTree = document.createElement('gaia-dom-tree');
  FXOSCustomizer.appendChild(this.gaiaDomTree);

  this.gaiaCssInspector = document.createElement('gaia-css-inspector');
  FXOSCustomizer.appendChild(this.gaiaCssInspector);

  this.gaiaModal = document.createElement('gaia-modal');
  this.gaiaModal.innerHTML = '<p>lorem ipsum...</p>';
  FXOSCustomizer.appendChild(this.gaiaModal);

  var root = document.getElementById('root');

  this.gaiaDomTree.setRoot(root);
  this.gaiaDomTree.render();

  this.gaiaDomTree.addEventListener(
    'selected', this._handleSelected.bind(this));
  this.gaiaDomTree.addEventListener(
    'longpressed', this._handleLongPressed.bind(this));
  root.addEventListener('click', this._handleClick.bind(this));
};

proto._handleSelected = function(e) {
  var prev = this._selected;
  this._selected = this.gaiaDomTree.selectedNode;

  if (prev) {
    prev.classList.remove('selected');
  }

  if (this._selected.nodeType == 3) {
    this._selected = this._selected.parentNode;
  }
};

proto._handleLongPressed = function(e) {
  this._handleSelected(e);
  ActionMenuController.main(this._selected);
};

proto._handleClick = function(e) {
  if (e.target === this.gaiaDomTree) {
    return;
  }

  this.gaiaDomTree.select(e.target);
};

document.registerElement('fxos-customizer', {
  prototype: proto
});

})(window);
