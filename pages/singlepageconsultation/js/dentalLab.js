$(function () {
  $(document).on("click", "#tooth-lab", function () {
    const modal = new bootstrap.Modal(document.getElementById("toothLabModal"));
    modal.show();
  });

  let selectedTooth = {};

  function renderTeethUI(teethArray) {
    const row1 = document.getElementById("dentalUpperLab");
    const row2 = document.getElementById("dentalLowerLab");
    if (!row1 || !row2) return;

    row1.innerHTML = "";
    row2.innerHTML = "";

    teethArray.forEach((tooth, index) => {
      const isUpper = index < 16;
      const elem = `
        <span role="button" id="lab-dental-tooth-${tooth.number}" class="rounded-3 border p-2 d-flex flex-column align-items-center gap-2 lab-tooth" data-tooth="${tooth.number}">
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

  function renderChildTeethUI(teethArray) {
    const row1 = document.getElementById("childDentalUpperLab");
    const row2 = document.getElementById("childDentalLowerLab");
    if (!row1 || !row2) return;

    row1.innerHTML = "";
    row2.innerHTML = "";

    teethArray.forEach((tooth, index) => {
      const isUpper = index < 10;
      const elem = `
        <span role="button" id="lab-dental-tooth-${tooth.number}" class="rounded-3 border p-2 d-flex flex-column align-items-center gap-2 lab-tooth" data-tooth="${tooth.number}">
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
  const $toggleBtn = $("#labToothToggle");
  let isLabAdult = true;
  $toggleBtn.on("click", function () {
    isLabAdult = !isLabAdult;
    if (isLabAdult) {
      $(this).html('<i class="fas fa-child"></i> Change to child');
      $("#adultToothLab").removeClass("d-none").addClass("d-block");
      $("#childToothLab").removeClass("d-block").addClass("d-none");
    } else {
      $(this).html('<i class="fas fa-male"></i> Change to adult');
      $("#childToothLab").removeClass("d-none").addClass("d-block");
      $("#adultToothLab").removeClass("d-block").addClass("d-none");
    }
  });

  $(document).on("click", ".lab-tooth", function () {
    const toothNo = $(this).data("tooth");
    if (selectedTooth[toothNo]) {
      delete selectedTooth[toothNo];
      $(`#lab-dental-tooth-${toothNo}`).removeClass("lab-tooth-selected")
    } else {
      selectedTooth[toothNo] = toothNo;
      $(`#lab-dental-tooth-${toothNo}`).addClass("lab-tooth-selected")
    }
     
    renderSelectedTooth();
  });

  $(document).on("click", ".toothDeleteBtn", function () {
    const selectedNo = $(this).data("selected");
    if (selectedTooth[selectedNo]) {
      delete selectedTooth[selectedNo];
      renderSelectedTooth();
    }
  });

  const renderSelectedTooth = () => {
    const selectedArray = Object.keys(selectedTooth);
    let renderElements = "";

    selectedArray.forEach((num) => {
      renderElements += `
            <div class="px-1 lab-tooth-selected rounded-4 border d-flex align-items-center gap-2 text-sm toothDeleteBtn" 
                 style="cursor: pointer;" data-selected=${num}>
                <span>Tooth ${num}</span>
                <i class="fas fa-times-circle"></i>
            </div>`;
    });
    if (selectedArray.length === 0) {
      renderElements =
        '<span class="text-muted small">No teeth selected</span>';
    } else {
      renderElements =
        renderElements +
        "<button id='clearSelected' class='btn btn-sm text-danger'>Clear all</button>";
    }

    $("#selectedLabContainer").html(renderElements);
    
    // Update header preview
    if (selectedArray.length > 0) {
      $("#dentalLabPreview").text("Teeth: " + selectedArray.join(", "));
    } else {
      $("#dentalLabPreview").text("No items yet");
    }
  };
  renderSelectedTooth();
  $(document).on("click", "#selectAllBtn", function () {
    if (isLabAdult) {
      selectedTooth = {};
      teeth.forEach((i) => {
        selectedTooth[i.number] = i.number;
      });
      renderTeethUI(teeth);
    } else {
      selectedTooth = {};
      childTeeth.forEach((i) => {
        selectedTooth[i.number] = i.number;
      });
      renderChildTeethUI(childTeeth);
    }
    renderSelectedTooth();
  });
  $(document).on("click", "#clearSelected", function () {
    selectedTooth = {};
    if (isLabAdult) {
      renderTeethUI(teeth);
    } else {
      renderChildTeethUI(childTeeth);
    }
    renderSelectedTooth();
  });

  // Base URL for APIs
  const apiBase = (typeof baseUrl !== 'undefined') ? baseUrl : "";

  // Initialize Select2 for Lab Name
  $("#labName").select2({
    placeholder: "Choose Lab...",
    width: "100%",
    selectionCssClass: "custom-select2 rounded-4",
    dropdownCssClass: "complaint-dropdown",
    ajax: {
      url: `${apiBase}/singlepage_labmaster/dentallab`,
      dataType: "json",
      delay: 250,
      data: function (params) {
        return {
          searchterm: params.term || "",
          start: 0,
          limit: 10
        };
      },
      processResults: function (data) {
        return {
          results: data.map(item => ({
            id: item.id,
            text: item.name
          }))
        };
      },
      cache: true
    }
  });

  // Initialize Select2 for Brand
  $("#brand").select2({
    placeholder: "Choose Brand...",
    width: "100%",
    selectionCssClass: "custom-select2 rounded-4",
    dropdownCssClass: "complaint-dropdown",
    ajax: {
      url: `${apiBase}/singlepage_labmaster/brand`,
      dataType: "json",
      delay: 250,
      data: function (params) {
        return {
          searchterm: params.term || "",
          start: 0,
          limit: 10
        };
      },
      processResults: function (data) {
        return {
          results: data.map(item => ({
            id: item.name,
            text: item.name
          }))
        };
      },
      cache: true
    }
  });

  // Save Dental Lab Order
  $(document).on("click", "#saveDental", function () {
    const $btn = $(this);
    const originalHtml = $btn.html();
    const labId = $("#labName").val();
    const selectedTeethArray = Object.keys(selectedTooth);
    
    if (!labId) {
      if (typeof ToastComponent !== 'undefined') {
        new ToastComponent().danger("Please select a lab.");
      } else {
        alert("Please select a lab.");
      }
      return;
    }
    
    if (selectedTeethArray.length === 0) {
      if (typeof ToastComponent !== 'undefined') {
        new ToastComponent().danger("Please select at least one tooth.");
      } else {
        alert("Please select at least one tooth.");
      }
      return;
    }

    const patientName = $("#pName").text().trim();
    
    // Create FormData as requested
    const formData = new FormData();
    formData.append("lab_id", labId);
    formData.append("teeth", selectedTeethArray.join(","));
    formData.append("typeofwork", $("#workType").val());
    formData.append("remarks", $("#remarks").val());
    formData.append("givendate", $("#givenDate").val());
    formData.append("deliverydate", $("#deliveryDate").val());
    formData.append("ex_name", patientName);
    formData.append("amount", $("#invoiceAmount").val() || 0);
    formData.append("paidamount", $("#labAmount").val() || 0);
    formData.append("deliverystatus", "Ordered");

    // Show loading state
    $btn.prop("disabled", true).html('<span class="spinner-border spinner-border-sm me-2"></span> Saving...');

    $.ajax({
      url: `${apiBase}/singlepage_dentallab_save`,
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        if (typeof ToastComponent !== 'undefined') {
          new ToastComponent().success("Dental lab order saved successfully!");
        } else {
          alert.success("Dental lab order saved successfully!");
        }
        console.log("Lab Save Success:", response);
      },
      error: function (xhr) {
        if (typeof ToastComponent !== 'undefined') {
          new ToastComponent().danger("Error saving dental lab order.");
        } else {
          alert("Error saving dental lab order.");
        }
        console.error("Lab Save Error:", xhr);
      },
      complete: function () {
        // Restore button state
        $btn.prop("disabled", false).html(originalHtml);
      }
    });
  });
});
