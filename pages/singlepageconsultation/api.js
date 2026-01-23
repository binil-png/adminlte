class ApiServices {
  constructor(container) {
    this.container = container;
    this.apiObj = new NetworkServices("http://localhost:8080");
    this.loader = new Loading(this.container);
    this.customAlert = new AlertComponent(this.container);
  }

  async execute(apiCall, msg) {
    try {
      this.loader.show();
      const response = await apiCall();
      return response;
    } catch (error) {
      const errorMsg = msg || error?.statusText || "Connection to server failed.";
      console.error("API Error:", error);
      this.customAlert.error(errorMsg || `Error: ${error.message}`);
      return null;
    } finally {
      this.loader.stop();
    }
  }

  async getVitalsList() {
    return await this.execute(
      () => this.apiObj.get("/singlepagevitallist"),
      "No vitals added !",
    );
  }

  async getClinicNotesList() {
    return await this.execute(
      () => this.apiObj.get("/singlepageclinicnoteslist"),
      "No clinical notes added !",
    );
  }

  async getPrescriptionList() {
    return await this.execute(
      () => this.apiObj.get("/singlepageprescriptionlist"),
      "No prescription added !"
    );
  }

  async getLabList() {
    return await this.execute(
      () => this.apiObj.get("/singlepagelablist"),
      "No lab added !"
    );
  }

}
