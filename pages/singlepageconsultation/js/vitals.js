// Removed addAllergyRow as it's replaced by Select2 multi-select

function appendAllergy(container, allergy, index) {
  container.append(
    `<span class="text-danger text-sm">${allergy}${
      index < addAllergies.length - 1 ? "," : ""
    } </span>`,
  );
}

function renderallergies() {
  const $allergyContainer = $("#pAllergies");
  $allergyContainer.empty();
  
  if (addAllergies && addAllergies.length) {
    addAllergies.forEach((allergy, i) => {
      appendAllergy($allergyContainer, allergy, i);
    });
    // Sync Select2 if it's initialized
    if ($("#allergySearch").hasClass("select2-hidden-accessible")) {
      $("#allergySearch").val(addAllergies).trigger("change.select2");
    }
  } else {
    $allergyContainer.append(`<span class="text-muted small">None</span>`);
    if ($("#allergySearch").hasClass("select2-hidden-accessible")) {
      $("#allergySearch").val([]).trigger("change.select2");
    }
  }
}

$(function () {
  const toast = new ToastComponent();
  const vitalsapi = new SinglePageServices();
  $("#allergySearch").select2({
    theme: "bootstrap-4",
    placeholder: "Search or add allergies",
    allowClear: true,
    tags: true, // Allow adding new allergies
    multiple: true,
    ajax: {
      url: `${baseUrl}/singlepage_allergy`,
      dataType: "json",
      delay: 250,
      data: function (params) {
        return {
          searchterm: params.term,
        };
      },
      processResults: function (data) {
        return {
          results: data,
        };
      },
      cache: true,
    },
  }).on("change", function() {
    addAllergies = $(this).val() || [];
    const $allergyContainer = $("#pAllergies");
    $allergyContainer.empty();
    if (addAllergies.length) {
      addAllergies.forEach((allergy, i) => {
        appendAllergy($allergyContainer, allergy, i);
      });
    } else {
      $allergyContainer.append(`<span class="text-muted small">None</span>`);
    }
  });

  // Re-sync on modal open to be safe
  $("#allergyModal").on("shown.bs.modal", function() {
    $("#allergySearch").val(addAllergies).trigger("change.select2");
  });

  $("#saveAllergyChanges").on("click", async function() {
    const $btn = $(this);
    const originalText = $btn.html();
    const formData = new FormData();
    
    if (addAllergies && addAllergies.length > 0) {
      addAllergies.forEach(allergy => {
        formData.append("allergy[]", allergy);
      });
    }

    if (patientDataGlobal && patientDataGlobal.patientId) {
      formData.append("patient_id", patientDataGlobal.patientId);
    }

    $btn.prop("disabled", true).html('<span class="spinner-border spinner-border-sm me-2"></span> Saving...');

    try {
      const res = await vitalsapi.saveAllergyData(formData);
      console.log("Allergy Save Response:", res);
      
      // Check for common success indicators or a successful object returned
      if (res && !(res instanceof Error) && (res.status || res.success || res.results || res === "success" || res.status === "success")) {
        toast.success("Allergies updated successfully");
        $("#allergyModal").modal("hide");
      } else {
        const errorMsg = res && res.message ? res.message : "Failed to update allergies";
        toast.danger(errorMsg);
      }
    } catch (error) {
      console.error("Allergy Save Error:", error);
      toast.danger("An error occurred while saving allergies");
    } finally {
      $btn.prop("disabled", false).html(originalText);
    }
  });

  renderallergies();

  $("#saveVitals").click(async function () {
    const vitals = getVitalsFormData();
    console.log("Vitals Saved:", vitals);
    console.log("globalySelectedDoctor => ", globalySelectedDoctor);
    const formData = new FormData();
    if (globalySelectedDoctor) {
      formData.append("doctorId", globalySelectedDoctor);
    }
    for (let key in vitals) {
      formData.append(key, vitals[key]);
    }
    const res = await vitalsapi.saveVitalsData(formData);
    console.log("res => ", res);
    if (res.status) {
      toast.success(res.status);
    }
  });

  function getVitalsFormData() {
    const form = $("#vitalsForm");

    return {
      temperature: form.find("input[name='temperature']").val(),
      height: form.find("input[name='height']").val(),
      weight: form.find("input[name='weight']").val(),
      systolicBp: form.find("input[name='systolic']").val(),
      diastolicBp: form.find("input[name='diastolic']").val(),
      position: form.find("select[name='position']").val(),
      glucose: form.find("input[name='glucose']").val(),
      pulse: form.find("input[name='pulse']").val(),
      cholesterol: form.find("input[name='cholesterol']").val(),
      spo2: form.find("input[placeholder='spo2']").val(),
      respiratoryRate: form.find("input[name='respiratoryRate']").val(),
    };
  }

  function setVitalsFormData(data) {
    const form = $("#vitalsForm");
    form.find("input[name='temperature']").val(data.temperature);
    form.find("input[name='height']").val(data.height);
    form.find("input[name='weight']").val(data.weight);
    form.find("input[name='systolic']").val(data.bp.systolic);
    form.find("input[name='diastolic']").val(data.bp.diastolic);
    form.find("select[name='position']").val(data.bp.position);
    form.find("input[name='glucose']").val(data.glucose);
    form.find("input[name='pulse']").val(data.pulse);
    form.find("input[name='cholesterol']").val(data.cholesterol);
    form.find("input[name='spo2']").val(data.spo2);
    form.find("input[name='respiratoryRate']").val(data.respiratoryRate);
  }

  $(document).ready(function () {
    const preview = new PreviewComponent($("#vitalPreview"));
    let previewArray = [];
    let dataWithKey = {};
    let bp = {
      systolic: "",
      diastolic: "",
      position: "",
    };

    // Helper to update top summary strip
    window.updateTopSummary = function() {
      const temp = $("input[name='temperature']").val();
      const height = $("input[name='height']").val();
      const weight = $("input[name='weight']").val();
      const systolic = $("input[name='systolic']").val();
      const diastolic = $("input[name='diastolic']").val();
      const glucose = $("input[name='glucose']").val();
      const pulse = $("input[name='pulse']").val();
      const chol = $("input[name='cholesterol']").val();
      const spo2 = $("input[name='spo2']").val();
      const rr = $("input[name='respiratoryRate']").val();

      $("#topTemp").text(temp ? `${temp}°F` : "—");
      $("#topHtWt").text(height || weight ? `${height || "—"}m/${weight || "—"}kg` : "—");
      $("#topBP").text(systolic || diastolic ? `${systolic || "—"}/${diastolic || "—"}` : "—");
      $("#topGlucose").text(glucose ? `${glucose} mg` : "—");
      $("#topPulse").text(pulse ? `${pulse} bpm` : "—");
      $("#topChol").text(chol ? `${chol} mg` : "—");
      $("#topSPO2").text(spo2 ? `${spo2}%` : "—");
      $("#topRespRate").text(rr ? `${rr}/min` : "—");
    }

    $("#vitalsForm").on("input change", "input, select", function () {
      const fieldName = $(this).attr("name");
      const newValue = $(this).val();
      const displayName = $(this).data("preview");

      if (displayName == "BP (mmHg)") {
        bp[fieldName] = newValue;
        dataWithKey[fieldName] =
          `${displayName}: ${bp.systolic}/${bp.diastolic} ${bp.position}`;
      } else {
        dataWithKey[fieldName] = `${displayName}: ${newValue}`;
      }

      // Update accordion summary text
      previewArray = Object.entries(dataWithKey)
        .filter(([key, val]) => val.split(": ")[1]?.trim()) // Only show fields with values
        .map(([key, val]) => val);
      preview.data = previewArray;

      // Update top strip summary
      updateTopSummary();
    });
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
  if (vitals) {
    container.empty();
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

    if (vitals?.vitals?.length === 0) {
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
    const dateHeaders = vitals?.vitals
      .map(
        (record) => `
        <th scope="col" class="text-start text-nowrap">
            ${record.date}
        </th>
    `,
      )
      .join("");
    let tableRows = "";
    const latestTrendData = vitals?.trendData;
    vitals?.heading?.forEach((metricKey) => {
      const def = metricDefinitions[metricKey.key];
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
}
