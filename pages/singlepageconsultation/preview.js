$(function () {
  function updatePreview() {
    const cards = $("#medList .medicine-card");
    const count = cards.length;

    if (count === 0) {
      $("#prescPreview").text("No items yet");
      return;
    }

    // Extract medicine names
    const names = cards
      .map(function () {
        return $(this).find(".med-name").val()?.trim();
      })
      .get()
      .filter(Boolean); // remove empty

    const firstMed = names[0] || "Unnamed";

    if (count === 1) {
      $("#prescPreview").text(firstMed);
    } else {
      $("#prescPreview").text(`${firstMed} + ${count - 1} more`);
    }
  }
  $("#addMed").click(function () {
    const newCard = $(".medicine-card").first().clone();
    newCard.find("input").val("");
    $("#medList").append(newCard);
    updatePreview();
  });

  $(document).on("click", ".btn-remove-med", function () {
    if ($("#medList .medicine-card").length > 1) {
      $(this).closest(".medicine-card").remove();
      updatePreview();
    }
  });

  $(document).on("input", ".med-name", function () {
    updatePreview();
  });

  // Initialize preview on load
  updatePreview();

function updateClinicalPreview() {
  // Get all textarea values
  const values = $("#notesForm textarea")
    .map(function () {
      return $(this).val()?.trim();
    })
    .get()
    .filter(Boolean); // remove empty entries

  if (values.length === 0) {
    $("#clinicalNotesPrev").text("No items yet");
    return;
  }

  // Join all values with commas
  const previewText = values.join(", ");

  $("#clinicalNotesPrev").text(previewText);
}

// Auto-update preview while typing
$(document).on("input", "#notesForm textarea", function () {
  updateClinicalPreview();
});

function updateProcedurePreview() {
  const procNames = $("#procTable tbody tr")
    .map(function () {
      const name = $(this).find("select.proc-name").first().val()?.trim();
      return name;
    })
    .get()
    .filter(Boolean); // remove empty values

  if (procNames.length === 0) {
    $("#procPreview").text("No procedures added");
  } else {
    $("#procPreview").text(procNames.join(", "));
  }
}

// Update preview when user changes any field
$(document).on("change input", "#procTable select.proc-name", function () {
  updateProcedurePreview();
});

// Update preview after adding or removing rows
$("#addProc").click(function () {
  // Clone row
  const newRow = $("#procTable tbody tr").first().clone();
  newRow.find("select").val("");
  newRow.find("input").val(1);
  newRow.find(".proc-line-total").text("₹0");
  $("#procTable tbody").append(newRow);

  updateProcedurePreview();
});

$(document).on("click", ".btn-remove-proc", function () {
  $(this).closest("tr").remove();
  updateProcedurePreview();
});
});
