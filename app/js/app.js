/* global MainController */

var mainController = new MainController();
mainController.main();

setTimeout(() => {
  window.alert('ohai');
}, 2000);
