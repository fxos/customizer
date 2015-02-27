(function(window) {
'use strict';

var proto = Object.create(HTMLElement.prototype);

var template =
`<style>
  gaia-dom-tree {
    width: 100%;
    height: calc(100% - 50px);
  }
</style>
<gaia-header>
  <h1></h1>
  <button type="button" data-action="settings">Settings</button>
</gaia-header>
<gaia-dom-tree></gaia-dom-tree>
<gaia-css-inspector></gaia-css-inspector>
<gaia-modal>
  <p>lorem ipsum...</p>
</gaia-modal>`;

proto.createdCallback = function() {
  var shadow = this.createShadowRoot();
  shadow.innerHTML = template;

  this.gaiaHeader = shadow.querySelector('gaia-header');
  this.gaiaDomTree = shadow.querySelector('gaia-dom-tree');
  this.gaiaCssInspector = shadow.querySelector('gaia-css-inspector');
  this.gaiaModal = shadow.querySelector('gaia-modal');

  this.gaiaHeader.addEventListener(
    'click', this._handleMenuAction.bind(this));
  this.gaiaDomTree.addEventListener(
    'click', this._handleSelected.bind(this));
  this.gaiaDomTree.addEventListener(
    'longpressed', this._handleLongPressed.bind(this));

  this.gaiaDomTree.addEventListener('contextmenu', (evt) => {
    evt.stopPropagation();
  });
};

proto.setRootNode = function(rootNode) {
  rootNode.addEventListener('click', this._handleClick.bind(this));

  this.gaiaDomTree.setRoot(rootNode);
  this.gaiaDomTree.render();
};

proto.watchChanges = function() {
  this.gaiaDomTree.watchChanges();
};

proto.unwatchChanges = function() {
  this.gaiaDomTree.unwatchChanges();
};

proto.select = function(node) {
  this.gaiaDomTree.select(node);
};

proto._handleMenuAction = function(e) {
  var action = e.target.dataset.action;
  if (action) {
    console.log(action);
    this.dispatchEvent(new CustomEvent('menu', {
      detail: action
    }));
  }
};

proto._handleSelected = function(e) {
  e.stopPropagation();

  var selectedNode = this.gaiaDomTree.selectedNode;

  this._selected = (selectedNode.nodeType === Node.TEXT_NODE) ?
    selectedNode.parentNode : selectedNode;

  this.dispatchEvent(new CustomEvent('selected', {
    detail: this._selected
  }));
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

  this.select(e.target);
};

document.registerElement('fxos-customizer', {
  prototype: proto
});

})(window);
