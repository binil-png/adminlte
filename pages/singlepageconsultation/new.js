$(function () {
  let isEdit = false;
  let patientDataGlobal = null;
  let popoverInstance = null;
  let selectedTeeth = [];

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

  $(document).ready(function () {
    const modal = new bootstrap.Modal(document.getElementById("confirmPopup"));
    const $container = $("#items-container");
    const $searchInput = $("#searchpreviousPatients");
    const $selectedText = $("#selected-item");
    const $noResults = $("#no-results");
    const excludedIds = ":not(.ignore-edit)";
    applyFilters()
    populateDateFilter()
    function populateList(filter = "") {
      $container.empty();
      const query = filter.toLowerCase();
      const filteredPatients = patients.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.id.toLowerCase().includes(query),
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
                `<strong>${patient.name}</strong> <small class="ms-2">(${patient.id})</small>`,
              );
              $("#selectedText").text("Select Appointment");
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

    function updatePatientCard(patient) {
      $("#pAvatar").attr("src", patient.img);
      $("#pName").text(patient.name);
      $(".text-sm:contains('#')").text(`# ${patient.id}`);
      $("#pPhone").html(
        `<i class="fa fa-mobile mr-2 text-custom"></i> ${patient.phone}`,
      );
      $("#pAmount").text(patient.amount || "$0.00");
      $("#pVisits").text(patient.visits || "0");
      $("#pLastVisit").text(patient.lastVisit || "N/A");
    }

    $(document).on(
      "input change",
      `input${excludedIds}, select${excludedIds}, textarea${excludedIds}`,
      function () {
        if (!isEdit) {
          isEdit = true;
          console.log("Global Edit Detected: Form Element");
        }
      },
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

  });

  $("#globalSave").on("click", () => {
    isEdit = false;
  });

  $(document).on("click", ".btn-remove-file", function () {
    $(this).parent().remove();
  });

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
      selectedTeeth.length ? selectedTeeth.join(", ") : "None",
    );
  });

  $("#asideMenu").addClass("aside-hidden");

  $("#asideMenu").removeClass(
    "col-md-2 col-lg-2 border border-top-0 border-bottom-0 p-3 sidebar hide-scrollbar",
  );
  
  const shareBtn = document.querySelector(".save-btn-share");

  renderPopover();

  $(document).on("click", ".appointment-item", function () {
    const name = $(this).find(".fw-semibold").text();
    const info = $(this).find("small").text();
    $("#selected-item").html("<span>Search patient...</span>");
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
      document.getElementById("allergyModal"),
    );
    allergyModal.show();
  });

  $(".openAddProcedure").on("click", function () {
    let visitingNotesModal = new bootstrap.Modal(
      document.getElementById("visitingNotesModal"),
    );
    visitingNotesModal.show();
  });

  let $patientAccordion = $("#patientAccordion");
  $(
    "#collapseVitals, #collapseNotes, #labArea, #collapseProcedure, #collapsePresc, #collapseDental",
  ).on("shown.bs.collapse", function () {
    let $this = $(this);
    let card = $this.closest(".card");

    $patientAccordion.stop().animate(
      {
        scrollTop:
          card.offset().top -
          $patientAccordion.offset().top +
          $patientAccordion.scrollTop() -
          5,
      },
      100,
    );
    $this.find("input, textarea, select").first().focus();
  });
});
