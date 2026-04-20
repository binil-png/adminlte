/**
 * Persistence Module for Single Page Consultation
 * This script handles saving and loading the form state to localStorage.
 */

$(function () {
    const BASE_STORAGE_KEY = 'consultationData_';
    const LAST_PATIENT_KEY = 'lastConsultationPatient';
    let currentPatientId = null;
    let saveTimeout = null;

    // Helper to get storage key based on current patient
    function getStorageKey() {
        const patientId = window.patientDataGlobal ? (window.patientDataGlobal.patientId || window.patientDataGlobal.patient_id) : null;
        return patientId ? BASE_STORAGE_KEY + patientId : null;
    }

    /**
     * Gathers all data from the UI into a single serializable object
     */
    function gatherAllData() {
        // Collect files metadata (binary cannot be serialized to JSON)
        const filesMetadata = (typeof window.uploadedFilesList !== 'undefined') ? window.uploadedFilesList.map(item => {
            if (item.file && item.file instanceof File) {
                return {
                    fileName: item.file.name,
                    description: item.description,
                    categoryId: item.categoryId,
                    isMetadata: true
                };
            }
            return item; // already metadata
        }) : [];

        const data = {
            patient: {
                name: $("#pName").text(),
                id: $("#pId").text().replace('#', ''),
                phone: $("#pPhone").text().trim(),
                avatar: $("#pAvatar").attr("src"),
                allergiesList: (typeof window.addAllergies !== 'undefined') ? window.addAllergies : [],
                chiefComplaints: $("#chiefComplaints").val(),
                medicalHistory: $("#medicalHistory").val(),
                observations: $("#observations").val(),
                investigations: $("#investigations").val(),
                diagnosis: $("#diagnosis").val(),
                treatment: $("#treatment").val(),
                notes: $("#notes").val(),
                advice: $("#advice").val() || ""
            },
            vitals: {
                temperature: $("input[name='temperature']").val(),
                height: $("input[name='height']").val(),
                weight: $("input[name='weight']").val(),
                bp: {
                    systolic: $("input[name='systolic']").val(),
                    diastolic: $("input[name='diastolic']").val(),
                    position: $("select[name='position']").val()
                },
                glucose: $("input[name='glucose']").val(),
                pulse: $("input[name='pulse']").val(),
                cholesterol: $("input[name='cholesterol']").val(),
                spo2: $("input[name='spo2']").val(),
                respiratoryRate: $("input[name='respiratoryRate']").val()
            },
            procedures: (typeof window.procData !== 'undefined') ? JSON.parse(JSON.stringify(window.procData)) : [],
            prescriptions: (typeof window.getPrescriptionData === 'function') ? window.getPrescriptionData() : [],
            labTests: (typeof window.labTestsList !== 'undefined') ? JSON.parse(JSON.stringify(window.labTestsList)) : [],
            dentalLab: {
                labId: $("#labName").val(),
                labName: $("#labName").find("option:selected").text(),
                brandId: $("#brand").val(),
                brandName: $("#brand").find("option:selected").text(),
                workType: $("#workType").val(),
                remarks: $("#remarks").val(),
                invoiceAmount: $("#invoiceAmount").val(),
                labAmount: $("#labAmount").val(),
                deliveryDate: $("#deliveryDate").val(),
                givenDate: $("#givenDate").val(),
                teeth: (typeof window.selectedLabTeeth !== 'undefined') ? Object.keys(window.selectedLabTeeth) : []
            },
            files: filesMetadata,
            nextReview: {
                date: $("#reviewDate").val(),
                time: $("#timeFilter").val()
            },
            timestamp: new Date().getTime()
        };
        return data;
    }

    /**
     * Saves the current form state to localStorage
     */
    function saveToLocalStorage() {
        const key = getStorageKey();
        if (!key) return;

        const data = gatherAllData();
        localStorage.setItem(key, JSON.stringify(data));
        
        // Also update last patient reference
        if (window.patientDataGlobal) {
            localStorage.setItem(LAST_PATIENT_KEY, JSON.stringify(window.patientDataGlobal));
        }
        
        console.log(`Persistence: Saved draft for patient ${key}`);
    }

    /**
     * Debounced save
     */
    function triggerDebouncedSave() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveToLocalStorage, 1000);
    }

    /**
     * Loads the state from localStorage and populates the UI
     */
    function loadFromLocalStorage() {
        const key = getStorageKey();
        if (!key) return;

        const savedData = localStorage.getItem(key);
        if (!savedData) {
            console.log("Persistence: No saved data found for this patient.");
            resetConsultationForm();
            return;
        }

        try {
            const data = JSON.parse(savedData);
            console.log("Persistence: Restoring data...", data);

            // 1. Clinical Notes & Allergies
            if (data.patient) {
                if (typeof window.setClinicalNotes === 'function') {
                    // This function handles the Select2 tag restoration
                    window.setClinicalNotes(data.patient);
                }
                if (data.patient.allergiesList) {
                    window.addAllergies = data.patient.allergiesList;
                    if (typeof window.renderallergies === 'function') window.renderallergies();
                }
            }

            // 2. Vitals
            if (data.vitals) {
                const v = data.vitals;
                $("input[name='temperature']").val(v.temperature);
                $("input[name='height']").val(v.height);
                $("input[name='weight']").val(v.weight);
                $("input[name='systolic']").val(v.bp?.systolic);
                $("input[name='diastolic']").val(v.bp?.diastolic);
                $("select[name='position']").val(v.bp?.position);
                $("input[name='glucose']").val(v.glucose);
                $("input[name='pulse']").val(v.pulse);
                $("input[name='cholesterol']").val(v.cholesterol);
                $("input[name='spo2']").val(v.spo2);
                $("input[name='respiratoryRate']").val(v.respiratoryRate);
                
                if (typeof updateTopSummary === 'function') updateTopSummary();
            }

            // 3. Procedures
            if (data.procedures && Array.isArray(data.procedures)) {
                window.procData = data.procedures;
                if (typeof window.renderProcTable === 'function') window.renderProcTable();
            }

            // 4. Prescriptions
            if (data.prescriptions && Array.isArray(data.prescriptions)) {
                if (typeof window.setPrescriptions === 'function') window.setPrescriptions(data.prescriptions);
            }

            // 5. Lab Tests
            if (data.labTests && Array.isArray(data.labTests)) {
                if (typeof window.renderLabSelectedTests === 'function') window.renderLabSelectedTests(data.labTests);
            }

            // 6. Dental Lab
            if (data.dentalLab) {
                const dl = data.dentalLab;
                if (dl.labId) {
                    const $el = $("#labName");
                    if ($el.length && $el.find(`option[value='${dl.labId}']`).length === 0) {
                        $el.append(new Option(dl.labName || dl.labId, dl.labId, true, true));
                    }
                    $el.val(dl.labId).trigger('change');
                }
                if (dl.brandId) {
                    const $el = $("#brand");
                    if ($el.length && $el.find(`option[value='${dl.brandId}']`).length === 0) {
                        $el.append(new Option(dl.brandName || dl.brandId, dl.brandId, true, true));
                    }
                    $el.val(dl.brandId).trigger('change');
                }
                $("#workType").val(dl.workType || "");
                $("#remarks").val(dl.remarks || "");
                $("#invoiceAmount").val(dl.invoiceAmount || "");
                $("#labAmount").val(dl.labAmount || "");
                $("#deliveryDate").val(dl.deliveryDate || "");
                $("#givenDate").val(dl.givenDate || "");
                
                if (dl.teeth && typeof window.setDentalLabTeeth === 'function') {
                    window.setDentalLabTeeth(dl.teeth);
                }
            }

            // 7. Files Metadata
            if (data.files && data.files.length > 0) {
                const $fileList = $("#fileList");
                if ($fileList.length) {
                    $fileList.empty();
                    window.uploadedFilesList = data.files.map(f => ({
                        file: null, // Binary lost on reload
                        fileName: f.fileName,
                        description: f.description,
                        categoryId: f.categoryId,
                        isRestored: true
                    }));
                    window.uploadedFilesList.forEach(item => {
                        $fileList.append(`
                        <li class="border rounded p-2 mb-2 d-flex justify-content-between align-items-center opacity-75">
                            <div class="d-flex flex-column gap-1">
                                <strong>${item.fileName}</strong>
                                <small class="text-info">(Pending/Restored)</small>
                                <p class="text-muted mb-0 small">${item.description || "No description"}</p>
                            </div>
                            <button class="btn btn-outline-danger btn-sm removeFile">
                                <i class="fas fa-trash"></i>
                            </button>
                        </li>`);
                    });
                }
                if (typeof window.renderUploadedFiles === 'function') window.renderUploadedFiles();
            }

            // 8. Next Review
            if (data.nextReview) {
                $("#reviewDate").val(data.nextReview.date || "");
                $("#timeFilter").val(data.nextReview.time || "");
            }

        } catch (e) {
            console.error("Persistence: Error restoring data", e);
        }
    }

    /**
     * Resets the consultation form
     */
    function resetConsultationForm() {
        $("#chiefComplaints, #medicalHistory, #observations, #investigations, #diagnosis, #treatment, #notes").val([]).trigger('change');
        $("#advice, #reviewDate, #timeFilter").val("");
        $("#vitalsForm")[0]?.reset();
        window.procData = [];
        if (typeof renderProcTable === 'function') renderProcTable();
        if (typeof setPrescriptions === 'function') setPrescriptions([]);
        if (typeof renderLabSelectedTests === 'function') renderLabSelectedTests([]);
        window.uploadedFilesList = [];
        $("#fileList").empty();
        if (typeof renderUploadedFiles === 'function') renderUploadedFiles();
        if (typeof setDentalLabTeeth === 'function') setDentalLabTeeth([]);
        $("#labName, #brand").val(null).trigger('change');
        $("#remarks, #invoiceAmount, #labAmount, #deliveryDate, #givenDate").val("");
    }

    // --- Events ---

    // Patient Switched
    $(document).on("patientMatched", function (e, patient) {
        const pid = patient ? (patient.patientId || patient.patient_id) : null;
        if (pid && pid !== currentPatientId) {
            currentPatientId = pid;
            loadFromLocalStorage();
        }
    });

    // Auto-save on any input/select/textarea change
    $(document).on("input change", "input, select, textarea", function() {
        if (!$(this).hasClass("no-persist")) {
            triggerDebouncedSave();
        }
    });

    // Special Select2 events
    $(document).on("select2:select select2:unselect", "select", function() {
        triggerDebouncedSave();
    });

    // Manual Save triggers
    $("#globalSave, [id^='save']").on("click", function() {
        saveToLocalStorage();
    });

    // Initial load check
    if (window.patientDataGlobal) {
        currentPatientId = window.patientDataGlobal.patientId || window.patientDataGlobal.patient_id;
        loadFromLocalStorage();
    } else {
        // Try to recover last patient from storage
        const lastPatientStr = localStorage.getItem(LAST_PATIENT_KEY);
        if (lastPatientStr) {
            try {
                const lastPatient = JSON.parse(lastPatientStr);
                window.patientDataGlobal = lastPatient;
                $(document).trigger("patientMatched", [lastPatient]);
            } catch(e) {}
        }
    }
});
