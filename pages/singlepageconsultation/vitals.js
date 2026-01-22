$(function () {
  // Allergy add/remove
  $("#addAllergy").on("click", function (e) {
    e.preventDefault();
    $("#allergyList").append(
      '<div class="input-group mb-2 allergy-row">< + """>',
    );
  });

  const $allergyContainer = $("#pAllergies");

  let addAllergies = ["Penicillin", "Food allergy"];

  function addAllergyRow(value, index) {
    var row = $('<div class="input-group mb-2 allergy-row col-md-2 col-lg-2">')
      .append(
        $(
          `<input type="text" data-index="${index}" class="form-control rounded-start-4 input-style allergyinput">`,
        )
          .val(value || "")
          .on("change", function () {
            addAllergies[$(this).data("index")] = $(this).val();
            $allergyContainer.empty();
            addAllergies.forEach((allergy, i) => {
              $allergyContainer.append(
                `<span class="text-danger text-sm">${allergy}${
                  i < addAllergies.length - 1 ? "," : ""
                } </span>`,
              );
            });
          }),
      )
      .append(
        $('<div class="input-group-append">').append(
          $(
            `<button data-index="${index}" style="padding: 0px 8px" class="btn btn-outline-danger btn-remove-allergy rounded-end-4" type="button"><i class="fas fa-times"></i></button>`,
          ),
        ),
      );
    $("#allergyList").append(row);
  }

  function appendAllergy(allergy, index) {
    $allergyContainer.append(
      `<span class="text-danger text-sm">${allergy}${
        index < addAllergies.length - 1 ? "," : ""
      } </span>`,
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
          },
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
          },
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
        `<div id="${chartId}" style="width:${chartWidth}px; height:${chartHeight}px; border: 1px solid #eee; border-radius: 4px; padding: 5px;"></div>`,
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
      },
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
      },
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
  container.empty()
  const metricDefinitions = {
    temperature: {
      unit: " °C",
      color: "#ffc107",
      key: "temperature",
      header: "Temp (°C)",
    },
    height: {
      unit: " m",
      color: "#9933cc",
      key: "height",
      header: "Height (m)",
    },
    weight: {
      unit: " kg",
      color: "#17a2b8",
      key: "weight",
      header: "Weight (kg)",
    },
    sugar: {
      unit: " mg/dL",
      color: "#dc3545",
      key: "sugar",
      header: "Sugar (mg/dL)",
    },
    cholesterol: {
      unit: " mg/dL",
      color: "#28a745",
      key: "cholesterol",
      header: "Chol. (mg/dL)",
    },
    bp: { unit: "mmHg", color: "#007bff", key: "bp", header: "BP (mmHg)" },
    pulse: {
      unit: " bpm",
      color: "#f8684d",
      key: "pulse",
      header: "Pulse (bpm)",
    },
    spo2: { unit: " %", color: "#00bfa5", key: "spo2", header: "SpO2 (%)" },
    respiratoryRate: {
      unit: " /min",
      color: "#546e7a",
      key: "respiratoryRate",
      header: "RR (/min)",
    },
  };

  console.log("inside renderVitalsTable => ",vitals)

  if (vitals.vitals.length === 0) {
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
  const dateHeaders = vitals.vitals
    .map(
      (record) => `
        <th scope="col" class="text-start text-nowrap">
            ${record.date}
        </th>
    `,
    )
    .join("");

  const totalColumns = 1 + vitals.vitals.length + 1;
  let tableRows = "";

  console.clear();
  const latestTrendData = vitals.trendData;
  console.log("latestTrendData = > ", latestTrendData);

  vitals.heading.forEach((metricKey) => {
    const def = metricDefinitions[metricKey.key];
    console.log("def => ", def);
    const metricDataKey = def.key;
    let rowData = `<th scope="row" class="text-custom fw-semibold text-nowrap">${metricKey.title}</th>`;
    vitals.vitals.forEach((record, dateIndex) => {
      const value = String(record[metricKey.key] || "-").trim();
      rowData += `<td class="text-start fw-medium text-nowrap">${value}</td>`;
    });
    const dataExists =
      latestTrendData[metricDataKey] &&
      latestTrendData[metricDataKey].length > 0;
    let trendCell = `<td></td>`;

    if (dataExists) {
      const chartDiv = `<div id="sparkline-${metricDataKey}" style="display: inline-block; vertical-align: middle;"></div>`;
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

  if (container && container.append) {
    container.append(vitalsTableHtml);

    Object.keys(latestTrendData).forEach((key) => {
      const data = latestTrendData[key];

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

$(".classname").select2({
  placeholder: "Search Patient By Name, Phone, Email (Min 4 Characters)",
  ajax: {
    url: "url_insert",
    type: "post",
    dataType: "json",
    delay: 250,
    data: function (params) {
      return {
        searchTerm: params.term, // search term
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

const data = [
  {
    id: "7563790",
    text: "anish antony anakattil | Mob-53453534543 | Email-HARV416@pappyjoe.com | File No:- | Patient ID:-HARV416 | Address:-",
  },
  {
    id: "7525707",
    text: "vyasan | Mob-344354576745654 | Email-HARV415@pappyjoe.com | File No:- | Patient ID:-HARV415 | Address:-",
  },
  {
    id: "7525703",
    text: "jose k | Mob-56456546 | Email-HARV414@pappyjoe.com | File No:- | Patient ID:-HARV414 | Address:-",
  },
  {
    id: "7525698",
    text: "aravind | Mob-645645645 | Email-HARV413@pappyjoe.com | File No:- | Patient ID:-HARV413 | Address:-",
  },
  {
    id: "7452605",
    text: "manikandan | Mob-6465465465464 | Email-HARV412@pappyjoe.com | File No:- | Patient ID:-HARV412 | Address:- | Species-",
  },
  {
    id: "7450610",
    text: "Oreo | Mob-8281545632 | Email-HARV411@pappyjoe.com | File No:- | Patient ID:-HARV411 | Address:-Raj | Species-",
  },
  {
    id: "7450220",
    text: "ajmeer | Mob-65465464646 | Email-HARV409@pappyjoe.com | File No:- | Patient ID:-HARV409 | Address:-",
  },
  {
    id: "7447201",
    text: "Jaisalmeer | Mob-5235353454 | Email-HARV408@pappyjoe.com | File No:- | Patient ID:-HARV408 | Address:-",
  },
  {
    id: "7446702",
    text: "Anjuttan | Mob-7542134560 | Email-HARV406@pappyjoe.com | File No:- | Patient ID:-HARV406 | Address:-Kochi",
  },
  {
    id: "7446623",
    text: "Aardha | Mob-8454621347 | Email-HARV405@pappyjoe.com | File No:- | Patient ID:-HARV405 | Address:-vengoor",
  },
];
