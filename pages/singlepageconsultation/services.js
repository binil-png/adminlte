class NetworkServices extends ToastComponent {
  baseUrl = "";
  customStatusText = {};

  constructor(baseUrl, proxy = "") {
    super();
    this.baseUrl = baseUrl;
    this.proxy = proxy;
    this.isLoading = false;
    this.errorMsg = null;
    this.status = null;
  }

  async request(endpoint, method = "GET", body = null) {
    this.isLoading = true;
    this.errorMsg = null;
    this.status = null;

    // Check if the body is an instance of FormData
    const isFormData = body instanceof FormData;
    const url = `${this.proxy}${this.baseUrl}${endpoint}`;

    try {
      const response = await $.ajax({
        url: url,
        method: method,
        dataType: "json",
        // Logic for Form Data vs JSON
        contentType: isFormData ? false : "application/json",
        processData: isFormData ? false : true,
        data: isFormData ? body : body ? JSON.stringify(body) : null,
        complete: (xhr) => {
          this.status = xhr.status;
        },
      });
      return response;
    } catch (xhr) {
      this.status = xhr.status;
      console.log(
        `API Call Failed (${method} => ${endpoint} => ${xhr.statusText})`,
        xhr,
      );
      this.errorMsg = xhr?.statusText || "Network Error";
      this.danger(this.errorMsg);
      return new Error(this.errorMsg);
    } finally {
      this.isLoading = false;
      this.onStateChange();
    }
  }

  // Helper for explicit Form Data posts
  async postForm(endpoint, formData) {
    return await this.request(endpoint, "POST", formData);
  }

  async get(endpoint) {
    return await this.request(endpoint, "GET");
  }
  async post(endpoint, data) {
    return await this.request(endpoint, "POST", data);
  }
  async put(endpoint, data) {
    return await this.request(endpoint, "PUT", data);
  }
  async delete(endpoint) {
    return await this.request(endpoint, "DELETE");
  }

  onStateChange() {
    console.log(`Loading: ${this.isLoading}, Status: ${this.status}`);
  }
}
