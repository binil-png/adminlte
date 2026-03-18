$(function () {
  let clinicalNotesToggle = true;
  function setClinicalNotes(data) {
    $("#chiefComplaints").val(data.chiefComplaints);
    $("#medicalHistory").val(data.medicalHistory);
    $("#observations").val(data.observations);
    $("#investigations").val(data.investigations);
    $("#diagnosis").val(data.diagnosis);
    $("#treatment").val(data.treatment);
    $("#advice").val(data.advice);

    // Set preview text
    $("#clinicalNotesPrev").text(data.chiefComplaints || "No items yet");
  }

  $("#saveNotes").on("click", function () {
    const notesData = {
      complaints: $("#chiefComplaints").val() || [],
      history: $("#medicalHistory").val() || [],
      observation: $("#observations").val() || [],
      investigation: $("#investigations").val() || [],
      diagnosis: $("#diagnosis").val() || [],
      note: $("#notes").val() || [],
      date_time: new Date().toISOString().split("T")[0],
      doctor_id:
        typeof globalySelectedDoctor !== "undefined"
          ? globalySelectedDoctor
          : 0,
    };

    $.ajax({
      url: `${baseUrl}/singlepage_saveclinicnote`,
      type: "post",
      dataType: "json",
      data: JSON.stringify(notesData),
      contentType: "application/json; charset=utf-8",
      success: function (response) {
        console.log("NOTES SAVED:", response);
        const complaintsText =
          Array.isArray(notesData.complaints) && notesData.complaints.length > 0
            ? notesData.complaints.join(", ")
            : "No items yet";
        $("#clinicalNotesPrev").text(complaintsText);
        alert("Clinical Notes Saved!");
      },
      error: function (error) {
        console.error("Error saving clinical notes:", error);
        alert("Found some error while saving clinical notes!");
      },
    });
  });

  function updateClinicalPreview() {
    const chief = $("#chiefComplaints").val();
    const obs = $("#observations").val();
    const diag = $("#diagnosis").val();
    const treat = $("#treatment").val();

    const preview = `
    Chief: ${chief || "—"} | 
    Obs: ${obs || "—"} | 
    Dx: ${diag || "—"} | 
    Tx: ${treat || "—"}
  `;

    $("#clinicalNotesPrev").text(preview.trim());
  }

  // Watch all fields for changes
  $(
    "#chiefComplaints, #medicalHistory, #observations, #investigations, #diagnosis, #treatment, #advice",
  ).on("input", function () {
    updateClinicalPreview();
  });

  $(document).on("click", ".note-template", function () {
    $("#chiefComplaints").val($(this).data("chief") || "");
    $("#medicalHistory").val($(this).data("history") || "");
    $("#observations").val($(this).data("observation") || "");
    $("#investigations").val($(this).data("investigation") || "");
    $("#diagnosis").val($(this).data("diagnosis") || "");
    $("#treatment").val($(this).data("treatment") || "");
    $("#advice").val($(this).data("advice") || "");
    const preview = `
    Chief: ${$(this).data("chief") || "—"} | 
    Obs: ${$(this).data("observation") || "—"} | 
    Dx: ${$(this).data("diagnosis") || "—"} | 
    Tx: ${$(this).data("treatment") || "—"}
  `;

    $("#clinicalNotesPrev").text(preview.trim());
  });

  // Load on page start
  $(document).ready(function () {
    setClinicalNotes(mockClinicalNotes);

    $("#chiefComplaints").select2({
      placeholder: "Select Chief Complaints",
      tags: true,
      selectionCssClass: "custom-select2 rounded-4 w-100",
      dropdownCssClass: "complaint-dropdown",
      ajax: {
        url: `${baseUrl}/singlepage_clinicnotemaster/complaint`,
        type: "post",
        dataType: "json",
        delay: 250,
        data: function (params) {
          return {
            searchTerm: params.term,
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

    $("#medicalHistory").select2({
      placeholder: "Select Medical History",
      tags: true,
      selectionCssClass: "custom-select2 rounded-4 w-100",
      dropdownCssClass: "complaint-dropdown",
      ajax: {
        url: `${baseUrl}/singlepage_clinicnotemaster/history`,
        type: "post",
        dataType: "json",
        delay: 250,
        data: function (params) {
          return {
            searchTerm: params.term,
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

    $("#observations").select2({
      placeholder: "Select Observations",
      tags: true,
      selectionCssClass: "custom-select2 rounded-4 w-100",
      dropdownCssClass: "complaint-dropdown",
      ajax: {
        url: `${baseUrl}/singlepage_clinicnotemaster/observation`,
        type: "post",
        dataType: "json",
        delay: 250,
        data: function (params) {
          return {
            searchTerm: params.term,
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

    $("#investigations").select2({
      placeholder: "Select Investigations",
      tags: true,
      selectionCssClass: "custom-select2 rounded-4 w-100",
      dropdownCssClass: "complaint-dropdown",
      ajax: {
        url: `${baseUrl}/singlepage_clinicnotemaster/investigation`,
        type: "post",
        dataType: "json",
        delay: 250,
        data: function (params) {
          return {
            searchTerm: params.term,
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

    $("#diagnosis").select2({
      placeholder: "Select Diagnosis",
      tags: true,
      selectionCssClass: "custom-select2 rounded-4 w-100",
      dropdownCssClass: "complaint-dropdown",
      ajax: {
        url: `${baseUrl}/singlepage_clinicnotemaster/diagnose`,
        type: "post",
        dataType: "json",
        delay: 250,
        data: function (params) {
          return {
            searchTerm: params.term,
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

    $("#notes").select2({
      placeholder: "Select Notes",
      tags: true,
      selectionCssClass: "custom-select2 rounded-4 w-100",
      dropdownCssClass: "complaint-dropdown",
      ajax: {
        url: `${baseUrl}/singlepage_clinicnotemaster/note`,
        type: "post",
        dataType: "json",
        delay: 250,
        data: function (params) {
          return {
            searchTerm: params.term,
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

    $("#treatment").select2({
      placeholder: "Select treatment recommendation",
      tags: true,
      selectionCssClass: "custom-select2 rounded-4 w-100",
      dropdownCssClass: "complaint-dropdown",
      ajax: {
        url: `${baseUrl}/singlepage_clinicnotemaster/recommend`,
        type: "post",
        dataType: "json",
        delay: 250,
        data: function (params) {
          return {
            searchTerm: params.term,
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
  });

  function renderClinicalChips() {
    const container = $("#notesTemplates");
    container.empty(); // clear old chips

    clinicalTemplates.forEach((t) => {
      const chip = $(`
      <span role="button"
        class="badge badge-primary p-2 rounded-4 note-template"
        data-chief="${t.chief}"
        data-history="${t.history}"
        data-observation="${t.observation}"
        data-investigation="${t.investigation}"
        data-diagnosis="${t.diagnosis}"
        data-treatment="${t.treatment}"
        data-advice="${t.advice}"
      >
        ${t.label}
      </span>
    `);

      container.append(chip);
    });

    // Also keep the select dropdown at the end
    container.append(`
      <select class="form-control custom-select proc-name rounded-4 w-25 template-select-style">
        <option value="">Select template</option>
        <option value="Dental Cleaning">Doctor A</option>
        <option value="Root Canal">Doctor B</option>
        <option value="X-Ray">Doctor C</option>
      </select>
  `);
  }
  renderClinicalChips();

  const protocols = [
    {
      id: 1,
      label: "ACTV",
    },
    {
      id: 2,
      label: "ASDF",
    },
    {
      id: 3,
      label: "BACTERIAL FEVER",
    },
    {
      id: 4,
      label: "Cough",
    },
  ];

  const labinslist = [
    {
      id: 1,
      label: "Lab 1",
    },
    {
      id: 2,
      label: "Lab 2",
    },
    {
      id: 3,
      label: "Lab 3",
    },
    {
      id: 4,
      label: "Lab 4",
    },
  ];

  const procedureRadiologylist = [
    {
      id: 1,
      label: "item 1",
    },
    {
      id: 2,
      label: "item 2",
    },
    {
      id: 3,
      label: "item 3",
    },
    {
      id: 4,
      label: "item 4",
    },
  ];

  const protocolList = {
    1: {
      lab: [
        {
          id: 2,
          label: "Lab 2",
        },
        {
          id: 4,
          label: "Lab 4",
        },
      ],
      radPros: [
        {
          id: 1,
          label: "item 1",
        },
        {
          id: 2,
          label: "item 2",
        },
      ],
      patientNotes: "Test patient notes for ACTV",
      doctorNotes: "Test doctor notes for ACTV",
    },
    4: {
      lab: [
        {
          id: 3,
          label: "Lab 3",
        },
        {
          id: 1,
          label: "Lab 1",
        },
      ],
      radPros: [
        {
          id: 2,
          label: "item 2",
        },
        {
          id: 3,
          label: "item 3",
        },
      ],
      patientNotes: "Test patient notes for Cough",
      doctorNotes: "Test doctor notes for Cough",
    },
  };

  function renderchips(list, con) {
    con.empty();
    list.forEach((i) => {
      con.append(`
             <div class="px-1 lab-tooth-selected rounded-4 border d-flex align-items-center gap-2 text-sm labinsitems" 
                 style="cursor: pointer;" data-selected=${i.id}>
                <span>${i.label}</span>
                <i class="fas fa-times-circle"></i>
            </div>`);
    });
  }
  let isShowProtocol = false;
  const $protocolShowBtn = $("#protocol-show-btn");
  $protocolShowBtn.on("click", function () {
    isShowProtocol = !isShowProtocol;
    console.log(isShowProtocol);
    if (isShowProtocol) {
      $("#protocolArea").removeClass("d-none");
      $protocolShowBtn.text("Show less");
    } else {
      $("#protocolArea").addClass("d-none");
      $protocolShowBtn.text("Show more");
    }
  });
  const $container = $("#protocol-container");
  const $searchProtocol = $("#searchProtocol");
  const $noProtocols = $("#no-protocols");
  const $protocolNameDisplay = $("#protocolNameDisplay");
  function populateProtocolList(filter = "") {
    $container.empty();
    const query = filter.toLowerCase();

    const filteredPatients = protocols.filter((p) =>
      p.label.toLowerCase().includes(query),
    );

    if (filteredPatients.length > 0) {
      $noProtocols.addClass("d-none");
      filteredPatients.forEach((p) => {
        const itemHtml = `
          <button class="dropdown-item py-2 border-bottom ignore-edit" type="button">
            <div class="d-flex align-items-center">
              <div class="text-muted small">${p.label}</div>
            </div>
          </button>`;

        const $item = $(itemHtml);
        const $notesContainer = $(".notescontainer");
        $item.on("click", function () {
          $protocolNameDisplay.text(p.label);
          if (protocolList[p.id]) {
            $notesContainer.removeClass("d-none");
            $("#doctor-notes").text(protocolList[p.id]?.doctorNotes || "");
            $("#patient-notes").text(protocolList[p.id]?.patientNotes || "");
            renderchips(
              protocolList[p.id].lab?.length ? protocolList[p.id].lab : [],
              $labselectedItems,
            );
            renderchips(
              protocolList[p.id].radPros.length
                ? protocolList[p.id].radPros
                : [],
              $procedureRadiologyItems,
            );
          } else {
            $notesContainer.addClass("d-none");
            renderchips([], $labselectedItems);
            renderchips([], $procedureRadiologyItems);
          }
        });

        $container.append($item);
      });
    } else {
      $noProtocols.removeClass("d-none");
    }
  }

  populateProtocolList("");

  $searchProtocol.on("input", function (e) {
    populateProtocolList($(this).val());
  });

  //populate lab list
  const $labcontainer = $("#labinsvestigation-container");
  const $searchlabinstruction = $("#searchlabinstruction");
  const $nolabins = $("#no-labins");
  const $labselectedItems = $("#labselectedItems");
  let selectedLabs = [];
  $(document).on("click", ".labinsitems", function (e) {
    e.stopPropagation();
    e.preventDefault();
    const selectedId = $(this).data("selected");
    $(this).remove();
    selectedLabs = selectedLabs.filter((i) => i.id != selectedId);
  });

  function populatelabinsList(filter = "") {
    $labcontainer.empty();
    const query = filter.toLowerCase();
    let filteredPatients = [];
    filteredPatients = labinslist.filter((p) =>
      p.label.toLowerCase().includes(query),
    );

    if (filteredPatients.length > 0) {
      $nolabins.addClass("d-none");
      filteredPatients.forEach((p) => {
        const itemHtml = `
          <button class="dropdown-item py-2 border-bottom ignore-edit" type="button">
            <div class="d-flex align-items-center">
              <div class="text-muted small">${p.label}</div>
            </div>
          </button>`;

        const $item = $(itemHtml);
        $item.on("click", function () {
          selectedLabs.push(p);
          renderchips(selectedLabs, $labselectedItems);
        });

        $labcontainer.append($item);
      });
    } else {
      const newObj = {
        id: Date.now(),
        label: filter,
      };
      filteredPatients.push(newObj);
      $nolabins.addClass("d-none");
      filteredPatients.forEach((p) => {
        const itemHtml = `
          <button class="dropdown-item py-2 border-bottom ignore-edit" type="button">
            <div class="d-flex align-items-center">
              <div class="text-muted small">${p.label}</div>
            </div>
          </button>`;

        const $item = $(itemHtml);
        $item.on("click", function () {
          selectedLabs.push(p);
          renderchips(selectedLabs, $labselectedItems);
        });

        $labcontainer.append($item);
      });
      // $nolabins.removeClass("d-none");
    }
  }
  $searchlabinstruction.on("input", function (e) {
    populatelabinsList($(this).val());
  });
  populatelabinsList("");

  //  populate lab and radiology list
  const $procedureRadiology = $("#procedure-radiology-container");
  const $procedureRadiologySearch = $("#procedure-radiology-input");
  const $noprocedurelab = $("#no-procedure-radiology");
  const $procedureRadiologyItems = $("#procedure-radiology-item");
  let selectedProcedureRadiology = [];
  $(document).on("click", ".labinsitems", function (e) {
    e.stopPropagation();
    e.preventDefault();
    const selectedId = $(this).data("selected");
    $(this).remove();
    selectedProcedureRadiology = selectedProcedureRadiology.filter(
      (i) => i.id != selectedId,
    );
  });
  function renderchips(list, con) {
    con.empty();
    list.forEach((i) => {
      con.append(`
             <div class="px-1 lab-tooth-selected rounded-4 border d-flex align-items-center gap-2 text-sm labinsitems" 
                 style="cursor: pointer;" data-selected=${i.id}>
                <span>${i.label}</span>
                <i class="fas fa-times-circle"></i>
            </div>`);
    });
  }
  function populateProcedureRadiologyList(filter = "") {
    $procedureRadiology.empty();
    const query = filter.toLowerCase();
    let filteredPatients = [];
    filteredPatients = procedureRadiologylist.filter((p) =>
      p.label.toLowerCase().includes(query),
    );

    if (filteredPatients.length > 0) {
      $noprocedurelab.addClass("d-none");
      filteredPatients.forEach((p) => {
        const itemHtml = `
          <button class="dropdown-item py-2 border-bottom ignore-edit" type="button">
            <div class="d-flex align-items-center">
              <div class="text-muted small">${p.label}</div>
            </div>
          </button>`;

        const $item = $(itemHtml);
        $item.on("click", function () {
          selectedProcedureRadiology.push(p);
          renderchips(selectedProcedureRadiology, $procedureRadiologyItems);
        });

        $procedureRadiology.append($item);
      });
    } else {
      filteredPatients.push({
        id: Date.now(),
        label: filter,
      });

      filteredPatients.forEach((p) => {
        const itemHtml = `
          <button class="dropdown-item py-2 border-bottom ignore-edit" type="button">
            <div class="d-flex align-items-center">
              <div class="text-muted small">${p.label}</div>
            </div>
          </button>`;

        const $item = $(itemHtml);
        $item.on("click", function () {
          selectedProcedureRadiology.push(p);
          renderchips(selectedProcedureRadiology, $procedureRadiologyItems);
        });

        $procedureRadiology.append($item);
      });
      // $noprocedurelab.removeClass("d-none");
    }
  }
  $procedureRadiologySearch.on("input", function (e) {
    populateProcedureRadiologyList($(this).val());
  });
  populateProcedureRadiologyList("");
});
let clinicalNotesToggle = true;
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function renderNotesComparisonTable(container, notesData) {
  const noteFields = [
    { key: "complaints", label: "Complaints" },
    { key: "history", label: "History" },
    { key: "observations", label: "Observations" },
    { key: "investigations", label: "Investigations" },
    { key: "diagnosis", label: "Diagnosis" },
    { key: "treatment", label: "Treatment" },
    { key: "advice", label: "Advice" },
  ];

  let table = `
      <div class="table-responsive clinical-notes-tables rounded-2 bg-white mb-2 shadow-sm filter-item d-none">
        <div class="d-flex justify-content-between align-item-center">
          <h6 class="fw-semibold text-custom p-2">
            <i class="fas fa-notes-medical text-warning me-2"></i>
            Clinical Notes
          </h6>
          <button  class="btn text-success btn-sm toggle-view-btn"><i class="fas fa-list-alt"></i></button>
        </div>
        <table class="table table-bordered table-sm align-middle bg-white mb-0">
          <thead class="bg-white">
            <tr>
              <th style="min-width:60px; font-size:.8rem" class="bg-white">Parameter</th>
              ${notesData
                .map(
                  (n) =>
                    `<th style="font-size:.8rem" class="text-center bg-white">${formatDate(
                      n.date,
                    )}</th>`,
                )
                .join("")}
            </tr>
          </thead>
          <tbody class="bg-white">
    `;

  noteFields.forEach((field) => {
    table += `
      <tr>
        <th style="min-width:60px; font-size:.8rem" class="fw-semibold">${
          field.label
        }</th>
        ${notesData
          .map((n) => `<td style="font-size:.8rem">${n[field.key] || "-"}</td>`)
          .join("")}
      </tr>
    `;
  });

  table += `
        </tbody>
      </table>
       <div class="d-flex justify-content-end align-items-center p-2">
          <nav aria-label="Page navigation with arrows">
              <ul class="pagination pagination-sm m-0">
                <li  class="page-item disabled">
                  <a style="padding:0px 8px;" class="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>

                <li class="page-item"><a style="padding:0px 8px;" class="page-link" href="#">1</a></li>
                <li class="page-item">
                  <a style="padding:0px 8px;" class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
          </nav>
       </div>
    </div>
  `;

  container.append(table);
}

function renderClinicalNotes(container, historyItems) {
  if (historyItems) {
    const headings = [
      {
        title: "Chief Complaints",
        key: "complaints",
      },
      {
        title: "Medical History",
        key: "history",
      },
      {
        title: "Observations",
        key: "observations",
      },
      {
        title: "Investigations",
        key: "investigations",
      },
      {
        title: "Diagnosis",
        key: "diagnosis",
      },
      {
        title: "Treatment",
        key: "treatment",
      },
      {
        title: "Advice",
        key: "advice",
      },
    ];
    container.empty();
    historyItems.forEach((notes) => {
      container.append(`
        <div class="date-wise-notes" data-date="${notes.date}">
         <h6 class="fw-bold small text-custom mt-3 clinical-notes-container">${notes.date}</h6>
        <div class="rounded-2 bg-white mb-2 shadow-sm filter-item clinical-notes-container" data-type="notes"> 
             <div class="card-body">
                <div class="d-flex justify-content-between align-item-center pb-2">
                          <h6 class="fw-semibold text-custom">
                              <i class="fas fa-notes-medical text-warning me-2 text-custom"></i> Clinical Notes
                          </h6>
                          <button class="btn text-success btn-sm toggle-view-btn" id="table-toggle-btn0"><i class="fas fa-table"></i></button>
                         </div>
                          <div class="content-container">
                            <div class="html-view">
                               
       <table class="table table-sm border-0">
          <tbody>
            <tr>
              <th class="border-0 p-0" style="width:110px; font-size:.8rem">Chief Complaints</th>
              <td class="border-0 p-0" style="font-size:.9rem">: ${notes.complaints}</td>
            </tr>
            <tr>
              <th class="border-0 p-0" style="width:110px; font-size:.8rem">Medical History</th>
              <td class="border-0 p-0" style="font-size:.9rem">: ${notes.history}</td>
            </tr>
            <tr>
              <th class="border-0 p-0" style="width:110px; font-size:.8rem">Observations</th>
              <td class="border-0 p-0" style="font-size:.9rem">: ${notes.observations}</td>
            </tr>
            <tr>
              <th class="border-0 p-0" style="width:110px; font-size:.8rem">Investigations</th>
              <td class="border-0 p-0" style="font-size:.9rem">: ${notes.investigations}</td>
            </tr>
            <tr>
              <th class="border-0 p-0" style="width:110px; font-size:.8rem">Diagnosis</th>
              <td class="border-0 p-0" style="font-size:.9rem">: ${notes.diagnosis}</td>
            </tr>
            <tr>
              <th class="border-0 p-0" style="width:110px; font-size:.8rem">Treatment</th>
              <td class="border-0 p-0" style="font-size:.9rem">: ${notes.treatment}</td>
            </tr>
            <tr>
              <th class="border-0 p-0" style="width:110px; font-size:.8rem">Advice</th>
              <td class="border-0 p-0" style="font-size:.9rem">: ${notes.advice}</td>
            </tr>
          </tbody>
   </table>
    </div>
</div>
</div>
    </div>
        </div>
        `);
    });

    let table = `<table class="table table-bordered table-sm align-middle bg-white mb-0">`;
    let thead = `<thead class="bg-white"><tr><th style="min-width:60px; font-size:.8rem" class="bg-white">Parameter</th>`;
    let tbody = `<tbody class="bg-white">`;
    let tdElement = "";
    headings.forEach((item, i) => {
      tdElement =
        tdElement +
        `<tr><td style="min-width:60px; font-size:.8rem" class="bg-white;font-weight:bold;">${item.title}</td>`;
      historyItems.forEach((n) => {
        if (i == 0) {
          thead =
            thead +
            `<th style="min-width:60px; font-size:.8rem" class="bg-white">${n.date}</th>`;
        }
        tdElement =
          tdElement +
          `<td style="min-width:60px; font-size:.8rem" class="bg-white">${n[item.key]}</td>`;
      });
      tdElement = tdElement + `</tr>`;
    });

    thead = thead + `</tr></thead>`;
    table = table + thead;
    tbody = tbody + tdElement;
    tbody = tbody + "</tbody></table>";
    table = table + tbody;
    container.append(`<div class="table-responsive clinical-notes-tables rounded-2 bg-white mb-2 shadow-sm filter-item d-none">
        <div class="d-flex justify-content-between align-item-center">
          <h6 class="fw-semibold text-custom p-2">
            <i class="fas fa-notes-medical text-warning me-2"></i>
            Clinical Notes
          </h6>
          <button  class="btn text-success btn-sm toggle-view-btn"><i class="fas fa-list-alt"></i></button>
        </div>
        <div style="overflow-x: auto;" >
        ${table}
       </div>
       <div class="d-flex justify-content-end align-items-center p-2">
       <nav aria-label="Page navigation with arrows">
          <ul class="pagination pagination-sm m-0">
            <li  class="page-item disabled">
              <a style="padding:0px 8px;" class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span> 
              </a>
            </li>
            
            <li class="page-item"><a style="padding:0px 8px;" class="page-link" href="#">1</a></li>
            <li class="page-item">
              <a style="padding:0px 8px;" class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
      </nav>
       </div>
    </div>
        `);

    container
      .off("click", ".toggle-view-btn")
      .on("click", ".toggle-view-btn", function () {
        const $tableView = $(".clinical-notes-tables");
        const $cardView = $(".clinical-notes-container");
        console.log("--- clicked ---");
        if (clinicalNotesToggle) {
          $cardView.addClass("d-none");
          $tableView.removeClass("d-none");
        } else {
          $tableView.addClass("d-none");
          $cardView.removeClass("d-none");
        }
        clinicalNotesToggle = !clinicalNotesToggle;
      });
  }
}
