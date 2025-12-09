$(function () {
  function renderProcTable() {
    const tbody = $("#procTable tbody");
    tbody.empty();

    procData.forEach((p, index) => {
      tbody.append(`
      <tr data-index="${index}">
        <td class="text-center">${index + 1}</td>
        <td>
          <select class="form-control custom-select proc-name rounded-4 input-style proc-field">
           <option ${p.name == "Blood Test" ? "selected" : ""} value="Blood Test">Blood Test</option>
           <option ${p.name == "X-Ray Chest" ? "selected" : ""} value="X-Ray Chest">X-Ray Chest</option>
           <option ${p.name == "ECG" ? "selected" : ""} value="ECG">ECG</option>
           <option ${p.name == "Ultrasound Abdomen" ? "selected" : ""} value="Ultrasound Abdomen">Ultrasound Abdomen</option>
           <option ${p.name == "Wound Dressing" ? "selected" : ""} value="Wound Dressing">Wound Dressing</option>
           <option ${p.name == "IV Cannula Insertion" ? "selected" : ""} value="IV Cannula Insertion">IV Cannula Insertion</option>
           <option ${p.name == "Nebulization" ? "selected" : ""} value="Nebulization">Nebulization</option>
           <option ${p.name == "Fever Panel Test" ? "selected" : ""} value="Fever Panel Test">Fever Panel Test</option>
           <option ${p.name == "Vaccination (Tetanus)" ? "selected" : ""} value="Vaccination (Tetanus)">Vaccination (Tetanus)</option>
           <option ${p.name == "CT Scan Brain" ? "selected" : ""} value="CT Scan Brain">CT Scan Brain</option>
          </select>
        </td>

        <td>
          <textarea row="1" class="form-control proc-qty rounded-4 input-style proc-field" value="${p.qty}"> </textarea>
        </td>
        <td>
          <input type="number" class="form-control proc-qty rounded-4 input-style proc-field" value="${
            p.qty
          }">
        </td>

        <td>
          <input type="number" class="form-control proc-price rounded-4 input-style proc-field" value="${
            p.price
          }">
        </td>

        <td>
          <input type="number" class="form-control proc-discount rounded-4 input-style proc-field" value="${
            p.discount
          }">
        </td>

        <td>
          <select class="form-control custom-select proc-status rounded-4 input-style proc-field">
            <option ${p.status === "" ? "selected" : ""}></option>
            <option ${
              p.status === "Planned/Completed" ? "selected" : ""
            }>Planned/Completed</option>
            <option ${
              p.status === "Nursing Performed" ? "selected" : ""
            }>Nursing Performed</option>
            <option ${
              p.status === "Send to Radiology" ? "selected" : ""
            }>Send to Radiology</option>
          </select>
        </td>

        <td class="proc-line-total">₹${p.total}</td>

        <td>
          <button type="button" class="btn btn-sm btn-remove-proc"><i class="fas fa-trash text-danger"></i></button>
        </td>
      </tr>
    `);
    });

    updateProcSummary();
  }

  function recalcProcRow(row) {
    const index = row.data("index");
    const name = row.find(".proc-name").val();
    const qty = parseFloat(row.find(".proc-qty").val()) || 1;
    const price = parseFloat(row.find(".proc-price").val()) || 0;
    const discount = parseFloat(row.find(".proc-discount").val()) || 0;
    const status = row.find(".proc-status").val();

    const total = price * qty * (1 - discount / 100);

    procData[index] = { name, qty, price, discount, status, total };

    row.find(".proc-line-total").text("₹" + total);

    updateProcSummary();
  }

  function updateProcSummary() {
    const sum = procData.reduce((a, b) => a + b.total, 0);
    $("#procSum").text(sum);

    if (procData.length === 0) {
      $("#procPreview").text("No procedures added");
    } else {
      const names = procData.map((p) => p.name).join(", ");
      $("#procPreview").text(names);
    }
  }

  $("#addProc").on("click", function () {
    procData.push({
      name: "",
      qty: 1,
      price: 0,
      discount: 0,
      status: "",
      total: 0,
    });

    renderProcTable();
  });

  $(document).on("input change", ".proc-field", function () {
    const row = $(this).closest("tr");
    recalcProcRow(row);
  });

  $(document).on("click", ".proc-template", function () {
    const templateProcs = $(this).data("procs");
    procData = templateProcs;
    console.log(procData);
    renderProcTable();
  });

  renderProcTable();
});
