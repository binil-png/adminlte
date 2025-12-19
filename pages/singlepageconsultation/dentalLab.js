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
        <span role="button" class="${
          selectedTooth[tooth.number]
            ? "rounded-3 border p-2 d-flex flex-column align-items-center gap-2 lab-tooth-selected lab-tooth"
            : "rounded-3 border p-2 d-flex flex-column align-items-center gap-2 lab-tooth"
        }" data-tooth="${tooth.number}">
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
        <span role="button" class="${
          selectedTooth[tooth.number]
            ? "rounded-3 border p-2 d-flex flex-column align-items-center gap-2 lab-tooth-selected lab-tooth"
            : "rounded-3 border p-2 d-flex flex-column align-items-center gap-2 lab-tooth"
        }" data-tooth="${tooth.number}">
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
    } else {
      selectedTooth[toothNo] = toothNo;
    }
    if (parseInt(toothNo) > 50) {
      renderChildTeethUI(childTeeth);
    } else {
      renderTeethUI(teeth);
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
});
