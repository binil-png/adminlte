$(function () {
  let isEdit = false;
  let patientDataGlobal = null;
  $(document).ready(function () {
    const modal = new bootstrap.Modal(document.getElementById("confirmPopup"));

    const excludedIds = ":not(.ignore-edit)";
    $(document).on(
      "input change",
      `input${excludedIds}, select${excludedIds}, textarea${excludedIds}`,
      function () {
        if (!isEdit) {
          isEdit = true;
          console.log("Global Edit Detected: Form Element");
        }
      }
    );
    $(document).on("click", `.dropdown-item${excludedIds}`, function () {
      if (!isEdit) {
        isEdit = true;
        console.log("Global Edit Detected: Custom Dropdown Selection");
      }
    });
    $("form").on("submit", function () {
      isEdit = false;
    });

    const patients = [
      {
        id: "P-101",
        name: "John Doe",
        phone: "555-0101",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnCl1OBS1ZNiCOAsWamNsbJT96c0JJPqUylg&s",
      },
      {
        id: "P-102",
        name: "Jane Smith",
        phone: "555-0102",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnCl1OBS1ZNiCOAsWamNsbJT96c0JJPqUylg&s",
      },
      {
        id: "P-103",
        name: "Robert Brown",
        phone: "555-0103",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnCl1OBS1ZNiCOAsWamNsbJT96c0JJPqUylg&s",
      },
      {
        id: "P-104",
        name: "Alice Wilson",
        phone: "555-0104",
        img: "https://icon0.com/free/static2/preview2/stock-photo-avatar-woman-people-icon-character-cartoon-32608.jpg",
      },
    ];

    const $container = $("#items-container");
    const $searchInput = $("#searchpreviousPatients");
    const $selectedText = $("#selected-item");
    const $noResults = $("#no-results");
    function populateList(filter = "") {
      $container.empty();
      const query = filter.toLowerCase();

      const filteredPatients = patients.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.id.toLowerCase().includes(query)
      );

      if (filteredPatients.length > 0) {
        $noResults.addClass("d-none");
        filteredPatients.forEach((patient) => {
          const itemHtml = `
          <button class="dropdown-item py-2 border-bottom ignore-edit" type="button">
            <div class="d-flex align-items-center">
              <img src="${patient.img}" class="rounded-circle me-3" width="25" height="25" alt="avatar">
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between">
                  <strong class="mb-0 text-dark">${patient.name}</strong>
                  <small class="text-primary fw-bold">${patient.id}</small>
                </div>
                <div class="text-muted small">${patient.phone}</div>
              </div>
            </div>
          </button>`;

          const $item = $(itemHtml);
          $item.on("click", function () {
            if (isEdit) {
              modal.show();
              patientDataGlobal = patient;
            } else {
              $selectedText.html(
                `<strong>${patient.name}</strong> <small class="ms-2">(${patient.id})</small>`
              );
              updatePatientCard(patient);
              $searchInput.val("");
              populateList("");
            }
          });

          $container.append($item);
        });
      } else {
        $noResults.removeClass("d-none");
      }
    }

    populateList();
    $searchInput.on("input", function (e) {
      if (isEdit) {
        modal.show();
      } else {
        populateList($(this).val());
      }
    });

    $(".close-confirm-popup").on("click", function () {
      console.log($(this).attr("id"));
      if ($(this).attr("id") === "confirmSwitchBtn") {
        if (isEdit) {
          updatePatientCard(patientDataGlobal);
        }
      }
      isEdit = false;
      modal.hide();
    });

    $searchInput.on("click", function (e) {
      e.stopPropagation();
    });

    $("#patient-autocomplete").on("shown.bs.dropdown", function () {
      $searchInput.focus();
    });

    function updatePatientCard(patient) {
      // Update Left Section
      $("#pAvatar").attr("src", patient.img);
      $("#pName").text(patient.name);
      $(".text-sm:contains('#')").text(`# ${patient.id}`); // Updates the ID span
      $("#pPhone").html(
        `<i class="fa fa-mobile mr-2 text-custom"></i> ${patient.phone}`
      );

      // Update Stats (using placeholder data if not in your object)
      $("#pAmount").text(patient.amount || "$0.00");
      $("#pVisits").text(patient.visits || "0");
      $("#pLastVisit").text(patient.lastVisit || "N/A");
    }
  });

  $("#globalSave").on("click", () => {
    isEdit = false;
  });
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

  function renderHistory() {
    const container = $(".content-area");
    container.empty();

    if (!historyData || historyData.length === 0) {
      container.append(`<p class="text-muted small">No history found.</p>`);
      return;
    }
    const vitalsData = [];
    const otherHistoryData = [];
    historyData.forEach((item) => {
      if (item.type === "vitals") {
        vitalsData.push(item);
      } else {
        otherHistoryData.push(item);
      }
    });

    if (vitalsData.length > 0) {
      renderVitalsTable(container, vitalsData);
      container.append('<hr class="my-4">');
    }
    if (notesList.length > 0) {
      renderNotesComparisonTable(container, notesList.slice(0, 3));
    }

    renderOtherHistory(container, otherHistoryData);
  }
  let clinicalNotesToggle = true;
  function renderOtherHistory(container, historyItems) {
    // Group by date
    const grouped = historyItems.reduce((acc, item) => {
      (acc[item.date] = acc[item.date] || []).push(item);
      return acc;
    }, {});

    const sortedDates = Object.keys(grouped).sort(
      (a, b) => new Date(b) - new Date(a)
    );

    sortedDates.forEach((date) => {
      const label = formatDateGroupLabel(date);

      container.append(
        `<h6 class="fw-bold small text-custom mt-3">${label}</h6>`
      );

      grouped[date].forEach((item, i) => {
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
                <div class="${
                  item.type == "notes"
                    ? "rounded-2 bg-white mb-2 shadow-sm filter-item clinical-notes-container"
                    : "rounded-2 bg-white mb-2 shadow-sm filter-item"
                }"
                    data-type="${item.type}"
                    data-date="${item.date}"> 
                    <div class="card-body">
                    <div class="d-flex justify-content-between align-item-center pb-2">
                          <h6 class="fw-semibold text-custom">
                              ${iconHtml} ${item.title}
                          </h6>
                          ${
                            item.type == "notes"
                              ? `<button  class="btn text-success btn-sm toggle-view-btn" id="table-toggle-btn${i}"><i class="fas fa-table"></i></button>`
                              : ""
                          }
                          ${
                            item.type == "procedure"
                              ? `<button  class="btn text-primary btn-sm openAddProcedure"><i class="fas fa-file-medical"></i></button>`
                              : ""
                          }
                    </div>
                          <div class="content-container">
                            <div class="html-view">
                               ${item.html || ""}
                            </div>
                            <div class="card-view d-none">
                              ${item.card || ""}
                            </div>
                          </div>
                        ${extra}
                        ${time}
                    </div>
                </div>
            `);

        container
          .off("click", ".toggle-view-btn")
          .on("click", ".toggle-view-btn", function () {
            console.log("clicked");
            // const $btn = $(this);
            // const $icon = $btn.find("i");
            const $tableView = $(".clinical-notes-tables");
            const $cardView = $(".clinical-notes-container");

            if (clinicalNotesToggle) {
              console.log("condition 1");
              // $icon.removeClass("fa-table").addClass("fa-list-alt");
              $cardView.addClass("d-none");
              $tableView.removeClass("d-none");
            } else {
              console.log("condition 2");
              // $icon.removeClass("fa-list-alt").addClass("fa-table");
              $tableView.addClass("d-none");
              $cardView.removeClass("d-none");
            }
            console.log("before = ", clinicalNotesToggle);
            clinicalNotesToggle = !clinicalNotesToggle;
            console.log("after = ", clinicalNotesToggle);
          });
      });
    });
  }

  function formatDateGroupLabel(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }

  renderHistory();

  function getUniqueDates() {
    if (typeof historyData === "undefined" || historyData.length === 0) {
      return [];
    }
    const uniqueDates = [...new Set(historyData.map((item) => item.date))];
    return uniqueDates.sort((a, b) => new Date(b) - new Date(a));
  }
  function populateDateFilter() {
    const $select = $("#dateFilter");
    $select.empty();
    $select.append(`<option value="all">-- Select All Dates --</option>`);
    const uniqueDates = getUniqueDates();
    uniqueDates.forEach((dateString) => {
      const displayLabel = formatDateGroupLabel(dateString);
      $select.append(`<option value="${dateString}">${displayLabel}</option>`);
    });
  }
  renderHistory();
  populateDateFilter();

  function applyFilters() {
    const activeFilter = $("#chipFilters .active-filter").data("filter");
    const selectedDates = $("#dateFilter").val() || [];
    const filterAllDates =
      selectedDates.includes("all") || selectedDates.length === 0;

    $(".filter-item")
      .hide()
      .filter(function () {
        const typeMatch =
          activeFilter === "all" || $(this).data("type") === activeFilter;

        const itemDate = $(this).data("date");
        const dateMatch = filterAllDates || selectedDates.includes(itemDate);

        return typeMatch && dateMatch;
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
      $("#showFileArea").addClass("d-none");
    });
    $("#closeFileToList").click(function () {
      $("#fileInputArea").addClass("d-none");
      $("#showFileArea").removeClass("d-none");
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
      $("#showFileArea").removeClass("d-none");
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

  // Initialize Save and Share Popover
  const shareBtn = document.querySelector(".save-btn-share");
  let popoverInstance = null;

  const renderPopover = () => {
    if (!shareBtn) return;

    popoverInstance = new bootstrap.Popover(shareBtn, {
      html: true,
      title: `
      <div class="d-flex justify-content-between align-items-center">
        <span>Sharing Options</span>
        <button type="button" id="close-popover" class="btn-close btn-sm"></button>
      </div>
    `,
      content: () => document.querySelector("#share-popover-content").innerHTML,
      placement: "right",
      trigger: "manual", // IMPORTANT
      sanitize: false,
    });

    // Toggle popover
    shareBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      popoverInstance.toggle();
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      const popoverEl = document.querySelector(".popover");

      if (popoverEl && !popoverEl.contains(e.target) && e.target !== shareBtn) {
        popoverInstance.hide();
      }
    });

    // Stop clicks inside popover from bubbling
    document.addEventListener("click", (e) => {
      if (e.target.closest(".popover")) {
        e.stopPropagation();
      }
    });

    // Close button
    document.addEventListener("click", (e) => {
      if (e.target.id === "close-popover") {
        popoverInstance.hide();
      }
    });

    // Share actions
    document.addEventListener("click", (e) => {
      if (!e.target.classList.contains("share-action")) return;

      const type = e.target.getAttribute("title");

      const data = {
        from: document.getElementById("share-from-date")?.value,
        to: document.getElementById("share-to-date")?.value,
        notes: document.getElementById("check-notes")?.checked,
        rx: document.getElementById("check-rx")?.checked,
        proc: document.getElementById("check-proc")?.checked,
      };

      console.log("Sharing via", type, data);

      popoverInstance.hide();

      if (type === "Print") {
        window.print();
      } else {
        alert(`Preparing ${type} share...`);
      }
    });
  };
  renderPopover();

  $(document).on("click", ".appointment-item", function () {
    const name = $(this).find(".fw-semibold").text();
    const info = $(this).find("small").text();

    $("#selectedText").text(`${name} — ${info}`);
  });
  const $templatePopup = $(".saveastemplete");
  $templatePopup.on("click", function () {
    const clickedBtn = $(this).data("templatefor");
    let selectedTemplate = prompt(`Please enter a template name`, "");
    if (selectedTemplate !== null && selectedTemplate !== "") {
      alert(`${selectedTemplate} template added in ${clickedBtn}`);
    }
  });

  $("#openAllergyModal").on("click", function () {
    let allergyModal = new bootstrap.Modal(
      document.getElementById("allergyModal")
    );
    allergyModal.show();
  });
  $(".openAddProcedure").on("click", function () {
    let visitingNotesModal = new bootstrap.Modal(
      document.getElementById("visitingNotesModal")
    );
    visitingNotesModal.show();
  });

  var $patientAccordion = $("#patientAccordion");

  // List all IDs separated by commas
  $(
    "#collapseVitals, #collapseNotes, #labArea, #collapseProcedure, #collapsePresc, #collapseDental"
  ).on("shown.bs.collapse", function () {
    var $this = $(this);
    var card = $this.closest(".card");

    $patientAccordion.stop().animate(
      {
        scrollTop:
          card.offset().top -
          $patientAccordion.offset().top +
          $patientAccordion.scrollTop() -
          5,
      },
      100
    );

    // Focus the first input or textarea found
    $this.find("input, textarea, select").first().focus();
  });
});
