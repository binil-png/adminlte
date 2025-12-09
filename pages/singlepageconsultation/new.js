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
