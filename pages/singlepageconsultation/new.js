$(function () {
  // Allergy add/remove
  $("#addAllergy").on("click", function (e) {
    e.preventDefault();
    $("#allergyList").append(
      '<div class="input-group mb-2 allergy-row">< + """>'
    );
  });

  // Better implementation: use template
  function addAllergyRow(value) {
    var row = $('<div class="input-group mb-2 allergy-row col-md-2 col-lg-2">')
      .append(
        $(
          '<input type="text" class="form-control rounded-start-4 input-style">'
        ).val(value || "")
      )
      .append(
        $('<div class="input-group-append">').append(
          $(
            '<button style="padding: 0px 8px" class="btn btn-outline-danger btn-remove-allergy rounded-end-4" type="button"><i class="fas fa-times"></i></button>'
          )
        )
      );
    $("#allergyList").append(row);
  }

  // initialize existing
  $("#allergyList .allergy-row input").each(function () {
    /* already exist*/
  });

  $("#addAllergy")
    .off("click")
    .on("click", function (e) {
      e.preventDefault();
      addAllergyRow("");
    });

  $(document).on("click", ".btn-remove-allergy", function () {
    $(this).closest(".allergy-row").remove();
  });

  // Procedures: add/remove and calculate
  function recalcProcedures() {
    var sum = 0;
    $("#procTable tbody tr").each(function () {
      var qty = parseFloat($(this).find(".proc-qty").val() || 0);
      var price = parseFloat($(this).find(".proc-price").val() || 0);
      var disc = parseFloat($(this).find(".proc-discount").val() || 0);
      var line = qty * price * (1 - disc / 100);
      $(this)
        .find(".proc-line-total")
        .text("₹" + line.toFixed(2));
      sum += line;
    });
    $("#procSum").text(sum.toFixed(2));
    $("#procTotal").text("₹" + sum.toFixed(2));
  }

  $("#addProc").on("click", function () {
    var idx = $("#procTable tbody tr").length + 1;
    var newRow = $("<tr>")
      .append('<td class="align-middle text-center">' + idx + "</td>")
      .append(
        '<td><select class="form-control rounded-4 proc-name input-style align-items-center"><option value="">Select procedure</option><option value="Dental Cleaning">Dental Cleaning</option><option value="General Consultation">General Consultation</option></select></td>'
      )
      .append(
        '<td><input type="number" class="form-control rounded-4 proc-qty input-style" value="1"></td>'
      )
      .append(
        '<td><input type="number" class="form-control rounded-4 proc-price input-style" value="0"></td>'
      )

      .append(
        '<td><input type="number" class="form-control rounded-4 proc-discount input-style" value="0"></td>'
      )
      .append(
        `         <td>
                   <select class="form-control proc-name rounded-4 input-style">
                              <option value="">Select status</option>
                              <option value="Planned/Completed">
                                Planned/Completed
                              </option>
                              <option value="Nursing Performed?">
                                Nursing Performed
                              </option>
                              <option value="Send to Radiology">
                                Send to Radiology
                              </option>
                   </select>
                 </td>`
      )
      .append('<td class="proc-line-total align-middle">₹0</td>')
      .append(
        '<td><button type="button" class="btn btn-sm btn-remove-proc"><i class="fas fa-trash text-danger"></i></button></td>'
      );
    $("#procTable tbody").append(newRow);
    recalcProcedures();
  });

  $(document).on("click", ".btn-remove-proc", function () {
    $(this).closest("tr").remove();
    // re-index
    $("#procTable tbody tr").each(function (i) {
      $(this)
        .find("td:first")
        .text(i + 1);
    });
    recalcProcedures();
  });

  $(document).on(
    "input",
    ".proc-qty, .proc-price, .proc-discount",
    function () {
      recalcProcedures();
    }
  );
  recalcProcedures();

  // Files
  $("#fileInput").on("change", function () {
    $("#fileList").empty();
    Array.from(this.files).forEach(function (f, i) {
      $("#fileList").append(
        "<li>" +
          f.name +
          ' <button data-index="' +
          i +
          '" class="btn btn-sm btn-link btn-remove-file">Remove</button></li>'
      );
    });
  });

  $(document).on("click", ".btn-remove-file", function () {
    $(this).parent().remove();
  });

  // Invoice behaviors
  function recalcInvoice() {
    var totalPrice = 0,
      totalDiscount = 0,
      totalTax = 0;
    $("#invoiceTable tbody tr").each(function () {
      var qty = parseFloat($(this).find(".invoice-qty").val() || 0);
      var price = parseFloat($(this).find(".invoice-price").val() || 0);
      var discount = parseFloat($(this).find(".invoice-discount").val() || 0);
      var tax = parseFloat($(this).find(".invoice-tax").val() || 0);
      var linePrice = qty * price;
      var lineDiscount = linePrice * (discount / 100);
      var lineTax = (linePrice - lineDiscount) * (tax / 100);
      var lineTotal = linePrice - lineDiscount + lineTax;
      $(this)
        .find(".invoice-line-total")
        .text("₹" + lineTotal.toFixed(2));
      totalPrice += linePrice;
      totalDiscount += lineDiscount;
      totalTax += lineTax;
    });
    $("#invPrice").text(totalPrice.toFixed(2));
    $("#invDiscount").text(totalDiscount.toFixed(2));
    $("#invTax").text(totalTax.toFixed(2));
    $("#invGrand").text((totalPrice - totalDiscount + totalTax).toFixed(2));
  }

  $("#addInvItem").on("click", function () {
    var row = $("<tr>")
      .append('<td><input class="form-control invoice-service" value=""></td>')
      .append(
        '<td><input type="number" class="form-control invoice-qty" value="1"></td>'
      )
      .append(
        '<td><input type="number" class="form-control invoice-price" value="0"></td>'
      )
      .append(
        '<td><input type="number" class="form-control invoice-discount" value="0"></td>'
      )
      .append(
        '<td><input type="number" class="form-control invoice-tax" value="0"></td>'
      )
      .append('<td class="invoice-line-total">₹0.00</td>')
      .append(
        '<td><button class="btn btn-sm btn-danger btn-remove-inv">✖</button></td>'
      );
    $("#invoiceTable tbody").append(row);
    recalcInvoice();
  });

  $(document).on("click", ".btn-remove-inv", function () {
    $(this).closest("tr").remove();
    recalcInvoice();
  });

  $(document).on(
    "input",
    ".invoice-qty, .invoice-price, .invoice-discount, .invoice-tax",
    recalcInvoice
  );

  $("#openInvoice").on("click", function () {
    $("#invoiceSection").toggle();
    $("html,body").animate(
      { scrollTop: $("#invoiceSection").offset().top - 20 },
      400
    );
    recalcInvoice();
  });

  $("#saveInvoice").on("click", function () {
    alert("Invoice saved. Grand Total: ₹" + $("#invGrand").text());
  });

  // Global save & buttons
  $(
    "#globalSave, #saveVitals, #saveNotes, #saveProc, #savePresc, #saveFiles"
  ).on("click", function () {
    $(this).prop("disabled", true);
    setTimeout(() => $(this).prop("disabled", false), 800);
    // In a real app we'd send AJAX here
    $(this).closest("form").addClass("border-success");
  });

  // small UX: when collapse shows, scroll into view
  $(".collapse").on("shown.bs.collapse", function () {
    $("html,body").animate(
      { scrollTop: $(this).prev().offset().top - 60 },
      300
    );
  });

  //---------------------- chip filter function ------------------------------------------------

  const historyData = [
    {
      type: "vitals",
      date: "2025-11-26",
      title: "Vitals Recorded",
      icon: "fa fa-stethoscope text-success",
      html: `
      <p class="small mb-1">Temp: <span class="badge bg-danger">98.6°F</span> | BP 120/80 | Pulse 72</p>
      <small class="text-muted">3:00 PM • Nurse Station</small>
    `,
    },
    {
      type: "prescription",
      date: "2025-11-26",
      title: "Prescription",
      icon: "fas fa-capsules text-primary",
      html: `<p class="small mb-0">Paracetamol • 5 Days</p>`,
    },
    {
      type: "procedure",
      date: "2025-11-25",
      icon: "fas fa-syringe text-info",
      title: "Procedure Performed",
      html: `
      <p class="small mb-1">Wound cleaning & dressing applied.</p>
      <p class="small mb-1">Status: <span class="badge bg-info text-dark">Completed</span></p>
      <small class="text-muted">4:15 PM • Nurse Emily • Ward 3B</small>
    `,
    },
    {
      type: "files",
      date: "2025-11-22",
      icon: "fas fa-file text-primary",
      title: "Uploaded Report",
      html: `<p class="small mb-0">Blood Test Report.pdf</p>`,
    },
    {
      type: "dental",
      date: "2025-11-22",
      icon: "fas fa-tooth text-muted",
      title: "Dental Procedure",
      html: `
      <p class="small mb-1">Root canal performed on tooth 36.</p>
      <small class="text-muted">1:30 PM • Dr. Miller</small>
    `,
    },
  ];

  function formatDateGroupLabel(dateStr) {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);

    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";

    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB"); // 20-11-2025
  }

  function renderHistory() {
    const container = $(".content-area");
    container.empty();

    // Group by date
    const grouped = historyData.reduce((acc, item) => {
      (acc[item.date] = acc[item.date] || []).push(item);
      return acc;
    }, {});

    // Sort dates descending
    const sortedDates = Object.keys(grouped).sort(
      (a, b) => new Date(b) - new Date(a)
    );

    sortedDates.forEach((date) => {
      const label = formatDateGroupLabel(date);
      container.append(
        `<h6 class="fw-bold small text-muted mt-3">${label}</h6>`
      );

      grouped[date].forEach((item) => {
        container.append(`
        <div class="rounded-2 mb-2 bg-white filter-item" data-type="${item.type}" data-date="${item.date}">
          <div class="card-body">
            <h6 class="fw-meduim text-muted"><i class="${item.icon} mr-2"></i> ${item.title}</h6>
            ${item.html}
          </div>
        </div>
      `);
      });
    });
  }

  renderHistory();

  function applyFilters() {
    const activeFilter = $("#chipFilters .active-filter").data("filter");
    const selectedDate = $("#dateFilter").val();

    $(".filter-item")
      .hide()
      .filter(function () {
        const typeMatch =
          activeFilter === "all" || $(this).data("type") === activeFilter;
        const dateMatch =
          !selectedDate || $(this).data("date") === selectedDate;

        return typeMatch && dateMatch;
      })
      .show();
  }

  // Chip Click
  function applyFilters() {
    const activeFilter = $("#chipFilters .active-filter").data("filter");
    const selectedDate = $("#dateFilter").val();

    $(".filter-item")
      .hide()
      .filter(function () {
        const matchesType =
          activeFilter === "all" || $(this).data("type") === activeFilter;
        const matchesDate =
          !selectedDate || $(this).data("date") === selectedDate;
        return matchesType && matchesDate;
      })
      .show();
  }

  $("#chipFilters span").click(function () {
    $("#chipFilters span")
      .removeClass("bg-dark text-white active-filter")
      .addClass("border text-muted");
    $(this)
      .removeClass("border text-muted")
      .addClass("bg-dark text-white active-filter");
    applyFilters();
  });

  $("#dateFilter").on("change", applyFilters);

  // --------------------------------------- procedure -------------------------------------------------
  function updateProcedureTotals() {
    let total = 0;
    let procedureNames = [];

    $("#procTable tbody tr").each(function () {
      const name = $(this).find(".proc-name").val()?.trim();
      const qty = parseFloat($(this).find(".proc-qty").val()) || 0;
      const price = parseFloat($(this).find(".proc-price").val()) || 0;
      const discount = parseFloat($(this).find(".proc-discount").val()) || 0;

      let lineTotal = qty * price;
      lineTotal -= (lineTotal * discount) / 100;

      if (name) procedureNames.push(name);

      $(this)
        .find(".proc-line-total")
        .text(`₹${lineTotal.toFixed(2)}`);
      total += lineTotal;
    });

    $("#procSum").text(total.toFixed(2));
    updateProcedurePreview(procedureNames, total);
  }

  function updateProcedurePreview(names, total) {
    const preview = $("#procPreview");

    if (names.length === 0) {
      preview.text("No procedures added");
    } else if (names.length === 1) {
      preview.text(`${names[0]} • ₹${total}`);
    } else {
      preview.text(`${names[0]} + ${names.length - 1} more • ₹${total}`);
    }
  }

  $(document).on(
    "input change",
    ".proc-name, .proc-qty, .proc-price, .proc-discount",
    updateProcedureTotals
  );

  $(document).on("click", ".btn-remove-proc", function () {
    $(this).closest("tr").remove();
    updateProcedureTotals();
  });

  updateProcedureTotals();

  let selectedTeeth = [];

  $(".tooth-item").on("click", function () {
    const tooth = $(this).data("tooth");

    if (selectedTeeth.includes(tooth)) {
      selectedTeeth = selectedTeeth.filter((t) => t !== tooth);
      $(this).removeClass("badge-primary text-white");
    } else {
      selectedTeeth.push(tooth);
      $(this).addClass("badge-primary text-white");
    }

    $("#selectedTeethPreview").text(
      selectedTeeth.length ? selectedTeeth.join(", ") : "None"
    );
  });

  // Add new dental row
  $("#addDentalProc").on("click", function () {
    const newRow = `
    <tr>
      <td class="px-3 py-2">
        <select class="form-control dental-proc rounded-4 input-style">
          <option value="">Select procedure</option>
          <option value="Filling">Filling</option>
          <option value="Extraction">Extraction</option>
          <option value="Scaling">Scaling</option>
        </select>
      </td>
      <td class="px-3 py-2"><input type="number" class="form-control dental-qty rounded-4 input-style" value="1"/></td>
      <td class="px-3 py-2"><input type="number" class="form-control dental-price rounded-4 input-style" value="0"/></td>
      <td class="dental-line-total align-middle px-3 py-2">₹0</td>
      <td class="px-3 py-2"><button type="button" class="btn btn-sm btn-remove-dental"><i class="fas fa-trash text-danger"></i></button></td>
    </tr>
  `;

    $("#dentalProcTable tbody").append(newRow);
  });

  // Calculate totals
  $(document).on("input change", ".dental-qty, .dental-price", function () {
    updateDentalTotals();
  });

  $(document).on("click", ".btn-remove-dental", function () {
    $(this).closest("tr").remove();
    updateDentalTotals();
  });

  function updateDentalTotals() {
    let total = 0;

    $("#dentalProcTable tbody tr").each(function () {
      const qty = parseFloat($(this).find(".dental-qty").val()) || 0;
      const price = parseFloat($(this).find(".dental-price").val()) || 0;
      const lineTotal = qty * price;
      $(this)
        .find(".dental-line-total")
        .text("₹" + lineTotal);
      total += lineTotal;
    });

    $("#dentalSum").text(total);
  }

  const teeth = [
    // uppder jaw
    { number: 18, image: "18_28.png" },
    { number: 17, image: "17_27.png" },
    { number: 16, image: "16_26.png" },
    { number: 15, image: "15_25.png" },
    { number: 14, image: "14_24.png" },
    { number: 13, image: "13_23.png" },
    { number: 12, image: "12_22.png" },
    { number: 11, image: "11_21.png" },
    { number: 21, image: "11_21.png" },
    { number: 22, image: "12_22.png" },
    { number: 23, image: "13_23.png" },
    { number: 24, image: "14_24.png" },
    { number: 25, image: "15_25.png" },
    { number: 26, image: "16_26.png" },
    { number: 27, image: "17_27.png" },
    { number: 28, image: "18_28.png" },
    // lower jaw
    { number: 48, image: "38_48.png" },
    { number: 47, image: "47_37.png" },
    { number: 46, image: "46_36.png" },
    { number: 45, image: "45_35.png" },
    { number: 44, image: "34_44.png" },
    { number: 43, image: "43_33.png" },
    { number: 42, image: "32_42.png" },
    { number: 41, image: "41_31.png" },
    { number: 31, image: "41_31.png" },
    { number: 32, image: "32_42.png" },
    { number: 33, image: "43_33.png" },
    { number: 34, image: "34_44.png" },
    { number: 35, image: "45_35.png" },
    { number: 36, image: "46_36.png" },
    { number: 37, image: "47_37.png" },
    { number: 38, image: "38_48.png" },
  ];

  function renderTeeth(teeth) {
    const row1 = document.getElementById("teethSelector1");
    const row2 = document.getElementById("teethSelector2");

    teeth.forEach((tooth, index) => {
      const elem = `
     <span role="button" class="rounded-3 border p-2 d-flex flex-column align-items-center gap-2 tooth-item"
      data-tooth="${tooth.number}">
        <img width="30" height="50" src="./Teeth/${tooth.image}" />
        <small>${tooth.number}</small>
      </span>
    `;

      if (index < 16) {
        row1.insertAdjacentHTML("beforeend", elem);
      } else {
        row2.insertAdjacentHTML("beforeend", elem);
      }
    });
  }
  $(document).on("click", ".tooth-item", function () {
    const toothNumber = $(this).data("tooth");
    console.log("Clicked tooth:", toothNumber);

    // Open modal
    const modal = new bootstrap.Modal(document.getElementById("toothModal"));
    modal.show();
  });

  renderTeeth(teeth);

  $(document).ready(function () {
    let allFiles = [];

    // Show input area
    $("#showFileArea").click(function () {
      $("#fileInputArea").removeClass("d-none");
    });

    // Add file + description
    $("#addFileToList").click(function () {
      let file = $("#singleFile")[0].files[0];
      let desc = $("#singleDescription").val();

      if (!file) {
        alert("Please select a file.");
        return;
      }

      // Save data in array
      allFiles.push({ file: file, description: desc });

      // Add UI box
      $("#fileList").append(`
      <li class="border rounded p-2 mb-2 d-flex justify-content-between align-items-center">
        <div class="d-flex flex-column gap-1">
          <strong>${file.name}</strong>
          <p class="text-muted mb-0">Description: ${desc || "No description"}</p>
        </div>
          <button class="btn btn-outline-danger btn-sm removeFile">
            <i class="fas fa-trash"></i>
          </button>
      </li>
    `);

      // Reset input area
      $("#singleFile").val("");
      $("#singleDescription").val("");
      $("#fileInputArea").addClass("d-none");
    });

    // Remove a file box
    $(document).on("click", ".removeFile", function () {
      let index = $(this).closest("li").index();
      allFiles.splice(index, 1);
      $(this).closest("li").remove();
    });

    // Save button
    $("#saveFiles").click(function () {
      console.log("FILES TO UPLOAD: ", allFiles);

      let formData = new FormData();
      allFiles.forEach((item, i) => {
        formData.append("files", item.file);
        formData.append("descriptions[]", item.description);
      });

      alert("Files ready. Check console.");

      // send using fetch → uncomment when backend ready
      // fetch("/upload-url", { method: "POST", body: formData });
    });
  });
});
