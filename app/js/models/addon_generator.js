/*global Model*/

/*global JSZip*/

export default class AddonGenerator extends Model {
  constructor(properties) {
    super(properties);

    this.operations = [];

    this.id = this.id || ('addon' + Math.round(Math.random() * 100000000));
    this.name = this.name || this.id;

    this.packageMetadata = {
      installOrigin: 'http://gaiamobile.org',
      manifestURL: 'app://' + this.id + '.gaiamobile.org/update.webapp',
      version: 1
    };

    this.packageManifest = {
      name: this.name,
      package_path: '/application.zip'
    };

    this.manifest = {
      name: this.name,
      description: 'Generated by Customizer',
      role: 'addon',
      type: 'certified',
      origin: 'app://' + this.id + '.gaiamobile.org',
      customizations: [{
        filter: window.location.origin,
        scripts: ['main.js']
      }]
    };
  }

  generate() {
    var script =
`/*=AddonGenerator*/
var selector = '${this.getSelector()}';
var el = document.querySelector(selector);
var mo = new MutationObserver(function() {
  var newEl = document.querySelector(selector);
  if (newEl !== el) {
    el = newEl;
    setTimeout(exec, 1);
  }
});
mo.observe(document.documentElement, {
  childList: true,
  attributes: true,
  characterData: true,
  subtree: true
});
exec();
function exec() {
${this.operations.join('\n')}
}
/*==*/`;

    console.log('******** Generated SCRIPT ********', script);

    var applicationZip = new JSZip();
    applicationZip.file('manifest.webapp', JSON.stringify(this.manifest));
    applicationZip.file('main.js', script);

    var packageZip = new JSZip();
    packageZip.file('metadata.json', JSON.stringify(this.packageMetadata));
    packageZip.file('update.webapp', JSON.stringify(this.packageManifest));
    packageZip.file('application.zip', applicationZip.generate({ type: 'arraybuffer' }));

    return packageZip.generate({ type: 'arraybuffer' });
  }

  getSelector() {
    return getSelector(this.target);
  }

  opAddEventListener(eventName, callback) {
    this.operations.push(
`/*=AddonGenerator::addEventListener*/
el.addEventListener('${eventName}', ${callback});
/*==*/`
    );
  }

  opAppendChild(childNodeName) {
    this.operations.push(
`/*=AddonGenerator::appendChild*/
el.appendChild(document.createElement('${childNodeName}');
/*==*/`
    );
  }

  opInnerHTML(html) {
    this.operations.push(
`/*=AddonGenerator::innerHTML*/
el.innerHTML = ${JSON.stringify(html)};
if (el.tagName === 'SCRIPT') {
  eval(el.innerHTML);
}
else {
  Array.prototype.forEach.call(el.querySelectorAll('script'), function(script) {
    eval(script.innerHTML);
  });
}
/*==*/`
    );
  }

  opScript(script) {
    this.operations.push(
`/*=AddonGenerator::innerHTML*/
${script}
/*==*/`
    );
  }

  opRemove() {
    this.operations.push(
`/*=AddonGenerator::remove*/
el.parentNode.removeChild(el);
/*==*/`
    );
  }

  opSetAttribute(name, value) {
    this.operations.push(
`/*=AddonGenerator::setAttribute*/
el.setAttribute('${name}', '${value}');
/*==*/`
    );
  }

  opSetProperty(name, value) {
    this.operations.push(
`/*=AddonGenerator::setProperty*/
el.${name} = ${JSON.stringify(value)};
/*==*/`
    );
  }

  opSetProperties(properties) {
    for (var name in properties) {
      this.setProperty(name, properties[name]);
    }
  }

  opMoveAppend(target) {
    this.operations.push(
`/*=AddonGenerator::moveAppend*/
var target = document.querySelector('${getSelector(target)}');
if (target) {
  target.appendChild(el);
}
/*==*/`
    );
  }

  opMovePrepend(target) {
    this.operations.push(
`/*=AddonGenerator::movePrepend*/
var target = document.querySelector('${getSelector(target)}');
if (target) {
  target.insertBefore(el, target.firstChild);
}
/*==*/`
    );
  }

  opMoveAfter(target) {
    this.operations.push(
`/*=AddonGenerator::moveAfter*/
var target = document.querySelector('${getSelector(target)}');
if (target && target.parentNode) {
  if (target.parentNode.lastChild === target) {
    target.parentNode.appendChild(el);
  }
  else {
    target.parentNode.insertBefore(el, target.nextSibling);
  }
}
/*==*/`
    );
  }

  opMoveBefore(target) {
    this.operations.push(
`/*=AddonGenerator::moveBefore*/
var target = document.querySelector('${getSelector(target)}');
if (target && target.parentNode) {
  target.parentNode.insertBefore(el, target);
}
/*==*/`
    );
  }
}

function getSelector(element) {
  var current = element;
  var path = [getSpecificSelector(current)];

  while (!current.id && current.nodeName !== 'HTML') {
    current = current.parentNode;
    path.push(getSpecificSelector(current));
  }

  return path.reverse().join('>');
}

function getSpecificSelector(element) {
  var selector = element.nodeName;

  if (element.id) {
    selector += '#' + element.id;
    return selector;
  }

  Array.prototype.forEach.call(element.classList, (item) => {
    selector += '.' + item;
  });

  Array.prototype.forEach.call(element.attributes, (attr) => {
    if (attr.nodeName.toLowerCase() === 'class') {
      return;
    }

    selector += '[' + attr.nodeName + '="' + attr.nodeValue + '"]';
  });

  return selector;
}