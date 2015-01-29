(function(window) {
'use strict';

var proto = Object.create(HTMLElement.prototype);

/*var template = `
<style scoped>

</style>
`;*/

proto.createdCallback = function() {
  var shadow = this.createShadowRoot();

  var gaiaDomTree = document.createElement('gaia-dom-tree');
  shadow.appendChild(gaiaDomTree);

  var gaiaCssInspector = document.createElement('gaia-css-inspector');
  shadow.appendChild(gaiaCssInspector);

  gaiaDomTree.setRoot(document.getElementById('root'));
  gaiaDomTree.render();
};

var FXOSCustomizer = document.registerElement('fxos-customizer', {
  prototype: proto
});

window.FXOSCustomizer = FXOSCustomizer;

})(window);
