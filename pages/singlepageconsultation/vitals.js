$(function () {
  // Allergy add/remove
  $("#addAllergy").on("click", function (e) {
    e.preventDefault();
    $("#allergyList").append(
      '<div class="input-group mb-2 allergy-row">< + """>'
    );
  });

  // Better implementation: use template
  function addAllergyRow(value) {
    var row = $('<div class="input-group mb-2 allergy-row col-md-2 col-lg-2">')
      .append(
        $(
          '<input type="text" class="form-control rounded-start-4 input-style">'
        ).val(value || "")
      )
      .append(
        $('<div class="input-group-append">').append(
          $(
            '<button style="padding: 0px 8px" class="btn btn-outline-danger btn-remove-allergy rounded-end-4" type="button"><i class="fas fa-times"></i></button>'
          )
        )
      );
    $("#allergyList").append(row);
  }

  // initialize existing
  $("#allergyList .allergy-row input").each(function () {
    /* already exist*/
  });

  $("#addAllergy")
    .off("click")
    .on("click", function (e) {
      e.preventDefault();
      addAllergyRow("");
    });

  $(document).on("click", ".btn-remove-allergy", function () {
    $(this).closest(".allergy-row").remove();
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

      allergies: getAllergies(),
    };
  }

  function getAllergies() {
    const allergies = [];

    $("#allergyList .allergy-row input").each(function () {
      const value = $(this).val().trim();
      if (value !== "") allergies.push(value);
    });

    return allergies;
  }

  $("#addAllergy").click(function (e) {
    e.preventDefault();
    $("#allergyList").append(`
    <div class="input-group mb-2 allergy-row col-md-2 col-lg-2">
      <input type="text" class="form-control rounded-start-4 input-style" />
      <div class="input-group-append">
        <button style="padding: 0px 8px" 
                class="btn btn-outline-danger btn-remove-allergy rounded-end-4" 
                type="button">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `);
  });

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

    setAllergies(data.allergies);
  }

  function setAllergies(allergies) {
    $("#allergyList").empty();

    allergies.forEach((item) => {
      $("#allergyList").append(`
      <div class="input-group mb-2 allergy-row col-md-2 col-lg-2">
        <input type="text" class="form-control rounded-start-4 input-style" value="${item}" />
        <div class="input-group-append">
          <button style="padding: 0px 8px"
                  class="btn btn-outline-danger btn-remove-allergy rounded-end-4" 
                  type="button">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `);
    });
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
    temperature: { title: "Temperature Trend", unit: " °C", color: "#ffc107" },
    weight: { title: "Weight Trend", unit: " kg", color: "#17a2b8" },
    bloodSugar: {
      title: "Blood Sugar Trend",
      unit: " mg/dL",
      color: "#dc3545",
    },
    bp: {
      title: "BP Trend (Systolic/Diastolic)",
      unit: " mmHg",
      color: "#007bff",
    },
    cholesterol: {
      title: "Cholesterol Trend",
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

function renderVitalsTable(container, vitals) {
  const consolidatedVitals = vitals.map((item) => {
    const v = item.vitalData;
    const time = "";

    return {
      date: item.date,
      time: time,
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

  const tableData = consolidatedVitals.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let tableRows = "";
  const metricOrder = [
    "Temperature",
    "Height",
    "Weight",
    "Sugar",
    "Cholesterol",
    "BP",
    "Pulse",
    "SpO2",
    "Respiratory Rate",
  ];
  const totalColumns = metricOrder.length + 1;

  tableData.forEach((record) => {
    let rowData = "";
    rowData += `
                <td class="small text-muted text-nowrap">
                    <span class="fw-semibold">${formatDateGroupLabel(
                      record.date
                    )}</span>
                    <div class="text-xs">${record.time}</div>
                </td>
            `;
    metricOrder.forEach((metricKey) => {
      const value = String(record[metricKey] || "-").trim();
      rowData += `<td class="text-center fw-medium">${value}</td>`;
    });
    tableRows += `<tr>${rowData}</tr>`;
  });
  const combinedTrendData = tableData.length > 0 ? tableData[0].trendData : {};
  const graphDataAttr = `data-graph-record='${JSON.stringify(
    combinedTrendData
  )}'`;
  const vitalsTableHtml = `
        <h6 class="fw-bold small text-custom mt-3">Vitals History Summary</h6>
        <div class="rounded-2 bg-white mb-2 shadow-sm filter-item" 
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
        
        <h6 class="fw-bold small text-custom mt-3">Vitals Trend Graphs</h6>
        <div id="vitals-trend-charts-container" class="d-flex flex-wrap justify-content-start gap-3">
        </div>
    `;

  if (container && container.append) {
    container.append(vitalsTableHtml);
    attachVitalsHoverEvents();
  } else {
    console.error("Container element is invalid or missing 'append' method.");
  }
}
