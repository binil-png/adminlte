$(function () {
  // Allergy add/remove
  $("#addAllergy").on("click", function (e) {
    e.preventDefault();
    $("#allergyList").append(
      '<div class="input-group mb-2 allergy-row">< + """>'
    );
  });

  const $allergyContainer = $("#pAllergies");

  let addAllergies = ["Penicillin", "Food allergy"];

  function addAllergyRow(value, index) {
    var row = $('<div class="input-group mb-2 allergy-row col-md-2 col-lg-2">')
      .append(
        $(
          `<input type="text" data-index="${index}" class="form-control rounded-start-4 input-style allergyinput">`
        )
          .val(value || "")
          .on("change", function () {
            addAllergies[$(this).data("index")] = $(this).val();
            $allergyContainer.empty();
            addAllergies.forEach((allergy, i) => {
              $allergyContainer.append(
                `<span class="text-danger text-sm">${allergy}${
                  i < addAllergies.length - 1 ? "," : ""
                } </span>`
              );
            });
          })
      )
      .append(
        $('<div class="input-group-append">').append(
          $(
            `<button data-index="${index}" style="padding: 0px 8px" class="btn btn-outline-danger btn-remove-allergy rounded-end-4" type="button"><i class="fas fa-times"></i></button>`
          )
        )
      );
    $("#allergyList").append(row);
  }

  function appendAllergy(allergy, index) {
    $allergyContainer.append(
      `<span class="text-danger text-sm">${allergy}${
        index < addAllergies.length - 1 ? "," : ""
      } </span>`
    );
  }

  function renderallergies() {
    $allergyContainer.empty();
    $("#allergyList").empty();
    if (addAllergies.length) {
      addAllergies.forEach((allergy, i) => {
        appendAllergy(allergy, i);
        addAllergyRow(allergy, i);
      });
    } else {
      $allergyContainer.append(`<span class="text-muted small">None</span>`);
    }
  }

  renderallergies();

  $("#addAllergy")
    .off("click")
    .on("click", function (e) {
      e.preventDefault();
      addAllergies.push("");
      renderallergies();
    });

  $(document).on("click", ".btn-remove-allergy", function () {
    const index = $(this).data("index");
    $(this).closest(".allergy-row").remove();
    $allergyContainer.empty();
    addAllergies = addAllergies.filter((a, i) => i != index);
    addAllergies.forEach((allergy, i) => {
      appendAllergy(allergy, i);
    });
  });

  $("#saveVitals").click(function () {
    const vitals = getVitalsFormData();
    console.log("Vitals Saved:", vitals);
  });

  function getVitalsFormData() {
    const form = $("#vitalsForm");

    return {
      temperature: form.find("input[name='temp']").val(),
      height: form.find("input[name='height']").val(),
      weight: form.find("input[name='weight']").val(),

      bp: {
        systolic: form.find("input[name='bp']").eq(0).val(),
        diastolic: form.find("input[name='bp']").eq(1).val(),
        position: form.find("select").val(),
      },

      glucose: form.find("input[placeholder='Enter blood glucose']").val(),
      pulse: form.find("input[placeholder='Enter pulse']").val(),
      cholesterol: form.find("input[placeholder='Enter cholesterol']").val(),
      spo2: form.find("input[placeholder='Enter SPO2']").val(),
      respiratoryRate: form
        .find("input[placeholder='Enter respiratory rate']")
        .val(),
    };
  }

  function setVitalsFormData(data) {
    const form = $("#vitalsForm");

    form.find("input[name='temp']").val(data.temperature);
    form.find("input[name='height']").val(data.height);
    form.find("input[name='weight']").val(data.weight);

    form.find("input[name='bp']").eq(0).val(data.bp.systolic);
    form.find("input[name='bp']").eq(1).val(data.bp.diastolic);
    form.find("select").val(data.bp.position);

    form.find("input[placeholder='Enter blood glucose']").val(data.glucose);
    form.find("input[placeholder='Enter pulse']").val(data.pulse);
    form.find("input[placeholder='Enter cholesterol']").val(data.cholesterol);
    form.find("input[placeholder='Enter SPO2']").val(data.spo2);
    form
      .find("input[placeholder='Enter respiratory rate']")
      .val(data.respiratoryRate);
  }

  $(document).ready(function () {
    setVitalsFormData(mockVitals);
  });
});

function renderVitalsTrendCharts(containerElement, graphData) {
  if (
    !containerElement ||
    Object.keys(graphData).length === 0 ||
    containerElement.hasChildNodes()
  ) {
    return;
  }
  const metricDefinitions = {
    temperature: { title: "Temperature", unit: " °C", color: "#ffc107" },
    weight: { title: "Weight", unit: " kg", color: "#17a2b8" },
    bloodSugar: {
      title: "Blood Sugar",
      unit: " mg/dL",
      color: "#dc3545",
    },
    bp: {
      title: "BP (Systolic/Diastolic)",
      unit: " mmHg",
      color: "#007bff",
    },
    cholesterol: {
      title: "Cholesterol",
      unit: " mg/dL",
      color: "#28a745",
    },
  };

  const chartWidth = 280;
  const chartHeight = 180;

  try {
    Object.keys(metricDefinitions).forEach((key) => {
      const def = metricDefinitions[key];
      const data = graphData[key];
      let seriesConfig = [];

      if (!data || data.length === 0) return;
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
            color: "#4d94ff",
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
      const chartId = "vitals-chart-" + key;
      const $chartDiv = $(
        `<div id="${chartId}" style="width:${chartWidth}px; height:${chartHeight}px; border: 1px solid #eee; border-radius: 4px; padding: 5px;"></div>`
      );

      $(containerElement).append($chartDiv);
      Highcharts.chart(chartId, {
        chart: {
          type: "line",
          margin: [40, 10, 30, 40],
          height: chartHeight - 10,
          width: chartWidth - 10,
          backgroundColor: null,
        },

        title: {
          text: def.title,
          align: "center",
          style: { fontSize: "11px", fontWeight: "bold", color: def.color },
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
    console.error("Error creating static vital charts:", e);
  }
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

function renderInlineSparkline(containerId, data, color, unit) {
  if (!data || data.length === 0) return; // Use a minimal, fixed height/width for sparklines

  const sparklineHeight = 30;
  const sparklineWidth = 80; // Ensure data is flat (not nested arrays like BP/Cholesterol)

  const flatData = Array.isArray(data[0])
    ? data.map((point) => point[0])
    : data;

  Highcharts.chart(containerId, {
    chart: {
      type: "line",
      margin: [2, 0, 2, 0], // Minimal margin
      height: sparklineHeight,
      width: sparklineWidth,
      backgroundColor: null,
      style: { overflow: "visible" },
    },
    title: { text: null }, // No title
    credits: { enabled: false }, // No credits
    legend: { enabled: false }, // No legend
    exporting: { enabled: false }, // No exporting button

    xAxis: {
      visible: false, // Hide X axis
      labels: { enabled: false },
      gridLineWidth: 0,
      lineWidth: 0,
      tickLength: 0,
    },
    yAxis: {
      visible: false, // Hide Y axis
      labels: { enabled: false },
      title: { text: null },
      gridLineWidth: 0,
    },
    tooltip: {
      enabled: true, // Keep tooltip for detail on hover
      headerFormat: "", // Hide header
      pointFormat: `{point.y}${unit}`, // Show only value + unit
      valueDecimals: 1, // Position the tooltip to prevent disruption
      positioner: function (w, h, point) {
        return { x: point.plotX + 10, y: point.plotY - 10 };
      },
    },
    plotOptions: {
      series: {
        marker: { enabled: false }, // Hide markers
        lineWidth: 1, // Thin line
        enableMouseTracking: true,
        states: { hover: { lineWidth: 1.5 } },
      },
    },
    series: [
      {
        data: flatData,
        color: color,
        name: containerId.split("-")[1], // Generic name for tooltip fallback
        zIndex: 1,
      },
    ],
  });
}

function renderMultiSeriesSparkline(containerId, data, definitions) {
  if (!data || data.length === 0) return;

  const sparklineHeight = 30;
  const sparklineWidth = 80;
  const unit = definitions.unit;

  let seriesConfig = [];
  let tooltipFormat = ""; // BP: Systolic (0) and Diastolic (1)

  if (containerId.includes("bp")) {
    seriesConfig.push(
      {
        name: "Systolic",
        data: data.map((point) => point[0]),
        color: definitions.color,
        dashStyle: "Solid",
      },
      {
        name: "Diastolic",
        data: data.map((point) => point[1]),
        color: "#4d94ff",
        dashStyle: "Dot",
      }
    );
    tooltipFormat = "<b>S:</b> {point.y:.0f} | <b>D:</b> {point.y:.0f}";
  } // Cholesterol: Total (0), LDL (1), HDL (2)
  else if (containerId.includes("cholesterol")) {
    seriesConfig.push(
      {
        name: "Total",
        data: data.map((point) => point[0]),
        color: "#28a745",
        dashStyle: "Solid",
      },
      {
        name: "LDL",
        data: data.map((point) => point[1]),
        color: "#dc3545",
        dashStyle: "Dash",
      },
      {
        name: "HDL",
        data: data.map((point) => point[2]),
        color: "#007bff",
        dashStyle: "Dot",
      }
    );
    tooltipFormat = "<b>{series.name}:</b> {point.y:.0f}";
  } else {
    return;
  }

  Highcharts.chart(containerId, {
    chart: {
      type: "line",
      margin: [2, 0, 2, 0],
      height: sparklineHeight,
      width: sparklineWidth,
      backgroundColor: null,
      style: { overflow: "visible" },
    },
    title: { text: null },
    credits: { enabled: false },
    legend: { enabled: false },
    exporting: { enabled: false },
    xAxis: {
      visible: false,
      labels: { enabled: false },
      gridLineWidth: 0,
      lineWidth: 0,
      tickLength: 0,
    },
    yAxis: {
      visible: false,
      labels: { enabled: false },
      title: { text: null },
      gridLineWidth: 0,
    },
    tooltip: {
      enabled: true,
      shared: true, // Important for showing all series data
      headerFormat: '<span style="font-size: 8px">Latest:</span><br/>',
      pointFormat: tooltipFormat + unit + "<br/>",
      valueDecimals: 0,
      positioner: function (w, h, point) {
        return { x: point.plotX + 10, y: point.plotY - 10 };
      },
    },
    plotOptions: {
      series: {
        marker: { enabled: false },
        lineWidth: 1,
        enableMouseTracking: true,
        states: { hover: { lineWidth: 1.5 } },
      },
    },
    series: seriesConfig,
  });
}

function renderVitalsTable(container, vitals) {
  const consolidatedVitals = vitals.map((item) => {
    const v = item.vitalData;
    return {
      date: item.date,
      time: "", // Assuming time is not strictly needed for this pivot view
      Temperature: v.temperature,
      Height: v.height,
      Weight: v.weight,
      Sugar: v.glucose,
      Cholesterol: v.cholesterol,
      BP: v.bp,
      Pulse: v.pulse,
      SpO2: v.spo2,
      "Respiratory Rate": v.respiration,
      trendData: item.trendData || {},
    };
  });

  // 1. Sort the data by date (most recent first)
  const sortedData = consolidatedVitals.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 2. Define Metrics and Mapping for display/rendering
  const metricDefinitions = {
    Temperature: {
      unit: " °C",
      color: "#ffc107",
      key: "temperature",
      header: "Temp (°C)",
    },
    Height: {
      unit: " m",
      color: "#9933cc",
      key: "height",
      header: "Height (m)",
    },
    Weight: {
      unit: " kg",
      color: "#17a2b8",
      key: "weight",
      header: "Weight (kg)",
    },
    Sugar: {
      unit: " mg/dL",
      color: "#dc3545",
      key: "bloodSugar",
      header: "Sugar (mg/dL)",
    },
    Cholesterol: {
      unit: " mg/dL",
      color: "#28a745",
      key: "cholesterol",
      header: "Chol. (mg/dL)",
    },
    BP: { unit: " mmHg", color: "#007bff", key: "bp", header: "BP (mmHg)" },
    Pulse: {
      unit: " bpm",
      color: "#f8684d",
      key: "pulse",
      header: "Pulse (bpm)",
    },
    SpO2: { unit: " %", color: "#00bfa5", key: "spo2", header: "SpO2 (%)" },
    "Respiratory Rate": {
      unit: " /min",
      color: "#546e7a",
      key: "respiratoryrate",
      header: "RR (/min)",
    },
  };
  const metricOrder = Object.keys(metricDefinitions);

  if (sortedData.length === 0) {
    // Handle no data case
    const noDataHtml = `<h6 class="fw-bold small text-custom mt-3">Vitals History Summary</h6>
                            <div class="rounded-2 bg-white mb-2 shadow-sm filter-item p-2">
                                <p class="text-center text-muted mb-0">No Vitals Records Found.</p>
                            </div>`;
    if (container && container.append) {
      container.append(noDataHtml);
    }
    return;
  }

  // 3. Generate Table Headers (Dates)
  const dateHeaders = sortedData
    .map(
      (record) => `
        <th scope="col" class="text-start text-nowrap">
            ${formatDateGroupLabel(record.date)}
        </th>
    `
    )
    .join("");

  const totalColumns = 1 + sortedData.length + 1;
  let tableRows = "";
  const latestTrendData = sortedData[0].trendData;

  metricOrder.forEach((metricKey) => {
    const def = metricDefinitions[metricKey];
    const metricDataKey = def.key;
    let rowData = `<th scope="row" class="text-custom fw-semibold text-nowrap">${def.header}</th>`;
    sortedData.forEach((record, dateIndex) => {
      const value = String(record[metricKey] || "-").trim();
      rowData += `<td class="text-start fw-medium text-nowrap">${value}</td>`;
    });
    const dataExists =
      latestTrendData[metricDataKey] &&
      latestTrendData[metricDataKey].length > 0;
    let trendCell = `<td></td>`;

    if (dataExists) {
      const chartDiv = `<div id="sparkline-${metricDataKey}" 
                                   style="display: inline-block; vertical-align: middle;"></div>`;
      trendCell = `<td>${chartDiv}</td>`;
    }

    tableRows += `<tr>${rowData}${trendCell}</tr>`;
  });
  const vitalsTableHtml = `
        <h6 class="fw-bold small text-custom mt-3">Vitals History (Date Columns)</h6>
        <div class="rounded-2 bg-white mb-2 shadow-sm filter-item" 
             data-type="vitals" 
             id="vitals-summary-table-pivot">
            <div class="card-body p-2">
                <div class="table-responsive rounded">
                    <table class="table rounded table-sm mb-0 small">
                        <thead>
                            <tr class="text-custom">
                                <th scope="col" class="text-start">Metric</th>
                                ${dateHeaders}
                                <th scope="col" class=""></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
                 <div class="d-flex justify-content-end align-items-center pt-2">
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
        </div>
    `;

  // 6. Append and Render Charts
  if (container && container.append) {
    container.append(vitalsTableHtml);

    // --- SPARKLINES RENDERING LOOP ---
    // Charts use the latestTrendData which corresponds to the first date column.
    Object.keys(latestTrendData).forEach((key) => {
      const data = latestTrendData[key];

      // Find the definition for color/unit
      const def = Object.values(metricDefinitions).find((d) => d.key === key);
      const containerId = `sparkline-${key}`;

      if (data && data.length > 0 && def) {
        if (key === "bp" || key === "cholesterol") {
          renderMultiSeriesSparkline(containerId, data, def);
        } else {
          renderInlineSparkline(containerId, data, def.color, def.unit);
        }
      }
    });
  } else {
    console.error("Container element is invalid or missing 'append' method.");
  }
}
