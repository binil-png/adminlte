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
  ...[
    "Temp: 99°F | BP 118/78 | Pulse 80",
    "Temp: 100.2°F | BP 130/85 | Pulse 88",
    "Temp: 97.9°F | BP 110/70 | Pulse 65",
    "Temp: 98.4°F | BP 125/82 | Pulse 76",
    "Temp: 101°F | BP 140/90 | Pulse 92",
    "Temp: 98.1°F | BP 119/79 | Pulse 74",
    "Temp: 99.5°F | BP 135/88 | Pulse 84",
    "Temp: 98.7°F | BP 122/81 | Pulse 73",
    "Temp: 100°F | BP 128/86 | Pulse 89",
    "Temp: 97.5°F | BP 115/75 | Pulse 68",
  ].map((v, i) => ({
    type: "vitals",
    date: `2025-11-${15 + i}`,
    title: "Vitals Recorded",
    icon: "fa fa-stethoscope text-success",
    html: `
      <p class="small mb-1">${v}</p>
      <small class="text-muted">${2 + i}:00 PM • Nurse Station</small>
    `,
  })),

  // ================= NEW 10 PRESCRIPTIONS ==================
  ...[
    ["Paracetamol 650mg", "Cetirizine 10mg","Amoxicillin 500mg", "Vitamin C 500mg"],
    ["Amoxicillin 500mg", "Vitamin C 500mg"],
    ["Azithromycin 250mg", "Pantoprazole 40mg"],
    ["Ibuprofen 400mg", "Domperidone 10mg"],
    ["Metformin 500mg", "Glimepiride 1mg"],
    ["Losartan 50mg", "Aspirin 75mg"],
    ["Dolo 650", "Rantac 150","ORS Solution", "Zinc 20mg","Multivitamin", "Calcium 500mg"],
    ["Cough Syrup 10ml", "Steam Inhalation"],
    ["ORS Solution", "Zinc 20mg"],
    ["Multivitamin", "Calcium 500mg"],
  ].map((meds, i) => ({
    type: "prescription",
    date: `2025-11-${10 + i}`,
    title: "Prescription",
    icon: "fas fa-capsules text-primary",
    html: `
      <p class="small mb-1"><b>Medicines:</b></p>
      <ul class="small mb-1">
        ${meds.map((m) => `<li>${m}</li>`).join("")}
      </ul>
      <small class="text-muted">Duration: ${3 + i} Days</small>
    `,
  })),

  // ================= NEW 10 CLINICAL NOTES ==================
  ...[
    "Patient reported mild headache.",
    "Complained of abdominal pain.",
    "Follow-up for blood pressure.",
    "Sore throat and cough observed.",
    "Advised lifestyle modifications.",
    "No major symptoms today.",
    "Improved breathing pattern.",
    "Pain reduced significantly.",
    "Sleep disturbance noted.",
    "General checkup completed.",
  ].map((note, i) => ({
    type: "notes",
    date: `2025-11-${12 + i}`,
    title: "Clinical Notes",
    icon: "fas fa-notes-medical text-secondary",
    html: `
      <p class="small mb-1">${note}</p>
      <small class="text-muted">${10 + i}:30 AM • Dr. Lisa</small>
    `,
  })),

  // ================= NEW 10 PROCEDURES ==================
  ...[
    "IV Cannula insertion",
    "Blood sample collection",
    "Nebulization therapy",
    "Ultrasound abdomen",
    "X-Ray Chest",
    "CT Scan (Brain)",
    "ECG Test performed",
    "Suture removal",
    "Wound dressing",
    "Physiotherapy session",
  ].map((proc, i) => ({
    type: "procedure",
    date: `2025-11-${5 + i}`,
    title: "Procedure Performed",
    icon: "fas fa-syringe text-info",
    html: `
      <p class="small mb-1">${proc}</p>
      <p class="small mb-1">
        Status: <span class="badge bg-info text-dark">${i % 2 === 0 ? "Completed" : "Pending"}</span>
      </p>
      <small class="text-muted">${9 + i}:00 AM • Nurse Ward</small>
    `,
  })),

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
  ...[
    "Scaling & Polishing",
    "Tooth extraction – Tooth 14",
    "Dental filling – Tooth 11",
    "Crown placement – Tooth 26",
    "Braces tightening",
    "Dental cleaning",
    "Wisdom tooth extraction",
    "Gum infection treatment",
    "Tooth whitening session",
    "Retainer adjustment",
  ].map((dental, i) => ({
    type: "dental",
    date: `2025-11-${3 + i}`,
    title: "Dental Procedure",
    icon: "fas fa-tooth text-muted",
    html: `
      <p class="small mb-1">${dental}</p>
      <small class="text-muted">${11 + i}:15 AM • Dr. Miller</small>
    `,
  })),
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
