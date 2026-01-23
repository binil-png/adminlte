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
