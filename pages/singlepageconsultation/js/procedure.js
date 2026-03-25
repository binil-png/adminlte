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

  window.procData = [];

  function renderProcTable() {
    const container = $("#procContainer");
    container.empty();
    const defaultHideClass = "d-none";
    procData.forEach((p, index) => {
      const boxId = generateBoxId(index);
      const lineTotal = calculateLineTotal(p.qty, p.price, p.discount);
      const initialDisplayClass = defaultHideClass;
      const initialButtonHtml = "Show more";
      container.append(`
      <div class="bg-custom rounded-4 proc-box" data-index="${index}">
            <div class="p-2">
                <div class="row g-2 align-items-end">
                    <div class="col-6 row">
                      <div class="col-1 text-center pe-0">
                            <label class="form-label small text-muted mb-0 d-none d-md-block">Sr</label>
                            <span class="d-block mt-1 pt-1">${index + 1}</span>
                      </div>
                      <div class="col-11">
                        <label class="form-label small text-muted mb-0 select2-label">Procedure</label>
                        <select class="form-control form-control-sm proc-name proc-field">
                            ${
                              p.name
                                ? `<option value="${p.name}" selected>${p.name}</option>`
                                : ""
                            }
                        </select>
                      </div>  
                    </div>

                 <div class="col-6 row">
                   <div class="col-3 px-1">
                        <label class="form-label small text-muted mb-0">Qty</label>
                        <input type="number" class="form-control form-control-sm proc-qty rounded-3 input-style proc-field text-center rounded-4" value="${
                          p.qty
                        }">
                   </div>

                    <div class="col-3 px-1">
                        <label class="form-label small text-muted mb-0">Price</label>
                        <input type="number" class="form-control form-control-sm proc-price rounded-3 input-style proc-field rounded-4" value="${
                          p.price
                        }">
                    </div>
                    
                    <div class="col-3 px-1">
                        <label class="form-label small text-muted mb-0">Disc</label>
                        <div class="d-flex">
                        <input type="number" class="form-control proc-discount rounded-4 border-end-0 rounded-end-0 form-control-sm input-style text-center" value="${
                          p.discount
                        }">
                        <select style="width:30px" class="form-control proc-discount-unit rounded-4 border-start-1 rounded-start-0 form-control-sm input-style text-center">
                            <option ${p.discountUnit === "per" ? "selected" : ""} value="per">%</option>
                            <option ${p.discountUnit === "rs" ? "selected" : ""} value="rs">₹</option>
                        </select>
                        </div>
                    </div>
                    
                    <div class="col-3 ps-1 d-flex align-items-center justify-content-end">
                        <div class="text-right">
                        <label class="form-label small text-muted mb-0 d-none d-md-block">Total</label>
                        <strong class="d-block text-sm text-success proc-line-total">₹${lineTotal}</strong>
                        </div>
                    </div>
                    </div>
                </div>
                
                <div id="${boxId}" class="${initialDisplayClass} mt-2 pt-2 border-top">
                             <div class="row g-2 mb-1 align-items-center">
                               <div class="col-4">
                                  <label class="form-label small text-muted mb-0">Status</label>
                                  <select
                                    class="form-control form-control-sm custom-select proc-status rounded-3 input-style proc-field rounded-4"
                                  >
                                                           <option value="">Select status</option>
                                                           <option value="Planned">Planned</option>
                                                           <option value="Completed">Completed</option>
                                                           <option value="Nursing Ordered">Nursing Ordered</option>
                                                           <option value="Nursing Done">Nursing Done</option>
                                                           <option value="Sent to Radiology">Sent to Radiology</option>
                                                           <option value="Radiology Done">Radiology Done</option>
                                                           <option value="Lab Ordered">Lab Ordered</option>
                                                           <option value="Lab Done">Lab Done</option>
                                   
                                  </select>
                                </div>
                                <div class="col-4">
                                        <label class="form-label small text-muted mb-0">Date/Time</label>
                                        <div class="input-group">
                                          <input
                                            type="date"
                                            class="form-control form-control-sm proc-date rounded-4 rounded-end-0 input-style proc-field"
                                            placeholder="dd-mm-yyyy"
                                            value=""
                                          />
                                            <input
                                            type="time"
                                            class="form-control form-control-sm proc-time rounded-0 input-style proc-field"
                                            placeholder="--:--"
                                            value=""
                                          />
                                            <button
                                          type="button"
                                          class="btn btn-primary btn-sm rounded-4 rounded-start-0"
                                          style="height: calc(1.5em + 0.5rem + 2px)"
                                        >
                                          Fixed
                                        </button>
                                        </div>
                                </div>
                               <div class="col-4">
                                  <label class="form-label small text-muted mb-0">Select doctor</label>
                                  <select
                                    class="form-control form-control-sm custom-select proc-status rounded-3 input-style proc-field rounded-4"
                                  >
                                            <option >Select doctor</option>
                                            <option >Doctor A</option>
                                            <option>Doctor B</option>
                                            <option>Doctor C</option>
                                   
                                  </select>
                                </div>
                              </div>
                              <div class="row g-2">
                                   <div class="col-4">
                                  <label class="form-label small text-muted mb-0">Internal Notes</label>
                                  <textarea
                                    class="form-control form-control-sm proc-internal-notes rounded-3 input-style proc-field rounded-4"
                                    placeholder="Add internal notes here..."></textarea>
                               </div>
                                <div class="col-4">
                                  <label class="form-label small text-muted mb-0">Patient Instructions</label>
                                  <textarea
                                    class="form-control form-control-sm proc-patient-instructions rounded-3 input-style proc-field rounded-4"
                                    placeholder="Add patient instructions here..."
                                  >${p.instruction || ""}</textarea>
                                </div>
                              </div>
                </div>

            </div>
            <div class="row pt-2 align-items-center">
               <div class="col-6"></div>
               <div class="col-6 text-end">
                   <button type="button" class="btn btn-xs p-0 text-decoration-none text-semibold btn-toggle-fields" data-target="#${boxId}">
                        ${initialButtonHtml}
                   </button>
                    <button type="button" class="btn btn-sm text-danger btn-remove-proc rounded-4">
                        <i style="font-size:.7rem;" class="fas fa-trash me-1"></i>
                    </button>
              </div>
            </div>  
      </div>
      `);
    });

    updateProcSummary();
    initProcSelect2();
  }

  function initProcSelect2() {
    $(".proc-name").select2({
      placeholder: "Select Procedure",
      tags: true,
      width: "100%",
      selectionCssClass: "custom-select2 rounded-4 w-100",
      dropdownCssClass: "complaint-dropdown",
      ajax: {
        url: `${baseUrl}/singlepage_proceduremaster`,
        type: "get",
        dataType: "json",
        delay: 250,
        data: function (params) {
          return {
            searchterm: params.term,
          };
        },
        processResults: function (response) {
          return {
            results: response,
          };
        },
        cache: true,
      },
    });
  }

  $(document).on("select2:select", ".proc-name", function (e) {
    const data = e.params.data;
    const $box = $(this).closest(".proc-box");
    const index = $box.data("index");

    if (data.cost) {
      const $priceInput = $box.find(".proc-price");
      $priceInput.val(data.cost).trigger("change");
    }
  });
  $(document).on("click", ".btn-toggle-fields", function () {
    const $button = $(this);
    const targetId = $button.data("target");
    const $target = $(targetId);
    if ($target.hasClass("d-none")) {
      $target.removeClass("d-none");
    }
    $target.slideToggle(200, function () {
      if ($target.is(":visible")) {
        $button.html("Show less");
      } else {
        $button.html("Show more");
      }
    });
  });

  $(document).on("click", "#addProcedureBtn", function () {
    if (typeof procData === "undefined") {
      window.procData = [];
    }
    procData.push({
      name: "",
      instruction: "",
      qty: 0,
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
        scrollTop: newBox.offset()?.top - 100,
      },
      500,
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
    renderProcTable();
  });

  $(document).on("input change", ".proc-field", function () {
    const row = $(this).closest("tr");
    recalcProcRow(row);
  });

  let notesList = [];

  const $visitingNotesForm = $("#visitingNotesForm");

  function renderVisitingNotes(list) {
    $visitingNotesForm.empty();
    if (list.length) {
      list.forEach((n, i) => {
        $visitingNotesForm.append(`
    <div class="p-2 bg-light rounded-4">
      <div class="mb-2 d-flex align-items-center gap-2">
        <div class="flex-fill">
          <label
            class="form-label d-flex justify-content-between align-items-center"
            ><span>Status</span>
          </label>
          <select class="form-control rounded-4 custom-select input-style">
            <option value="">Select status</option>
            <option value="">Planned</option>
            <option value="">Completed</option>
            <option value="">Nursing Ordered</option>
            <option value="">Nursing Done</option>
            <option value="">Sent to Radiology</option>
            <option value="">Radiology Done</option>
            <option value="">Lab Ordered</option>
            <option value="">Lab Done</option>
          </select>
        </div>
        <div class="row flex-fill align-items-center">
          <div class="col-md-6 mx-0 pe-0 mb-2">
            <label style="margin-bottom: 9px;" class="form-label d-flex justify-content-between align-items-center ">Date</label>
            <input type="date" class="form-control rounded-4 rounded-end-0 input-style" />
          </div>

          <div class="col-md-6 mx-0 ps-0 mb-2">
            <label
              class="form-label d-flex justify-content-between align-items-center "
              ><span>Time</span>
              <button
                data-index="${i}"
                class="btn btn-sm text-danger p-0 m-0 visitingnotedelete"
              >
                <i class="fas fa-times"></i></button
            ></label>
            <input type="time" class="form-control border-start-0 rounded-start-0 rounded-4 input-style" />
          </div>
        </div>
      </div>
      <div class="mb-2">
        <label class="form-label">Notes</label>
        <textarea
          class="form-control rounded-4 input-style"
          rows="2"
          placeholder="Enter visiting notes"
        ></textarea>
      </div>
    </div>
      `);
      });
    } else {
      $visitingNotesForm.append(`<div>No visiting notes</div>`);
    }
  }

  $(document).on("click", ".visitingnotedelete", function () {
    const index = $(this).data("index");
    console.log(index);
    notesList = notesList.filter((n, i) => i != index);
    renderVisitingNotes(notesList);
  });

  $("#addVistingNotes").on("click", function () {
    notesList.push({
      status: "",
      date: "",
      time: "",
      notes: "",
    });
    renderVisitingNotes(notesList);
  });
  $(document).on("click", ".openAddProcedure", function () {
    let visitingNotesModal = new bootstrap.Modal(
      document.getElementById("visitingNotesModal"),
    );
    visitingNotesModal.show();
  });

  $(document).on("click", "#saveProcedure", function () {
    const doctorId =
      typeof globalySelectedDoctor !== "undefined" && globalySelectedDoctor
        ? globalySelectedDoctor
        : "405968";
    const today = new Date().toISOString().split("T")[0];

    const payload = {
      doctor_id: doctorId,
      date: today,
      items: {},
    };

    $(".proc-box").each(function (index) {
      const $box = $(this);

      // Get Select2 data to find id
      const select2Data = $box.find(".proc-name").select2("data")[0];
      const procedureId = select2Data ? select2Data.id : "";

      const dateVal = $box.find(".proc-date").val();
      const timeVal = $box.find(".proc-time").val();
      const dateTime =
        dateVal && timeVal ? `${dateVal} ${timeVal}:00` : "2026-02-01 10:10:00"; // Fallback as per request example if empty

      const discUnit = $box.find(".proc-discount-unit").val();
      const discountType = discUnit === "per" ? "%" : "INR";

      const status = $box.find(".proc-status").val() || "Completed";
      const appointment = status === "Planned" ? "1" : "0";
      const prostatus = status === "Planned" ? "Yes" : "No";

      payload.items[index.toString()] = {
        procedure_id: procedureId,
        quantity: $box.find(".proc-qty").val() || "1",
        price: $box.find(".proc-price").val() || "0",
        discount: $box.find(".proc-discount").val() || "0",
        discount_type: discountType,
        note: $box.find(".proc-patient-instructions").val() || "",
        total: $box.find(".proc-line-total").text().replace("₹", "") || "0",
        intnote: $box.find(".proc-internal-notes").val() || "",
        pdate: dateTime,
        edate: dateTime,
        appointment: appointment,
        prostatus: prostatus,
        status: status,
      };
    });

    console.log("Saving Procedures Payload:", payload);

    $.ajax({
      url: `${baseUrl}/api/singlepage_saveprocedures`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),
      success: function (response) {
        const toast = new ToastComponent();
        toast.success("Procedures saved successfully!");
        console.log("Save Success:", response);
      },
      error: function (xhr) {
        const toast = new ToastComponent();
        toast.danger("Error saving procedures.");
        console.error("Save Error:", xhr);
      },
    });
  });
});

function renderProcedure(container, proceduresList) {
  const status = {
    Completed: "badge bg-success",
    Pending: "badge bg-danger",
    Active: "badge bg-success",
    Invoiced: "badge bg-primary",
  };
  container.empty();
  proceduresList.forEach((i) => {
    let procedureDiv = "";
    i.procedures.forEach((p, count) => {
      procedureDiv += `<div class="content-container mt-1 border-b">
             <div class="d-flex">
              <small class="me-1">${i.procedures.length > 1 ? count + 1 + ")" : ""}</small>
              <div class="html-view">
              <div class="d-flex justify-content-start ailgn-items-center gap-2">
                <p class="small mb-1">
                  <b>Procedure:</b> ${p.name}
                </p>
                <p class="small mb-1">
                  <span class="${status[p.status] || "badge bg-secondary"}">${p.status}</span>
                </p>
              </div>
              <p class="small mb-1">
                <b>Internal Notes:</b> ${p.internalNotes}.
              </p>
              <p class="small mb-1">
                <b>Patient Notes:</b> ${p.patientNotes}.
              </p>
              <!-- <small class="text-muted">Radiology Department</small> -->
            </div>
             </div>
            <div class="card-view d-none"></div>
          </div>`;
    });

    container.append(
      `<div class="date-wise-procedures" data-date="${i.date}">
         <h6 class="fw-bold small text-custom mt-3">Dec 05, 2025</h6>
         <div
        class="rounded-2 bg-white mb-2 shadow-sm filter-item"
        data-type="procedure"
        data-date="2025-12-03"
      >
        <div class="card-body">
          <div class="d-flex justify-content-between align-item-center pb-2">
            <h6 class="fw-semibold text-custom">
              <i class="fas fa-syringe text-info me-2 text-custom"></i>
              Procedure Performed
            </h6>
            <button class="btn text-primary btn-sm openAddProcedure">
              <i class="fas fa-file-medical"></i>
            </button>
          </div>
           ${procedureDiv}
        </div>
      </div>
      </div>`,
    );
  });
}


