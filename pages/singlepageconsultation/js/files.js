$(function () {
  let allFiles = [];
  const apiBase = (typeof baseUrl !== 'undefined') ? baseUrl : "";

  $(document).ready(function () {
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
      let categoryId = $("#categoryuploads").val();
      let categoryName = $("#categoryuploads option:selected").text();

      if (!file) {
        alert("Please select a file.");
        return;
      }

      // Save data in array
      allFiles.push({ file: file, description: desc, categoryId: categoryId });

      // Add UI box
      $("#fileList").append(`
      <li class="border rounded p-2 mb-2 d-flex justify-content-between align-items-center">
        <div class="d-flex flex-column gap-1">
          <strong>${file.name}</strong>
          <small class="text-muted">Category: ${categoryName}</small>
          <p class="text-muted mb-0 small">Description: ${
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
      if (allFiles.length === 0) {
        alert("Please add at least one file to the list.");
        return;
      }

      const $btn = $(this);
      const originalText = $btn.html();
      $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span> Saving...');

      let formData = new FormData();
      allFiles.forEach((item) => {
        formData.append("file[]", item.file);
        formData.append("notes[]", item.description);
        formData.append("category_id[]", item.categoryId);
      });

      $.ajax({
        url: `${apiBase}/singlepage_savefiles`,
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          alert("Files saved successfully!");
          allFiles = [];
          $("#fileList").empty();
          $("#closeFileToList").click(); // Hide input area if open
        },
        error: function (xhr) {
          console.error("Failed to save files:", xhr);
          alert("Error saving files. Please try again.");
        },
        complete: function() {
          $btn.prop('disabled', false).html(originalText);
        }
      });
    });

    $("#fileInput").on("change", function () {
      $("#fileList").empty();
      Array.from(this.files).forEach(function (f, i) {
        $("#fileList").append(
          "<li>" +
            f.name +
            ' <button data-index="' +
            i +
            '" class="btn btn-sm btn-link btn-remove-file">Remove</button></li>',
        );
      });
    });
  });
});

function renderFiles(container, fileList) {
  container.empty();
  let fileDiv = "";
  fileList.forEach((f) => {
    fileDiv = "";
    f.files.forEach((file) => {
      fileDiv += `<div class="d-flex flex-column">
          <div
            class="d-flex align-items-center px-3 py-2 border-bottom filter-item hover-bg"
            style="transition: background 0.1s ease; cursor: pointer;"
          >
            <div class="flex-shrink-0" style="width: 24px;">
              <i class="fas fa-file text-muted"></i>
            </div>

            <div class="flex-grow-1 ms-2 overflow-hidden">
              <div class="d-flex align-items-center gap-2">
                <a
                  href="${file.url || ""}"
                  target="_blank"
                  class="text-decoration-none text-dark fw-semibold small text-truncate"
                >
                  ${file.fileName || "File"}
                </a>
                <span class="text-muted small" style="font-size: 0.7rem;">
                  • ${file.category}
                </span>
              </div>
              <div
                class="text-muted text-truncate"
                style="font-size: 0.75rem; margin-top: -2px;"
              >
                ${file.description || "No description"}
              </div>
            </div>

            <div class="ms-2">
              <a class="text-muted" href="${file.url || ""}" target="_blank">
                <i class="fas fa-eye"></i>
              </a>
            </div>
          </div>
        </div>`;
    });
    container.append(
      `<div class="date-wise-files" data-date="${f.date}">
      <h6 class="fw-bold small text-custom mt-3">${f.date}</h6>
        <div
          class="border-0 shadow-sm rounded-3 overflow-hidden my-2"
          style="background-color: white;"
        >
          <div class="px-3 py-2 border-bottom d-flex justify-content-between align-items-center">
            <small
              class="fw-bold text-uppercase text-muted"
              style="letter-spacing: 0.5px; font-size: 0.75rem;"
            >
              <i class="fas fa-file-alt text-danger me-1"></i> Files
            </small>
            <span class="badge bg-light text-dark fw-normal">
              Total: ${f.files.length}
            </span>
          </div>

          <div class="card-body p-0">${fileDiv}</div>
        </div>
      </div>`
    );
  });
}
