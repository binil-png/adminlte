
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
            .append(
              $('<input type="text" class="form-control">').val(value || "")
            )
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
            var discount = parseFloat(
              $(this).find(".invoice-discount").val() || 0
            );
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
          $("#invGrand").text(
            (totalPrice - totalDiscount + totalTax).toFixed(2)
          );
        }
        $("#addInvItem").on("click", function () {
          var row = $("<tr>")
            .append(
              '<td><input class="form-control invoice-service" value=""></td>'
            )
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

        

      });
    