[![Build Status](https://travis-ci.org/fxos/customizer.svg?branch=master)](https://travis-ci.org/fxos/customizer)

# Customizer

An addon to create addons.

Want to hack? Read the [documentation](https://github.com/fxos/docs/wiki/Development-Setup).

# Temporary build instructions

## Setup
```npm install && bower install```

## Build
```gulp build && ./custombuild```
Do *not* use the ```gulp``` watcher.
'custombuild' concatenates all JS into one file that ends up in
```dist/app/js/addon-concat.js```. This is needed because addons can only inject
one JS file at a time without modifying the manifest.

## Run
Open ```./dist/app/``` in WebIDE and install it. When the file manager appears
on the device, open ```index.html```.
