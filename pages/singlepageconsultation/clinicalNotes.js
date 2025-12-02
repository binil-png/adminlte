$(function () {
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
      chiefComplaints: $("#chiefComplaints").val().trim(),
      medicalHistory: $("#medicalHistory").val().trim(),
      observations: $("#observations").val().trim(),
      investigations: $("#investigations").val().trim(),
      diagnosis: $("#diagnosis").val().trim(),
      treatment: $("#treatment").val().trim(),
      advice: $("#advice").val().trim(),
    };

    console.log("NOTES SAVED:", notesData); // <-- You get the full object here

    // Update preview text
    $("#clinicalNotesPrev").text(notesData.chiefComplaints || "No items yet");

    alert("Clinical Notes Saved!");
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
    "#chiefComplaints, #medicalHistory, #observations, #investigations, #diagnosis, #treatment, #advice"
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

  $(document).ready(function () {
    renderClinicalChips();
  });
});
