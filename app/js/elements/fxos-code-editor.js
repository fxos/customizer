(function(window) {
'use strict';

var proto = Object.create(HTMLElement.prototype);

var template =
`<style>
  .container {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .line-numbers {
    background: #95368c;
    color: #fff;
    font-family: Consolas,Monaco,"Andale Mono",monospace;
    font-size: 14px;
    line-height: 1.2em;
    position: absolute;
    padding: 0 2px;
    top: 0;
    left: 0;
    width: 28px;
    height: 100%;
    overflow: hidden;
  }
  textarea {
    background: #000;
    border: none;
    color: #fff;
    font-family: Consolas,Monaco,"Andale Mono",monospace;
    font-size: 14px;
    line-height: 1.2em;
    position: absolute;
    top: 0;
    left: 32px;
    width: calc(100% - 32px);
    height: 100%;
    margin: 0;
    padding: 0;
    -moz-user-select: text !important;
  }
  .line-numbers,
  textarea {
    font-family: Consolas,Monaco,"Andale Mono",monospace;
    font-size: 14px;
    line-height: 1.2em;
  }
</style>
<div class="container">
  <div class="line-numbers"></div>
  <textarea wrap="off"></textarea>
</div>`;

proto.createdCallback = function() {
  var value = this.innerHTML;

  this.shadow = this.createShadowRoot();
  this.shadow.innerHTML = template;

  this.lineNumbers = this.shadow.querySelector('.line-numbers');

  this.textarea = this.shadow.querySelector('textarea');
  this.textarea.value = value;

  this.textarea.addEventListener('keyup', () => {
    this.dispatchEvent(new CustomEvent('change'));
    updateLineNumbers(this);
  });

  this.textarea.addEventListener('scroll', () => {
    this.lineNumbers.scrollTop = this.textarea.scrollTop;
  });
};

Object.defineProperty(proto, 'value', {
  get: function() {
    return this.textarea.value;
  },

  set: function(value) {
    this.textarea.value = value;
    this.dispatchEvent(new CustomEvent('change'));
    updateLineNumbers(this);
  }
});

function updateLineNumbers(element) {
  var html = '';

  var lines = element.value.split('\n').length;
  if (lines === element.lineNumbers.childElementCount) {
    return;
  }

  for (var i = 1; i <= lines; i++) {
    html += '<div>' + i + '</div>';
  }

  element.lineNumbers.innerHTML = html;
  element.lineNumbers.scrollTop = element.textarea.scrollTop;
}

try {
  document.registerElement('fxos-code-editor', { prototype: proto });
} catch (e) {
  if (e.name !== 'NotSupportedError') {
    throw e;
  }
}

})(window);
