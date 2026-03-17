const imports = [
    "./js/data.js",
    "./components/components.js",
    "./services/services.js",
    "./services/api.js",
    "./js/components/chart.js",
    "./js/customdropdown.js",
    "./js/drawer.js",
    "./js/new.js",
    "./js/lab.js",
    "./js/mockData.js",
    "./js/vitals.js",
    "./js/dental.js",
    "./js/dentalLab.js",
    "./js/clinicalNotes.js",
    "./js/procedure.js",
    "./js/prescription.js",
    "./js/files.js",
    "./js/collapse.js",
    "./js/preview.js",
    "./js/sidebar.js",
    "./js/invoice.js",
]

function loadScripts() {
    imports.forEach(script => {
        const scriptTag = document.createElement("script");
        scriptTag.src = script;
        document.body.appendChild(scriptTag);
    });
}
loadScripts();