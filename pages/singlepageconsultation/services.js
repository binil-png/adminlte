class ApiService {
  constructor(baseUrl, proxy = "https://cors-anywhere.herokuapp.com/") {
    this.baseUrl = baseUrl;
    this.proxy = proxy;
    this.isLoading = false;
    this.error = null;
    this.status = null;
  }
  async request(endpoint, method = "GET", body = null) {
    this.isLoading = true;
    this.error = null;
    this.status = null;
    const url = `${this.proxy}${this.baseUrl}${endpoint}`;
    try { 
      const response = await $.ajax({
        url: url,
        method: method,
        dataType: "json",
        contentType: "application/json",
        data: body ? JSON.stringify(body) : null,
        complete: (xhr) => {
          this.status = xhr.status;
        },
      });

      return response;
    } catch (xhr) {
      this.status = xhr.status;
      this.error = xhr.statusText || "Network Error";
      console.error(`API Call Failed (${method} ${endpoint}):`, this.error);
      return null;
    } finally {
      this.isLoading = false;
      this.onStateChange();
    }
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

