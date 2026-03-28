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
const allergies = []
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
  chiefComplaints: "",
  medicalHistory: "",
  observations: "",
  investigations: "",
  diagnosis: "",
  treatment: "",
  advice: "",
};

const clinicalTemplates = [];

let procData = [];

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

const prescriptions = [];

const labTests = [];

const testCategories = [];

const labPackages = [];

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
  