let showLeft = true;

function dateFilter(data) {
  $("#dateFilter").empty();
  $("#dateFilter").select2({
    theme: "bootstrap5.3.0",
    placeholder: "Search date",
    selectionCssClass: "form-control rounded-4 input-style custom-select ignore-edit",
    data,
  });
}

async function applyFilters() {
  const container = $(".content-area");
  container.empty();
  let api = new ApiServices(container);

  const activeFilter =
    $("#chipFilters .active-filter").data("filter") || "vitals";
  if (activeFilter == "vitals") {
    const apiVitalsData = await api.getVitalsList();
    dateFilter(apiVitalsData?.results?.vitals.map(i=>({id:i.date,text:i.date})));
    renderVitalsTable(container, apiVitalsData?.results);
  }

  if (activeFilter == "notes") {
    const apiNotessData = await api.getClinicNotesList();
    dateFilter(apiNotessData?.results.map(i=>({id:i.date,text:i.date})));
    renderClinicalNotes(container, apiNotessData?.results);
  }

  if (activeFilter == "prescription") {
    const apiPrescriptionData = await api.getPrescriptionList();
    dateFilter(apiPrescriptionData?.results.map(i=>({id:i.date,text:i.date})));
    renderPrescription(container, apiPrescriptionData?.results);
  }

  if (activeFilter == "procedure") {
    const apiProcedureData = await api.getProcedure();
    dateFilter(apiProcedureData?.results.map(i=>({id:i.date,text:i.date})));
    console.log("apiProcedureData?.results => ",apiProcedureData?.results)
    renderProcedure(container, apiProcedureData?.results);
  }
  if (activeFilter == "lab_report") {
    const apiLabData = await api.getLabList();
    dateFilter(apiLabData?.results.map(i=>({id:i.date,text:i.date})));
    renderLabTests(container, apiLabData?.results);
  }
  if (activeFilter == "files") {
    const apiFileList = await api.getUploadedFile();
    // dateFilter(apiLabData?.results.map(i=>({id:i.date,text:i.date})));
    renderFiles(container, apiFileList?.results);
  }
}

$(function () {
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

  $("#dateFilter").on("change", function () {
    console.log($(this).val());
  });
});
