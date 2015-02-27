(function(window) {
'use strict';

var proto = Object.create(HTMLElement.prototype);

var template =
`<style>
@import '../components/gaia-icons/gaia-icons-embedded.css';

gaia-dom-tree {
  width: 100%;
  height: 100%;
}

.pin {
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 0.5rem !important;
  transition: opacity 0.5s ease-in-out 0.5s;
  opacity: 1;
}

.pin.scrolling {
  transition-delay: 0;
  opacity: 0;
}
</style>
<gaia-button circular class="pin" data-action="settings">
  <i data-icon="settings"></i>
</gaia-button>
<gaia-dom-tree></gaia-dom-tree>
<gaia-css-inspector></gaia-css-inspector>
<gaia-modal>
  <p>lorem ipsum...</p>
</gaia-modal>`;

proto.createdCallback = function() {
  var shadow = this.createShadowRoot();
  shadow.innerHTML = template;

  this.settingsButton = shadow.querySelector('[data-action="settings"]');
  this.gaiaDomTree = shadow.querySelector('gaia-dom-tree');
  this.gaiaCssInspector = shadow.querySelector('gaia-css-inspector');
  this.gaiaModal = shadow.querySelector('gaia-modal');

  this.settingsButton.addEventListener(
    'click', this._handleMenuAction.bind(this));
  this.gaiaDomTree.addEventListener(
    'click', this._handleSelected.bind(this));
  this.gaiaDomTree.addEventListener(
    'longpressed', this._handleLongPressed.bind(this));

  this.gaiaDomTree.addEventListener('contextmenu', (evt) => {
    evt.stopPropagation();
  });

  this.gaiaDomTree.shadowRoot.addEventListener('scroll',
  (evt) => {
    if (this._scrollTimeout) {
      clearTimeout(this._scrollTimeout);
    }

    this._scrollTimeout = setTimeout(() => {
      this.settingsButton.classList.remove('scrolling');
    }, 50);

    this.settingsButton.classList.add('scrolling');
  }, true);
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
