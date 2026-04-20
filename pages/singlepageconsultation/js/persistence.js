  const LAST_PATIENT_KEY = "lastConsultationPatient";
  const BASE_STORAGE_KEY = "consultationData_";
  let currentPatientId = null;

  function getStorageKey() {
    // Attempt to get patient ID from global state
    const pid = window.patientDataGlobal ? (window.patientDataGlobal.patientId || window.patientDataGlobal.patient_id) : null;
    return pid ? BASE_STORAGE_KEY + pid : null;
  }

  function gatherAllData() {
    const data = {
      patient: {
        name: $("#pName").text(),
        id: $("#pId").text(),
        basic: $("#pBasic").text(),
        phone: $("#pPhone").text().trim(),
        avatar: $("#pAvatar").attr("src"),
        amountDue: $("#pAmount").text(),
        visits: $("#pVisits").text(),
        lastVisit: $("#pLastVisit").text(),
        allergies: $("#pAllergies").html(),
        allergiesList: (typeof window.addAllergies !== 'undefined') ? window.addAllergies : []
      },
      vitals: {
        temperature: $("input[name='temperature']").val(),
        height: $("input[name='height']").val(),
        weight: $("input[name='weight']").val(),
        bp: {
          systolic: $("input[name='systolic']").val(),
          diastolic: $("input[name='diastolic']").val(),
          position: $("select[name='position']").val()
        },
        glucose: $("input[name='glucose']").val(),
        pulse: $("input[name='pulse']").val(),
        cholesterol: $("input[name='cholesterol']").val(),
        spo2: $("input[name='spo2']").val(),
        respiratoryRate: $("input[name='respiratoryRate']").val()
      },
      clinicalNotes: {
        chiefComplaints: $("#chiefComplaints").val(),
        medicalHistory: $("#medicalHistory").val(),
        observations: $("#observations").val(),
        investigations: $("#investigations").val(),
        diagnosis: $("#diagnosis").val(),
        treatment: $("#treatment").val(),
        notes: $("#notes").val(),
        advice: $("#advice").val() || ""
      },
      procedures: (typeof window.procData !== 'undefined') ? JSON.parse(JSON.stringify(window.procData)) : [],
      prescriptions: (typeof window.getPrescriptionData === 'function') ? window.getPrescriptionData() : [],
      labTests: (typeof window.labTestsList !== 'undefined') ? JSON.parse(JSON.stringify(window.labTestsList)) : [],
      dentalProcedures: (typeof window.dentalProceduresList !== 'undefined') ? JSON.parse(JSON.stringify(window.dentalProceduresList)) : [],
      dental: {
        teeth: $("#selectedTeethPreview").text(),
        sum: $("#dentalSum").text()
      },
      dentalLab: {
          labName: $("#labName").val(),
          brand: $("#brand").val(),
          workType: $("#workType").val(),
          remarks: $("#remarks").val(),
          invoiceAmount: $("#invoiceAmount").val(),
          labAmount: $("#labAmount").val(),
          executiveName: $("#executiveName").val(),
          deliveryStatus: $("#deliveryStatus").val(),
          deliveryDate: $("#deliveryDate").val(),
          givenDate: $("#givenDate").val(),
          teeth: (typeof window.selectedLabTeeth !== 'undefined') ? Object.keys(window.selectedLabTeeth) : []
      },
      files: (typeof window.uploadedFilesList !== 'undefined') ? JSON.parse(JSON.stringify(window.uploadedFilesList)) : [],
      patientDataGlobal: (typeof window.patientDataGlobal !== 'undefined') ? window.patientDataGlobal : null
    };

    // The object is already initialized with global data getters for 
    // procedures, prescriptions, labTests, dentalProcedures, files, etc.
    // We only need to gather manual fields like follow-up.

    data.nextReview = {
        date: $("#reviewDate").val(),
        time: $("#timeFilter").val()
    };

    return data;
  }

  function resetConsultationForm() {
    console.log("Persistence: Resetting consultation form...");
    $("form#vitalsForm")[0]?.reset();
    $("form#notesForm")[0]?.reset();
    $(".select2.complaint").val([]).trigger("change");
    if (typeof window.procData !== "undefined") {
      window.procData = [];
      if (typeof window.renderProcTable === "function") window.renderProcTable();
    }
    if (typeof window.setPrescriptions === "function") {
      window.setPrescriptions([]);
    }
    if (typeof window.renderLabSelectedTests === "function") {
        window.renderLabSelectedTests([]);
    }
    if (typeof window.renderUploadedFiles === "function") {
        window.renderUploadedFiles(); 
    }
    window.uploadedFilesList = [];
    $("#fileList").empty();
    $("#selectedLabContainer").empty();
    $("#selectedTeethPreview").text("No items yet");
    $("#dentalSum").text("0");
    $(".preview-text").text("No items yet");
  }

  function saveToLocalStorage() {
    const key = getStorageKey();
    if (!key) {
        console.warn("Persistence: No patient selected, skipping save.");
        return;
    }

    const data = gatherAllData();
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`Persistence: Data saved for key ${key}`, data);
  }

  // Explicit Save Listeners (Removed debounced auto-save on input change)
  $("#globalSave, #saveVitals, #saveNotes, #saveLab, #saveProcedure, #savePresc, #saveDental, #saveFiles, #saveAllergyChanges, .save-all-btn").on("click", function () {
    saveToLocalStorage();
  });

  // Handle explicit patient switch
  $(document).on("patientMatched", function(e, patient) {
    console.log("Persistence: Patient matched event received:", patient);
    const pid = patient.patientId || patient.patient_id;
    currentPatientId = pid;
    
    // Remember this patient as the last active one
    localStorage.setItem(LAST_PATIENT_KEY, JSON.stringify(patient));
    
    loadFromLocalStorage();
  });

  // Periodic check for patient switch (fallback)
  setInterval(() => {
    const pid = window.patientDataGlobal ? (window.patientDataGlobal.patientId || window.patientDataGlobal.patient_id) : null;
    if (pid && pid !== currentPatientId) {
        console.log(`Persistence: Detected patient switch to ${pid}`);
        currentPatientId = pid;
        loadFromLocalStorage();
    }
  }, 2000);

  // Initial Load Logic
  $(document).ready(function() {
      // 1. Check if we already have a global patient (set by new.js or other)
      if (window.patientDataGlobal) {
          console.log("Persistence: Global patient found on load.");
          loadFromLocalStorage();
      } 
      // 2. Otherwise try to restore from last session
      else {
          const lastPatientStr = localStorage.getItem(LAST_PATIENT_KEY);
          if (lastPatientStr) {
              const lastPatient = JSON.parse(lastPatientStr);
              console.log("Persistence: Restoring last active patient:", lastPatient);
              window.patientDataGlobal = lastPatient;
              // Trigger UI update in new.js (sidebar)
              $(document).trigger("patientMatched", [lastPatient]);
          }
      }

      // If we are on the preview page, we should load data
      if (window.location.pathname.includes("preview.html")) {
          loadFromLocalStorage();
      }
  });

  function loadFromLocalStorage() {
      resetConsultationForm();

      let key = getStorageKey();
      if (!key) {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(BASE_STORAGE_KEY));
        if (keys.length > 0) key = keys[0];
      }

      if (!key) return;

      const rawData = localStorage.getItem(key);
      if (!rawData) {
          console.log(`Persistence: No local data found for key ${key}`);
          return;
      }

      const data = JSON.parse(rawData);
      console.log(`Persistence: Loading data for key ${key}`, data);

      if (data.patientDataGlobal) {
          window.patientDataGlobal = data.patientDataGlobal;
      }

      // Populate Patient Sidebar
      if (data.patient) {
        $("#pName").text(data.patient.name);
        $("#pAvatar").attr("src", data.patient.avatar);
        $("#pBasic").text(data.patient.basic);
        if ($("#pPhone").length) $("#pPhone").html(`<i class="fa fa-mobile mr-2 text-custom"></i> ${data.patient.phone}`);
        $("#pAmount").text(data.patient.amountDue);
        $("#pVisits").text(data.patient.visits);
        $("#pLastVisit").text(data.patient.lastVisit);
        $("#pId").text(data.patient.id);
        
        // Restore global allergy list and sync UI
        if (typeof window.addAllergies !== 'undefined' && data.patient.allergiesList) {
            window.addAllergies = data.patient.allergiesList;
            if (typeof window.renderallergies === 'function') window.renderallergies();
        } else {
            $("#pAllergies").html(data.patient.allergies);
        }
      }

      // Populate Vitals
      if (data.vitals) {
          $("input[name='temperature']").val(data.vitals.temperature);
          $("input[name='height']").val(data.vitals.height);
          $("input[name='weight']").val(data.vitals.weight);
          $("input[name='systolic']").val(data.vitals.bp?.systolic);
          $("input[name='diastolic']").val(data.vitals.bp?.diastolic);
          $("select[name='position']").val(data.vitals.bp?.position);
          $("input[name='glucose']").val(data.vitals.glucose);
          $("input[name='pulse']").val(data.vitals.pulse);
          $("input[name='cholesterol']").val(data.vitals.cholesterol);
          $("input[name='spo2']").val(data.vitals.spo2);
          $("input[name='respiratoryRate']").val(data.vitals.respiratoryRate);

          $("#topTemp").text(`${data.vitals.temperature || "—"}°F`);
          $("#topHtWt").text(`${data.vitals.height || "—"}m/${data.vitals.weight || "—"}kg`);
          $("#topBP").text(`${data.vitals.bp?.systolic || "—"}/${data.vitals.bp?.diastolic || "—"}`);
          $("#topGlucose").text(`${data.vitals.glucose || "—"} mg`);
          $("#topPulse").text(`${data.vitals.pulse || "—"} bpm`);
          $("#topChol").text(`${data.vitals.cholesterol || "—"} mg`);
          $("#topSPO2").text(`${data.vitals.spo2 || "—"}%`);
          $("#topRespRate").text(`${data.vitals.respiratoryRate || "—"}/min`);
      }

      // Populate Clinical Notes
      if (data.clinicalNotes) {
          if (typeof window.setClinicalNotes === 'function') {
              window.setClinicalNotes(data.clinicalNotes);
          } else {
              const cn = data.clinicalNotes;
              $("#chiefComplaints").val(cn.chiefComplaints).trigger('change');
              $("#medicalHistory").val(cn.medicalHistory).trigger('change');
              $("#observations").val(cn.observations).trigger('change');
              $("#investigations").val(cn.investigations).trigger('change');
              $("#diagnosis").val(cn.diagnosis).trigger('change');
              $("#treatment").val(cn.treatment).trigger('change');
              $("#notes").val(cn.notes).trigger('change');
              $("#advice").val(cn.advice);
          }
          
          const formatText = (arr) => Array.isArray(arr) ? arr.join(", ") : arr;
          const cn = data.clinicalNotes;
          const cc = formatText(cn.chiefComplaints);
          const hist = formatText(cn.medicalHistory);
          const obs = formatText(cn.observations);
          const inv = formatText(cn.investigations);
          const diag = formatText(cn.diagnosis);
          const treat = formatText(cn.treatment);
          const notes = formatText(cn.notes);
          const adv = cn.advice;

          $(".border-primary p").html(`<strong>Chief Complaints:</strong> ${cc || "—"}<br><strong>History:</strong> ${hist || "—"}`);
          if ($(".clinical-details-section").length > 0) {
              $(".clinical-details-section p").html(`<strong>Obs:</strong> ${obs || "—"}<br><strong>Inv:</strong> ${inv || "—"}`);
          }
          $(".border-info p:first").html(`<strong>Diagnosis:</strong> ${diag || "—"}`);
          $(".border-info p:last").html(`<strong>Advice:</strong> ${adv || "—"}`);
          if ($(".treatment-notes-section").length > 0) {
              $(".treatment-notes-section p").html(`<strong>Treatment:</strong> ${treat || "—"}<br><strong>Notes:</strong> ${notes || "—"}`);
          }
      }

      if (data.procedures && data.procedures.length > 0) {
          if (typeof window.procData !== 'undefined') {
              window.procData = JSON.parse(JSON.stringify(data.procedures));
              if (typeof window.renderProcTable === 'function') window.renderProcTable();
          }
          const container = $("#procedurePreviewList");
          if (container.length) {
              container.empty(); 
              data.procedures.forEach(proc => {
                  container.append(`
                      <div class="p-2 border rounded-3 mb-2 bg-white shadow-sm" style="font-size: 0.75rem">
                        <div class="d-flex justify-content-between fw-bold pb-1 mb-1">
                          <span>${proc.name || "—"}</span>
                          <span class="text-success">${proc.price ? "₹" + proc.price : "—"}</span>
                        </div>
                        <div class="row g-1">
                          <div class="col-6"><span class="text-muted">Dr:</span> ${proc.doctor || "—"}</div>
                          <div class="col-6"><span class="text-muted">Status:</span> 
                            <span class="badge bg-success-subtle text-success py-0">${proc.status || "—"}</span>
                          </div>
                        </div>
                      </div>
                  `);
              });
          }
      }

      if (data.procedures && data.procedures.length > 0) {
          if (typeof window.renderProcTable === 'function') {
              window.procData = data.procedures;
              window.renderProcTable();
          }
           const container = $("#procedurePreviewList");
           if (container.length) {
               container.empty();
               data.procedures.forEach(proc => {
                   container.append(`<div class="p-2 border-bottom" style="font-size: 0.75rem"><div class="fw-bold text-primary">${proc.name || "—"}</div><div class="text-muted">Qty: ${proc.qty || "1"} | ₹${proc.price || "0"}${proc.toothNo ? ` | Tooth: ${proc.toothNo.join(", ")}` : ""}</div></div>`);
               });
           }
      }

      if (data.dentalProcedures && data.dentalProcedures.length > 0) {
          if (typeof window.renderDentalTable === 'function') {
              window.renderDentalTable(data.dentalProcedures);
          }
      }

      if (data.dental && data.dental.teeth && data.dental.teeth !== "No items yet") {
          const container = $("#dentalProcedurePreviewList");
          if (container.length) {
              container.empty().removeClass("d-none");
              container.append(`<div class="p-2 border-start border-3 border-danger bg-white shadow-sm mb-2" style="font-size: 0.75rem"><div class="fw-bold mb-1">DENTAL SUMMARY</div><div class="text-muted"><strong>Teeth:</strong> ${data.dental.teeth}</div><div class="text-danger fw-bold mt-1">Estim. Total: ₹${data.dental.sum || "0"}</div></div>`);
          }
          if ($("#selectedTeethPreview").length) $("#selectedTeethPreview").text(data.dental.teeth);
          if ($("#dentalSum").length) $("#dentalSum").text(data.dental.sum);
      }

      if (data.prescriptions && data.prescriptions.length > 0) {
          if (typeof window.setPrescriptions === 'function') window.setPrescriptions(data.prescriptions);
          const container = $("#prescriptionPreviewList");
          if (container.length) {
              container.empty(); 
              data.prescriptions.forEach(med => {
                  container.append(`<div class="card mb-2 border-0 bg-light shadow-sm"><div class="card-body p-2" style="font-size: 0.75rem"><div class="d-flex justify-content-between pb-1 mb-1"><strong class="text-dark">${med.name || "—"}</strong><span class="badge text-dark">Qty: ${med.qty || "0"}</span></div><div class="row g-0 text-muted"><div style="font-size: .9rem;" class="col-6">${med.dosage || "—"} | ${med.duration || "0"} Days</div><div style="font-size: .9rem;" class="col-6">Oral | ${med.instruction || "—"}</div></div></div></div>`);
              });
          }
      }

      if (data.labTests && data.labTests.length > 0) {
          if (typeof window.renderLabSelectedTests === 'function') {
              window.renderLabSelectedTests(data.labTests);
          }
          const tbody = $("#labPreviewList");
          if (tbody.length) {
              tbody.empty();
              data.labTests.forEach(test => {
                  const testName = typeof test === 'object' ? (test.name || test.text || test.label) : test;
                  tbody.append(`<tr><td>${testName || "—"}</td><td class="text-end text-muted">Today</td></tr>`);
              });
          }
      }

      if (data.files && data.files.length > 0) {
          if (typeof window.renderUploadedFiles === 'function') {
              window.uploadedFilesList = data.files;
              window.renderUploadedFiles();
          }
      }

      if (data.dentalLab) {
          const dl = data.dentalLab;
          if (dl.labName) {
              const $labSelect = $("#labName");
              if ($labSelect.length) {
                  const option = new Option(dl.labName, dl.labName, true, true);
                  $labSelect.append(option).trigger('change');
              }
          }
          if (dl.brand) {
              const $brandSelect = $("#brand");
              if ($brandSelect.length) {
                  const option = new Option(dl.brand, dl.brand, true, true);
                  $brandSelect.append(option).trigger('change');
              }
          }
          $("#workType").val(dl.workType || "");
          $("#remarks").val(dl.remarks || "");
          $("#invoiceAmount").val(dl.invoiceAmount || "");
          $("#labAmount").val(dl.labAmount || "");
          $("#executiveName").val(dl.executiveName || "");
          $("#deliveryStatus").val(dl.deliveryStatus || "");
          $("#deliveryDate").val(dl.deliveryDate || "");
          $("#givenDate").val(dl.givenDate || "");
          
          if (dl.teeth && dl.teeth.length > 0) {
              if (typeof window.setDentalLabTeeth === 'function') {
                  window.setDentalLabTeeth(dl.teeth);
              }
          }
      }

      if (data.nextReview && data.nextReview.date) {
          $("#reviewDate").val(data.nextReview.date);
          $("#timeFilter").val(data.nextReview.time);
          $("#pNextReview").text(`${data.nextReview.date} ${data.nextReview.time || ""}`);
          $(".next-review-container").removeClass("d-none");
      }
  }
