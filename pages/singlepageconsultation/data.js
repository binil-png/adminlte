const allergies = ["Penicillin"];
const mockPatient = {
  avatar:
    "https://www.nicepng.com/png/detail/186-1866063_dicks-out-for-harambe-sample-avatar.png",
  name: "John Doe",
  age: 27,
  gender: "Male",
  city: "New York",
  allergies,
  amountDue: 0,
  visits: 1,
  lastVisit: "Today",
  phone: "98712376538",
};

function generateVitals() {
  return {
    temperature: (97 + Math.random() * 3).toFixed(1) + "°F",
    height: (1.5 + Math.random() * 0.35).toFixed(2) + " m",
    weight: (50 + Math.random() * 35).toFixed(1) + " kg",
    bp: `${100 + Math.floor(Math.random() * 30)}/${
      70 + Math.floor(Math.random() * 20)
    } mmHg`,
    glucose: 80 + Math.floor(Math.random() * 70) + " mg/dL",
    pulse: 60 + Math.floor(Math.random() * 40) + " bpm",
    cholesterol: 150 + Math.floor(Math.random() * 100) + " mg/dL",
    spo2: 94 + Math.floor(Math.random() * 5) + "%",
    respiration: 12 + Math.floor(Math.random() * 10) + " breaths/min",
    allergies: ["None", "Dust", "Pollen", "Peanuts", "Seafood", "Egg", "Latex"][
      Math.floor(Math.random() * 7)
    ],
  };
}

const vitalsHistory = Array.from({ length: 10 }).map((_, i) => {
  const v = generateVitals();

  return {
    type: "vitals",
    date: `2025-12-${String(1 + i).padStart(2, "0")}`,
    title: "Vitals Recorded",
    icon: "fa fa-stethoscope text-success",
    html: `
      <p class="small mb-1">
        <b>Temperature:</b> ${v.temperature} |
        <b>Height:</b> ${v.height} |
        <b>Weight:</b> ${v.weight}
      </p>
      <p class="small mb-1">
        <b>BP:</b> ${v.bp} |
        <b>Blood Glucose:</b> ${v.glucose} |
        <b>Pulse:</b> ${v.pulse}
      </p>
      <p class="small mb-1">
        <b>Cholesterol:</b> ${v.cholesterol} |
        <b>SPO₂:</b> ${v.spo2} |
        <b>Respiratory Rate:</b> ${v.respiration}
      </p>
      <p class="small mb-1">
        <b>Allergies:</b> ${v.allergies}
      </p>
      <small class="text-muted">
        ${3 + i}:00 PM • Nurse Station
      </small>
    `,
  };
});

function generatePrescriptionDetails(medicineList, index) {
  const frequencies = ["1-0-1", "1-1-1", "0-1-1", "1-0-0", "0-0-1"];
  const routes = ["Oral", "IV", "IM", "Topical", "Nebulization"];
  const timings = [
    "After Food",
    "Before Food",
    "Morning",
    "Night",
    "Every 8 hours",
    "Every 12 hours",
  ];

  return medicineList.map((m) => ({
    name: m,
    dosage: m.match(/\d+/)?.[0] + (m.includes("ml") ? " ml" : " mg"), // auto extract dosage
    frequency: frequencies[Math.floor(Math.random() * frequencies.length)],
    route: routes[Math.floor(Math.random() * routes.length)],
    timing: timings[Math.floor(Math.random() * timings.length)],
    duration: `${3 + index} Days`,
  }));
}

const prescriptionData = [
  [
    "Paracetamol 650mg",
    "Cetirizine 10mg",
    "Amoxicillin 500mg",
    "Vitamin C 500mg",
  ],
  ["Amoxicillin 500mg", "Vitamin C 500mg"],
  ["Azithromycin 250mg", "Pantoprazole 40mg"],
  ["Ibuprofen 400mg", "Domperidone 10mg"],
  ["Metformin 500mg", "Glimepiride 1mg"],
  ["Losartan 50mg", "Aspirin 75mg"],
  [
    "Dolo 650",
    "Rantac 150",
    "ORS Solution",
    "Zinc 20mg",
    "Multivitamin",
    "Calcium 500mg",
  ],
  ["Cough Syrup 10ml", "Steam Inhalation"],
  ["ORS Solution", "Zinc 20mg"],
  ["Multivitamin", "Calcium 500mg"],
].map((meds, i) => {
  const detailedMeds = generatePrescriptionDetails(meds, i);

  return {
    type: "prescription",
    date: `2025-11-${10 + i}`,
    title: "Prescription",
    icon: "fas fa-capsules text-primary",
    html: `
      <p class="small mb-1"><b>Medicines Prescribed:</b></p>
      <ul class="small mb-1">
        ${detailedMeds
          .map(
            (m) => `
          <li>
            <b>${m.name}</b><br/>
            Dosage: ${m.dosage}<br/>
            Frequency: ${m.frequency}<br/>
            Route: ${m.route}<br/>
            Timing: ${m.timing}<br/>
            Duration: ${m.duration}
          </li>
        `
          )
          .join("")}
      </ul>
    `,
  };
});

const dentalRecords = [
  {
    type: "dental_procedure",
    date: "2025-11-10",
    chiefComplaints: "Toothache in upper right molar for 3 days",
    observations: "Caries observed in tooth #16, tenderness on percussion",
    medicalHistory: "No known allergies, no systemic illness",
    advice: "Maintain oral hygiene, avoid hot/cold foods",
    procedures: [
      {
        name: "Dental X-Ray",
        quantity: 1,
        price: 300,
        discount: 0,
        // status: "completed",
      },
      {
        name: "Root Canal Treatment",
        quantity: 1,
        price: 3500,
        discount: 10,
        // status: "planned",
      },
    ],
  },
  {
    type: "dental_procedure",
    date: "2025-11-12",
    chiefComplaints: "Swelling and pain in the lower jaw",
    observations: "Impacted wisdom tooth #38, swelling present",
    medicalHistory: "Patient is diabetic (controlled)",
    advice: "Warm saline gargles, start antibiotics",
    procedures: [
      {
        name: "Extraction of Wisdom Tooth",
        quantity: 1,
        price: 4500,
        discount: 5,
        status: "planned",
      },
      {
        name: "Scaling and Polishing",
        quantity: 1,
        price: 1500,
        discount: 0,
        status: "completed",
      },
    ],
  },
  {
    type: "dental_procedure",
    date: "2025-11-14",
    chiefComplaints: "Bleeding gums and bad breath",
    observations: "Generalized gingivitis, plaque accumulation",
    medicalHistory: "Patient smokes occasionally",
    advice: "Stop smoking, maintain brushing twice daily",
    procedures: [
      {
        name: "Deep Cleaning",
        quantity: 1,
        price: 2000,
        discount: 0,
        status: "completed",
      },
      {
        name: "Gingival Treatment",
        quantity: 1,
        price: 1200,
        discount: 10,
        status: "planned",
      },
    ],
  },
  {
    type: "dental_procedure",
    date: "2025-11-16",
    chiefComplaints: "Loose tooth while chewing",
    observations: "Mobility grade II in tooth #31, periodontal bone loss",
    medicalHistory: "Hypertension, on medication",
    advice: "Soft diet, avoid hard chewing",
    procedures: [
      {
        name: "Periodontal Therapy",
        quantity: 1,
        price: 2500,
        discount: 0,
        status: "completed",
      },
      {
        name: "Splinting of Teeth",
        quantity: 1,
        price: 3000,
        discount: 5,
        status: "planned",
      },
    ],
  },
  {
    type: "dental_procedure",
    date: "2025-11-18",
    chiefComplaints: "Sensitivity to cold food",
    observations: "Enamel erosion on premolars",
    medicalHistory: "No major medical history",
    advice: "Use desensitizing toothpaste",
    procedures: [
      {
        name: "Fluoride Application",
        quantity: 1,
        price: 800,
        discount: 0,
        status: "completed",
      },
    ],
  },
];

const historyData = [
  // ================= EXISTING ITEMS ==================
  {
    type: "vitals",
    date: "2025-11-26",
    title: "Vitals Recorded",
    icon: "fa fa-stethoscope text-success",
    html: `
      <p class="small mb-1">Temp: <span class="badge bg-danger">98.6°F</span> | BP 120/80 | Pulse 72</p>
      <small class="text-muted">3:00 PM • Nurse Station</small>
    `,
  },
  {
    type: "prescription",
    date: "2025-11-26",
    title: "Prescription",
    icon: "fas fa-capsules text-primary",
    html: `<p class="small mb-0">Paracetamol • 5 Days</p>`,
  },
  {
    type: "procedure",
    date: "2025-11-25",
    icon: "fas fa-syringe text-info",
    title: "Procedure Performed",
    html: `
      <p class="small mb-1">Wound cleaning & dressing applied.</p>
      <p class="small mb-1">Status: <span class="badge bg-info text-dark">Completed</span></p>
      <small class="text-muted">4:15 PM • Nurse Emily • Ward 3B</small>
    `,
  },
  {
    type: "files",
    date: "2025-11-22",
    icon: "fas fa-file text-primary",
    title: "Uploaded Report",
    html: `<p class="small mb-0">Blood Test Report.pdf</p>`,
  },
  {
    type: "dental",
    date: "2025-11-22",
    icon: "fas fa-tooth text-muted",
    title: "Dental Procedure",
    html: `
      <p class="small mb-1">Root canal performed on tooth 36.</p>
      <small class="text-muted">1:30 PM • Dr. Miller</small>
    `,
  },

  // ================= NEW 10 VITALS ==================
  ...vitalsHistory,
  // ================= NEW 10 PRESCRIPTIONS ==================
  ...prescriptionData,
  // ================= NEW 10 CLINICAL NOTES ==================
  {
    type: "notes",
    date: "2025-12-01",
    title: "Clinical Notes",
    icon: "fas fa-notes-medical text-warning",
    html: `
      <p class="small mb-1"><b>Chief Complaints:</b> Fever, body ache for 2 days</p>
      <p class="small mb-1"><b>Medical History:</b> No chronic illness</p>
      <p class="small mb-1"><b>Observations:</b> Mild dehydration, throat congestion</p>
      <p class="small mb-1"><b>Investigations:</b> CBC, CRP ordered</p>
      <p class="small mb-1"><b>Diagnosis:</b> Viral Fever</p>
      <p class="small mb-1"><b>Treatment:</b> Paracetamol, hydration</p>
      <p class="small mb-1"><b>Advice:</b> Rest, drink fluids</p>
    `,
  },
  {
    type: "notes",
    date: "2025-12-02",
    title: "Clinical Notes",
    icon: "fas fa-notes-medical text-warning",
    html: `
      <p class="small mb-1"><b>Chief Complaints:</b> Headache and dizziness</p>
      <p class="small mb-1"><b>Medical History:</b> Migraines occasionally</p>
      <p class="small mb-1"><b>Observations:</b> BP slightly elevated</p>
      <p class="small mb-1"><b>Investigations:</b> BP monitoring</p>
      <p class="small mb-1"><b>Diagnosis:</b> Migraine Episode</p>
      <p class="small mb-1"><b>Treatment:</b> Ibuprofen, cold compress</p>
      <p class="small mb-1"><b>Advice:</b> Avoid stress, rest in dark room</p>
    `,
  },
  {
    type: "notes",
    date: "2025-12-03",
    title: "Clinical Notes",
    icon: "fas fa-notes-medical text-warning",
    html: `
      <p class="small mb-1"><b>Chief Complaints:</b> Stomach pain and nausea</p>
      <p class="small mb-1"><b>Medical History:</b> Gastric irritation</p>
      <p class="small mb-1"><b>Observations:</b> Mild tenderness in abdomen</p>
      <p class="small mb-1"><b>Investigations:</b> LFT, Ultrasound Abdomen</p>
      <p class="small mb-1"><b>Diagnosis:</b> Gastritis</p>
      <p class="small mb-1"><b>Treatment:</b> Pantoprazole, antacids</p>
      <p class="small mb-1"><b>Advice:</b> Avoid spicy food</p>
    `,
  },
  {
    type: "notes",
    date: "2025-12-04",
    title: "Clinical Notes",
    icon: "fas fa-notes-medical text-warning",
    html: `
      <p class="small mb-1"><b>Chief Complaints:</b> Cough and cold</p>
      <p class="small mb-1"><b>Medical History:</b> Allergic rhinitis</p>
      <p class="small mb-1"><b>Observations:</b> Nasal congestion</p>
      <p class="small mb-1"><b>Investigations:</b> None</p>
      <p class="small mb-1"><b>Diagnosis:</b> Upper Respiratory Infection</p>
      <p class="small mb-1"><b>Treatment:</b> Antihistamines, steam inhalation</p>
      <p class="small mb-1"><b>Advice:</b> Increase warm fluids</p>
    `,
  },
  {
    type: "notes",
    date: "2025-12-05",
    title: "Clinical Notes",
    icon: "fas fa-notes-medical text-warning",
    html: `
      <p class="small mb-1"><b>Chief Complaints:</b> Back pain</p>
      <p class="small mb-1"><b>Medical History:</b> Mild disc bulge</p>
      <p class="small mb-1"><b>Observations:</b> Limited movement</p>
      <p class="small mb-1"><b>Investigations:</b> X-ray lumbar spine</p>
      <p class="small mb-1"><b>Diagnosis:</b> Muscular strain</p>
      <p class="small mb-1"><b>Treatment:</b> Muscle relaxant, hot fomentation</p>
      <p class="small mb-1"><b>Advice:</b> Avoid heavy lifting</p>
    `,
  },
  {
    type: "notes",
    date: "2025-12-06",
    title: "Clinical Notes",
    icon: "fas fa-notes-medical text-warning",
    html: `
      <p class="small mb-1"><b>Chief Complaints:</b> Chest discomfort</p>
      <p class="small mb-1"><b>Medical History:</b> Hypertension</p>
      <p class="small mb-1"><b>Observations:</b> Slight breathlessness</p>
      <p class="small mb-1"><b>Investigations:</b> ECG, Chest X-Ray</p>
      <p class="small mb-1"><b>Diagnosis:</b> Muscular chest pain</p>
      <p class="small mb-1"><b>Treatment:</b> Analgesics</p>
      <p class="small mb-1"><b>Advice:</b> Avoid exertion</p>
    `,
  },
  {
    type: "notes",
    date: "2025-12-07",
    title: "Clinical Notes",
    icon: "fas fa-notes-medical text-warning",
    html: `
      <p class="small mb-1"><b>Chief Complaints:</b> Swelling in leg</p>
      <p class="small mb-1"><b>Medical History:</b> Varicose veins</p>
      <p class="small mb-1"><b>Observations:</b> Edema noted</p>
      <p class="small mb-1"><b>Investigations:</b> Doppler Study</p>
      <p class="small mb-1"><b>Diagnosis:</b> Venous insufficiency</p>
      <p class="small mb-1"><b>Treatment:</b> Compression stockings</p>
      <p class="small mb-1"><b>Advice:</b> Elevate legs</p>
    `,
  },
  {
    type: "notes",
    date: "2025-12-08",
    title: "Clinical Notes",
    icon: "fas fa-notes-medical text-warning",
    html: `
      <p class="small mb-1"><b>Chief Complaints:</b> Shortness of breath</p>
      <p class="small mb-1"><b>Medical History:</b> Asthma</p>
      <p class="small mb-1"><b>Observations:</b> Wheezing present</p>
      <p class="small mb-1"><b>Investigations:</b> Peak flow test</p>
      <p class="small mb-1"><b>Diagnosis:</b> Asthma exacerbation</p>
      <p class="small mb-1"><b>Treatment:</b> Nebulization</p>
      <p class="small mb-1"><b>Advice:</b> Avoid triggers</p>
    `,
  },
  {
    type: "notes",
    date: "2025-12-09",
    title: "Clinical Notes",
    icon: "fas fa-notes-medical text-warning",
    html: `
      <p class="small mb-1"><b>Chief Complaints:</b> Knee pain</p>
      <p class="small mb-1"><b>Medical History:</b> Osteoarthritis</p>
      <p class="small mb-1"><b>Observations:</b> Crepitus on movement</p>
      <p class="small mb-1"><b>Investigations:</b> X-ray knee</p>
      <p class="small mb-1"><b>Diagnosis:</b> OA flare-up</p>
      <p class="small mb-1"><b>Treatment:</b> NSAIDs</p>
      <p class="small mb-1"><b>Advice:</b> Physiotherapy</p>
    `,
  },
  {
    type: "notes",
    date: "2025-12-10",
    title: "Clinical Notes",
    icon: "fas fa-notes-medical text-warning",
    html: `
      <p class="small mb-1"><b>Chief Complaints:</b> Fatigue and weakness</p>
      <p class="small mb-1"><b>Medical History:</b> Iron deficiency</p>
      <p class="small mb-1"><b>Observations:</b> Pale appearance</p>
      <p class="small mb-1"><b>Investigations:</b> CBC, Ferritin</p>
      <p class="small mb-1"><b>Diagnosis:</b> Anemia</p>
      <p class="small mb-1"><b>Treatment:</b> Iron supplements</p>
      <p class="small mb-1"><b>Advice:</b> Iron-rich diet</p>
    `,
  },

  // ================= NEW 10 PROCEDURES ==================
  {
    type: "procedure",
    date: "2025-12-01",
    title: "Procedure Performed",
    icon: "fas fa-syringe text-info",
    html: `
      <p class="small mb-1"><b>Procedure:</b> IV Cannula Insertion</p>
      <p class="small mb-1">Qty: 1 | Price: ₹350 | Discount: 0%</p>
      <p class="small mb-1">Status: <span class="badge bg-warning text-dark">Planned</span></p>
      <small class="text-muted">Requested by Dr. Thomas</small>
    `,
  },
  {
    type: "procedure",
    date: "2025-12-02",
    title: "Procedure Performed",
    icon: "fas fa-syringe text-info",
    html: `
      <p class="small mb-1"><b>Procedure:</b> Nebulization</p>
      <p class="small mb-1">Qty: 1 | Price: ₹250 | Discount: 10%</p>
      <p class="small mb-1">Status: <span class="badge bg-success">Completed</span></p>
      <small class="text-muted">Nursing Team • Room 102</small>
    `,
  },
  {
    type: "procedure",
    date: "2025-12-03",
    title: "Procedure Performed",
    icon: "fas fa-syringe text-info",
    html: `
      <p class="small mb-1"><b>Procedure:</b> ECG</p>
      <p class="small mb-1">Qty: 1 | Price: ₹500 | Discount: 5%</p>
      <p class="small mb-1">Status: <span class="badge bg-secondary">Sent to Radiology</span></p>
      <small class="text-muted">Radiology Department</small>
    `,
  },
  {
    type: "procedure",
    date: "2025-12-04",
    title: "Procedure Performed",
    icon: "fas fa-syringe text-info",
    html: `
      <p class="small mb-1"><b>Procedure:</b> Ultrasound Abdomen</p>
      <p class="small mb-1">Qty: 1 | Price: ₹1200 | Discount: 0%</p>
      <p class="small mb-1">Status: <span class="badge bg-secondary">Sent to Radiology</span></p>
      <small class="text-muted">Radiology Unit</small>
    `,
  },
  {
    type: "procedure",
    date: "2025-12-05",
    title: "Procedure Performed",
    icon: "fas fa-syringe text-info",
    html: `
      <p class="small mb-1"><b>Procedure:</b> Dressing Change</p>
      <p class="small mb-1">Qty: 1 | Price: ₹300 | Discount: 0%</p>
      <p class="small mb-1">Status: <span class="badge bg-primary">Nursing Performed</span></p>
      <small class="text-muted">Ward 3A</small>
    `,
  },
  {
    type: "procedure",
    date: "2025-12-06",
    title: "Procedure Performed",
    icon: "fas fa-syringe text-info",
    html: `
      <p class="small mb-1"><b>Procedure:</b> Blood Test (CBC)</p>
      <p class="small mb-1">Qty: 1 | Price: ₹400 | Discount: 0%</p>
      <p class="small mb-1">Status: <span class="badge bg-success">Completed</span></p>
      <small class="text-muted">Lab Technician • Sample Collected</small>
    `,
  },
  {
    type: "procedure",
    date: "2025-12-07",
    title: "Procedure Performed",
    icon: "fas fa-syringe text-info",
    html: `
      <p class="small mb-1"><b>Procedure:</b> X-Ray Chest</p>
      <p class="small mb-1">Qty: 1 | Price: ₹700 | Discount: 5%</p>
      <p class="small mb-1">Status: <span class="badge bg-secondary">Sent to Radiology</span></p>
      <small class="text-muted">Radiology Section</small>
    `,
  },
  {
    type: "procedure",
    date: "2025-12-08",
    title: "Procedure Performed",
    icon: "fas fa-syringe text-info",
    html: `
      <p class="small mb-1"><b>Procedure:</b> Injection (Vitamin B12)</p>
      <p class="small mb-1">Qty: 1 | Price: ₹150 | Discount: 0%</p>
      <p class="small mb-1">Status: <span class="badge bg-primary">Nursing Performed</span></p>
      <small class="text-muted">Administered IM</small>
    `,
  },
  {
    type: "procedure",
    date: "2025-12-09",
    title: "Procedure Performed",
    icon: "fas fa-syringe text-info",
    html: `
      <p class="small mb-1"><b>Procedure:</b> CT Scan Brain</p>
      <p class="small mb-1">Qty: 1 | Price: ₹3000 | Discount: 10%</p>
      <p class="small mb-1">Status: <span class="badge bg-secondary">Sent to Radiology</span></p>
      <small class="text-muted">Radiology - CT Room</small>
    `,
  },
  {
    type: "procedure",
    date: "2025-12-10",
    title: "Procedure Performed",
    icon: "fas fa-syringe text-info",
    html: `
      <p class="small mb-1"><b>Procedure:</b> Nebulization</p>
      <p class="small mb-1">Qty: 2 | Price: ₹500 | Discount: 0%</p>
      <p class="small mb-1">Status: <span class="badge bg-success">Completed</span></p>
      <small class="text-muted">Nursing Team</small>
    `,
  },

  // ================= NEW 10 FILES ==================
  ...[
    "MRI Brain.pdf",
    "Liver Function Test.pdf",
    "Kidney Panel Report.pdf",
    "CBC Report.pdf",
    "X-Ray Chest Image.png",
    "Ultrasound Abdomen.pdf",
    "ECG Scan.jpg",
    "Blood Sugar Profile.pdf",
    "Allergy Test Report.pdf",
    "Vaccination Certificate.pdf",
  ].map((file, i) => ({
    type: "files",
    date: `2025-11-${1 + i}`,
    title: "Uploaded Report",
    icon: "fas fa-file text-primary",
    html: `<p class="small mb-0">${file}</p>`,
  })),

  // ================= NEW 10 DENTAL PROCEDURES ==================
  ...dentalRecords.map((record) => {
    const procedureList = record.procedures
      .map(
        (p) => `
          <li>
            <b>${p.name}</b>  
            (Qty: ${p.quantity}, Price: ₹${p.price}, Discount: ${p.discount}%,  
            Status: <span class="text-primary">${p.status}</span>)
          </li>`
      )
      .join("");

    return {
      type: "dental",
      date: "2025-11-22",
      icon: "fas fa-tooth text-muted",
      title: "Dental Procedure",
      html: `
      <div class="card shadow-sm mb-3">
        <div class="card-body">
          <h6 class="text-primary mb-1"><i class="fas fa-tooth me-2"></i>Dental Procedure</h6>
          <small class="text-muted">${record.date}</small>

          <div class="mt-2">
            <p class="mb-1"><b>Chief Complaints:</b> ${record.chiefComplaints}</p>
            <p class="mb-1"><b>Observations:</b> ${record.observations}</p>
            <p class="mb-1"><b>Medical History:</b> ${record.medicalHistory}</p>
            <p class="mb-1"><b>Advice:</b> ${record.advice}</p>

            <p class="mb-1"><b>Procedures:</b></p>
            <ul class="small mb-1">${procedureList}</ul>
          </div>
        </div>
      </div>`,
    };
  }),
];

const mockVitals = {
  temperature: "98.6",
  height: "1.72",
  weight: "75",
  bp: { systolic: "120", diastolic: "80", position: "Sitting" },
  glucose: "105",
  pulse: "72",
  cholesterol: "180",
  spo2: "98",
  respiratoryRate: "16",
  allergies,
};

const mockClinicalNotes = {
  chiefComplaints: "Fever, cold, body pain",
  medicalHistory: "No major history, allergic to dust",
  observations: "High temperature, throat congestion",
  investigations: "Blood test suggested",
  diagnosis: "Viral infection",
  treatment: "Paracetamol 650mg",
  advice: "Drink warm water & rest well",
};

const clinicalTemplates = [
  {
    label: "Fever & Cold",
    chief: "Fever, cold for 2 days",
    history: "No major history",
    observation: "Mild throat redness",
    investigation: "CBC recommended",
    diagnosis: "Viral Fever",
    treatment: "Paracetamol + Rest",
    advice: "Stay hydrated",
  },
  {
    label: "Headache",
    chief: "Severe headache",
    history: "Migraine history",
    observation: "No nausea",
    investigation: "MRI if persists",
    diagnosis: "Migraine",
    treatment: "Pain killers",
    advice: "Avoid stress",
  },
];

let procData = [
  {
    name: "Blood Test",
    qty: 1,
    price: 400,
    discount: 0,
    status: "Completed",
    total: 400,
  },
  {
    name: "X-Ray Chest",
    qty: 1,
    price: 800,
    discount: 5,
    status: "Completed",
    total: 760,
  },
  {
    name: "ECG",
    qty: 1,
    price: 500,
    discount: 0,
    status: "Completed",
    total: 500,
  },
  {
    name: "Ultrasound Abdomen",
    qty: 1,
    price: 1800,
    discount: 10,
    status: "Planned",
    total: 1620,
  },
  {
    name: "Wound Dressing",
    qty: 2,
    price: 300,
    discount: 0,
    status: "Completed",
    total: 600,
  },
  {
    name: "IV Cannula Insertion",
    qty: 1,
    price: 200,
    discount: 0,
    status: "Completed",
    total: 200,
  },
  {
    name: "Nebulization",
    qty: 1,
    price: 250,
    discount: 0,
    status: "Completed",
    total: 250,
  },
  {
    name: "Fever Panel Test",
    qty: 1,
    price: 1200,
    discount: 10,
    status: "Planned",
    total: 1080,
  },
  {
    name: "Vaccination (Tetanus)",
    qty: 1,
    price: 600,
    discount: 0,
    status: "Completed",
    total: 600,
  },
  {
    name: "CT Scan Brain",
    qty: 1,
    price: 3500,
    discount: 5,
    status: "Planned",
    total: 3325,
  },
];

const prescriptionTemplates = {
  "Template A": [
    {
      name: "Paracetamol",
      dosage: { value: "500", unit: "mg" },
      duration: { value: "3", unit: "Day (s)" },
      frequency: { value: "1", unit: "After food" },
      instructions: "Take with water",
      usage: "Morning",
    },
  ],
  "Template B": [
    {
      name: "Azithromycin",
      dosage: { value: "250", unit: "mg" },
      duration: { value: "5", unit: "Day (s)" },
      frequency: { value: "2", unit: "Before food" },
      instructions: "",
      usage: "Night",
    },
  ],
};

const prescriptions = [
  {
    medicine: "Amoxicillin 500mg",
    dosage: "1",
    dosageUnit: "mg",
    duration: 7,
    durationUnit: "1", // Days
    frequency: "1-0-1",
    frequencyUnit: "2", // After food
  },
  {
    medicine: "Ibuprofen 400mg",
    dosage: "1",
    dosageUnit: "mg",
    duration: 5,
    durationUnit: "1",
    frequency: "1-1-1",
    frequencyUnit: "1", // Before food
  },
  {
    medicine: "Azithromycin 250mg",
    dosage: "1",
    dosageUnit: "mg",
    duration: 3,
    durationUnit: "1",
    frequency: "1-0-0",
    frequencyUnit: "2",
  },
  {
    medicine: "Pantoprazole 40mg",
    dosage: "1",
    dosageUnit: "mg",
    duration: 10,
    durationUnit: "1",
    frequency: "0-0-1",
    frequencyUnit: "1",
  },
  {
    medicine: "Metformin 500mg",
    dosage: "1",
    dosageUnit: "mg",
    duration: 30,
    durationUnit: "3", // Months
    frequency: "1-0-1",
    frequencyUnit: "3", // None
  },
  {
    medicine: "Vitamin D3 60k IU",
    dosage: "1",
    dosageUnit: "mg",
    duration: 8,
    durationUnit: "2", // Weeks
    frequency: "0-0-1",
    frequencyUnit: "2",
  },
  {
    medicine: "Cough Syrup 5ml",
    dosage: "5",
    dosageUnit: "ml",
    duration: 7,
    durationUnit: "1",
    frequency: "1-1-1",
    frequencyUnit: "3",
  },
  {
    medicine: "ORS Solution 200ml",
    dosage: "200",
    dosageUnit: "ml",
    duration: 2,
    durationUnit: "1",
    frequency: "2-2-2",
    frequencyUnit: "3",
  },
  {
    medicine: "Aspirin 75mg",
    dosage: "1",
    dosageUnit: "mg",
    duration: 30,
    durationUnit: "3",
    frequency: "1-0-0",
    frequencyUnit: "2",
  },
  {
    medicine: "Loratadine 10mg",
    dosage: "10",
    dosageUnit: "mg",
    duration: 7,
    durationUnit: "1",
    frequency: "0-0-1",
    frequencyUnit: "3",
  },
];
