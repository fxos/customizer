(function(window) {
'use strict';

var proto = Object.create(HTMLElement.prototype);

var lightHTML =
`<style>
fxos-customizer-highlighter {
  pointer-events: none;
  display: none;
  position: fixed;
  z-index: 9999999;
}
</style>`;

var shadowHTML =
`<style scoped>
.inner {
  background-color: #00caf2;
  border: 2px dotted #fff;
  outline: 1px solid #00caf2;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.75;
}
</style>
<div class="inner"></div>`;

proto.createdCallback = function() {
  var shadow = this.createShadowRoot();
  shadow.innerHTML = shadowHTML;

  this.innerHTML = lightHTML;
};

proto.show = function() {
  this.style.display = 'block';
};

proto.hide = function() {
  this.style.display = 'none';
};

proto.clearTarget = function() {
  this.setTargetRect(0, 0, 0, 0);

  this.hide();
};

proto.setTargetRect = function(x, y, w, h) {
  this.style.left   = x + 'px';
  this.style.top    = y + 'px';
  this.style.width  = w + 'px';
  this.style.height = h + 'px';

  this.show();
};

proto.setTargetElement = function(element) {
  var rect = element.getBoundingClientRect();
  this.setTargetRect(rect.left, rect.top, rect.width, rect.height);
};

var FXOSCustomizerHighlighter = document.registerElement('fxos-customizer-highlighter', {
  prototype: proto
});

window.FXOSCustomizerHighlighter = FXOSCustomizerHighlighter;

})(window);
