$(function () {
  let isEdit = false;
  let popoverInstance = null;
  let selectedTeeth = [];

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

  function updatePatientCard(patient) {
    console.log(patient)
    $("#pAvatar").attr("src", patient.imageUrl || "https://cloud.pappyjoe.com/images/user.png");
    $("#pName").text(patient.patientName || "");
    $("#pId").text(`#${patient.patientId}` || "");
    let basic = ""
    if (patient?.age) {
      basic += `${patient.age || ""} Y ${(patient.address || patient.gender) ? " | " : ""}`
    }

    if (patient.gender) {
      basic += `${patient.gender || ""} ${patient.address ? " | " : ""}`
    }

    if (patient.gender) {
      basic += ` ${patient.address || ""}`
    }

    $("#pBasic").text(basic);
    $("#pAmount").text(` `);
    $("#pVisits").text(patient.noOfVisits || "");
    $("#pLastVisit").text(patient.lastVisit || "");
    $("#pPhone").html(
      `<i class="fa fa-mobile mr-2 text-custom"></i> ${patient.mobile || ""}`
    );
    addAllergies = patient.allergies
    renderallergies()
  }

  function renderPatientData() {
    updatePatientCard(patientDataGlobal);
  }

  $(document).ready(function () {
    const modal = new bootstrap.Modal(document.getElementById("confirmPopup"));
    const singlePageApi = new SinglePageServices();
    const excludedIds = ":not(.ignore-edit)";
    applyFilters();

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

    $(".close-confirm-popup").on("click", function () {
      if ($(this).attr("id") === "confirmSwitchBtn") {
        if (isEdit) {
          updatePatientCard(patientDataGlobal);
        }
      }
      isEdit = false;
      modal.hide();
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

    const $selectDoctorElem = $("#selectedDoctor");
    const $patientSearch = $("#patientSearch");
    const $appointmentSearch = $("#appointmentSearch");
    $selectDoctorElem.select2({
      theme: "bootstrap-4",
      selectionCssClass:
        "form-control custom-select border-start-0 rounded-start-0 rounded-4 template-select-style w-100",
      ajax: {
        url: `${baseUrl}/singlepagedoctorlist`,
        dataType: "json",
        delay: 250,
        processResults: function (data) {
          return {
            results: $.map(data.results, function (item) {
              return {
                text: item.Name,
                id: item.doctor_id,
                selected: item.selected === "Yes",
              };
            }),
          };
        },
        cache: true,
      },
      placeholder: "Select a doctor",
      minimumInputLength: 0,
    });

    $selectDoctorElem.on("change", function () {
      globalySelectedDoctor = $(this).val();
    });

    $patientSearch.select2({
      theme: "bootstrap-4",
      selectionCssClass:
        "form-control custom-select border-end-0 rounded-end-0 rounded-4 template-select-style",
      ajax: {
        url: `${baseUrl}/singlepagepatientsearchselect`,
        type: "POST",
        dataType: "json",
        delay: 250,
        processResults: function (data) {
          console.log(data);
          return { results: data };
        },
        data: function (params) {
          return { searchTerm: params.term };
        },
        cache: true,
      },
      placeholder: "Select a patient",
      minimumInputLength: 0,
    });

    $patientSearch.on("change", async function () {
      const patientId = $(this).val();
      const res = await singlePageApi.getPatientData(patientId);
      patientDataGlobal = res.results;
      console.log(patientDataGlobal)
      renderPatientData();
    });

    $appointmentSearch.select2({
      theme: "bootstrap-4",
      selectionCssClass:
        "form-control custom-select border-start rounded-start-0 rounded-4 template-select-style",
    });
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

  const shareBtn = document.querySelector(".save-btn-share");

  renderPopover();

  $(document).on("click", ".appointment-item", function () {
    const name = $(this).find(".fw-semibold").text();
    const info = $(this).find("small").text();
    $("#selected-item").html("<span>Search patient...</span>");
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
