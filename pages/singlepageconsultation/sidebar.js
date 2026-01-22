let showLeft = true;

let api = new ApiService("https://cloud.pappyjoe.com/api");

async function applyFilters() {
  const container = $(".content-area");
  container.empty();
  const activeFilter =
    $("#chipFilters .active-filter").data("filter") || "vitals";
  if (activeFilter == "vitals") {
    const apiVitalsData = await api.get("/singlepagevitallist");
    renderVitalsTable(container, apiVitalsData.results);
  }
  if (activeFilter == "notes") {
    const apiNotessData = await api.get("/singlepageclinicnoteslist");
    renderClinicalNotes(container, apiNotessData.results);
  }
}

function renderHistory() {
  const container = $(".content-area");
  container.empty();

  if (!historyData || historyData.length === 0) {
    container.append(`<p class="text-muted small">No history found.</p>`);
    return;
  }
  const vitalsData = [];
  const otherHistoryData = [];
  historyData.forEach((item) => {
    if (item.type === "vitals") {
      vitalsData.push(item);
    } else {
      otherHistoryData.push(item);
    }
  });

  if (vitalsData.length > 0) {
    renderVitalsTable(container, vitalsData);
    container.append('<hr class="my-4">');
  }

}

function renderOtherHistory(container, historyItems) {
  const grouped = historyItems.reduce((acc, item) => {
    (acc[item.date] = acc[item.date] || []).push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b) - new Date(a),
  );

  sortedDates.forEach((date) => {
    const label = formatDateGroupLabel(date);

    container.append(
      `<h6 class="fw-bold small text-custom mt-3">${label}</h6>`,
    );

    grouped[date].forEach((item, i) => {
      const iconHtml = item.icon
        ? `<i class="${item.icon} me-2 text-custom"></i>`
        : "";

      const extra = item.extra
        ? `<p class="small mb-1">Status: <span class="badge bg-info text-dark">${item.extra}</span></p>`
        : "";

      const time = item.time
        ? `<small class="text-custom">${item.time}</small>`
        : "";

      container.append(`
                <div class="${
                  item.type == "notes"
                    ? "rounded-2 bg-white mb-2 shadow-sm filter-item clinical-notes-container"
                    : "rounded-2 bg-white mb-2 shadow-sm filter-item"
                }"
                    data-type="${item.type}"
                    data-date="${item.date}"> 
                    <div class="card-body">
                    <div class="d-flex justify-content-between align-item-center pb-2">
                          <h6 class="fw-semibold text-custom">
                              ${iconHtml} ${item.title}
                          </h6>
                          ${
                            item.type == "notes"
                              ? `<button  class="btn text-success btn-sm toggle-view-btn" id="table-toggle-btn${i}"><i class="fas fa-table"></i></button>`
                              : ""
                          }
                          ${
                            item.type == "procedure"
                              ? `<button  class="btn text-primary btn-sm openAddProcedure"><i class="fas fa-file-medical"></i></button>`
                              : ""
                          }
                    </div>
                          <div class="content-container">
                            <div class="html-view">
                               ${item.html || ""}
                            </div>
                            <div class="card-view d-none">
                              ${item.card || ""}
                            </div>
                          </div>
                        ${extra}
                        ${time}
                    </div>
                </div>
            `);

      container
        .off("click", ".toggle-view-btn")
        .on("click", ".toggle-view-btn", function () {
          const $tableView = $(".clinical-notes-tables");
          const $cardView = $(".clinical-notes-container");

          if (clinicalNotesToggle) {
            $cardView.addClass("d-none");
            $tableView.removeClass("d-none");
          } else {
            $tableView.addClass("d-none");
            $cardView.removeClass("d-none");
          }
          clinicalNotesToggle = !clinicalNotesToggle;
        });
    });
  });
}

function formatDateGroupLabel(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function getUniqueDates() {
  if (typeof historyData === "undefined" || historyData.length === 0) {
    return [];
  }
  const uniqueDates = [...new Set(historyData.map((item) => item.date))];
  return uniqueDates.sort((a, b) => new Date(b) - new Date(a));
}

function populateDateFilter() {
  const $select = $("#dateFilter");
  $select.empty();
  $select.append(`<option value="all">-- Select All Dates --</option>`);
  const uniqueDates = getUniqueDates();
  console.log("uniqueDates => ", uniqueDates);
  uniqueDates.forEach((dateString) => {
    const displayLabel = formatDateGroupLabel(dateString);
    $select.append(`<option value="${dateString}">${displayLabel}</option>`);
  });
}

$("#toggleAside").on("click", function () {
  if (showLeft) {
    $("#asideMenu").removeClass("aside-hidden");
    $("#asideSideBar").addClass("aside-hidden");
    $("#asideSideBar").removeClass(
      "col-md-2 col-lg-2 border border-top-0 border-bottom-0 p-3 sidebar hide-scrollbar",
    );
    $("#asideMenu").addClass(
      "col-md-2 col-lg-2 border border-top-0 border-bottom-0 p-3 sidebar hide-scrollba",
    );
  } else {
    $("#asideSideBar").removeClass("aside-hidden");
    $("#asideSideBar").addClass(
      "col-md-2 col-lg-2 border border-top-0 border-bottom-0 p-3 sidebar hide-scrollbar",
    );
    $("#asideMenu").removeClass(
      "col-md-2 col-lg-2 border border-top-0 border-bottom-0 p-3 sidebar hide-scrollbar",
    );
    $("#asideMenu").addClass("aside-hidden");
  }

  showLeft = !showLeft; // flip the switch
});
