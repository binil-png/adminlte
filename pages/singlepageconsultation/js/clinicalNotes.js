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
    $("#notes").val(data.notes || []);

    updateClinicalPreview();
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
    const chief = $("#chiefComplaints").val() || [];
    const history = $("#medicalHistory").val() || [];
    const obs = $("#observations").val() || [];
    const investigations = $("#investigations").val() || [];
    const diag = $("#diagnosis").val() || [];
    const treat = $("#treatment").val() || [];
    const notes = $("#notes").val() || [];
    const advice = $("#advice").val() || "";

    const parts = [];
    const formatValue = (val) => (Array.isArray(val) ? val.join(", ") : val);

    if (formatValue(chief)) parts.push(`Chief: ${formatValue(chief)}`);
    if (formatValue(history)) parts.push(`History: ${formatValue(history)}`);
    if (formatValue(obs)) parts.push(`Obs: ${formatValue(obs)}`);
    if (formatValue(investigations)) parts.push(`Inv: ${formatValue(investigations)}`);
    if (formatValue(diag)) parts.push(`Dx: ${formatValue(diag)}`);
    if (formatValue(treat)) parts.push(`Tx: ${formatValue(treat)}`);
    if (formatValue(notes)) parts.push(`Note: ${formatValue(notes)}`);
    if (advice.trim()) parts.push(`Advice: ${advice}`);

    const preview = parts.length > 0 ? parts.join(" | ") : "No items yet";
    $("#clinicalNotesPrev").text(preview);
  }

  // Watch all fields for changes (Select2 triggers 'change')
  $(
    "#chiefComplaints, #medicalHistory, #observations, #investigations, #diagnosis, #treatment, #advice, #notes",
  ).on("change input", function () {
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
    $("#notes").val($(this).data("notes") || "");
    
    // Trigger updateClinicalPreview to refresh the header text
    updateClinicalPreview();
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

  function initProtocolSelect2() {
    $("#protocolSelect").select2({
      placeholder: "Select a protocol",
      allowClear: true,
      width: "100%",
      selectionCssClass: "custom-select2 rounded-4",
      dropdownCssClass: "complaint-dropdown",
      data: protocols.map((p) => ({ id: p.id, text: p.label })),
    });

    $("#protocolSelect").on("change", function () {
      const selectedId = $(this).val();
      const $notesContainer = $(".notescontainer");

      if (selectedId && protocolList[selectedId]) {
        const protocol = protocolList[selectedId];
        $notesContainer.removeClass("d-none");
        $("#doctor-notes").text(protocol.doctorNotes || "");
        $("#patient-notes").text(protocol.patientNotes || "");

        // Populate Lab Investigations
        if (protocol.lab) {
          const labIds = protocol.lab.map((l) => l.id);
          $("#labInvestigationSelect").val(labIds).trigger("change");
        } else {
          $("#labInvestigationSelect").val([]).trigger("change");
        }

        // Populate Procedures / Radiology
        if (protocol.radPros) {
          const radIds = protocol.radPros.map((r) => r.id);
          $("#procedureRadiologySelect").val(radIds).trigger("change");
        } else {
          $("#procedureRadiologySelect").val([]).trigger("change");
        }
      } else {
        $notesContainer.addClass("d-none");
        $("#doctor-notes").text("");
        $("#patient-notes").text("");
        $("#labInvestigationSelect").val([]).trigger("change");
        $("#procedureRadiologySelect").val([]).trigger("change");
      }
    });
  }

  function initInvestigationSelect2() {
    $("#labInvestigationSelect").select2({
      placeholder: "Select Lab Investigations",
      allowClear: true,
      multiple: true,
      width: "100%",
      selectionCssClass: "custom-select2 rounded-4",
      dropdownCssClass: "complaint-dropdown",
      data: labinslist.map((l) => ({ id: l.id, text: l.label })),
    });

    $("#procedureRadiologySelect").select2({
      placeholder: "Select Procedures / Radiology",
      allowClear: true,
      multiple: true,
      width: "100%",
      selectionCssClass: "custom-select2 rounded-4",
      dropdownCssClass: "complaint-dropdown",
      data: procedureRadiologylist.map((r) => ({ id: r.id, text: r.label })),
    });
  }

  initProtocolSelect2();
  initInvestigationSelect2();

  let isShowProtocol = false;
  const $protocolShowBtn = $("#protocol-show-btn");
  $protocolShowBtn.on("click", function () {
    isShowProtocol = !isShowProtocol;
    if (isShowProtocol) {
      $("#protocolArea").removeClass("d-none");
      $protocolShowBtn.text("Show less");
    } else {
      $("#protocolArea").addClass("d-none");
      $protocolShowBtn.text("Show more");
    }
  });
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
