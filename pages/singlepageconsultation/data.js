let globalySelectedDoctor = null;
let patientDataGlobal = null;
let addAllergies = [];
let baseUrl = "http://localhost:8080";
const teeth = [
  // upper jaw
  { number: 18, image: "18_28.png", surface: "18_28C.png" },
  { number: 17, image: "17_27.png", surface: "17_27C.png" },
  { number: 16, image: "16_26.png", surface: "16_26C.png" },
  { number: 15, image: "15_25.png", surface: "15_25C.png" },
  { number: 14, image: "14_24.png", surface: "14_24C.png" },
  { number: 13, image: "13_23.png", surface: "13_23C.png" },
  { number: 12, image: "12_22.png", surface: "12_22C.png" },
  { number: 11, image: "11_21.png", surface: "11_21C.png" },
  { number: 21, image: "11_21.png", surface: "11_21C.png" },
  { number: 22, image: "12_22.png", surface: "12_22C.png" },
  { number: 23, image: "13_23.png", surface: "13_23C.png" },
  { number: 24, image: "14_24.png", surface: "14_24C.png" },
  { number: 25, image: "15_25.png", surface: "15_25C.png" },
  { number: 26, image: "16_26.png", surface: "16_26C.png" },
  { number: 27, image: "17_27.png", surface: "17_27C.png" },
  { number: 28, image: "18_28.png", surface: "18_28C.png" },
  // lower jaw
  { number: 48, image: "38_48.png", surface: "38_48C.png" },
  { number: 47, image: "47_37.png", surface: "47_37C.png" },
  { number: 46, image: "46_36.png", surface: "46_36C.png" },
  { number: 45, image: "45_35.png", surface: "45_35C.png" },
  { number: 44, image: "34_44.png", surface: "34_44C.png" },
  { number: 43, image: "43_33.png", surface: "43_33C.png" },
  { number: 42, image: "32_42.png", surface: "32_42C.png" },
  { number: 41, image: "41_31.png", surface: "41_31C.png" },
  { number: 31, image: "41_31.png", surface: "41_31C.png" },
  { number: 32, image: "32_42.png", surface: "32_42C.png" },
  { number: 33, image: "43_33.png", surface: "43_33C.png" },
  { number: 34, image: "34_44.png", surface: "34_44C.png" },
  { number: 35, image: "45_35.png", surface: "45_35C.png" },
  { number: 36, image: "46_36.png", surface: "46_36C.png" },
  { number: 37, image: "47_37.png", surface: "47_37C.png" },
  { number: 38, image: "38_48.png", surface: "38_48C.png" },
];

const childTeeth = [
  { number: 55, image: "childTeeth/F51.gif", surface: "childTeeth/O51.gif" },
  { number: 54, image: "childTeeth/F52.gif", surface: "childTeeth/O52.gif" },
  { number: 53, image: "childTeeth/F53.gif", surface: "childTeeth/O53.gif" },
  { number: 52, image: "childTeeth/F54.gif", surface: "childTeeth/O54.gif" },
  { number: 51, image: "childTeeth/F55.gif", surface: "childTeeth/O55.gif" },
  { number: 61, image: "childTeeth/F61.gif", surface: "childTeeth/O61.gif" },
  { number: 62, image: "childTeeth/F62.gif", surface: "childTeeth/O62.gif" },
  { number: 63, image: "childTeeth/F63.gif", surface: "childTeeth/O63.gif" },
  { number: 64, image: "childTeeth/F64.gif", surface: "childTeeth/O64.gif" },
  { number: 65, image: "childTeeth/F65.gif", surface: "childTeeth/O65.gif" },
  { number: 85, image: "childTeeth/F71.gif", surface: "childTeeth/O71.gif" },
  { number: 84, image: "childTeeth/F72.gif", surface: "childTeeth/O72.gif" },
  { number: 83, image: "childTeeth/F73.gif", surface: "childTeeth/O73.gif" },
  { number: 82, image: "childTeeth/F74.gif", surface: "childTeeth/O74.gif" },
  { number: 81, image: "childTeeth/F75.gif", surface: "childTeeth/O75.gif" },
  { number: 71, image: "childTeeth/F81.gif", surface: "childTeeth/O81.gif" },
  { number: 72, image: "childTeeth/F82.gif", surface: "childTeeth/O82.gif" },
  { number: 73, image: "childTeeth/F83.gif", surface: "childTeeth/O83.gif" },
  { number: 74, image: "childTeeth/F84.gif", surface: "childTeeth/O84.gif" },
  { number: 75, image: "childTeeth/F85.gif", surface: "childTeeth/O85.gif" },
];

const descriptions = {
  "Vaccination Certificate.pdf":
    "Official certificate confirming vaccination with date and batch number.",
  "Allergy Test Report.pdf":
    "Allergen sensitivity results including IgE levels and reaction severity.",
};

const notestText = "mb-1";
const notestStyle = "font-size:.9rem";

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

const labTests = [
  { id: 1, label: "Complete Blood Count (CBC)", price: 350 },
  { id: 2, label: "Liver Function Test (LFT)", price: 750 },
  { id: 3, label: "Kidney Function Test (KFT)", price: 600 },
  { id: 4, label: "HbA1c (Diabetes Screen)", price: 450 },
  { id: 5, label: "Lipid Profile (Cholesterol)", price: 500 },
  { id: 6, label: "Thyroid Stimulating Hormone (TSH)", price: 300 },
  { id: 7, label: "Vitamin D (25-OH)", price: 1200 },
  { id: 8, label: "Urinalysis", price: 150 },
  { id: 9, label: "Blood Glucose (Fasting)", price: 100 },
  { id: 10, label: "C-Reactive Protein (CRP)", price: 400 },
];

const testCategories = [
  { id: 101, label: "Hematology", price: 800 },
  { id: 102, label: "Biochemistry", price: 1100 },
  { id: 103, label: "Diabetes Care", price: 500 },
  { id: 104, label: "Cardiology", price: 1500 },
  { id: 105, label: "Thyroid Profile", price: 650 },
  { id: 106, label: "Vitamins & Minerals", price: 1800 },
  { id: 107, label: "Kidney Care", price: 900 },
  { id: 108, label: "Liver Care", price: 850 },
  { id: 109, label: "Hormone Tests", price: 1400 },
  { id: 110, label: "Immunology", price: 1250 },
];

const labPackages = [
  { id: 201, label: "Basic Health Checkup", testCount: 4, price: 1800 },
  { id: 202, label: "Comprehensive Health Checkup", testCount: 7, price: 4200 },
  { id: 203, label: "Cardiac Checkup", testCount: 4, price: 2700 },
  { id: 204, label: "Senior Citizen Male", testCount: 12, price: 5500 },
  { id: 205, label: "Senior Citizen Female", testCount: 13, price: 5500 },
  { id: 206, label: "Full Body Screening", testCount: 15, price: 7000 },
  { id: 207, label: "Diabetes Essential Package", testCount: 5, price: 2200 },
  { id: 208, label: "Executive Health Profile", testCount: 10, price: 4800 },
  { id: 209, label: "Women Wellness Package", testCount: 8, price: 3500 },
  { id: 210, label: "Post-Viral Recovery Check", testCount: 6, price: 2900 },
];

const categoryTestsMap = {
  101: {
    id: 101,
    label: "Hematology",
    price: 800,
    tests: [{ id: 1, label: "Complete Blood Count (CBC)", price: 350 }],
  },
  102: {
    id: 102,
    label: "Biochemistry",
    price: 1100,
    tests: [
      { id: 2, label: "Liver Function Test (LFT)", price: 750 },
      { id: 3, label: "Kidney Function Test (KFT)", price: 600 },
      { id: 5, label: "Lipid Profile (Cholesterol)", price: 500 },
      { id: 10, label: "C-Reactive Protein (CRP)", price: 400 },
    ],
  },
  103: {
    id: 103,
    label: "Diabetes Care",
    price: 500,
    tests: [
      { id: 4, label: "HbA1c (Diabetes Screen)", price: 450 },
      { id: 9, label: "Blood Glucose (Fasting)", price: 100 },
    ],
  },
  104: {
    id: 104,
    label: "Cardiology",
    price: 1500,
    tests: [
      { id: 5, label: "Lipid Profile (Cholesterol)", price: 500 },
      { id: 10, label: "C-Reactive Protein (CRP)", price: 400 },
    ],
  },
  105: {
    id: 105,
    label: "Thyroid Profile",
    price: 650,
    tests: [{ id: 6, label: "Thyroid Stimulating Hormone (TSH)", price: 300 }],
  },
  106: {
    id: 106,
    label: "Vitamins & Minerals",
    price: 1800,
    tests: [{ id: 7, label: "Vitamin D (25-OH)", price: 1200 }],
  },
  107: {
    id: 107,
    label: "Kidney Care",
    price: 900,
    tests: [
      { id: 3, label: "Kidney Function Test (KFT)", price: 600 },
      { id: 8, label: "Urinalysis", price: 150 },
    ],
  },
  108: {
    id: 108,
    label: "Liver Care",
    price: 850,
    tests: [{ id: 2, label: "Liver Function Test (LFT)", price: 750 }],
  },
  109: {
    id: 109,
    label: "Hormone Tests",
    price: 1400,
    tests: [{ id: 6, label: "Thyroid Stimulating Hormone (TSH)", price: 300 }],
  },
  110: {
    id: 110,
    label: "Immunology",
    price: 1250,
    tests: [{ id: 10, label: "C-Reactive Protein (CRP)", price: 400 }],
  },
};

const packageTestsMap = {
  201: {
    id: 201,
    label: "Basic Health Checkup",
    price: 1800,
    tests: [
      { id: 1, label: "Complete Blood Count (CBC)", price: 350 },
      { id: 4, label: "HbA1c (Diabetes Screen)", price: 450 },
      { id: 8, label: "Urinalysis", price: 150 },
      { id: 9, label: "Blood Glucose (Fasting)", price: 100 },
    ],
  },
  202: {
    id: 202,
    label: "Comprehensive Health Checkup",
    price: 4200,
    tests: [
      { id: 1, label: "Complete Blood Count (CBC)", price: 350 },
      { id: 2, label: "Liver Function Test (LFT)", price: 750 },
      { id: 3, label: "Kidney Function Test (KFT)", price: 600 },
      { id: 4, label: "HbA1c (Diabetes Screen)", price: 450 },
      { id: 5, label: "Lipid Profile (Cholesterol)", price: 500 },
      { id: 6, label: "Thyroid Stimulating Hormone (TSH)", price: 300 },
      { id: 8, label: "Urinalysis", price: 150 },
    ],
  },
  203: {
    id: 203,
    label: "Cardiac Checkup",
    price: 2700,
    tests: [
      { id: 1, label: "Complete Blood Count (CBC)", price: 350 },
      { id: 5, label: "Lipid Profile (Cholesterol)", price: 500 },
      { id: 10, label: "C-Reactive Protein (CRP)", price: 400 },
      { id: 9, label: "Blood Glucose (Fasting)", price: 100 },
    ],
  },
  204: {
    id: 204,
    label: "Senior Citizen Male",
    price: 5500,
    tests: [
      { id: 1, label: "Complete Blood Count (CBC)", price: 350 },
      { id: 2, label: "Liver Function Test (LFT)", price: 750 },
      { id: 3, label: "Kidney Function Test (KFT)", price: 600 },
      { id: 4, label: "HbA1c (Diabetes Screen)", price: 450 },
      { id: 5, label: "Lipid Profile (Cholesterol)", price: 500 },
      { id: 6, label: "Thyroid Stimulating Hormone (TSH)", price: 300 },
      { id: 7, label: "Vitamin D (25-OH)", price: 1200 },
      { id: 8, label: "Urinalysis", price: 150 },
      { id: 9, label: "Blood Glucose (Fasting)", price: 100 },
      { id: 10, label: "C-Reactive Protein (CRP)", price: 400 },
    ],
  },
  205: {
    id: 205,
    label: "Senior Citizen Female",
    price: 5500,
    tests: [
      { id: 1, label: "Complete Blood Count (CBC)", price: 350 },
      { id: 2, label: "Liver Function Test (LFT)", price: 750 },
      { id: 3, label: "Kidney Function Test (KFT)", price: 600 },
      { id: 4, label: "HbA1c (Diabetes Screen)", price: 450 },
      { id: 5, label: "Lipid Profile (Cholesterol)", price: 500 },
      { id: 6, label: "Thyroid Stimulating Hormone (TSH)", price: 300 },
      { id: 7, label: "Vitamin D (25-OH)", price: 1200 },
      { id: 8, label: "Urinalysis", price: 150 },
      { id: 9, label: "Blood Glucose (Fasting)", price: 100 },
      { id: 10, label: "C-Reactive Protein (CRP)", price: 400 },
    ],
  },
  206: {
    id: 206,
    label: "Full Body Screening",
    price: 7000,
    tests: [
      { id: 1, label: "Complete Blood Count (CBC)", price: 350 },
      { id: 2, label: "Liver Function Test (LFT)", price: 750 },
      { id: 3, label: "Kidney Function Test (KFT)", price: 600 },
      { id: 4, label: "HbA1c (Diabetes Screen)", price: 450 },
      { id: 5, label: "Lipid Profile (Cholesterol)", price: 500 },
      { id: 6, label: "Thyroid Stimulating Hormone (TSH)", price: 300 },
      { id: 7, label: "Vitamin D (25-OH)", price: 1200 },
      { id: 8, label: "Urinalysis", price: 150 },
      { id: 9, label: "Blood Glucose (Fasting)", price: 100 },
      { id: 10, label: "C-Reactive Protein (CRP)", price: 400 },
    ],
  },
  207: {
    id: 207,
    label: "Diabetes Essential Package",
    price: 2200,
    tests: [
      { id: 4, label: "HbA1c (Diabetes Screen)", price: 450 },
      { id: 9, label: "Blood Glucose (Fasting)", price: 100 },
      { id: 3, label: "Kidney Function Test (KFT)", price: 600 },
      { id: 8, label: "Urinalysis", price: 150 },
      { id: 1, label: "Complete Blood Count (CBC)", price: 350 },
    ],
  },
  208: {
    id: 208,
    label: "Executive Health Profile",
    price: 4800,
    tests: [
      { id: 1, label: "Complete Blood Count (CBC)", price: 350 },
      { id: 2, label: "Liver Function Test (LFT)", price: 750 },
      { id: 3, label: "Kidney Function Test (KFT)", price: 600 },
      { id: 5, label: "Lipid Profile (Cholesterol)", price: 500 },
      { id: 6, label: "Thyroid Stimulating Hormone (TSH)", price: 300 },
      { id: 10, label: "C-Reactive Protein (CRP)", price: 400 },
    ],
  },
  209: {
    id: 209,
    label: "Women Wellness Package",
    price: 3500,
    tests: [
      { id: 1, label: "Complete Blood Count (CBC)", price: 350 },
      { id: 4, label: "HbA1c (Diabetes Screen)", price: 450 },
      { id: 6, label: "Thyroid Stimulating Hormone (TSH)", price: 300 },
      { id: 7, label: "Vitamin D (25-OH)", price: 1200 },
      { id: 8, label: "Urinalysis", price: 150 },
    ],
  },
  210: {
    id: 210,
    label: "Post-Viral Recovery Check",
    price: 2900,
    tests: [
      { id: 1, label: "Complete Blood Count (CBC)", price: 350 },
      { id: 10, label: "C-Reactive Protein (CRP)", price: 400 },
      { id: 2, label: "Liver Function Test (LFT)", price: 750 },
      { id: 3, label: "Kidney Function Test (KFT)", price: 600 },
    ],
  },
};
