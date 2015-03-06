(function(window) {
'use strict';

var shadowHTML =
`<style scoped>
.overlay {
  display: none;
  position: absolute;
  box-sizing: border-box;
  pointer-events: none;
  z-index: 9999999; /* above the app, but below the other customizer elements */
  background-color: #00caf2;
  border: 2px dotted #fff;
  outline: 1px solid #00caf2;
  opacity: 0.75;
}
</style>
<div class="overlay"></div>`;

var proto = Object.create(HTMLElement.prototype);

proto.createdCallback = function() {
  this.shadow = this.createShadowRoot();
  this.shadow.innerHTML = shadowHTML;
  this.overlay = this.shadow.querySelector('.overlay');
};

proto.highlight = function(element) {
  // Figure out where the element is
  var rect = element.getBoundingClientRect();

  // If the element has zero size, hide the highlight
  if (rect.width === 0 && rect.height === 0) {
    this.overlay.style.display = 'none';
  }
  else {
    // Otherwise, highlight the element.
    // Note that we use add the document scroll offsets to the element
    // coordinates to get document coordinates instead of screen coordinates.
    this.overlay.style.left    = (rect.left + window.pageXOffset) + 'px';
    this.overlay.style.top     = (rect.top + window.pageYOffset) + 'px';
    this.overlay.style.width   = rect.width + 'px';
    this.overlay.style.height  = rect.height + 'px';
    this.overlay.style.display = 'block';

    // And try to move the element so that it is on screen
    element.scrollIntoView({behavior: 'smooth'});
  }
};

proto.hide = function() {
  this.overlay.style.display = 'none';
};

document.registerElement('fxos-customizer-highlighter', { prototype: proto });
})(window);
