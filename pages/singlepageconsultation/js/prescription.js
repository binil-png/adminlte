$(function () {
  $(document).ready(function () {
    function getPrescriptions() {
      const list = [];

      $("#medList .medicine-card").each(function () {
        const card = $(this);

        list.push({
          medicine_id: card.find(".select2-medicine").val(),
          medicine_name: card.find(".select2-medicine option:selected").text(),
          generic_name: card.find(".med-generic").val(),
          dosage: {
            value: card.find(".dosage-value").val(),
            unit: card.find(".dosage-unit").val(),
          },
          duration: {
            id: card.find(".select2-duration").val(),
            text: card.find(".select2-duration option:selected").text(),
          },
          frequency: {
            id: card.find(".select2-frequency").val(),
            text: card.find(".select2-frequency option:selected").text(),
          },
          route: {
            id: card.find(".select2-route").val(),
            text: card.find(".select2-route option:selected").text(),
          },
          injection_site: {
            id: card.find(".select2-site").val(),
            text: card.find(".select2-site option:selected").text(),
          },
          consumption: {
            id: card.find(".select2-consumption").val(),
            text: card.find(".select2-consumption option:selected").text(),
          },
          instructions: card.find(".instructions").val(),
          dispense: {
            value: card.find(".dispense-value").val(),
            unit: card.find(".dispense-unit").val(),
          },
        });
      });

      console.log("Prescription Data:", list);
      return list;
    }

    // ---------- 2. SET DATA INTO UI ----------
    function setPrescriptions(data) {
      $("#medList").empty(); // Clear old list
      if (Array.isArray(data)) {
        data.forEach((med) => addMedicineRow(med));
      }
    }

    // ---------- 3. ADD MEDICINE ROW ----------
    function addMedicineRow(data = {}) {
      const row = $(`
       <div class="medicine-card bg-custom mt-2 rounded-4 py-2 ps-2">
      <div class="d-flex justify-content-between align-items-center mb-1 pe-2">
          <h6 class="mb-0 ps-1 fw-bold small text-custom">Medicine</h6>
          <button class="btn btn-sm text-danger btn-remove-med p-0" type="button">
            <i class="fas fa-trash-alt me-1"></i>Remove
          </button>
      </div>

      <div class="row g-1 pe-2">

        <!-- Grouped Row 1: Medicine & Generic -->
        <div class="col-md-8">
          <div class="d-flex align-items-end">
            <div class="flex-grow-1">
              <label class="small text-muted mb-0">Medicine Name</label>
              <select class="form-control select2-medicine input-style" style="width:100%"></select>
            </div>
            <div class="flex-grow-1">
              <label class="small text-muted mb-0">Generic Name</label>
              <input class="form-control med-generic input-style rounded-start-0" placeholder="Generic" readonly style="border-left: 0;">
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <label class="small text-muted mb-0">Dosage</label>
          <div class="input-group">
            <input class="form-control dosage-value rounded-start-4 input-style" placeholder="Qty">
            <input class="form-control dosage-unit rounded-end-4 input-style" placeholder="Unit" style="max-width: 70px;">
          </div>
        </div>

        <!-- Grouped Row 2: Frequency & Consumption + Others -->
        <div class="col-md-6">
           <div class="row g-0">
              <div class="col-md-6">
                 <label class="small text-muted mb-0">Frequency</label>
                 <select class="form-control select2-frequency input-style" style="width:100%"></select>
              </div>
              <div class="col-md-6">
                 <label class="small text-muted mb-0">Consumption</label>
                 <select class="form-control select2-consumption input-style" style="width:100%"></select>
              </div>
           </div>
        </div>
        <div class="col-md-2">
           <label class="small text-muted mb-0">Duration</label>
           <select class="form-control select2-duration input-style" style="width:100%"></select>
        </div>
        <div class="col-md-2">
          <label class="small text-muted mb-0">Route</label>
          <select class="form-control select2-route input-style" style="width:100%"></select>
        </div>
        <div class="col-md-2">
          <label class="small text-muted mb-0">Site</label>
          <select class="form-control select2-site input-style" style="width:100%"></select>
        </div>

        <!-- Row 3: Dispensing, Instructions -->
        <div class="col-md-3">
          <label class="small text-muted mb-0">Dispensing Qty</label>
          <div class="input-group">
            <input class="form-control dispense-value rounded-start-4 input-style" placeholder="Qty">
            <input class="form-control dispense-unit rounded-end-4 input-style" placeholder="Unit" style="max-width: 70px;">
          </div>
        </div>
        <div class="col-md-9">
          <label class="small text-muted mb-0">Instructions</label>
          <input class="form-control instructions rounded-4 input-style" placeholder="Special instructions...">
        </div>

      </div>
    </div>
    `);

      $("#medList").append(row);
      initRowSelect2(row, data);
    }

    function initRowSelect2(row, data) {
      const createConfig = (url, placeholder, extraClasses = "") => ({
        theme: "bootstrap-4",
        selectionCssClass: `form-control custom-select2 input-style w-100 ${extraClasses}`,
        ajax: {
          url: `${baseUrl}${url}`,
          dataType: "json",
          delay: 250,
          data: (params) => ({ searchterm: params.term || "" }),
          processResults: (data) => ({ results: data }),
          cache: true,
        },
        placeholder: placeholder,
        minimumInputLength: 0,
        width: "100%",
        allowClear: true,
      });

      // Medicine Select2 - custom classes for grouping
      const medSelect = row
        .find(".select2-medicine")
        .select2(
          createConfig(
            "/singlepage_medicinemaster",
            "Search Medicine",
            "rounded-end-0 rounded-start-4 border-end-0",
          ),
        );

      medSelect.on("select2:select", function (e) {
        const item = e.params.data;
        if (item && item.text) {
          // Extract generic from text: "BRAND Generic | BRAND:X | BATCH:Y"
          const mainInfo = item.text.split("|")[0].trim();
          const firstSpace = mainInfo.indexOf(" ");
          const generic =
            firstSpace !== -1 ? mainInfo.substring(firstSpace).trim() : "";
          row.find(".med-generic").val(generic);

          // Set unit from medicine name (common units like mg, ml, tab, etc.)
          const unitMatch = mainInfo.match(
            /\b(mg|ml|mcg|microgram|gram|tab|tablet|cap|capsule|unit|iu|puff|spray|sachet)\b/i,
          );
          if (unitMatch) {
            row.find(".dosage-unit").val(unitMatch[0].toLowerCase());
          }
        }
      });

      // Frequency Select2 - custom classes for grouping
      row
        .find(".select2-frequency")
        .select2(
          createConfig(
            "/singlepage_rxmaster/frequency",
            "Frequency",
            "rounded-4",
          ),
        );

      // Consumption Select2 - custom classes for grouping
      row
        .find(".select2-consumption")
        .select2(
          createConfig(
            "/singlepage_rxmaster/consume",
            "Consumption",
            "rounded-4",
          ),
        );

      // Other Select2s
      row
        .find(".select2-duration")
        .select2(
          createConfig(
            "/singlepage_rxmaster/duration",
            "Duration",
            "rounded-4",
          ),
        );
      row
        .find(".select2-route")
        .select2(
          createConfig("/singlepage_rxmaster/route", "Route", "rounded-4"),
        );
      row
        .find(".select2-site")
        .select2(
          createConfig(
            "/singlepage_rxmaster/site",
            "Injection Site",
            "rounded-4",
          ),
        );

      // Pre-fill values if data exists
      if (data.medicine_id) {
        let option = new Option(
          data.medicine_name || "Selected Medicine",
          data.medicine_id,
          true,
          true,
        );
        medSelect.append(option).trigger("change");
        row.find(".med-generic").val(data.generic_name || "");
      }

      if (data.dosage) {
        row.find(".dosage-value").val(data.dosage.value || "");
        row.find(".dosage-unit").val(data.dosage.unit || "mg");
      }

      if (data.duration && data.duration.id) {
        let option = new Option(
          data.duration.text || data.duration.id,
          data.duration.id,
          true,
          true,
        );
        row.find(".select2-duration").append(option).trigger("change");
      }

      if (data.frequency && data.frequency.id) {
        let option = new Option(
          data.frequency.text || data.frequency.id,
          data.frequency.id,
          true,
          true,
        );
        row.find(".select2-frequency").append(option).trigger("change");
      }

      if (data.route && data.route.id) {
        let option = new Option(
          data.route.text || data.route.id,
          data.route.id,
          true,
          true,
        );
        row.find(".select2-route").append(option).trigger("change");
      }

      if (data.injection_site && data.injection_site.id) {
        let option = new Option(
          data.injection_site.text || data.injection_site.id,
          data.injection_site.id,
          true,
          true,
        );
        row.find(".select2-site").append(option).trigger("change");
      }

      if (data.consumption && data.consumption.id) {
        let option = new Option(
          data.consumption.text || data.consumption.id,
          data.consumption.id,
          true,
          true,
        );
        row.find(".select2-consumption").append(option).trigger("change");
      }

      if (data.instructions) row.find(".instructions").val(data.instructions);

      if (data.dispense) {
        row.find(".dispense-value").val(data.dispense.value || "");
        row.find(".dispense-unit").val(data.dispense.unit || "Nos");
      }
    }

    // ---------- 4. CLICK TEMPLATE CHIP ----------
    $(".quick-badges span").on("click", function () {
      const templateName = $(this).text().trim();
      // Check if prescriptionTemplates exists globaly
      if (
        typeof prescriptionTemplates !== "undefined" &&
        prescriptionTemplates[templateName]
      ) {
        setPrescriptions(prescriptionTemplates[templateName]);
      }
    });

    // ---------- 5. ADD MED BUTTON ----------
    $("#addMedicine").on("click", function () {
      addMedicineRow();
    });

    // ---------- 6. REMOVE MED ----------
    $("#medList").on("click", ".btn-remove-med", function () {
      $(this)
        .closest(".medicine-card")
        .fadeOut(200, function () {
          $(this).remove();
        });
    });

    // ---------- 7. SAVE PRESCRIPTION ----------
    $("#savePresc").on("click", function () {
      const itemsArr = getPrescriptions();
      if (itemsArr.length === 0) {
        if (typeof showToast === "function") {
          showToast("Please add at least one medicine", "warning");
        } else {
          alert("Please add at least one medicine");
        }
        return;
      }

      const itemsObj = {};
      itemsArr.forEach((item, index) => {
        itemsObj[index] = {
          medicine_id: item.medicine_id,
          frequency: item.frequency.text || "",
          consume: item.consumption.text || "",
          duration: item.duration.text || "",
          from_time: "", // Use time from timeFilter if you want: $("#timeFilter").val()
          to_time: "",
          site: item.injection_site.text || "",
          volume: "",
          infusion: "",
          notes: item.instructions || "",
          route: item.route.text || "",
          internalnote: "",
        };
      });

      const payload = {
        date: new Date().toISOString().split("T")[0],
        review_date: $("#reviewDate").val() || "",
        items: itemsObj,
      };

      // Add patient/doctor context if available globally
      if (typeof selectedPatientId !== "undefined")
        payload.patient_id = selectedPatientId;
      if (typeof selectedAppointmentId !== "undefined")
        payload.appointment_id = selectedAppointmentId;

      $.ajax({
        url: `${baseUrl}/singlepage_saveprescription`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: function (response) {
          if (typeof showToast === "function") {
            showToast("Prescription saved successfully!", "success");
          } else {
            alert("Prescription saved successfully!");
          }
          if (response && response.preview) {
            $("#prescPreview").text(response.preview);
          } else {
            $("#prescPreview").text(itemsArr.length + " items saved");
          }
        },
        error: function (xhr) {
          console.error("Save failed:", xhr);
          if (typeof showToast === "function") {
            showToast("Failed to save prescription", "danger");
          } else {
            alert("Failed to save prescription");
          }
        },
      });
    });

    // Initial load
    if (typeof prescriptions !== "undefined") {
      setPrescriptions(prescriptions);
    }

    if ($("#medList .medicine-card").length === 0) {
      addMedicineRow();
    }
  });
});

function renderPrescription(container, precription) {
  if (precription) {
    container.empty();
    let pIndex = 0;
    let proceTableTd = "";
    precription.forEach((i) => {
      i.prescription.forEach((p) => {
        proceTableTd += `
      <tr>
        <td>${++pIndex}</td>
        <td class="text-sm">${p}</td>
      </tr>`;
      });

      container.append(`
        <divclass="date-wise-prescription" data-date="${i.date}">
          <h6 class="fw-bold small text-custom mt-3">${i.date}</h6>
          <div class="rounded-2 bg-white mb-2 shadow-sm filter-item" data-type="prescription" > 
          <div class="card-body">
            <div class="d-flex justify-content-between align-item-center pb-2">
               <h6 class="fw-semibold text-custom">
                 <i class="fas fa-prescription text-primary me-2 text-custom"></i> Prescription
               </h6>         
            </div>
            <div class="content-container">
               <div class="html-view">          
                 <div class="">
                  <table class="table table-sm">
                    <tbody>${proceTableTd}</tbody>
                  </table>
             </div>
          </div>
         <div class="card-view d-none">
           </div>
          </div>
         </div>
      </div>
        </divclass=>
    `);
    });
  }
}


