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
    temperature: (40 + Math.random() * 3).toFixed(1) + "",
    height: (1.5 + Math.random() * 0.35).toFixed(2) + " ",
    weight: (50 + Math.random() * 35).toFixed(1) + "",
    bp: `${100 + Math.floor(Math.random() * 30)}/${
      70 + Math.floor(Math.random() * 20)
    }`,
    glucose: 80 + Math.floor(Math.random() * 70) + "",
    pulse: 60 + Math.floor(Math.random() * 40) + "",
    cholesterol: 150 + Math.floor(Math.random() * 100) + "",
    spo2: 94 + Math.floor(Math.random() * 5) + "",
    respiration: 12 + Math.floor(Math.random() * 10) + "",
    allergies: ["None", "Dust", "Pollen", "Peanuts", "Seafood", "Egg", "Latex"][
      Math.floor(Math.random() * 7)
    ],
  };
}

const vitalsHistory = Array.from({ length: 5 }).map((_, i) => {
  const v = generateVitals();

  return {
    type: "vitals",
    date: `${String(1 + i).padStart(2, "0")}/12/25`,
    title: "Vitals Recorded",
    icon: "fa fa-stethoscope text-success",
    trendData: {
      temperature: [40, 44, 39, 38, 37, 38, 36],
      weight: [80, 78.9, 77, 74, 70, 69.4, 67],
      bloodSugar: [95, 98, 92, 105, 110, 100, 99],
      bp: [
        [120, 80],
        [122, 82],
        [118, 78],
        [125, 85],
        [120, 80],
        [130, 90],
        [128, 88],
      ],
      cholesterol: [
        [190, 110, 45],
        [195, 115, 48],
        [188, 105, 42],
        [192, 112, 44],
        [185, 108, 40],
        [180, 100, 45],
        [182, 102, 46],
      ],
    },
    vitalData: v,
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
  // ["Azithromycin 250mg", "Pantoprazole 40mg"],
  // ["Ibuprofen 400mg", "Domperidone 10mg"],
  // ["Metformin 500mg", "Glimepiride 1mg"],
  // ["Losartan 50mg", "Aspirin 75mg"],
  [
    "Dolo 650",
    "Rantac 150",
    "ORS Solution",
    "Zinc 20mg",
    "Multivitamin",
    "Calcium 500mg",
  ],
  // ["Cough Syrup 10ml", "Steam Inhalation"],
  // ["ORS Solution", "Zinc 20mg"],
  // ["Multivitamin", "Calcium 500mg"],
].map((meds, i) => {
  const detailedMeds = generatePrescriptionDetails(meds, i);
  return {
    type: "prescription",
    date: `2025-11-${10 + i}`,
    title: "Prescription",
    icon: "fas fa-capsules text-primary",
    html: `
      <div class="">
       <table class="table table-sm">
      <tbody>
      ${detailedMeds
        .map(
          (m, i) => `
          <tr>
            <td>${i + 1}</td>
            <td class="text-sm">
            ${m.name ? m.name : ""} | ${m.dosage ? m.dosage : ""} | ${
            m.frequency ? m.frequency : ""
          } | ${m.route ? m.route : ""} | ${m.timing ? m.timing : ""} | ${
            m.duration ? m.duration : ""
          }
            </td>
          </tr>
      `
        )
        .join("")}
      </tbody>
      </table>
      </div>
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
        toothNo: 21,
        status: "completed",
      },
      {
        name: "Root Canal Treatment",
        quantity: 1,
        price: 3500,
        discount: 10,
        toothNo: 18,
        status: "planned",
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
        toothNo: 38,
      },
      {
        name: "Scaling and Polishing",
        quantity: 1,
        price: 1500,
        discount: 0,
        status: "completed",
        toothNo: 37,
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
        toothNo: 18,
      },
      {
        name: "Gingival Treatment",
        quantity: 1,
        price: 1200,
        discount: 10,
        status: "planned",
        toothNo: 18,
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
        toothNo: 19,
      },
      {
        name: "Splinting of Teeth",
        quantity: 1,
        price: 3000,
        discount: 5,
        status: "planned",
        toothNo: 19,
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
        toothNo: 20,
      },
    ],
  },
];

const descriptions = {
  "Vaccination Certificate.pdf":
    "Official certificate confirming vaccination with date and batch number.",
  "Allergy Test Report.pdf":
    "Allergen sensitivity results including IgE levels and reaction severity.",
};

const notestText = "mb-1";
const notestStyle = "font-size:.9rem";
const notesList = [
  {
    date: "2025-12-01",
    title: "Clinical Notes 10",
    complaints: "Fever, body ache for 2 days",
    history: "No chronic illness",
    observations: "Mild dehydration, throat congestion",
    investigations: "CBC, CRP ordered",
    diagnosis: "Viral Fever",
    treatment: "Paracetamol, hydration",
    advice: "Rest, drink fluids",
  },
  {
    date: "2025-12-02",
    title: "Clinical Notes",
    complaints: "Headache and dizziness",
    history: "Migraines occasionally",
    observations: "BP slightly elevated",
    investigations: "BP monitoring",
    diagnosis: "Migraine Episode",
    treatment: "Ibuprofen, cold compress",
    advice: "Avoid stress, rest in dark room",
  },
  {
    date: "2025-12-03",
    title: "Clinical Notes",
    complaints: "Stomach pain and nausea",
    history: "Gastric irritation",
    observations: "Mild tenderness in abdomen",
    investigations: "LFT, Ultrasound Abdomen",
    diagnosis: "Gastritis",
    treatment: "Pantoprazole, antacids",
    advice: "Avoid spicy food",
  },
  {
    date: "2025-12-04",
    title: "Clinical Notes",
    complaints: "Cough and cold",
    history: "Allergic rhinitis",
    observations: "Nasal congestion",
    investigations: "None",
    diagnosis: "Upper Respiratory Infection",
    treatment: "Antihistamines, steam inhalation",
    advice: "Increase warm fluids",
  },
  {
    date: "2025-12-05",
    title: "Clinical Notes",
    complaints: "Back pain",
    history: "Mild disc bulge",
    observations: "Limited movement",
    investigations: "X-ray lumbar spine",
    diagnosis: "Muscular strain",
    treatment: "Muscle relaxant, hot fomentation",
    advice: "Avoid heavy lifting",
  },
]
const notestData = notesList.map((item) => {
  return {
    type: "notes",
    date: item.date,
    title: item.title,
    icon: "fas fa-notes-medical text-warning",
    html: `
    <table class="table table-sm border-0">
          <tbody>
            <tr>
              <th class="border-0 p-0" style="width:110px; font-size:.8rem">Chief Complaints</th>
              <td class="border-0 p-0" style="font-size:.9rem">: ${item.complaints}</td>
            </tr>
            <tr>
              <th class="border-0 p-0" style="width:110px; font-size:.8rem">Medical History</th>
              <td class="border-0 p-0" style="font-size:.9rem">: ${item.history}</td>
            </tr>
            <tr>
              <th class="border-0 p-0" style="width:110px; font-size:.8rem">Observations</th>
              <td class="border-0 p-0" style="font-size:.9rem">: ${item.observations}</td>
            </tr>
            <tr>
              <th class="border-0 p-0" style="width:110px; font-size:.8rem">Investigations</th>
              <td class="border-0 p-0" style="font-size:.9rem">: ${item.investigations}</td>
            </tr>
            <tr>
              <th class="border-0 p-0" style="width:110px; font-size:.8rem">Diagnosis</th>
              <td class="border-0 p-0" style="font-size:.9rem">: ${item.diagnosis}</td>
            </tr>
            <tr>
              <th class="border-0 p-0" style="width:110px; font-size:.8rem">Treatment</th>
              <td class="border-0 p-0" style="font-size:.9rem">: ${item.treatment}</td>
            </tr>
            <tr>
              <th class="border-0 p-0" style="width:110px; font-size:.8rem">Advice</th>
              <td class="border-0 p-0" style="font-size:.9rem">: ${item.advice}</td>
            </tr>
          </tbody>
   </table>
    `,
    card: `<p style="font-size:.9rem" class="small mb-1"><b>Chief Complaints:</b> ${item.complaints}</p>
      <p style="font-size:.9rem" class="small mb-1"><b>Medical History:</b> ${item.history}</p>
      <p style="font-size:.9rem" class="small mb-1"><b>Observations:</b> ${item.observations}</p>
      <p style="font-size:.9rem" class="small mb-1"><b>Investigations:</b> ${item.investigations}</p>
      <p style="font-size:.9rem" class="small mb-1"><b>Diagnosis:</b> ${item.diagnosis}</p>
      <p style="font-size:.9rem" class="small mb-1"><b>Treatment:</b> ${item.treatment}</p>
      <p style="font-size:.9rem" class="small mb-1"><b>Advice:</b> ${item.advice}</p>`,
  };
});

const historyData = [
  // ================= NEW 10 VITALS ==================
  ...vitalsHistory,
  // ================= NEW 10 PRESCRIPTIONS ==================
  ...prescriptionData,
  // ================= NEW 10 CLINICAL NOTES ==================
  ...notestData,
  // ================= NEW 10 PROCEDURES ==================
  {
    type: "procedure",
    date: "2025-12-01",
    title: "Procedure Performed",
    icon: "fas fa-syringe text-info",
    html: `
          <div class="d-flex justify-content-start ailgn-items-center gap-2">
             <p class="small mb-1"><b>Procedure:</b> IV Cannula Insertion</p>
             <p class="small mb-1"><span class="badge bg-warning text-dark">Planned</span></p>
          </div>
          <p class="small mb-1"><b>Internal Notes:</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
          <p class="small mb-1"><b>Patient Notes:</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
      <small class="text-muted">Requested by Dr. Thomas</small>
    `,
  },
  {
    type: "procedure",
    date: "2025-12-02",
    title: "Procedure Performed",
    icon: "fas fa-syringe text-info",
    html: `
         <div class="d-flex justify-content-start ailgn-items-center gap-2">
            <p class="small mb-1"><b>Procedure:</b> Nebulization</p>
            <p class="small mb-1"> <span class="badge bg-success">Completed</span></p>
          </div>
          <p class="small mb-1"><b>Internal Notes:</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
          <p class="small mb-1"><b>Patient Notes:</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
      <small class="text-muted">Nursing Team • Room 102</small>
    `,
  },
  {
    type: "procedure",
    date: "2025-12-03",
    title: "Procedure Performed",
    icon: "fas fa-syringe text-info",
    html: `
      <div class="d-flex justify-content-start ailgn-items-center gap-2">
          <p class="small mb-1"><b>Procedure:</b> ECG</p>
          <p class="small mb-1"> <span class="badge bg-secondary">Sent to Radiology</span></p>
      </div>
          <p class="small mb-1"><b>Internal Notes:</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
          <p class="small mb-1"><b>Patient Notes:</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
      <small class="text-muted">Radiology Department</small>
    `,
  },

  // ================= NEW 10 FILES ==================

  ...["Allergy Test Report.pdf", "Vaccination Certificate.pdf"].map(
    (file, i) => ({
      type: "files",
      date: `2025-11-${1 + i}`,
      title: "Uploaded Report",
      icon: "fas fa-file text-primary",
      html: `
      <p class="small mb-1"><b>${file}</b></p>
      <p class="small text-muted mb-0">${descriptions[file]}</p>
    `,
    })
  ),

  // ================= NEW 10 DENTAL PROCEDURES ==================
  ...dentalRecords.map((record) => {
    const procedureList = record.procedures
      .map(
        (p) => `
          <li class="text-sm">
            <span class="text-sm">Tooth no# ${p.toothNo} | ${p.name} | </span>  
            Status: <span class="text-primary">${p.status}</span>)
          </li>`
      )
      .join("");

    return {
      type: "dental",
      date: "2025-11-22",
      icon: "fas fa-tooth text-muted",
      title: "Dental Procedure",
      html: `<div class="mt-2">
            <p class="mb-1 text-sm"><b>Chief Complaints:</b> ${record.chiefComplaints}</p>
            <p class="mb-1 text-sm"><b>Observations:</b> ${record.observations}</p>
            <p class="mb-1 text-sm"><b>Medical History:</b> ${record.medicalHistory}</p>
            <p class="mb-1 text-sm"><b>Advice:</b> ${record.advice}</p>

            <p class="mb-1  text-sm"><b>Procedures:</b></p>
            <ul class="small mb-1">${procedureList}</ul>
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
    brand: "Amoxil", // Example Brand
    dosage: "1",
    dosageUnit: "mg",
    duration: 7,
    durationUnit: "1", // Days
    frequency: "1-0-1",
    frequencyUnit: "2", // After food
    dispenseValue: 14, // 2 times a day * 7 days = 14 tablets
    dispenseUnit: "Nos", // Can also be 'Strip' (e.g., 2 strips of 10)
  },
  {
    medicine: "Ibuprofen 400mg",
    brand: "Advil", // Example Brand
    dosage: "1",
    dosageUnit: "mg",
    duration: 5,
    durationUnit: "1",
    frequency: "1-1-1",
    frequencyUnit: "1", // Before food
    dispenseValue: 15, // 3 times a day * 5 days = 15 tablets
    dispenseUnit: "Strip",
  },
  {
    medicine: "Azithromycin 250mg",
    brand: "Zithromax", // Example Brand
    dosage: "1",
    dosageUnit: "mg",
    duration: 3,
    durationUnit: "1",
    frequency: "1-0-0",
    frequencyUnit: "2",
    dispenseValue: 3, // 1 time a day * 3 days = 3 tablets (often packaged this way)
    dispenseUnit: "Nos",
  },
  {
    medicine: "Pantoprazole 40mg",
    brand: "Protonix", // Example Brand
    dosage: "1",
    dosageUnit: "mg",
    duration: 10,
    durationUnit: "1",
    frequency: "0-0-1",
    frequencyUnit: "1",
    dispenseValue: 10, // 1 time a day * 10 days = 10 tablets
    dispenseUnit: "Strip",
  },
  {
    medicine: "Metformin 500mg",
    brand: "Glucophage", // Example Brand
    dosage: "1",
    dosageUnit: "mg",
    duration: 30,
    durationUnit: "3", // Months (90 days)
    frequency: "1-0-1", // 2 times a day
    frequencyUnit: "3", // None
    dispenseValue: 180, // 2 times a day * 90 days = 180 tablets
    dispenseUnit: "Nos",
  },
  {
    medicine: "Vitamin D3 60k IU",
    brand: "D-Rise", // Example Brand
    dosage: "1",
    dosageUnit: "mg",
    duration: 8,
    durationUnit: "2", // Weeks (8 capsules for 8 weeks)
    frequency: "0-0-1", // Assumed once weekly
    frequencyUnit: "2",
    dispenseValue: 8,
    dispenseUnit: "Capsules",
  },
  {
    medicine: "Cough Syrup 5ml",
    brand: "Ascoril", // Example Brand
    dosage: "5",
    dosageUnit: "ml",
    duration: 7,
    durationUnit: "1",
    frequency: "1-1-1", // 3 times a day (total 15ml/day)
    frequencyUnit: "3",
    // Total required: 15ml/day * 7 days = 105ml. Dispense a 100ml bottle.
    dispenseValue: 100,
    dispenseUnit: "ml Bottle",
  },
  {
    medicine: "ORS Solution 200ml",
    brand: "Electral", // Example Brand
    dosage: "200",
    dosageUnit: "ml",
    duration: 2,
    durationUnit: "1",
    frequency: "2-2-2", // 6 times a day (total 1200ml/day)
    frequencyUnit: "3",
    // Total required: 1200ml/day * 2 days = 2400ml. Dispense 12 sachets (200ml each).
    dispenseValue: 12,
    dispenseUnit: "Sachets",
  },
  {
    medicine: "Aspirin 75mg",
    brand: "Ecosprin", // Example Brand
    dosage: "1",
    dosageUnit: "mg",
    duration: 30,
    durationUnit: "3", // Months (90 days)
    frequency: "1-0-0", // 1 time a day
    frequencyUnit: "2",
    dispenseValue: 90, // 1 time a day * 90 days = 90 tablets
    dispenseUnit: "Nos",
  },
  {
    medicine: "Loratadine 10mg",
    brand: "Claritin", // Example Brand
    dosage: "10",
    dosageUnit: "mg",
    duration: 7,
    durationUnit: "1",
    frequency: "0-0-1", // 1 time a day
    frequencyUnit: "3",
    dispenseValue: 7, // 1 time a day * 7 days = 7 tablets
    dispenseUnit: "Strip",
  },
];
