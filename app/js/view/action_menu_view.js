/* global View */

/* import 'components/gaia-dialog/gaia-dialog'; */

export default class ActionMenuView extends View {
  constructor() {
    this.el = document.createElement('view');
  }

  render() {
    super();

    this._dialog = document.createElement('gaia-dialog');

    var editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    this._dialog.appendChild(editBtn);

    var delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    this._dialog.appendChild(delBtn);

    var moveBtn = document.createElement('button');
    moveBtn.textContent = 'Move';
    this._dialog.appendChild(moveBtn);

    var cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', this._handleCancel.bind(this));
    this._dialog.appendChild(cancelBtn);

    document.body.appendChild(this._dialog);
    this._dialog.open();
  }

  _handleCancel(e) {
    this._dialog.close();
  }
}
