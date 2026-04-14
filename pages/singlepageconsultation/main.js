const imports = [
  "./js/data.js",
  "./js/mockData.js",
  "./components/components.js",
  "./services/services.js",
  "./services/api.js",
  "./components/chart.js",
  "./js/customdropdown.js",
  "./js/drawer.js",
  "./js/collapse.js",
  "./js/sidebar.js",
  "./js/vitals.js",
  "./js/dentalLab.js",
  "./js/clinicalNotes.js",
  "./js/procedure.js",
  "./js/prescription.js",
  "./js/files.js",
  "./js/lab.js",
  "./js/preview.js",
  "./js/invoice.js",
  "./js/new.js",
  "./js/persistence.js",
];

function loadScripts() {
  imports.forEach((script) => {
    const scriptTag = document.createElement("script");
    scriptTag.src = script;
    scriptTag.async = false;
    document.body.appendChild(scriptTag);
  });
}
loadScripts();

