$(function () {
  // Add new dental row
  $("#addDentalProc").on("click", function () {
    const newRow = `
                              <tr>
                                <td>
                                  <select
                                    class="form-control custom-select dental-proc rounded-4 input-style"
                                  >
                                    <option value="">Select procedure</option>
                                    <option value="Filling">Filling</option>
                                    <option value="Extraction">
                                      Extraction
                                    </option>
                                    <option value="Scaling">Scaling</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    class="form-control dental-qty rounded-4 input-style"
                                    value="1"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    class="form-control dental-price rounded-4 input-style"
                                    value="0"
                                  />
                                </td>
                                <td
                                  class="dental-line-total align-middle px-3 py-2"
                                >
                                  ₹0
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    class="btn btn-sm btn-remove-dental"
                                  >
                                    <i class="fas fa-trash text-danger"></i>
                                  </button>
                                </td>
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
    { number: 18, image: "18_28.png", surface: "18_28C.png" },
    { number: 17, image: "17_27.png", surface: "17_27C.png" },
    { number: 16, image: "16_26.png", surface: "16_26C.png" },
    { number: 15, image: "15_25.png", surface: "15_25C.png" },
    { number: 14, image: "14_24.png", surface: "14_24C.png" },
    { number: 13, image: "13_23.png", surface: "13_23C.png" },
    { number: 12, image: "12_22.png", surface: "12_22C.png" },
    { number: 11, image: "11_21.png", surface: "11_21C.png" },
    { number: 21, image: "11_21.png", surface: "11_21C.png" },
    { number: 22, image: "12_22.png", surface: "12_22C.png" },
    { number: 23, image: "13_23.png", surface: "13_23C.png" },
    { number: 24, image: "14_24.png", surface: "14_24C.png" },
    { number: 25, image: "15_25.png", surface: "15_25C.png" },
    { number: 26, image: "16_26.png", surface: "16_26C.png" },
    { number: 27, image: "17_27.png", surface: "17_27C.png" },
    { number: 28, image: "18_28.png", surface: "18_28C.png" },
    // lower jaw
    { number: 48, image: "38_48.png", surface: "38_48C.png" },
    { number: 47, image: "47_37.png", surface: "47_37C.png" },
    { number: 46, image: "46_36.png", surface: "46_36C.png" },
    { number: 45, image: "45_35.png", surface: "45_35C.png" },
    { number: 44, image: "34_44.png", surface: "34_44C.png" },
    { number: 43, image: "43_33.png", surface: "43_33C.png" },
    { number: 42, image: "32_42.png", surface: "32_42C.png" },
    { number: 41, image: "41_31.png", surface: "41_31C.png" },
    { number: 31, image: "41_31.png", surface: "41_31C.png" },
    { number: 32, image: "32_42.png", surface: "32_42C.png" },
    { number: 33, image: "43_33.png", surface: "43_33C.png" },
    { number: 34, image: "34_44.png", surface: "34_44C.png" },
    { number: 35, image: "45_35.png", surface: "45_35C.png" },
    { number: 36, image: "46_36.png", surface: "46_36C.png" },
    { number: 37, image: "47_37.png", surface: "47_37C.png" },
    { number: 38, image: "38_48.png", surface: "38_48C.png" },
  ];

  function renderTeeth(teeth) {
    const row1 = document.getElementById("teethSelector1");
    const row2 = document.getElementById("teethSelector2");

    teeth.forEach((tooth, index) => {
      const elem =
        index < 16
          ? `
     <span role="button" class="rounded-3 border p-2 d-flex flex-column align-items-center gap-2 tooth-item"
      data-tooth="${tooth.number}">
      <img width="30" height="50" src="./Teeth/${tooth.image}" />
      <img width="30" height="30" src="./Teeth/${tooth.surface}" />
        <small>${tooth.number}</small>
      </span> 
    `
          : `
     <span role="button" class="rounded-3 border p-2 d-flex flex-column align-items-center gap-2 tooth-item"
      data-tooth="${tooth.number}">
       <small>${tooth.number}</small>
        <img width="30" height="30" src="./Teeth/${tooth.surface}" />
        <img width="30" height="50" src="./Teeth/${tooth.image}" />
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

  let selectedSurfaces = [];

  // Handle surface clicking
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

  // Reset surfaces when opening modal for a specific tooth
  $(document).on("click", ".tooth-item", function () {
    const toothNumber = $(this).data("tooth");

    // Reset modal state
    $(".surface").removeClass("active");
    selectedSurfaces = [];
    $("#selectedSurfacesText").text("");
    $("#toothModalLabel").text("Dental procedure for Tooth #" + toothNumber);

    const modal = new bootstrap.Modal(document.getElementById("toothModal"));
    modal.show();
  });
});
