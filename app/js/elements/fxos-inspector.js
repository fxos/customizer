(function(window) {
'use strict';

const HTML_ESCAPE_CHARS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
  '/': '&#x2F;'
};

const CONSTANT_PROPERTY_REGEX = /^[A-Z_]+$/;

var proto = Object.create(HTMLElement.prototype);

var template =
`<style scoped>
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
  [flex] {
    display: flex;
    justify-content: space-between;
    padding: 0 5px;
  }
  [flex] > * {
    flex: 1 1 auto;
    margin-right: 5px;
    margin-left: 5px;
  }
  #container {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  gaia-list a {
    position: relative;
    text-decoration: none;
  }
  gaia-list [hidden] {
    display: none;
  }
  gaia-list h3 {
    font-size: 18px;
    max-width: calc(100% - 2em);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  gaia-list [data-customizer-icon] {
    position: absolute;
    padding: 1.6em 1em;
    top: 0;
    right: 0;
  }
  gaia-list .value {
    color: #00aac5;
  }
  fxos-code-editor {
    display: block;
    width: 100%;
    height: calc(100% - 100px);
  }
</style>
<div id="container"></div>
<gaia-dialog-prompt id="new-attribute-name">
  Enter new attribute name
</gaia-dialog-prompt>`;

proto.createdCallback = function() {
  this.shadow = this.createShadowRoot();
  this.shadow.innerHTML = template;

  this.container = this.shadow.querySelector('#container');
  this.newAttributeName = this.shadow.querySelector('#new-attribute-name');

  this.keyPath = [];

  // Handle all clicks within this component.
  this.container.addEventListener('click', (evt) => {
    // Handle case where <a href> was clicked.
    var target = evt.target.closest('a');
    if (target) {
      evt.preventDefault();

      // Handle case where <i data-action="remove"> was clicked.
      if (evt.target.dataset.action === 'remove') {
        this._handleRemoveAttributeClick(target);
      }

      // Otherwise, treat as regular list item click.
      else {
        this._handleListItemClick(target);
      }
      return;
    }

    // Handle case where <gaia-button> was clicked.
    target = evt.target.closest('gaia-button');
    if (target) {
      evt.preventDefault();
      this._handleButtonClick(target);
      return;
    }
  });

  // Filter the list of properties 500ms after a keypress
  // in the <gaia-text-input> search box.
  this.container.addEventListener('keyup', (evt) => {
    var textInput = evt.target.closest('gaia-text-input');
    if (!textInput) {
      return;
    }

    clearTimeout(this._searchTimeout);
    this._searchTimeout = setTimeout(() => {
      var value = textInput.value.toLowerCase();
      var items = [].slice.apply(this.container.querySelectorAll('gaia-list a[data-search]'));

      // Toggle each list items' [hidden] attribute if the search text
      // isn't blank and the items' [data-search] value contains the
      // current search text.
      items.forEach(i => i.hidden = value && i.dataset.search.indexOf(value) === -1);
    }, 500);
  });

  // Automatically set focus to the input box when the
  // <gaia-dialog-prompt> is opened.
  this.newAttributeName.addEventListener('opened', () => {
    this.newAttributeName.els.input.focus();
  });

  // Reset the <gaia-dialog-prompt> value when closed.
  this.newAttributeName.addEventListener('closed', () => {
    this.newAttributeName.els.input.value = '';
  });

  // Create a new attribute when the <gaia-dialog-prompt>
  // is submitted.
  this.newAttributeName.els.submit.addEventListener('click', () => {
    try {
      var name = this.newAttributeName.els.input.value;
      var attribute = document.createAttribute(name);

      this.target.setNamedItem(attribute);

      this.dispatchEvent(new CustomEvent('createattribute', {
        detail: JSON.stringify({
          keyPath: this.keyPath,
          expression: '[\'' + this.keyPath.join('\'][\'') + '\']',
          name: name
        })
      }));
    } catch (e) {
      window.alert('Invalid attribute name');
      return;
    }

    this.render();
  });
};

proto.render = function() {
  clearTimeout(this._searchTimeout);

  this.target = this.rootTarget;
  this.keyPath.forEach(key => this.target = this.target[key]);

  this.container.innerHTML = renderTargetPage(this.target, this.keyPath.length === 0).innerHTML;
  this.container.scrollTo(0, 0);
};

proto.setRootTarget = function(rootTarget) {
  this.rootTarget = rootTarget;
  this.target = this.rootTarget;

  this.keyPath = [];
  this.render();
};

proto._handleButtonClick = function(target) {
  switch (target.dataset.action) {
    case 'cancel':
      this.keyPath.pop();
      break;
    case 'save':
      (() => {
        var value = this.container.querySelector('fxos-code-editor').value;
        var target = this.rootTarget;

        this.keyPath.forEach((key, index) => {
          if (index < this.keyPath.length - 1) {
            target = target[key];
            return;
          }

          target[key] = value;
        });

        this.dispatchEvent(new CustomEvent('save', {
          detail: JSON.stringify({
            keyPath: this.keyPath,
            expression: '[\'' + this.keyPath.join('\'][\'') + '\']',
            value: value
          })
        }));

        this.keyPath.pop();
      })();
      break;
    default:
      break;
  }

  this.render();
};

proto._handleRemoveAttributeClick = function(target) {
  var name = target.getAttribute('href');
  this.target.removeNamedItem(name);

  this.dispatchEvent(new CustomEvent('removeattribute', {
    detail: JSON.stringify({
      keyPath: this.keyPath,
      expression: '[\'' + this.keyPath.join('\'][\'') + '\']',
      name: name
    })
  }));

  this.render();
};

proto._handleListItemClick = function(target) {
  // If the link clicked has an `href` pointing
  // to "../", go back to the previous level in
  // the key path.
  var href = target.getAttribute('href');
  if (href === '../') {
    this.keyPath.pop();
  }

  // Show "Create New Attribute" prompt.
  else if (href === '#add-attribute') {
    this.newAttributeName.open();
  }

  // Otherwise, push the next part of the key path.
  else {
    this.keyPath.push(href);
  }

  this.render();
};

/**
 * Helper function for determining the type of
 * page to render for the current target (editor
 * or list).
 */
function renderTargetPage(target, isRoot) {
  // If the target is not an object, assume that
  // it is editable and render the editor page.
  if (typeof target !== 'object') {
    return renderTargetEditor(target);
  }

  // Otherwise, the target is an enumerable object
  // and we can render the list page.
  return renderTargetList(target, isRoot);
}

/**
 * Helper for rendering the editor page.
 */
function renderTargetEditor(target) {
  var page = document.createElement('section');
  page.innerHTML =
`<fxos-code-editor>${target}</fxos-code-editor>
<section flex>
  <gaia-button data-action="cancel">Cancel</gaia-button>
  <gaia-button data-action="save">Save</gaia-button>
</section>`;

  return page;
}

/**
 * Helper for rendering the list page.
 */
function renderTargetList(target, isRoot) {
  var list = document.createElement('gaia-list');

  if (!isRoot) {
    list.appendChild(renderBackItem());
  }

  if (target instanceof window.NamedNodeMap) {
    list.appendChild(renderAddAttributeItem());
  }

  getSortedProperties(target).forEach((property) => {
    list.appendChild(renderTargetListItem(target, property));
  });

  var page = document.createElement('section');
  page.innerHTML =
`<section flex>
  <gaia-text-input type="search" placeholder="Search Properties"></gaia-text-input>
</section>
${list.outerHTML}`;

  return page;
}

/**
 * Helper for rendering a list item.
 */
function renderTargetListItem(target, property) {
  var value = target[property];
  if (value instanceof window.Attr) {
    value = `'${escapeHTML(value.value)}'`;
  }

  else if (typeof value === 'string') {
    value = `'${escapeHTML(value)}'`;
  }

  var a = document.createElement('a');
  a.href = property;
  a.dataset.search = property.toLowerCase();
  a.innerHTML =
`<h3>${property} = <span class="value">${value}</span></h3>`;

  // Append "X" button to remove attributes.
  if (target instanceof window.NamedNodeMap) {
    a.innerHTML +=
`<i data-customizer-icon="remove" data-action="remove"></i>`;
  }

  return a;
}

/**
 * Helper for rendering the "Up One Level [..]" list item.
 */
function renderBackItem() {
  var a = document.createElement('a');
  a.href = '../';
  a.innerHTML =
`<h3>Up One Level [..]</h3>`;

  return a;
}

/**
 * Helper for rendering the "Create New Attribute"
 * list item.
 */
function renderAddAttributeItem() {
  var a = document.createElement('a');
  a.href = '#add-attribute';
  a.innerHTML =
`<h3>Create New Attribute</h3>
<i data-customizer-icon="add"></i>`;

  return a;
}

/**
 * Helper for enumerating and sorting all direct
 * properties for the specified target object.
 * This also handles an `attributes` object as a
 * special case and returns a sorted array of
 * attribute names instead of an array-indexed
 * list of `Attr` objects.
 */
function getSortedProperties(target) {
  var properties = [];

  // If the `target` is a `NamedNodeMap` (attributes),
  // enumerate the attributes and push their names
  // instead of treating it as properties.
  if (target instanceof window.NamedNodeMap) {
    for (var attr of target) {
      properties.push(attr.name);
    }

    properties = properties.sort();
  }

  // Otherwise, emumerate the properties as usual.
  else {
    for (var property in target) {
      // Omit invalid properties.
      if (!isValidProperty(target, property)) {
        continue;
      }

      // Omit constants.
      if (CONSTANT_PROPERTY_REGEX.test(property)) {
        continue;
      }

      // Omit native functions unless the target object
      // directly contains them (e.g. `Element.prototype`).
      if (!target.hasOwnProperty(property) &&
          isNativeFunction(target[property])) {
        continue;
      }

      properties.push(property + '');
    }

    // Explicitly add the `nodeValue`, `textContent` and
    // `value` properties for empty attributes so their
    // values can be set.
    if (target instanceof window.Attr && !target.value) {
      properties.push('nodeValue');
      properties.push('textContent');
      properties.push('value');
    }

    properties = properties.sort();

    // Append `__proto__` property to end of array after
    // sorting (if the object has one).
    if (target.__proto__) {
      properties.push('__proto__');
    }
  }

  return properties;
}

/**
 * Escapes HTML strings so that <, > and quotation
 * characters are properly rendered in the list items.
 */
function escapeHTML(html) {
  return html.replace(/[&<>"'\/]/g, (s) => {
    return HTML_ESCAPE_CHARS[s];
  });
}

/**
 * Determines if the specified property is valid for
 * the target object.
 * NOTE: The `try`/`catch` is necessary to catch
 * exceptions for properties that cannot be directly
 * accessed.
 */
function isValidProperty(target, property) {
  try {
    return !!target[property];
  } catch (e) {
    return false;
  }
}

/**
 * Determines if a function is native. Native functions
 * are filtered from the list items unless they are direct
 * members of the current target object. This is to
 * provide consistency with object/property inspection on
 * desktop DevTools.
 */
function isNativeFunction(value) {
  return typeof value === 'function' && !!~value.toString().indexOf('[native code]');
}

try {
  document.registerElement('fxos-inspector', { prototype: proto });
} catch (e) {
  if (e.name !== 'NotSupportedError') {
    throw e;
  }
}

})(window);
