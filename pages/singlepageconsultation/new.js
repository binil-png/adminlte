$(function () {
  // Files
  $("#fileInput").on("change", function () {
    $("#fileList").empty();
    Array.from(this.files).forEach(function (f, i) {
      $("#fileList").append(
        "<li>" +
          f.name +
          ' <button data-index="' +
          i +
          '" class="btn btn-sm btn-link btn-remove-file">Remove</button></li>'
      );
    });
  });

  $(document).on("click", ".btn-remove-file", function () {
    $(this).parent().remove();
  });

  //---------------------- chip filter function ------------------------------------------------

  function attachVitalsHoverEvents() {
    // We are now targeting the main vitals card wrapper (.filter-item)
    const $vitalsItems = $('.filter-item[data-type="vitals"]');

    // Define properties for each metric, crucial for creating separate graphs
    const metricDefinitions = {
      // ID must match the key in graphData
      temperature: {
        title: "Temperature Trend",
        unit: " °C",
        color: "#ffc107", // Yellow
      },
      weight: {
        title: "Weight Trend",
        unit: " kg",
        color: "#17a2b8", // Cyan
      },
      bloodSugar: {
        title: "Blood Sugar Trend",
        unit: " mg/dL",
        color: "#dc3545", // Red
      },
      bp: {
        title: "BP Trend (Systolic/Diastolic)",
        unit: " mmHg",
        color: "#007bff", // Blue
      },
      cholesterol: {
        title: "Cholesterol Trend",
        unit: " mg/dL",
        color: "#28a745", // Green
      },
    };

    $vitalsItems.on({
      // 1. Mouse Enter (Show FIVE Separate Graphs)
      mouseenter: function () {
        const $this = $(this);

        try {
          // MOCK DATA: Using hardcoded data
          const graphData = $vitalsItems.first().data("graph-record");
          const cardOffset = $this.offset();
          const cardWidth = $this.outerWidth();
          const chartSpacing = 10;
          let currentLeft = cardOffset.left + cardWidth + chartSpacing;
          $("body").find(".vitals-popover-single").remove();
          Object.keys(metricDefinitions).forEach((key, index) => {
            const def = metricDefinitions[key];
            const data = graphData[key];
            let seriesConfig = [];

            // --- Handle Multi-Series Data (BP & Cholesterol) ---
            if (key === "bp") {
              const systolicData = data.map((point) => point[0]);
              const diastolicData = data.map((point) => point[1]);
              seriesConfig.push(
                {
                  name: "Systolic",
                  data: systolicData,
                  color: def.color,
                  type: "line",
                  dashStyle: "Solid",
                },
                {
                  name: "Diastolic",
                  data: diastolicData,
                  color: def.color,
                  type: "line",
                  dashStyle: "Dot",
                }
              );
            } else if (key === "cholesterol") {
              const totalData = data.map((point) => point[0]);
              const ldlData = data.map((point) => point[1]);
              const hdlData = data.map((point) => point[2]);
              seriesConfig.push(
                {
                  name: "Total",
                  data: totalData,
                  color: "#28a745",
                  type: "line",
                  dashStyle: "Solid",
                },
                {
                  name: "LDL",
                  data: ldlData,
                  color: "#dc3545",
                  type: "line",
                  dashStyle: "Dash",
                },
                {
                  name: "HDL",
                  data: hdlData,
                  color: "#007bff",
                  type: "line",
                  dashStyle: "Dot",
                }
              );
            } else {
              seriesConfig.push({
                name: def.title.replace(" Trend", ""),
                data: data,
                color: def.color,
              });
            }
            const popoverId = "vitals-popover-single-" + key;
            const $popover = $(
              `<div id="${popoverId}" class="vitals-popover-single"></div>`
            );
            const chartWidth = 250;
            const chartHeight = 200;

            $popover.css({
              position: "absolute",
              top: cardOffset.top, // Align with the top of the card
              left: currentLeft, // Position next to the previous chart/card
              zIndex: 1000,
              width: chartWidth + "px",
              height: chartHeight + "px",
              backgroundColor: "#fff",
              border: "1px solid " + def.color, // Use metric color for border
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              padding: "10px",
            });

            $("body").append($popover);
            currentLeft += chartWidth + chartSpacing;
            Highcharts.chart($popover[0], {
              chart: {
                type: "line",
                margin: [40, 10, 30, 40],
                height: chartHeight - 20,
                width: chartWidth - 20,
                backgroundColor: null,
              },

              title: {
                text: def.title,
                align: "center",
                style: {
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: def.color,
                },
                y: 10,
              },

              credits: { enabled: false },
              yAxis: {
                title: {
                  text: def.unit.trim(),
                  style: { color: def.color, fontSize: "9px" },
                },
                labels: {
                  format: `{value}${def.unit}`,
                  style: { color: def.color, fontSize: "9px" },
                },
                visible: true,
                opposite: false,
              },
              xAxis: {
                visible: true,
                labels: { enabled: false },
                gridLineWidth: 0,
              },
              legend: {
                enabled: key === "bp" || key === "cholesterol",
                align: "center",
                verticalAlign: "top",
                layout: "horizontal",
                y: 20,
                itemStyle: { fontSize: "9px" },
              },

              tooltip: {
                enabled: true,
                shared: false,
                formatter: function () {
                  return `<b>${this.series.name}:</b> ${this.y} ${def.unit}`;
                },
              },

              plotOptions: {
                series: {
                  marker: { enabled: true, radius: 2 },
                  lineWidth: 1.5,
                  enableMouseTracking: true,
                },
              },
              series: seriesConfig,
            });
          });
        } catch (e) {
          console.error("Error creating separate vital charts:", e);
          $("body").find(".vitals-popover-single").remove();
        }
      },
      mouseleave: function () {
        $("body").find(".vitals-popover-single").remove();
      },
    });
  }

  function formatDateGroupLabel(dateStr) {
    const today = new Date();
    const date = new Date(dateStr);

    const isToday = date.toDateString() === today.toDateString();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return dateStr.split("-").reverse().join("-"); // dd-mm-yyyy
  }

  function renderHistory() {
    const container = $(".content-area");
    container.empty();

    if (!historyData || historyData.length === 0) {
      container.append(`<p class="text-muted small">No history found.</p>`);
      return;
    }

    // --- 1. SEPARATE VITAL ITEMS FROM OTHER HISTORY ITEMS ---
    const vitalsData = [];
    const otherHistoryData = [];

    historyData.forEach((item) => {
      if (item.type === "vitals") {
        vitalsData.push(item);
      } else {
        otherHistoryData.push(item);
      }
    });

    // --- 2. RENDER THE VITALS TABLE (SINGLE COMPONENT) ---
    if (vitalsData.length > 0) {
      renderVitalsTable(container, vitalsData);
      container.append('<hr class="my-4">'); // Separator
    }

    // --- 3. RENDER THE REMAINING HISTORY ITEMS (GROUPED) ---
    renderOtherHistory(container, otherHistoryData);

    // Attach hover events if necessary (targeting the main vitals table)
    attachVitalsHoverEvents();
  }

  function renderOtherHistory(container, historyItems) {
    // Group by date
    const grouped = historyItems.reduce((acc, item) => {
      (acc[item.date] = acc[item.date] || []).push(item);
      return acc;
    }, {});

    const sortedDates = Object.keys(grouped).sort(
      (a, b) => new Date(b) - new Date(a)
    );

    sortedDates.forEach((date) => {
      const label = formatDateGroupLabel(date);

      container.append(
        `<h6 class="fw-bold small text-custom mt-3">${label}</h6>`
      );

      grouped[date].forEach((item) => {
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
                <div class="rounded-2 bg-white mb-2 shadow-sm filter-item"
                    data-type="${item.type}"
                    data-date="${item.date}"> 
                    <div class="card-body">
                        <h6 class="fw-semibold text-custom">
                            ${iconHtml} ${item.title}
                        </h6>
                        ${item.html || ""}
                        ${extra}
                        ${time}
                    </div>
                </div>
            `);
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

  function renderVitalsTable(container, vitals) {
    const consolidatedVitals = vitals.map((item) => {
      // --- 1. DIRECTLY ACCESS DATA FROM vitalData ---
      const v = item.vitalData;

      // Time is currently intentionally left blank based on your code
      const time = "";

      return {
        date: item.date,
        time: time,
        // Map vitalData properties to the table column keys
        Temperature: v.temperature, // String, e.g., "41.2"
        Height: v.height, // NEW: String, e.g., "1.75 "
        Weight: v.weight, // NEW: String, e.g., "75.5"
        Sugar: v.glucose, // String, e.g., "125"
        Cholesterol: v.cholesterol, // String, e.g., "205"
        BP: v.bp, // String, e.g., "120/80"
        Pulse: v.pulse,
        SpO2: v.spo2,
        "Respiratory Rate": v.respiration,
        trendData: item.trendData || {},
      };
    });

    // Convert the consolidated object into an array and sort by date descending
    const tableData = consolidatedVitals.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // --- 2. GENERATE TABLE ROWS ---
    let tableRows = "";

    // UPDATED: Added 'Height' and 'Weight' to the metric order
    const metricOrder = [
      "Temperature",
      "Height", // NEW
      "Weight", // NEW
      "Sugar",
      "Cholesterol",
      "BP",
      "Pulse",
      "SpO2",
      "Respiratory Rate",
    ];

    // Total number of columns in the <tbody> is 1 (Date/Time) + 9 (Metrics) = 10
    const totalColumns = metricOrder.length + 1;

    tableData.forEach((record) => {
      let rowData = "";

      // Date/Time column
      rowData += `
        <td class="small text-muted text-nowrap">
          <span class="fw-semibold">${formatDateGroupLabel(record.date)}</span>
          <div class="text-xs">${record.time}</div>
        </td>
      `;

      // Metric columns in the desired order
      metricOrder.forEach((metricKey) => {
        // Ensure that the output is safe/trimmed, especially for height which has a trailing space
        const value = String(record[metricKey] || "-").trim();

        // Use 'RR' for 'Respiratory Rate' in the table header, but map the value here
        rowData += `<td class="text-center fw-medium">${value}</td>`;
      });

      tableRows += `<tr>${rowData}</tr>`;
    });

    // If there is any data, pull the trend data from the latest record
    const combinedTrendData =
      tableData.length > 0 ? tableData[0].trendData : {};
    const graphDataAttr = `data-graph-record='${JSON.stringify(
      combinedTrendData
    )}'`;

    // --- 3. BUILD THE HTML TABLE COMPONENT ---
    const vitalsTableHtml = `
        <h6 class="fw-bold small text-custom mt-3">Vitals History Summary</h6>
        <div class="rounded-2 bg-white mb-2 shadow-sm filter-item cursor-pointer" 
             data-type="vitals" 
             ${graphDataAttr} 
             id="vitals-summary-table">
            <div class="card-body p-2">
                <div class="table-responsive">
                    <table class="table table-sm table-striped mb-0 small">
                        <thead>
                            <tr class="text-custom">
                                <th scope="col" class="text-start">Date</th>
                                <th scope="col" class="text-center">Temp °C</th>
                                <th scope="col" class="text-center">Height m</th>
                                <th scope="col" class="text-center">Weight kg</th>
                                <th scope="col" class="text-center">Sugar </th>
                                <th scope="col" class="text-center">Chol.</th>
                                <th scope="col" class="text-center">BP</th>
                                <th scope="col" class="text-center">Pulse</th>
                                <th scope="col" class="text-center">SpO2</th>
                                <th scope="col" class="text-center">RR</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${
                              tableRows ||
                              `<tr><td colspan="${totalColumns}" class="text-center text-muted">No Vitals Records Found.</td></tr>`
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    // Ensure container exists before attempting to append
    if (container && container.append) {
      container.append(vitalsTableHtml);
    } else {
      console.error("Container element is invalid or missing 'append' method.");
    }
  }

  renderHistory();

  function applyFilters() {
    const activeFilter = $("#chipFilters .active-filter").data("filter");
    const selectedDate = $("#dateFilter").val();

    $(".filter-item")
      .hide()
      .filter(function () {
        const typeMatch =
          activeFilter === "all" || $(this).data("type") === activeFilter;
        const dateMatch =
          !selectedDate || $(this).data("date") === selectedDate;

        return typeMatch && dateMatch;
      })
      .show();
  }

  $("#chipFilters span").click(function () {
    $("#chipFilters span")
      .removeClass("bg-dark text-white active-filter")
      .addClass("border text-muted");
    $(this)
      .removeClass("border text-muted")
      .addClass("bg-dark text-white active-filter");
    applyFilters();
  });

  $("#dateFilter").on("change", applyFilters);

  let selectedTeeth = [];

  $(".tooth-item").on("click", function () {
    const tooth = $(this).data("tooth");

    if (selectedTeeth.includes(tooth)) {
      selectedTeeth = selectedTeeth.filter((t) => t !== tooth);
      $(this).removeClass("badge-primary text-white");
    } else {
      selectedTeeth.push(tooth);
      $(this).addClass("badge-primary text-white");
    }

    $("#selectedTeethPreview").text(
      selectedTeeth.length ? selectedTeeth.join(", ") : "None"
    );
  });

  $(document).ready(function () {
    let allFiles = [];

    // Show input area
    $("#showFileArea").click(function () {
      $("#fileInputArea").removeClass("d-none");
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

      // send using fetch → uncomment when backend ready
      // fetch("/upload-url", { method: "POST", body: formData });
    });
  });

  let showLeft = true;

  $("#toggleAside").on("click", function () {
    if (showLeft) {
      $("#asideMenu").removeClass("aside-hidden");
      $("#asideSideBar").addClass("aside-hidden");
      $("#asideSideBar").removeClass(
        "col-md-2 col-lg-2 border border-top-0 border-bottom-0 p-3 sidebar hide-scrollbar"
      );
      $("#asideMenu").addClass(
        "col-md-2 col-lg-2 border border-top-0 border-bottom-0 p-3 sidebar hide-scrollba"
      );
    } else {
      $("#asideSideBar").removeClass("aside-hidden");
      $("#asideSideBar").addClass(
        "col-md-2 col-lg-2 border border-top-0 border-bottom-0 p-3 sidebar hide-scrollbar"
      );
      $("#asideMenu").removeClass(
        "col-md-2 col-lg-2 border border-top-0 border-bottom-0 p-3 sidebar hide-scrollbar"
      );
      $("#asideMenu").addClass("aside-hidden");
    }

    showLeft = !showLeft; // flip the switch
  });
  $("#asideMenu").addClass("aside-hidden");
  $("#asideMenu").removeClass(
    "col-md-2 col-lg-2 border border-top-0 border-bottom-0 p-3 sidebar hide-scrollbar"
  );
});
