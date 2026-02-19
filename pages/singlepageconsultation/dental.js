// unifiedDentalProcedure.js
$(function () {
  // 1. Data Structure
  let dentalDataList = [
    { name: "", qty: 1, price: 0, toothInfo: "", notes: "", total: 0 },
  ];
  let currentActiveToothIndex = null; // Tracks which box the modal is updating
  let selectedTooth = {};
  function generateDentalBoxId(index) {
    return `dental-box-${index}-extra-fields`;
  }
    function calculateDentalLineTotal(qty, price, discount) {
    const quantity = parseFloat(qty) || 0;
    const itemPrice = parseFloat(price) || 0;
    const discountPercent = parseFloat(discount) || 0;
    const subtotal = quantity * itemPrice;
    const discountAmount = subtotal * (discountPercent / 100);
    const total = subtotal - discountAmount;
    return total.toFixed(2);
  }

  // 2. Procedures Rendering
  function renderDentalTable(dentalData) {
    const container = $("#dentalContainer");
    container.empty();
    const defaultHideClass = "d-none";
    dentalData.forEach((p, index) => {
      const boxId = generateDentalBoxId(index);
      const lineTotal = calculateDentalLineTotal(p.qty, p.price, p.discount);
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
                        <label class="form-label small text-muted mb-0">Procedure</label>
                        <select class="form-control form-control-sm custom-select proc-name rounded-3 input-style proc-field rounded-4">
                            <option value="Blood Test">Blood Test</option>
                            <option value="X-Ray Chest">X-Ray Chest</option>
                            <option value="ECG">ECG</option>
                            <option value="Ultrasound Abdomen">Ultrasound Abdomen</option>
                            <option value="Wound Dressing">Wound Dressing</option>
                            <option value="IV Cannula Insertion">IV Cannula Insertion</option>
                            <option value="Nebulization">Nebulization</option>
                            <option value="Fever Panel Test">Fever Panel Test</option>
                            <option value="Vaccination (Tetanus)">Vaccination (Tetanus)</option>
                            <option value="CT Scan Brain">CT Scan Brain</option>
                        </select>
                      </div>  
                    </div>

                 <div class="col-6 row">
                   <div class="col-3 px-1">
                        <label class="form-label small text-muted mb-0">Qty</label>
                        <input type="number" class="form-control form-control-sm proc-qty rounded-3 input-style proc-field text-center rounded-4" value="">
                   </div>

                    <div class="col-3 px-1">
                        <label class="form-label small text-muted mb-0">Price</label>
                        <input type="number" class="form-control form-control-sm proc-price rounded-3 input-style proc-field rounded-4" value="">
                    </div>
                    
                    <div class="col-3 px-1">
                        <label class="form-label small text-muted mb-0">Disc</label>
                        <div class="d-flex">
                        <input type="number" class="form-control rounded-4 border-end-0 rounded-end-0 form-control-sm input-style text-center" value="">
                        <select style="width:30px" class="form-control rounded-4 border-start-1 rounded-start-0 form-control-sm input-style text-center">
                            <option value="per">%</option>
                            <option value="rs">₹</option>
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
                                  >${""}</textarea>
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
    updateDentalTotals();
  }

  // 3. Tooth UI Rendering Logic
  function renderTeethUI(teethArray) {
    const row1 = document.getElementById("teethSelector1");
    const row2 = document.getElementById("teethSelector2");
    if (!row1 || !row2) return;

    row1.innerHTML = "";
    row2.innerHTML = "";

    teethArray.forEach((tooth, index) => {
      const isUpper = index < 16;
      const elem = `
        <span role="button" id="dental-tooth-${
          tooth.number
        }" class="rounded-3 border p-2 d-flex flex-column align-items-center gap-2 tooth-item" data-tooth="${
          tooth.number
        }">
          ${isUpper ? "" : `<small>${tooth.number}</small>`}
          ${
            isUpper
              ? `<img width="30" height="50" src="./Teeth/${tooth.image}" />`
              : `<img width="30" height="30" src="./Teeth/${tooth.surface}" />`
          }
          ${
            isUpper
              ? `<img width="30" height="30" src="./Teeth/${tooth.surface}" />`
              : `<img width="30" height="50" src="./Teeth/${tooth.image}" />`
          }
          ${isUpper ? `<small>${tooth.number}</small>` : ""}
        </span>`;

      (isUpper ? row1 : row2).insertAdjacentHTML("beforeend", elem);
    });
  }

  // 4. Interaction Handlers
  $(document).on("click", "#addDentalProc", function () {
    console.log("add btn clicked");
    dentalDataList.push({
      name: "",
      qty: 1,
      price: 0,
      toothInfo: "",
      notes: "",
      total: 0,
    });
    renderDentalTable(dentalDataList);
  });

  $(document).on("click", ".btn-remove-dental", function () {
    const index = $(this).closest(".dental-box").data("index");
    if (confirm("Remove dental procedure?")) {
      dentalDataList.splice(index, 1);
      renderDentalTable(dentalDataList);
    }
  });

  $(document).on("change input", ".dental-field", function () {
    const $box = $(this).closest(".dental-box");
    const index = $box.data("index");

    if ($(this).hasClass("dental-name"))
      dentalDataList[index].name = $(this).val();
    if ($(this).hasClass("dental-qty"))
      dentalDataList[index].qty = parseFloat($(this).val()) || 0;
    if ($(this).hasClass("dental-price"))
      dentalDataList[index].price = parseFloat($(this).val()) || 0;
    if ($(this).hasClass("dental-tooth-info"))
      dentalDataList[index].toothInfo = $(this).val();
    if ($(this).hasClass("dental-notes"))
      dentalDataList[index].notes = $(this).val();

    dentalDataList[index].total =
      dentalDataList[index].qty * dentalDataList[index].price;
    $box
      .find(".dental-line-total")
      .text(`₹${dentalDataList[index].total.toFixed(2)}`);
    updateDentalTotals();
  });
  $(document).on("click", ".btn-toggle-dental-fields", function (e) {
    e.preventDefault();
    const $button = $(this);
    const targetSelector = $button.attr("data-target");
    const $target = $(targetSelector);
    if ($target.hasClass("d-none")) {
      $target.hide().removeClass("d-none");
    }
    $target.slideToggle(200, function () {
      const isVisible = $target.is(":visible");
      $button.text(isVisible ? "Show less" : "Show more");
    });
  });
  let selectedSurfaces = [];

  // $(document).on("dblclick", ".tooth-item", function () {
  //   const toothNumber = $(this).data("tooth");
  //   if (selectedTooth[toothNumber]) {
  //     delete selectedTooth[toothNumber];
  //     $(`#dental-tooth-${toothNumber}`).removeClass("lab-tooth-selected")
  //   } else {
  //     selectedTooth[toothNumber] = toothNumber;
  //     $(`#dental-tooth-${toothNumber}`).addClass("lab-tooth-selected")
  //   }
  // });

  $(document).on("click", ".tooth-item", function () {
    const toothNumber = $(this).data("tooth");
    $(".surface").removeClass("active");
    selectedSurfaces = [];
    $("#selectedSurfacesText").text("");
    $("#toothModalLabel").text("Dental procedure for Tooth #" + toothNumber);
    $("#forTooth").removeClass("d-none");
    $("#forMouth").addClass("d-none");
    const modal = new bootstrap.Modal(document.getElementById("toothModal"));
    modal.show();
  });

  $(document).on("click", "#selectFullMouth", function () {
    const toothNumber = $(this).data("tooth");
    $(".surface").removeClass("active");
    selectedSurfaces = [];
    $("#selectedSurfacesText").text("");
    $("#toothModalLabel").text("Dental procedure for Tooth #" + toothNumber);
    $("#forTooth").addClass("d-none");
    $("#forMouth").removeClass("d-none");
    const modal = new bootstrap.Modal(document.getElementById("toothModal"));
    modal.show();
  });

  $(document).on("click", ".surface", function () {
    $(this).toggleClass("active");
    const surfaceName = $(this).data("surface");
    if ($(this).hasClass("active")) {
      selectedSurfaces.push(surfaceName);
    } else {
      selectedSurfaces = selectedSurfaces.filter((s) => s !== surfaceName);
    }
    $("#selectedSurfacesText").text(selectedSurfaces.join(", "));
  });

  function updateDentalTotals() {
    const sum = dentalDataList.reduce((a, b) => a + (b.total || 0), 0);
    $("#dentalSum").text(sum.toFixed(2));
  }
  function renderChildTeethUI(teethArray) {
    const row1 = document.getElementById("childTeethSelector1");
    const row2 = document.getElementById("childTeethSelector2");
    if (!row1 || !row2) return;

    row1.innerHTML = "";
    row2.innerHTML = "";

    teethArray.forEach((tooth, index) => {
      const isUpper = index < 10;
      const elem = `
        <span role="button" id="dental-tooth-${
          tooth.number
        }" class="rounded-3 border p-2 d-flex flex-column align-items-center gap-2 tooth-item" data-tooth="${
          tooth.number
        }">
          ${isUpper ? "" : `<small>${tooth.number}</small>`}
          ${
            isUpper
              ? `<img width="30" height="50" src="./Teeth/${tooth.image}" />`
              : `<img width="30" height="30" src="./Teeth/${tooth.surface}" />`
          }
          ${
            isUpper
              ? `<img width="30" height="30" src="./Teeth/${tooth.surface}" />`
              : `<img width="30" height="50" src="./Teeth/${tooth.image}" />`
          }
          ${isUpper ? `<small>${tooth.number}</small>` : ""}
        </span>`;

      (isUpper ? row1 : row2).insertAdjacentHTML("beforeend", elem);
    });
  }
  renderChildTeethUI(childTeeth);
  renderTeethUI(teeth);
  renderDentalTable(dentalDataList);

  const $toggleBtn = $("#dentalToothToggle");
  let isAdult = true;
  $toggleBtn.on("click", function () {
    isAdult = !isAdult;
    if (isAdult) {
      $(this).html('<i class="fas fa-child"></i> Change to child');
      $("#adultTooth").removeClass("d-none").addClass("d-block");
      $("#childTooth").removeClass("d-block").addClass("d-none");
    } else {
      $(this).html('<i class="fas fa-male"></i> Change to adult');
      $("#childTooth").removeClass("d-none").addClass("d-block");
      $("#adultTooth").removeClass("d-block").addClass("d-none");
    }
  });
});
