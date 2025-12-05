$(function () {
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

  //---------------------- chip filter function ------------------------------------------------

  function formatDateGroupLabel(dateStr) {
    const today = new Date();
    const date = new Date(dateStr);

    const isToday = date.toDateString() === today.toDateString();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return dateStr.split("-").reverse().join("-"); // dd-mm-yyyy
  }
  function renderHistory() {
    const container = $(".content-area");
    container.empty();

    if (!historyData || historyData.length === 0) {
      container.append(`<p class="text-muted small">No history found.</p>`);
      return;
    }

    // Group by date
    const grouped = historyData.reduce((acc, item) => {
      (acc[item.date] = acc[item.date] || []).push(item);
      return acc;
    }, {});

    // Sort dates desc
    const sortedDates = Object.keys(grouped).sort(
      (a, b) => new Date(b) - new Date(a)
    );

    sortedDates.forEach((date) => {
      // Convert 2025-11-26 to Today / Yesterday / dd-mm-yyyy
      const label = formatDateGroupLabel(date);

      container.append(
        `<h6 class="fw-bold small text-custom mt-3">${label}</h6>`
      );

      grouped[date].forEach((item) => {
        const iconHtml = item.icon
          ? `<i class="${item.icon} me-2 text-custom"></i>`
          : "";

        const extra = item.extra
          ? `<p class="small mb-1">Status: <span class="badge bg-info text-dark">${item.extra}</span></p>`
          : "";

        const time = item.time
          ? `<small class="text-custom">${item.time}</small>`
          : "";

        container.append(`
        <div class="rounded-2 bg-white mb-2 shadow-sm filter-item"
             data-type="${item.type}"
             data-date="${item.date}">

          <div class="card-body">

            <h6 class="fw-semibold text-custom">
              ${iconHtml} ${item.title}
            </h6>

            ${item.html || ""}
            ${extra}
            ${time}

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
          <p class="text-muted mb-0">Description: ${
            desc || "No description"
          }</p>
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

  let showLeft = true;

  $("#toggleAside").on("click", function () {
    if (showLeft) {
      $("#asideMenu").removeClass("aside-hidden");
      $("#asideSideBar").addClass("aside-hidden");
      $("#asideSideBar").removeClass(
        "col-md-2 col-lg-2 border border-top-0 border-bottom-0 p-3 sidebar hide-scrollbar"
      );
      $("#asideMenu").addClass(
        "col-md-2 col-lg-2 border border-top-0 border-bottom-0 p-3 sidebar hide-scrollba"
      );
    } else {
      $("#asideSideBar").removeClass("aside-hidden");
      $("#asideSideBar").addClass(
        "col-md-2 col-lg-2 border border-top-0 border-bottom-0 p-3 sidebar hide-scrollbar"
      );
      $("#asideMenu").removeClass(
        "col-md-2 col-lg-2 border border-top-0 border-bottom-0 p-3 sidebar hide-scrollbar"
      );
      $("#asideMenu").addClass("aside-hidden");
    }

    showLeft = !showLeft; // flip the switch
  });
  $("#asideMenu").addClass("aside-hidden");
  $("#asideMenu").removeClass(
    "col-md-2 col-lg-2 border border-top-0 border-bottom-0 p-3 sidebar hide-scrollbar"
  );
});
