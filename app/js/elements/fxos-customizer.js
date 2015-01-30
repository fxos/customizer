(function(window) {
'use strict';

var proto = Object.create(HTMLElement.prototype);

var template =
`<gaia-dom-tree></gaia-dom-tree>
<gaia-css-inspector></gaia-css-inspector>
<gaia-modal>
	<p>lorem ipsum...</p>
</gaia-modal>`;

proto.createdCallback = function() {
  var shadow = this.createShadowRoot();
  shadow.innerHTML = template;

  this.gaiaDomTree = shadow.querySelector('gaia-dom-tree');
  this.gaiaCssInspector = shadow.querySelector('gaia-css-inspector');
  this.gaiaModal = shadow.querySelector('gaia-modal');

  this.gaiaDomTree.addEventListener(
    'selected', this._handleSelected.bind(this));
  this.gaiaDomTree.addEventListener(
    'longpressed', this._handleLongPressed.bind(this));
};

proto.setRootNode = function(rootNode) {
	rootNode.addEventListener('click', this._handleClick.bind(this));

	this.gaiaDomTree.setRoot(rootNode);
	this.gaiaDomTree.render();
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

  this.dispatchEvent(new CustomEvent('action', {
  	detail: this._selected
  }));
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
