$(function () {
  const STORAGE_KEY = "lastConsultationData";

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
        allergies: $("#pAllergies").html()
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
        chiefComplaints: $("#chiefComplaints").find('option:selected').map(function(){ return $(this).text(); }).get(),
        medicalHistory: $("#medicalHistory").find('option:selected').map(function(){ return $(this).text(); }).get(),
        observations: $("#observations").find('option:selected').map(function(){ return $(this).text(); }).get(),
        investigations: $("#investigations").find('option:selected').map(function(){ return $(this).text(); }).get(),
        diagnosis: $("#diagnosis").find('option:selected').map(function(){ return $(this).text(); }).get(),
        treatment: $("#treatment").find('option:selected').map(function(){ return $(this).text(); }).get(),
        notes: $("#notes").find('option:selected').map(function(){ return $(this).text(); }).get(),
        advice: $("#advice").val()
      },
      procedures: [],
      prescriptions: [],
      lab: [],
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
          teeth: $("#selectedLabContainer").find('.badge').map(function(){ return $(this).text().trim(); }).get()
      },
      files: [],
      patientDataGlobal: (typeof patientDataGlobal !== 'undefined') ? patientDataGlobal : null
    };

    // Gather procedures
    $(".proc-box").each(function () {
        const row = $(this);
        data.procedures.push({
            name: row.find("select.proc-name option:selected").text().trim() || "Procedure", 
            qty: row.find(".proc-qty").val(),
            price: row.find(".proc-price").val(),
            doctor: row.find("label:contains('doctor')").next("select").val() || "—",
            status: row.find("label:contains('Status')").next("select").val() || "Planned"
        });
    });

    // Gather prescriptions
    $(".medicine-card").each(function () {
        const card = $(this);
        data.prescriptions.push({
            name: card.find(".select2-medicine option:selected").text().trim() || "Medicine",
            dosage: (card.find(".dosage-value").val() || "1") + " " + (card.find(".dosage-unit").val() || ""),
            frequency: card.find(".select2-frequency option:selected").text().trim() || "0-0-1",
            duration: card.find(".select2-duration option:selected").text().trim() || "1 Day",
            instruction: card.find(".select2-consumption option:selected").text().trim() || "After Food",
            qty: card.find(".dispense-value").val() || "1"
        });
    });

    // Gather lab tests
    $("#selectedTestArea li").each(function() {
        data.lab.push($(this).find("small").first().text());
    });

    // Gather attached files
    $("#fileList li").each(function() {
        data.files.push({
            name: $(this).find('span').first().text(),
            category: $(this).find('.badge').text()
        });
    });

    // Gather follow up
    data.nextReview = {
        date: $("#reviewDate").val(),
        time: $("#timeFilter").val()
    };

    return data;
  }

  function saveToLocalStorage() {
    const data = gatherAllData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log("Data persisted to localStorage:", data);
  }

  // Bind to the View details (globalSave) button
  $("#globalSave").on("click", function (e) {
    saveToLocalStorage();
  });

  // If we are on the preview page, load the data
  if (window.location.pathname.includes("preview.html")) {
      loadFromLocalStorage();
  }

  function loadFromLocalStorage() {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) return;

      const data = JSON.parse(rawData);
      console.log("Loading data from localStorage:", data);

      // Restore global patient data for drawers/modals
      if (data.patientDataGlobal) {
          window.patientDataGlobal = data.patientDataGlobal;
      }

      // Populate Patient Info
      if (data.patient) {
        $("#pName").text(data.patient.name);
        $("#pAvatar").attr("src", data.patient.avatar);
        $("#pBasic").text(data.patient.basic);
        $("#pPhone").html(`<i class="fa fa-mobile mr-2 text-custom"></i> ${data.patient.phone}`);
        $("#pAmount").text(data.patient.amountDue);
        $("#pVisits").text(data.patient.visits);
        $("#pLastVisit").text(data.patient.lastVisit);
        $("#pId").text(data.patient.id);
        $("#pAllergies").html(data.patient.allergies);
      }

      // Populate Vitals in Preview (specific elements in preview.html)
      if (data.vitals) {
          $("#topTemp").text(`${data.vitals.temperature || "—"}°F`);
          $("#topHtWt").text(`${data.vitals.height || "—"}m/${data.vitals.weight || "—"}kg`);
          $("#topBP").text(`${data.vitals.bp.systolic || "—"}/${data.vitals.bp.diastolic || "—"}`);
          $("#topGlucose").text(`${data.vitals.glucose || "—"} mg`);
          $("#topPulse").text(`${data.vitals.pulse || "—"} bpm`);
          $("#topChol").text(`${data.vitals.cholesterol || "—"} mg`);
          $("#topSPO2").text(`${data.vitals.spo2 || "—"}%`);
          $("#topRespRate").text(`${data.vitals.respiratoryRate || "—"}/min`);
      }

      // Populate Clinical Notes
      if (data.clinicalNotes) {
          const cn = data.clinicalNotes;
          
          // Chief Complaints & History section
          const formatText = (arr) => Array.isArray(arr) ? arr.join(", ") : arr;
          
          // Populate different areas in preview.html for all clinical note fields
          const cc = formatText(cn.chiefComplaints);
          const hist = formatText(cn.medicalHistory);
          const obs = formatText(cn.observations);
          const inv = formatText(cn.investigations);
          const diag = formatText(cn.diagnosis);
          const treat = formatText(cn.treatment);
          const notes = formatText(cn.notes);
          const adv = cn.advice;

          // Target specific sections in preview.html
          // Chief Complaints & History
          $(".border-primary p").html(`
              <strong>Chief Complaints:</strong> ${cc || "—"}<br>
              <strong>History:</strong> ${hist || "—"}
          `);
          
          // Observations & Investigations
          if ($(".clinical-details-section").length === 0) {
              // Add a new section for more detail if it doesn't exist
              $(".border-info").before(`
                  <div class="mb-2 border-start border-3 border-warning ps-2 clinical-details-section">
                    <div class="text-muted fw-bold" style="font-size: 0.7rem">Observations & Investigations</div>
                    <p class="mb-0" style="font-size: 0.8rem">
                        <strong>Obs:</strong> ${obs || "—"}<br>
                        <strong>Inv:</strong> ${inv || "—"}
                    </p>
                  </div>
              `);
          } else {
              $(".clinical-details-section p").html(`
                  <strong>Obs:</strong> ${obs || "—"}<br>
                  <strong>Inv:</strong> ${inv || "—"}
              `);
          }

          // Diagnosis & Advice
          $(".border-info p:first").html(`<strong>Diagnosis:</strong> ${diag || "—"}`);
          $(".border-info p:last").html(`<strong>Advice:</strong> ${adv || "—"}`);

          // Add treatment & notes if they exist
          if ($(".treatment-notes-section").length === 0) {
              $(".border-info").after(`
                  <div class="mb-2 border-start border-3 border-success ps-2 treatment-notes-section">
                    <div class="text-muted fw-bold" style="font-size: 0.7rem">Treatment & Additional Notes</div>
                    <p class="mb-0" style="font-size: 0.8rem">
                        <strong>Treatment:</strong> ${treat || "—"}<br>
                        <strong>Notes:</strong> ${notes || "—"}
                    </p>
                  </div>
              `);
          } else {
              $(".treatment-notes-section p").html(`
                  <strong>Treatment:</strong> ${treat || "—"}<br>
                  <strong>Notes:</strong> ${notes || "—"}
              `);
          }
      }

      // Populate Procedures
      if (data.procedures) {
          const container = $("#procedurePreviewList");
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
          $(".fw-bold:contains('PROCEDURES') span").text(data.procedures.length);
      }

      // Populate Dental Procedures Summary
      if (data.dental && data.dental.teeth && data.dental.teeth !== "No items yet") {
          const container = $("#dentalProcedurePreviewList");
          container.empty().removeClass("d-none");
          container.append(`
              <div class="p-2 border-start border-3 border-danger bg-white shadow-sm mb-2" style="font-size: 0.75rem">
                  <div class="fw-bold mb-1">DENTAL SUMMARY</div>
                  <div class="text-muted"><strong>Teeth:</strong> ${data.dental.teeth}</div>
                  <div class="text-danger fw-bold mt-1">Estim. Total: ₹${data.dental.sum || "0"}</div>
              </div>
          `);
      } else {
          $("#dentalProcedurePreviewList").addClass("d-none");
      }

      // Populate Prescriptions
      if (data.prescriptions) {
          const container = $("#prescriptionPreviewList");
          container.empty(); 
          data.prescriptions.forEach(med => {
              container.append(`
                  <div class="card mb-2 border-0 bg-light shadow-sm">
                    <div class="card-body p-2" style="font-size: 0.75rem">
                      <div class="d-flex justify-content-between pb-1 mb-1">
                        <strong class="text-dark">${med.name || "—"}</strong>
                        <span class="badge text-dark">Qty: ${med.qty || "0"}</span>
                      </div>
                      <div class="row g-0 text-muted">
                        <div style="font-size: .9rem;" class="col-6">${med.dosage || "—"} | ${med.duration || "0"} Days</div>
                        <div style="font-size: .9rem;" class="col-6">Oral | ${med.instruction || "—"}</div>
                      </div>
                    </div>
                  </div>
              `);
          });
          $(".fw-bold:contains('PRESCRIPTIONS')").text(`PRESCRIPTIONS (${data.prescriptions.length} Drugs)`);
      }

      // Populate Lab
      if (data.lab) {
          const tbody = $("#labPreviewList");
          tbody.empty();
          data.lab.forEach(test => {
              tbody.append(`
                <tr>
                    <td>${test || "—"}</td>
                    <td class="text-end text-muted">Today</td>
                </tr>
              `);
          });
          $(".fw-bold:contains('LAB TESTS')").text(`LAB TESTS (${data.lab.length})`);
      }

      // Populate Dental Lab
      if (data.dentalLab && data.dentalLab.labName) {
          const container = $("#dentalLabPreviewList");
          container.empty();
          container.append(`
              <div class="p-2 border rounded-3 bg-white shadow-sm" style="font-size: 0.75rem">
                  <div class="d-flex justify-content-between fw-bold pb-1 border-bottom mb-1">
                      <span>${data.dentalLab.labName} (${data.dentalLab.brand || "—"})</span>
                      <span class="text-primary">${data.dentalLab.deliveryStatus || "—"}</span>
                  </div>
                  <div class="row g-1 mt-1">
                      <div class="col-6"><strong>Work:</strong> ${data.dentalLab.workType || "—"}</div>
                      <div class="col-6"><strong>Teeth:</strong> ${data.dentalLab.teeth.join(", ") || "—"}</div>
                      <div class="col-6 text-muted">Due: ${data.dentalLab.deliveryDate || "—"}</div>
                      <div class="col-6 text-muted">Amt: ₹${data.dentalLab.invoiceAmount || "0"}</div>
                  </div>
              </div>
          `);
          $(".fw-bold:contains('DENTAL LAB WORK')").text(`DENTAL LAB WORK (1)`);
      }

      // Populate Attached Files
      if (data.files) {
          const container = $("#attachedFilesPreviewList");
          container.empty();
          data.files.forEach(file => {
              container.append(`
                  <div class="d-flex align-items-center p-1 border rounded bg-white shadow-sm" style="font-size: 0.65rem; min-width: 45%">
                      <i class="fas fa-file-alt text-primary me-2"></i>
                      <div class="text-truncate" style="max-width: 80px" title="${file.name}">${file.name}</div>
                      <span class="badge bg-light text-dark ms-1" style="font-size: 0.5rem">${file.category}</span>
                  </div>
              `);
          });
          $(".fw-bold:contains('ATTACHED FILES')").text(`ATTACHED FILES (${data.files.length})`);
      }

      // Populate Next Review
      if (data.nextReview && data.nextReview.date) {
          $("#pNextReview").text(`${data.nextReview.date} ${data.nextReview.time || ""}`);
          $(".next-review-container").removeClass("d-none");
      } else {
          $(".next-review-container").addClass("d-none");
      }
  }
});
