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
    var row = $('<div class="input-group mb-2 allergy-row">')
      .append($('<input type="text" class="form-control">').val(value || ""))
      .append(
        $('<div class="input-group-append">').append(
          $(
            '<button class="btn btn-outline-danger btn-remove-allergy" type="button">✖</button>'
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
      .append('<td class="align-middle">' + idx + "</td>")
      .append(
        '<td><select class="form-control proc-name"><option value="">SELECT</option><option value="Dental Cleaning">Dental Cleaning</option><option value="General Consultation">General Consultation</option></select></td>'
      )
      .append(
        '<td><input type="number" class="form-control proc-qty" value="1"></td>'
      )
      .append(
        '<td><input type="number" class="form-control proc-price" value="0"></td>'
      )
      .append(
        '<td><input type="number" class="form-control proc-discount" value="0"></td>'
      )
      .append('<td class="proc-line-total align-middle">₹0</td>')
      .append(
        '<td><button type="button" class="btn btn-sm btn-danger btn-remove-proc">✖</button></td>'
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

  // Prescriptions: add/remove
  $("#addMed").on("click", function () {
    var count = $("#medList .medicine-card").length + 1;
    var card = $('<div class="medicine-card card mb-2 p-3">')
      .append("<h6>Medicine " + count + "</h6>")
      .append(
        '<div class="form-row"><div class="form-group col-md-8"><input class="form-control" placeholder="e.g., Paracetamol 500mg"></div><div class="form-group col-md-4 text-right"><button class="btn btn-sm btn-danger btn-remove-med" type="button">Remove</button></div></div>'
      )
      .append(
        '<div class="form-row"><div class="form-group col-md-3"><input class="form-control" placeholder="Dosage"></div><div class="form-group col-md-3"><input class="form-control" placeholder="Duration"></div><div class="form-group col-md-3"><input class="form-control" placeholder="Frequency"></div><div class="form-group col-md-3"><input class="form-control" placeholder="Instructions"></div></div>'
      );
    $("#medList").append(card);
  });
  $(document).on("click", ".btn-remove-med", function () {
    $(this).closest(".medicine-card").remove();
  });

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

  $("#chipFilters span").click(function () {
    // Remove active class from all chips
    $("#chipFilters span").removeClass("bg-dark text-white active-filter");
    $("#chipFilters span").addClass("border text-muted");

    // Add active style to clicked chip
    $(this)
      .removeClass("border text-muted")
      .addClass("bg-dark text-white active-filter");

    const filterValue = $(this).data("filter");

    if (filterValue === "all") {
      $(".filter-item").show();
    } else {
      $(".filter-item").hide().filter(`[data-type="${filterValue}"]`).show();
    }
  });

  // ------------------- handle prescription preview on the top -------------------------------------

  function updatePreview() {
    const cards = $("#medList .medicine-card");
    const count = cards.length;

    if (count === 0) {
      $("#prescPreview").text("No items yet");
      return;
    }

    const names = cards
      .map(function () {
        return $(this).val()?.trim();
      })
      .get()
      .filter(Boolean); // remove empty values

    const firstMed = names.join(", ") || "Unnamed";

    if (count === 1) {
      $("#prescPreview").text(firstMed);
    } else {
      $("#prescPreview").text(`${firstMed} + ${count - 1} more`);
    }
  }

  $("#addMed").click(function () {
    const newCard = $(".medicine-card").first().clone();
    newCard.find("input").val("");
    $("#medList").append(newCard);
    updatePreview();
  });

  $(document).on("click", ".btn-remove-med", function () {
    $(this).closest(".medicine-card").remove();
    updatePreview();
  });

  $(document).on("input", ".med-name", function () {
    updatePreview();
  });

  // Initialize preview on load
  updatePreview();

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
      <td>
        <select class="form-control dental-proc">
          <option value="">SELECT</option>
          <option value="Filling">Filling</option>
          <option value="Extraction">Extraction</option>
          <option value="Scaling">Scaling</option>
        </select>
      </td>
      <td><input type="number" class="form-control dental-qty" value="1"/></td>
      <td><input type="number" class="form-control dental-price" value="0"/></td>
      <td class="dental-line-total align-middle">₹0</td>
      <td><button type="button" class="btn btn-sm btn-danger btn-remove-dental">✖</button></td>
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
      <span role="button" class="badge badge-light border p-2 d-flex flex-column align-items-center gap-2 tooth-item"
            data-tooth="${tooth.number}">
        <img width="20" height="40" src="./Teeth/${tooth.image}" />
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

  renderTeeth(teeth);
});
