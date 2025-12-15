$(function () {
  function generateBoxId(index) {
    return `proc-box-${index}-extra-fields`;
  }

  function calculateLineTotal(qty, price, discount) {
    const quantity = parseFloat(qty) || 0;
    const itemPrice = parseFloat(price) || 0;
    const discountPercent = parseFloat(discount) || 0;

    const subtotal = quantity * itemPrice;
    const discountAmount = subtotal * (discountPercent / 100);
    const total = subtotal - discountAmount;

    return total.toFixed(2);
  }

  function renderProcTable() {
    const container = $("#procContainer");
    container.empty();

    if (typeof procData === "undefined") {
      console.error("procData array is not defined. Using placeholder data.");
      window.procData = window.procData || [
        {
          name: "Blood Test",
          instruction: "",
          qty: 1,
          price: 1500,
          discount: 10,
          status: "",
          total: 1350,
        },
      ];
    }
    const defaultHideClass = "d-none";

    procData.forEach((p, index) => {
      const boxId = generateBoxId(index);
      const lineTotal = calculateLineTotal(p.qty, p.price, p.discount);
      const initialDisplayClass = defaultHideClass;
      const initialButtonHtml =
        'Show more';

      container.append(`
        <div class="bg-custom rounded-4 proc-box" data-index="${index}">
            <div class="p-2">
                <div class="row g-2 align-items-end">
                    <div class="col-6 row">
                      <div class="col-1 text-center pe-0">
                            <label class="form-label small text-muted mb-0 d-none d-md-block">Sr</label>
                            <span class="d-block mt-1 pt-1 font-weight-bold">${
                              index + 1
                            }</span>
                      </div>
                      <div class="col-11">
                        <label class="form-label small text-muted mb-0">Procedure</label>
                        <select class="form-control form-control-sm custom-select proc-name rounded-3 input-style proc-field rounded-4">
                            <option ${
                              p.name == "Blood Test" ? "selected" : ""
                            } value="Blood Test">Blood Test</option>
                            <option ${
                              p.name == "X-Ray Chest" ? "selected" : ""
                            } value="X-Ray Chest">X-Ray Chest</option>
                            <option ${
                              p.name == "ECG" ? "selected" : ""
                            } value="ECG">ECG</option>
                            <option ${
                              p.name == "Ultrasound Abdomen" ? "selected" : ""
                            } value="Ultrasound Abdomen">Ultrasound Abdomen</option>
                            <option ${
                              p.name == "Wound Dressing" ? "selected" : ""
                            } value="Wound Dressing">Wound Dressing</option>
                            <option ${
                              p.name == "IV Cannula Insertion" ? "selected" : ""
                            } value="IV Cannula Insertion">IV Cannula Insertion</option>
                            <option ${
                              p.name == "Nebulization" ? "selected" : ""
                            } value="Nebulization">Nebulization</option>
                            <option ${
                              p.name == "Fever Panel Test" ? "selected" : ""
                            } value="Fever Panel Test">Fever Panel Test</option>
                            <option ${
                              p.name == "Vaccination (Tetanus)"
                                ? "selected"
                                : ""
                            } value="Vaccination (Tetanus)">Vaccination (Tetanus)</option>
                            <option ${
                              p.name == "CT Scan Brain" ? "selected" : ""
                            } value="CT Scan Brain">CT Scan Brain</option>
                        </select>
                      </div>  
                    </div>

                    <div class="col-1 px-1">
                        <label class="form-label small text-muted mb-0">Qty</label>
                        <input type="number" class="form-control form-control-sm proc-qty rounded-3 input-style proc-field text-center rounded-4" value="${
                          p.qty
                        }">
                    </div>

                    <div class="col-1 px-1">
                        <label class="form-label small text-muted mb-0">Price</label>
                        <input type="number" class="form-control form-control-sm proc-price rounded-3 input-style proc-field rounded-4" value="${
                          p.price
                        }">
                    </div>
                    
                    <div class="col-1 px-1">
                        <label class="form-label small text-muted mb-0">Disc</label>
                        <div class="d-flex">
                        <input type="number" class="form-control rounded-4 border-end-0 rounded-end-0 form-control-sm input-style text-center" value="${
                          p.discount
                        }">
                        <select class="form-control rounded-4 border-start-1 rounded-start-0 form-control-sm input-style text-center">
                            <option value="per">%</option>
                            <option value="rs">₹</option>
                        </select>
                        </div>
                    </div>
                    
                    <div class="col-3 ps-1 d-flex align-items-center justify-content-between">
                        <div>
                        <label class="form-label small text-muted mb-0 d-none d-md-block">Total</label>
                        <strong class="d-block h6 text-success proc-line-total">₹${lineTotal}</strong>
                        </div>
                        <div>
                         <button type="button" class="btn btn-xs btn-link p-0 text-decoration-none btn-toggle-fields text-primary" data-target="#${boxId}">
                            ${initialButtonHtml}
                        </button>
                        </div>
                    </div>
                </div>
                
                          <div id="${boxId}" class="${initialDisplayClass} mt-2 pt-2 border-top">
                              <div class="row g-2 mb-3">
                                <div class="col-3 ms-5">
                                  <label class="form-label small text-muted mb-0">Status</label>
                                  <select
                                    class="form-control form-control-sm custom-select proc-status rounded-3 input-style proc-field rounded-4"
                                  >
                                    <option ${p.status === "" ? "selected" : ""}></option>
                                            <option ${p.status === "Planned/Completed" ? "selected" : ""}>Planned</option>
                                            <option ${p.status === "Planned/Completed" ? "selected" : ""}>Completed</option>
                                            <option ${p.status === "Planned/Completed" ? "selected" : ""}>Ongoing</option>
                                   
                                  </select>
                                </div>

                                <div class="col-2">
                                  <label class="form-label small text-muted mb-0">Date</label>
                                  <div class="input-group">
                                    <input
                                      type="date"
                                      class="form-control form-control-sm proc-date rounded-4 input-style proc-field"
                                      placeholder="dd-mm-yyyy"
                                      value=""
                                    />
                                  </div>
                                </div>

                                <div class="col-2">
                                  <label class="form-label small text-muted mb-0">Time</label>
                                  <div class="input-group">
                                    <input
                                      type="time"
                                      class="form-control form-control-sm proc-time rounded-4 input-style proc-field"
                                      placeholder="--:--"
                                      value=""
                                    />
                                   
                                  </div>
                                </div>

                                <div class="col-2 d-flex align-items-end">
                                  <button
                                    type="button"
                                    class="btn btn-primary btn-sm rounded-4 w-100"
                                    style="height: calc(1.5em + 0.5rem + 2px)"
                                  >
                                    Fixed
                                  </button>
                                </div>
                              </div>

                              <div class="row px-5 g-2">
                                <div class="col-6">
                                  <label class="form-label small text-muted mb-0">Internal Notes</label>
                                  <textarea
                                    rows="2"
                                    class="form-control form-control-sm proc-internal-notes rounded-3 input-style proc-field rounded-4"
                                    placeholder="Add internal notes here..."
                                  ></textarea>
                                </div>

                                <div class="col-6">
                                  <label class="form-label small text-muted mb-0"
                                    >Patient Instructions</label
                                  >
                                  <textarea
                                    rows="2"
                                    class="form-control form-control-sm proc-patient-instructions rounded-3 input-style proc-field rounded-4"
                                    placeholder="Add patient instructions here..."
                                  >
                            ${p.instruction || ""}</textarea
                                  >
                                </div>
                              </div>
                      </div>

                </div>

                <div class="row pt-2 align-items-center">
                    <div class="col-6">
                       
                    </div>
                    
                    <div class="col-6 text-end">
                        <button type="button" class="btn btn-sm text-danger btn-remove-proc rounded-4">
                            <i style="font-size:.7rem;" class="fas fa-trash me-1"></i> Remove
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
      `);
    });

    updateProcSummary();
  }
  $(document).on("click", ".btn-toggle-fields", function () {
    const $button = $(this);
    const targetId = $button.data("target");
    const $target = $(targetId);
    if ($target.hasClass("d-none")) {
      $target.removeClass("d-none");
    }
    $target.slideToggle(200, function () {
      if ($target.is(":visible")) {
        $button.html('Show less');
      } else {
        $button.html('Show more');
      }
    });
  });

  $(document).on("click", "#addProcedureBtn", function () {
    if (typeof procData === "undefined") {
      window.procData = [];
    }
    procData.push({
      name: "Blood Test",
      instruction: "",
      qty: 1,
      price: 0,
      discount: 0,
      discountUnit: "per",
      status: "",
      total: 0,
    });
    renderProcTable();
    const newBox = $("#procContainer").children().last();
    $("html, body").animate(
      {
        scrollTop: newBox.offset().top - 100,
      },
      500
    );
  });
  $(document).on("click", ".btn-remove-proc", function () {
    const $box = $(this).closest(".proc-box");
    const index = $box.data("index");

    if (confirm("Are you sure you want to remove this procedure?")) {
      procData.splice(index, 1);
      renderProcTable();
    }
  });

  $(document).on("change", ".proc-field", function () {
    const $box = $(this).closest(".proc-box");
    const index = $box.data("index");
    const $qtyInput = $box.find(".proc-qty");
    const $priceInput = $box.find(".proc-price");
    const $discInput = $box.find(".proc-discount");
    const $totalDisplay = $box.find(".proc-line-total");

    // 1. Update procData with the new value of the changed field
    const fieldClass = $(this)
      .attr("class")
      .match(/proc-(name|instruction|qty|price|discount|status)/)[1];
    let newValue = $(this).val();

    if (
      fieldClass === "qty" ||
      fieldClass === "price" ||
      fieldClass === "discount"
    ) {
      newValue = parseFloat(newValue) || 0;
    }

    procData[index][fieldClass] = newValue;
    const newQty = $qtyInput.val();
    const newPrice = $priceInput.val();
    const newDiscount = $discInput.val();
    const newLineTotal = calculateLineTotal(newQty, newPrice, newDiscount);
    $totalDisplay.text(`₹${newLineTotal}`);
    procData[index].total = parseFloat(newLineTotal);
    updateProcSummary();
  });

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
