class Container {
  container = null;
  constructor(container) {
    this.container = container;
  }
}

class Loading extends Container {
  show() {
    this.container
      .append(`<div id="custom-loading-component" class="d-flex flex-column align-items-center justify-content-center p-5" >
          <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem">
            <span class="visually-hidden">Loading...</span>
          </div>
          <strong class="mt-2 text-primary">Loading...</strong>
        </div>`);
  }
  stop() {
    this.container.find("#custom-loading-component").remove();
  }
}

class AlertComponent extends Container {
  primary(message) {
    this.container.append(
      `<div class="alert alert-primary" role="alert">${message}</div>`,
    );
  }

  error(message) {
    this.container.append(
      `<div class="alert alert-error" role="alert">${message}</div>`,
    );
  }

  success(message) {
    this.container.append(
      `<div class="alert alert-success" role="alert">${message}</div>`,
    );
  }

  warning(message) {
    this.container.append(
      `<div class="alert alert-warning" role="alert">${message}</div>`,
    );
  }
}

class PreviewComponent extends Container {
  _data = [];
  constructor(container, data = []) {
    super(container);
    this.data = data;
  }
  set data(value) {
    this._data = Array.isArray(value) ? value : [value];
    this.renderPreview();
  }
  get data() {
    return this._data;
  }
  renderPreview() {
    const $el =
      this.container instanceof $ ? this.container : $(this.container);
    if ($el.length && this._data) {
      const displayText = this._data.join(" | ");
      $el.text(displayText);
    }
  }
}

class ToastComponent {
  $toast = null;
  constructor() {
    this.$toast = $("#liveToast");
  }
  success(message, delay = 3000) {
    this.$toast.addClass(`bg-success`);
    $("#toastMessage").text(message);
    this.$toast.toast({ autohide: true, delay }).toast("show");
  }
  danger(message, delay = 3000) {
    this.$toast.addClass(`bg-danger`);
    $("#toastMessage").text(message);
    this.$toast.toast({ autohide: true, delay }).toast("show");
  }
  info(message, delay = 3000) {
    this.$toast.addClass(`bg-info`);
    $("#toastMessage").text(message);
    this.$toast.toast({ autohide: true, delay }).toast("show");
  }
  warning(message, delay = 3000) {
    this.$toast.addClass(`bg-warning`);
    $("#toastMessage").text(message);
    this.$toast.toast({ autohide: true, delay }).toast("show");
  }
}
