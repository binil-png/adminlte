$(function () {
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
  let count = 1;

  $("#addInvItem").on("click", function () {
    count++;

    var row = $("<tr>")
      .append(`<td>${count}</td>`)
      .append('<td><input class="form-control proc-price rounded-4 input-style invoice-service" value=""></td>')
      .append(
        '<td><input type="number" class="form-control proc-price rounded-4 input-style invoice-qty" value="1"></td>'
      )
      .append(
        '<td><input type="number" class="form-control proc-price rounded-4 input-style invoice-price" value="0"></td>'
      )
      .append(
        '<td><input type="number" class="form-control proc-price rounded-4 input-style invoice-discount" value="0"></td>'
      )
      .append(
        '<td><input type="number" class="form-control proc-price rounded-4 input-style invoice-tax" value="0"></td>'
      )
      .append('<td class="invoice-line-total">₹0.00</td>')
      .append(
        `<td>
        <button type="button" class="btn btn-sm btn-remove-inv"><i class="fas fa-trash text-danger"></i></button>
        </td>`
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
  $("#showInvoice").on("click", function () {
  $("#invoiceSection").slideToggle(300);
  recalcInvoice(); // ensure fresh totals
});
});
