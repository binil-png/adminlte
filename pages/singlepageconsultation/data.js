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

const patientHistory = [
  {
    type: "vitals",
    date: "2025-11-26",
    title: "Vitals Recorded",
    details: "Temp: 98.6°F | BP 120/80 | Pulse 72",
    time: "3:00 PM • Nurse Station",
  },
  {
    type: "prescription",
    date: "2025-11-26",
    title: "Prescription",
    details: "Paracetamol • 5 Days",
  },
  {
    type: "procedure",
    date: "2025-11-25",
    title: "Procedure Performed",
    details: "Wound cleaning & dressing applied.",
    extra: "Completed",
    time: "4:15 PM • Nurse Emily • Ward 3B",
  },
  {
    type: "files",
    date: "2025-11-22",
    title: "Uploaded Report",
    details: "Blood Test Report.pdf",
  },
  {
    type: "dental",
    date: "2025-11-22",
    title: "Dental Procedure",
    details: "Root canal performed on tooth 36.",
    time: "1:30 PM • Dr. Miller",
  },
];

const historyData = [
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
    name: "Root Canal",
    qty: 1,
    price: 2500,
    discount: 10,
    status: "Planned",
    total: 2250,
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
  { medicine: "Paracetamol 650mg", dosage: "10",dosageUnit:"mg", duration: 5,durationUnit:"2",frequency:"1-0-1", frequencyUnit: "1" },
  { medicine: "Cetirizine 10mg", dosage: "10",dosageUnit:"mg", duration: 3,durationUnit:"1",frequency:"0-0-1", frequencyUnit: "2" }
];
