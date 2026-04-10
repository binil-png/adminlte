$(function () {
  let allTest = []; // This stores the items selected by the user
  let currentFetchedList = []; // This stores results from the current API call
  let selectedMode = "test"; // 'test', 'category', or 'package'
  let price = 0;
  const $categoryArea = $("#categoryArea");
  const $selectedTestArea = $("#selectedTestArea");
  const $allTestArea = $("#allTestArea");
  const $labpricearea = $("#labpricearea");
  const $selectedCount = $("#selectedCount");
  const $labSearchInput = $("#labSearchInput");
  const $labPrevBtn = $("#labPrevBtn");
  const $labNextBtn = $("#labNextBtn");

  let currentStart = 0;
  const pageSize = 10;

  // Define baseUrl - check if it's already defined globally, otherwise use empty string
  const apiBase = (typeof baseUrl !== 'undefined') ? baseUrl : "";

  function fetchLabData(type) {
    selectedMode = type;
    renderLoading();
    $labPrevBtn.prop('disabled', true);
    $labNextBtn.prop('disabled', true);

    let endpoint = "";
    if (type === "test") endpoint = `/singlepage_labmaster/test?start=${currentStart}&limit=${pageSize}`;
    else if (type === "category") endpoint = `/singlepage_labmaster/category?start=${currentStart}&limit=${pageSize}`;
    else if (type === "package") endpoint = `/singlepage_labmaster/package?start=${currentStart}&limit=${pageSize}`;

    $.ajax({
      url: `${apiBase}${endpoint}`,
      method: "GET",
      dataType: "json",
      success: function (data) {
        // Map data if needed (some APIs return result in different keys)
        currentFetchedList = Array.isArray(data) ? data : (data.results || data.items || []);
        renderTest(currentFetchedList);
        
        // If it's categories, maybe we want to render them as top chips too?
        if (type === "category") {
           renderTopChips(currentFetchedList);
        }

        // Pagination buttons state
        $labPrevBtn.prop('disabled', currentStart === 0);
        // Disable next if we fetched less than pageSize (indicates no more records)
        $labNextBtn.prop('disabled', currentFetchedList.length < pageSize);
      },
      error: function (xhr) {
        console.error("Failed to fetch lab data:", xhr);
        $allTestArea.empty().append('<div class="p-3 text-center text-danger small">Failed to load data. Please try again.</div>');
      }
    });
  }

  function updateLabPreview(list) {
    if (list.length > 0) {
      const previewText = list.map(t => t.name || t.label || t.text).join(", ");
      $("#labPreview").text(previewText);
    } else {
      $("#labPreview").text("No items yet");
    }
  }

  function renderSelectedTest(list) {
    $selectedTestArea.empty();
 
    if (list.length) {
      list.forEach((t) => {
        const itemHtml = `
          <li class="list-group-item d-flex justify-content-between align-items-center border-0 py-2 px-2">
             <div>
                <small class="fw-semibold d-block">${t.name || t.label || t.text}</small>
                <small class="text-muted text-xs">${t.type}</small>
             </div>
             <div class="d-flex justify-content-end align-items-center gap-2">
                <small class="fw-bold text-primary">₹${t.cost || 0}</small>
                <button data-id="${t.id}" class="btn text-danger text-md test-cancel p-0 m-0" style="font-size: 0.6rem">
                  <i class="fas fa-times-circle"></i>
                </button>
             </div>
          </li>
        `;
        $selectedTestArea.append(itemHtml);
        price += parseFloat(t.cost || 0);
      });
      $labpricearea.text("₹" + price);
      $selectedCount.text(list.length);
    } else {
      $selectedTestArea.append(`
        <li class="list-group-item d-flex justify-content-between align-items-center border-0 py-2">
          <small class="text-muted">No items selected</small>
        </li>
      `);
      $selectedCount.text(0);
      $labpricearea.text("₹0");
    }
    updateLabPreview(list);
  }

  function renderTest(list) {
    $allTestArea.empty();
    if (list && list.length) {
      list.forEach((i) => {
        const isChecked = allTest.some(item => item.id == i.id);
        $allTestArea.append(`
          <label class="list-group-item list-group-item-action p-1 m-0 cursor-pointer border-0 border-bottom">
            <div class="d-flex w-100 justify-content-between align-items-center">
               <div class="px-1 d-flex align-items-center gap-2">
                  <input type="checkbox" class="selectCheckbox" data-id="${i.id}" ${isChecked ? 'checked' : ''} />
                  <div>
                    <span style="font-weight:normal;" class="d-block text-sm">${i.name || i.text || i.label}</span>
                    ${i.testCount ? `<small class="text-muted">${i.testCount} tests included</small>` : ''}
                  </div>
               </div>
               <span class="fw-bold text-primary text-sm">₹${i.cost || 0}</span>
            </div>
          </label>
        `);
      });
    } else {
      $allTestArea.append('<div class="p-3 text-center text-muted small">No results found</div>');
    }
  }

  function renderLoading() {
    $allTestArea.empty().append(`
      <div class="d-flex justify-content-center align-items-center h-100 py-5">
        <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
        <span class="text-muted small">Loading...</span>
      </div>
    `);
  }

  // Checkbox Selection
  $allTestArea.on("change", ".selectCheckbox", function () {
    const id = $(this).data("id");
    const isChecked = $(this).is(":checked");
    if (isChecked) {
      const item = currentFetchedList.find((i) => i.id == id);
      if (item && !allTest.some(t => t.id == id)) {
        allTest.push({...item,type:selectedMode});
      }
    } else {
      allTest = allTest.filter((i) => i.id != id);
    }
    renderSelectedTest(allTest);
  });

  // Tab Buttons
  const $changetotest = $("#changetotest");
  const $changetopackage = $("#changetopackage");
  const $changetocategory = $("#changetocategory");

  function setActiveTab(btn) {
    $(".btn-group .btn").removeClass("active");
    btn.addClass("active");
  }

  $changetotest.on("click", function () {
    currentStart = 0;
    setActiveTab($(this));
    fetchLabData("test");
  });

  $changetopackage.on("click", function () {
    currentStart = 0;
    setActiveTab($(this));
    fetchLabData("package");
  });

  $changetocategory.on("click", function () {
    currentStart = 0;
    setActiveTab($(this));
    fetchLabData("category");
  });

  // Pagination Handlers
  $labNextBtn.on("click", function () {
    currentStart += pageSize;
    fetchLabData(selectedMode);
  });

  $labPrevBtn.on("click", function () {
    if (currentStart >= pageSize) {
      currentStart -= pageSize;
      fetchLabData(selectedMode);
    }
  });

  // Search local filtering
  $labSearchInput.on("input", function() {
    const term = $(this).val().toLowerCase();
    const filtered = currentFetchedList.filter(item => 
       (item.label || item.text || "").toLowerCase().includes(term)
    );
    renderTest(filtered);
  });

  function renderTopChips(categories) {
    $categoryArea.empty();
    if (categories && categories.length) {
      categories.forEach((i) => {
        $categoryArea.append(
          `<div data-id="${i.id}" role="button" class="badge bg-light text-custom fw-normal px-2 py-1 rounded-4 category-chips cursor-pointer border">${i.name || i.text || i.label}</div>`,
        );
      });
    }
  }

  // Remove Item
  $selectedTestArea.on("click", ".test-cancel", function () {
    const id = $(this).data("id");
    allTest = allTest.filter((i) => i.id != id);
    renderSelectedTest(allTest);
    // Uncheck in the list if currently displayed
    $allTestArea.find(`.selectCheckbox[data-id="${id}"]`).prop('checked', false);
  });

  // Category Chip Filtering (Mock behavior - since categories usually filter tests)
  $categoryArea.on("click", ".category-chips", function () {
    const id = $(this).data("id");
    // Usually this would call an API with ?category=id
    // For now, let's switch to Tests mode and filter (if possible) or just fetch
    $changetotest.click();
    // In a real app, this would be: fetchLabData("test", id);
  });

  $(document).ready(function () {
    // Initial fetch
    fetchLabData("test");
    renderSelectedTest(allTest);
  });

  // Save Lab Prescription
  $("#saveLab").on("click", function () {
    const $btn = $(this);
    if (allTest.length === 0) {
      const toast = new ToastComponent();
      toast.warning("Please select at least one lab item.");
      return;
    }

    // Loading state
    const originalHtml = $btn.html();
    $btn.prop("disabled", true).html('<span class="spinner-border spinner-border-sm me-2" role="status"></span>Saving...');

    // Prepare payload
    const today = new Date().toISOString().split("T")[0];
    const payload = {
      date: $("#dateFilter").val() || today,
      items: {}
    };

    allTest.forEach((item, index) => {
      payload.items[index.toString()] = {
        item_id: item.id.toString(),
        type: item.type,
        cost: (item.cost || 0).toString()
      };
    });

    console.log("Saving Lab Prescription Payload:", payload);

    $.ajax({
      url: `${apiBase}/singlepage_savelabprescription`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),
      success: function (response) {
        const toast = new ToastComponent();
        toast.success("Lab prescription saved successfully!");
        console.log("Lab Save Success:", response);
        
        // Optionally clear selection after successful save
        // allTest = [];
        // renderSelectedTest(allTest);
        // Reset checkboxes if visible
        $allTestArea.find(".selectCheckbox").prop("checked", false);
      },
      error: function (xhr) {
        const toast = new ToastComponent();
        toast.danger("Failed to save lab prescription.");
        console.error("Lab Save Error:", xhr);
      },
      complete: function() {
        // Restore button state
        $btn.prop("disabled", false).html(originalHtml);
      }
    });
  });
});

function renderLabTests(container, lablist) {
  if (lablist) {
    lablist.forEach((lab) => {
      let labItems = "";
      lab.list.forEach((l,index) => {
        console.log(l)
       labItems += ` 
       <tr>
          <td style="border:0px;" class="text-muted">
            ${index+1}
          </td>
          <td style="border:0px;min-width:200px;" class="fw-bold text-dark">
            ${l.name}
          </td>
          <td style="border:0px;" class="${l.isAbnormal ? "text-danger fw-bold" : "fw-bold"}">
            ${l.result} <small>${l.unit}</small>
          </td>
          <td style="border:0px;min-width:100px;" class="text-muted">
            ${l.referenceRange}
          </td>
          <td style="border:0px;min-width:50px;" class="text-end">
            <span class="${l.status ?  l.isAbnormal ? "badge bg-danger-subtle text-danger":"badge bg-success-subtle text-success" : ""}" style="font-size: 0.6rem;">
              ${l.status || "--"}
            </span>
          </td>
        </tr>`
      });
      container.append(
        `
        <div data-date="2025-11-14">
        <h6 class="fw-bold small text-custom mt-3">${lab.date}</h6>
          <div
          class="rounded-2 bg-white mb-2 shadow-sm filter-item"
          data-type="lab_report"
          
          style=""
        >
          <div class="card-body">
            <div class="d-flex justify-content-between align-item-center pb-2">
              <h6 class="fw-semibold text-custom">
                <i class="fas fa-microscope text-info me-2 text-custom"></i> Lab
                Investigation
              </h6>
            </div>
            <div class="content-container">
              <div class="html-view">
                <div class="table-responsive">
                  <table class="table table-sm table-hover mb-0">
                    <thead class="bg-light">
                      <tr style="font-size: 0.7rem;" class="text-muted">
                        <th style="border:0px;" class="fw-bold">
                          #
                        </th>
                        <th style="border:0px;" class="fw-bold">
                          TEST NAME
                        </th>
                        <th style="border:0px;" class="fw-bold">
                          RESULT
                        </th>
                        <th style="border:0px;" class="fw-bold">
                          REFERENCE
                        </th>
                        <th style="border:0px;" class="fw-bold text-end">
                          STATUS
                        </th>
                      </tr>
                    </thead>
                    <tbody style="font-size: 0.75rem;">${labItems}</tbody>
                  </table>
                </div>
              </div>
              <div class="card-view d-none"></div>
            </div>
          </div>
        </div>
        </div>
        `
      );
    });
  }
}
