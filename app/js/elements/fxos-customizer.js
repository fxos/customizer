(function(window) {
'use strict';

var proto = Object.create(HTMLElement.prototype);

var template =
`<style scoped>
[data-icon]:before {
  font-family: "gaia-icons";
  content: attr(data-icon);
  display: inline-block;
  font-weight: 500;
  font-style: normal;
  text-decoration: inherit;
  text-transform: none;
  text-rendering: optimizeLegibility;
  font-size: 30px;
}
[data-customizer-icon]:before {
  font-family: "customizer-icons";
  content: attr(data-customizer-icon);
  display: inline-block;
  font-weight: 500;
  font-style: normal;
  text-decoration: inherit;
  text-transform: none;
  text-rendering: optimizeLegibility;
  font-size: 30px;
}
gaia-dom-tree {
  width: 100%;
  height: calc(100% - 46px);
}
.pin {
  position: absolute;
  top: 0;
  right: 0;
  margin: 1rem !important;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}
.pin.scrolling {
  pointer-events: none;
  opacity: 0;
}
</style>
<gaia-button circular class="pin" data-action="settings">
  <i data-icon="settings"></i>
</gaia-button>
<gaia-dom-tree></gaia-dom-tree>
<gaia-toolbar>
  <button data-customizer-icon="edit" data-action="edit" disabled></button>
  <button data-customizer-icon="copy" data-action="copyOrMove" disabled></button>
  <button data-customizer-icon="append" data-action="append" disabled></button>
  <button data-customizer-icon="remove" data-action="remove" disabled></button>
  <button data-customizer-icon="source" data-action="viewSource" disabled></button>
</gaia-toolbar>`;

proto.createdCallback = function() {
  this.shadow = this.createShadowRoot();
  this.shadow.innerHTML = template;

  this.settingsButton = this.shadow.querySelector('[data-action="settings"]');
  this.gaiaDomTree = this.shadow.querySelector('gaia-dom-tree');
  this.gaiaToolbar = this.shadow.querySelector('gaia-toolbar');

  this.settingsButton.addEventListener(
    'click', this._handleMenuAction.bind(this));
  this.gaiaDomTree.addEventListener(
    'click', this._handleSelected.bind(this));
  this.gaiaToolbar.addEventListener(
    'click', this._handleAction.bind(this));

  this._watchScrolling();

  this.gaiaDomTree.addEventListener('contextmenu', (evt) => {
    evt.stopPropagation();
  });

  this._rootNodeClickHandler = this._handleClick.bind(this);
};

proto.setRootNode = function(rootNode) {
  // If we already have a root node defined, disconnect from it first
  if (this._root) {
    this.unwatchChanges();
    this.gaiaDomTree.setRoot(null);
    this.gaiaDomTree.render();
    this._root.removeEventListener('click', this._rootNodeClickHandler);
    this._root = null;
  }

  // If we've got a new root node, set that one up
  if (rootNode) {
    this._root = rootNode;
    rootNode.addEventListener('click', this._rootNodeClickHandler);
    this.gaiaDomTree.setRoot(rootNode);
    this.gaiaDomTree.render();
    this.watchChanges();
  }
};

proto._watchScrolling = function() {
  this.gaiaDomTree.shadowRoot.addEventListener('scroll',
  (evt) => {
    if (this._scrollTimeout) {
      clearTimeout(this._scrollTimeout);
    }

    this._scrollTimeout = setTimeout(() => {
      this.settingsButton.classList.remove('scrolling');
    }, 500);

    this.settingsButton.classList.add('scrolling');
  }, true);
};

proto._shadowContains = function(el) {
  var customizerRootView =
    document.body.querySelector('.fxos-customizer-main-view');

  if (!el || el == document.documentElement) {
    return false;
  } else if (el == customizerRootView) {
    return true;
  }

  return this._shadowContains(el.parentNode || el.host);
};

proto.watchChanges = function() {
  const OBSERVER_CONFIG = {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true
  };

  this._observer = new MutationObserver((mutations) => {
    // Only re-render if a mutation occurred in the app itself, and is
    // outside of the customizer addon. This depends on the customizer
    // root element having the class "fxos-customizer-main-view"
    for (var i = mutations.length - 1; i >= 0; i--) {
      if (!this._shadowContains(mutations[i].target)) {
        var selectedNode = this.gaiaDomTree.selectedNode;
        this.gaiaDomTree.render();
        this.select(selectedNode);
        return;
      }
    }
  });

  this._observer.observe(this._root, OBSERVER_CONFIG);
};

proto.unwatchChanges = function() {
  this._observer.disconnect();
  this._observer = null;
};

proto.select = function(node) {
  this.gaiaDomTree.select(node);
};

proto._handleMenuAction = function(e) {
  var action = e.target.dataset.action;
  if (action) {
    this.dispatchEvent(new CustomEvent('menu', {
      detail: action
    }));
  }
};

proto._handleSelected = function(e) {
  e.stopPropagation();

  var selectedNode = this.gaiaDomTree.selectedNode;
  if (!selectedNode) {
    return;
  }

  var selected = this._selected = (selectedNode.nodeType === Node.TEXT_NODE) ?
    selectedNode.parentNode : selectedNode;

  [].forEach.call(this.gaiaToolbar.querySelectorAll('button'), (button) => {
    button.disabled = !selected;
  });

  this.gaiaToolbar.querySelector('[data-action="viewSource"]').disabled =
    (selected.tagName !== 'SCRIPT' || !selected.hasAttribute('src')) &&
    (selected.tagName !== 'LINK' || !selected.hasAttribute('href'));

  this.dispatchEvent(new CustomEvent('selected', {
    detail: this._selected
  }));
};

proto._handleAction = function(e) {
  this.dispatchEvent(new CustomEvent('action:' + e.target.dataset.action, {
    detail: this._selected
  }));
};

proto._handleClick = function(e) {
  if (e.target === this.gaiaDomTree) {
    return;
  }

  this.select(e.target);
};

try {
  document.registerElement('fxos-customizer', { prototype: proto });
} catch (e) {
  if (e.name !== 'NotSupportedError') {
    throw e;
  }
}

})(window);
