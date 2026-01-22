$(function () {
  let allFiles = [];
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
