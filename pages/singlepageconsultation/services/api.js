class ApiServices {
  constructor(container) {
    this.container = container;
    this.apiObj = new NetworkServices("http://localhost:8080");
    this.loader = new Loading(this.container);
  }

  async execute(apiCall, msg) {
    try {
      this.loader.show();
      const response = await apiCall();
      return response;
    } catch (error) {
      const errorMsg = msg || error?.statusText || "Connection to server failed.";
      console.error("API Error:", error);
      return null;
    } finally {
      this.loader.stop();
    }
  }
  
}

class SinglePageServices extends ApiServices {
  
   async getPatientData (id){
        return await this.apiObj.get(`/singlepageselectpatient?patient_id=${id}`)
   }

   async saveVitalsData(data){
        return await this.apiObj.post(`/singlepage_vitals_save`,data)
   }

   async saveAllergyData(data){
        return await this.apiObj.post(`/singlepage_patientprofilesave`,data)
   }
}

class SidebarServices extends ApiServices {
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
      "No prescription added !",
    );
  }

  async getLabList() {
    return await this.execute(
      () => this.apiObj.get("/singlepagelablist"),
      "No lab added !",
    );
  }

  async getProcedure() {
    return await this.execute(
      () => this.apiObj.get("/singlepageprecedureplanlist"),
      "No procedures added !",
    );
  }
  
  async getUploadedFile() {
    return await this.execute(
      () => this.apiObj.get("/singlepagefilelist"),
      "No procedures added !",
    );
  }
}

