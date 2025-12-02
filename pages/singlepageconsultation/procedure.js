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
            <option ${p.name === "" ? "selected" : ""}></option>
            <option ${
              p.name === "Dental Cleaning" ? "selected" : ""
            }>Dental Cleaning</option>
            <option ${
              p.name === "Root Canal" ? "selected" : ""
            }>Root Canal</option>
            <option ${
              p.name === "X-Ray" ? "selected" : ""
            }>X-Ray Imaging</option>
          </select>
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
    console.log(procData)
    renderProcTable();
  });

  renderProcTable();
});
