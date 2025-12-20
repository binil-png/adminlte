$(function () {
  $(document).ready(function () {
    function getPrescriptions() {
      const list = [];

      $("#medList .medicine-card").each(function () {
        const card = $(this);

        list.push({
          name: card.find(".med-name").val(),
          dosage: {
            value: card.find(".dosage-value").val(),
            unit: card.find(".dosage-unit").val(),
          },
          duration: {
            value: card.find(".duration-value").val(),
            unit: card.find(".duration-unit").val(),
          },
          frequency: {
            value: card.find(".freq-value").val(),
            unit: card.find(".freq-unit").val(),
          },
          instructions: card.find(".instructions").val(),
          usage: card.find(".usage-select").val(),
        });
      });

      console.log("Prescription Data:", list);
      return list;
    }

    // ---------- 2. SET DATA INTO UI ----------
    function setPrescriptions(data) {
      $("#medList").empty(); // Clear old list

      data.forEach((med) => addMedicineRow(med));
    }

    // ---------- 3. ADD MEDICINE ROW ----------
    function addMedicineRow(data = {}) {
      const row = $(`
       <div class="medicine-card bg-custom mt-2 rounded-4 py-3 ps-2">
      <h6 class="mb-3 ps-1">Medicine</h6>

      <div class="row g-1">

        <!-- Medicine name -->
        <div class="col-md-5 d-flex pe-1">
          <input class="form-control rounded-start-4 rounded-end-0 border-end-0 input-style" placeholder="Medicine Name">
          <input class="form-control rounded-end-4 rounded-start-0 input-style" placeholder="Medicine Generic Name">
        </div>

        <!-- Dosage -->
        <div class="col-md-7 row align-items-center">
          <div class="input-group col-3 p-1">
            <input style="width:20px;" class="form-control rounded-start-4 input-style" placeholder="Dosage">
            <select style="width:30px;" class="form-select rounded-end-4 input-style">
              <option>mg</option>
              <option>ml</option>
            </select>
          </div>
            <div class="input-group col-4 p-1">
            <input class="form-control rounded-start-4 input-style" placeholder="Duration">
            <select class="form-select rounded-end-4 input-style">
              <option>Day(s)</option>
              <option>Week(s)</option>
              <option>Month(s)</option>
            </select>
          </div>
          <div class="input-group col-5 p-1">
            <input class="form-control rounded-start-4 input-style" placeholder="Frequency">
            <select class="form-select rounded-end-4 input-style">
              <option>Before food</option>
              <option>After food</option>
              <option>None</option>
            </select>
          </div>
        </div>

      

        <!-- Dispense -->
        <div class="col-md-3">
          <div class="input-group">
            <input class="form-control rounded-start-4 input-style" placeholder="Dispensing qty">
            <select class="form-select rounded-end-4 input-style">
              <option>Nos</option>
              <option>Bottle</option>
              <option>Strip</option>
              <option>Tube</option>
            </select>
          </div>
        </div>

        <!-- Instructions -->
        <div class="col-md-3">
          <input class="form-control rounded-4 input-style" placeholder="Instructions">
        </div>

        <!-- Usage -->
        <div class="col-md-3">
          <select class="form-select rounded-4 input-style">
            <option value="">Select usage / route</option>
            <option>SOS</option>
            <option>Now</option>
            <option>STAT</option>
            <option>Morning</option>
            <option>Night</option>
            <option>Oral (PO)</option>
            <option>IV</option>
          </select>
        </div>

        <!-- Remove -->
        <div class="col-md-12 d-flex align-items-end justify-content-end">
          <button class="btn btn-sm text-danger btn-remove-med" type="button">
            Remove
          </button>
        </div>

      </div>
    </div>
    `);

      // Pre-fill values
      if (data.medicine) row.find(".med-name").val(data.medicine);
      if (data.brand) row.find(".med-brand").val(data.brand);
      if (data.dosage) {
        row.find(".dosage-value").val(data.dosage);
        row.find(".dosage-unit").val(data.dosageUnit);
      }
      if (data.duration) {
        row.find(".duration-value").val(data.duration);
        row.find(".duration-unit").val(data.durationUnit);
      }
      if (data.frequency) {
        row.find(".freq-value").val(data.frequency);
        row.find(".freq-unit").val(data.frequencyUnit);
      }
      if (data.frequency) {
        row.find(".dispense-value").val(data.dispenseValue);
        row.find(".dispense-unit").val(data.dispenseUnit);
      }
      if (data.instructions) row.find(".instructions").val(data.instructions);
      if (data.usage) row.find(".usage-select").val(data.usage);

      $("#medList").append(row);
    }

    // ---------- 4. CLICK TEMPLATE CHIP ----------
    $(".quick-badges span").on("click", function () {
      const templateName = $(this).text().trim();
      if (prescriptionTemplates[templateName]) {
        setPrescriptions(prescriptionTemplates[templateName]);
      }
    });

    // ---------- 5. ADD MED BUTTON ----------
    $("#addMedicine").on("click", function () {
      addMedicineRow();
    });

    // ---------- 6. REMOVE MED ----------
    $("#medList").on("click", ".btn-remove-med", function () {
      $(this).closest(".medicine-card").remove();
    });

    // ---------- 7. SAVE PRESCRIPTION ----------
    $("#savePresc").on("click", function () {
      const data = getPrescriptions();
      $("#prescPreview").text(data.length + " items added");
    });
    setPrescriptions(prescriptions);
    if ($("#medList .medicine-card").length === 0) {
      addMedicineRow();
    }
  });
});
