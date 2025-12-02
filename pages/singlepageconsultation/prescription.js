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
      <div class="medicine-card bg-custom mt-2 rounded-4 p-3">
        <div><h6 class="mb-2 ps-1">Medicine</h6></div>

        <div class="form-row">

          <div class="form-group col-md-3 m-0">
            <input class="form-control med-name rounded-4 input-style" placeholder="Medicine Name">
          </div>

          <div class="form-group col-md-9 row m-0">
            <div class="form-group col-md-4 d-flex">
              <input class="form-control dosage-value rounded-start-4 rounded-end-0 border-end-0 input-style" placeholder="Dosage">
              <select class="form-control dosage-unit custom-select text-center rounded-end-4 rounded-start-0 input-style">
                <option>mg</option>
                <option>ml</option>
              </select>
            </div>

            <div class="form-group col-md-4 d-flex">
              <input class="form-control duration-value rounded-start-4 rounded-end-0 border-end-0 input-style" placeholder="Duration">
              <select class="form-control duration-unit custom-select text-center rounded-end-4 rounded-start-0 input-style">
                <option value="1">Day (s)</option>
                <option value="2">Week (s)</option>
                <option value="3">Month (s)</option>
              </select>
            </div>

            <div class="form-group col-md-4 d-flex">
              <input class="form-control freq-value rounded-start-4 rounded-end-0 border-end-0 input-style" placeholder="Frequency">
              <select class="form-control freq-unit custom-select text-center rounded-end-4 rounded-start-0 input-style">
                <option value="1">Before food</option>
                <option value="2">After food</option>
                <option value="3">None</option>
              </select>
            </div>
          </div>

          <div class="form-group col-md-6 m-0">
            <input class="form-control instructions rounded-4 input-style" placeholder="Instructions">
          </div>

          <div class="form-group col-md-3 m-0">
            <select class="form-control usage-select custom-select rounded-4 input-style">
              <option value="">Select usage or route</option>
              <option>SOS</option>
              <option>Now</option>
              <option>STAT</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Night</option>
              <option>Oral (PO)</option>
              <option>Intravenous (IV)</option>
            </select>
          </div>
        </div>

        <div class="form-group d-flex justify-content-end m-0">
          <button class="btn btn-sm text-danger btn-remove-med" type="button">Remove</button>
        </div>
      </div>
    `);

      // Pre-fill values
      if (data.medicine) row.find(".med-name").val(data.medicine);
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
     setPrescriptions(prescriptions)
    if ($("#medList .medicine-card").length === 0) {
      addMedicineRow();
    }
    
  });
});
