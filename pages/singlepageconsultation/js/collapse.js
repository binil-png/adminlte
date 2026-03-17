$(function () {
  // highlight the opened components
  $("#collapseVitals").on("shown.bs.collapse", function () {
    $("#headingVitals h6").addClass("accordion-highlight");
  });

  // When closed
  $("#collapseVitals").on("hidden.bs.collapse", function () {
    $("#headingVitals h6").removeClass("accordion-highlight");
  });

  // clinical notes
  $("#collapseNotes").on("shown.bs.collapse", function () {
    $("#headingClinicalNotes h6").addClass("accordion-highlight");
  });

  $("#collapseNotes").on("hidden.bs.collapse", function () {
    $("#headingClinicalNotes h6").removeClass("accordion-highlight");
  });

  // Procedure
  $("#collapseProcedure").on("shown.bs.collapse", function () {
    $("#headingProcedure h6").addClass("accordion-highlight");
  });

  // When closed
  $("#collapseProcedure").on("hidden.bs.collapse", function () {
    $("#headingProcedure h6").removeClass("accordion-highlight");
  });

  // Prescription
  $("#collapsePresc").on("shown.bs.collapse", function () {
    $("#headingPresc h6").addClass("accordion-highlight");
  });

  // When closed
  $("#collapsePresc").on("hidden.bs.collapse", function () {
    $("#headingPresc h6").removeClass("accordion-highlight");
  });

  // Dental
  $("#collapseDental").on("shown.bs.collapse", function () {
    $("#headingDental h6").addClass("accordion-highlight");
  });

  // When closed
  $("#collapseDental").on("hidden.bs.collapse", function () {
    $("#headingDental h6").removeClass("accordion-highlight");
  });

  // Files
  $("#collapseFiles").on("shown.bs.collapse", function () {
    $("#headingFiles h6").addClass("accordion-highlight");
  });

  // When closed
  $("#collapseFiles").on("hidden.bs.collapse", function () {
    $("#headingFiles h6").removeClass("accordion-highlight");
  });
});
