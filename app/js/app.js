/*global EditView*/
/*global ActionMenuView*/
/*global MainView*/

/*global EditController*/
/*global ActionMenuController*/
/*global MainController*/

var editView = new EditView();
var actionMenuView = new ActionMenuView();
var mainView = new MainView({
  actionMenuView: actionMenuView,
  editView: editView
});

var editController = new EditController({
  view: editView
});

var actionMenuController = new ActionMenuController({
  view: actionMenuView,

  editController: editController
});

window.mainController = new MainController({
  view: mainView,

  actionMenuController: actionMenuController
});
