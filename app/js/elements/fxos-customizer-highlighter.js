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
.label {
  background-color: rgba(0, 0, 0, 0.5);
  border-bottom-right-radius: 2px;
  color: #fff;
  font-family: 'FiraSans';
  font-size: 10px;
  line-height: 1.2em;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  position: absolute;
  padding: 0 2px;
  top: 0;
  left: 0;
  max-width: 100%;
  overflow: hidden;
}
</style>
<div class="overlay">
  <div class="label"></div>
</div>`;

var proto = Object.create(HTMLElement.prototype);

proto.createdCallback = function() {
  this.shadow = this.createShadowRoot();
  this.shadow.innerHTML = shadowHTML;
  this.overlay = this.shadow.querySelector('.overlay');
  this.label = this.shadow.querySelector('.label');
};

proto.highlight = function(element) {
  // Figure out where the element is
  var rect = element && element.getBoundingClientRect();

  // If the element has zero size, hide the highlight
  if (!rect || (rect.width === 0 && rect.height === 0)) {
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

    // Set the label to properly identify the element.
    this.label.textContent = element.tagName;
    if (element.id) {
      this.label.textContent += '#' + element.id;
    }

    // And try to move the element so that it is on screen
    element.scrollIntoView({behavior: 'smooth'});
  }
};

proto.hide = function() {
  this.overlay.style.display = 'none';
};

try {
  document.registerElement('fxos-customizer-highlighter', { prototype: proto });
} catch (e) {
  if (e.name !== 'NotSupportedError') {
    throw e;
  }
}

})(window);
