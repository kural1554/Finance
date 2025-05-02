// constants/formConfig.js
export const formTabs = [
  { id: 1, title: "Personal Details", icon: "bx-user" },
  { id: 2, title: "Employment Details", icon: "bx-briefcase" },
  { id: 3, title: "Bank Details", icon: "mdi mdi-bank" },
  { id: 4, title: "Property Details", icon: "bx-home" },
  { id: 5, title: "Documents", icon: "bx-file" }
];

export const initialFormData = {
  // Personal Details
  userID: "",
  title: "",
  first_name: "",
  last_name: "",
  dateOfBirth: "",
  gender: "",
  maritalStatus: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  profile_photo: null,
  
  // Employment Details (array to support multiple employments)
  employment: [{
    employmentType: "",
    jobTitle: "",
    yearsWithEmployer: "",
    monthlyIncome: "",
    otherIncome: ""
  }],
  
  // Bank Details (array to support multiple accounts)
  banking_details: [{
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    bankBranch: "",
    accountType: "1"
  }],
  
  // Property Details (array to support multiple properties)
  properties: [{
    propertyType: "",
    property_address: "",
    propertyValue: "",
    propertyAge: "",
    propertyOwnership: "",
    is_deleted: false,
    remarks: null
  }],
  
  // Documents (array for proofs)
  proofs: [],
  
  // System fields
  is_deleted: false,
  is_approved: false,
  loan_id: null,
  loanreg_date: new Date().toISOString().split('T')[0]
};

// Field configurations for each tab
export const formFields = {
  personalDetails: [
    { name: "title", label: "Title", type: "select", options: [
      { value: 1, label: "Mr" }, 
      { value: 2, label: "Mrs" },
      { value: 3, label: "Ms" }
    ], required: true },
    { name: "first_name", label: "First Name", type: "text", required: true },
    { name: "last_name", label: "Last Name", type: "text", required: true },
    { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
    { name: "gender", label: "Gender", type: "select", options: [
      { value: 1, label: "Male" },
      { value: 2, label: "Female" },
      { value: 3, label: "Other" }
    ], required: true },
    { name: "maritalStatus", label: "Marital Status", type: "select", options: [
      { value: 1, label: "Single" },
      { value: 2, label: "Married" },
      { value: 3, label: "Divorced" },
      { value: 4, label: "Widowed" }
    ], required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "tel", required: true },
    { name: "address", label: "Address", type: "textarea", required: true },
    { name: "city", label: "City", type: "text", required: true },
    { name: "state", label: "State", type: "text", required: true },
    { name: "postalCode", label: "Postal Code", type: "text", required: true },
    { name: "profile_photo", label: "Profile Photo", type: "file", accept: "image/*" }
  ],
  
  employmentDetails: [
    { name: "employment[0].employmentType", label: "Employment Type", type: "select", options: [
      { value: 1, label: "Salaried" },
      { value: 2, label: "Self-Employed" },
      { value: 3, label: "Business" },
      { value: 4, label: "Retired" }
    ], required: true },
    { name: "employment[0].jobTitle", label: "Job Title", type: "text", required: true },
    { name: "employment[0].yearsWithEmployer", label: "Years with Employer", type: "number", required: true },
    { name: "employment[0].monthlyIncome", label: "Monthly Income", type: "number", required: true },
    { name: "employment[0].otherIncome", label: "Other Income", type: "number" }
  ],
  
  bankDetails: [
    { name: "banking_details[0].accountHolderName", label: "Account Holder Name", type: "text", required: true },
    { name: "banking_details[0].accountNumber", label: "Account Number", type: "text", required: true },
    { name: "banking_details[0].bankName", label: "Bank Name", type: "text", required: true },
    { name: "banking_details[0].ifscCode", label: "IFSC Code", type: "text", required: true },
    { name: "banking_details[0].bankBranch", label: "Bank Branch", type: "text", required: true },
    { name: "banking_details[0].accountType", label: "Account Type", type: "select", options: [
      { value: 1, label: "Savings" },
      { value: 2, label: "Current" }
    ], required: true }
  ],
  
  propertyDetails: [
    { name: "properties[0].propertyType", label: "Property Type", type: "select", options: [
      { value: 1, label: "Residential" },
      { value: 2, label: "Commercial" },
      { value: 3, label: "Land" }
    ], required: true },
    { name: "properties[0].property_address", label: "Property Address", type: "textarea", required: true },
    { name: "properties[0].propertyValue", label: "Property Value", type: "number", required: true },
    { name: "properties[0].propertyAge", label: "Property Age (years)", type: "number", required: true },
    { name: "properties[0].propertyOwnership", label: "Ownership Type", type: "select", options: [
      { value: 1, label: "Owned" },
      { value: 2, label: "Mortgaged" },
      { value: 3, label: "Leased" }
    ], required: true }
  ]
};

// Validation schema (you can use with Yup or similar)
export const validationSchema = {
  first_name: { required: true, minLength: 2, maxLength: 50 },
  last_name: { required: true, minLength: 2, maxLength: 50 },
  dateOfBirth: { required: true, isDate: true },
  email: { required: true, isEmail: true },
  phone: { required: true, isPhone: true, minLength: 10, maxLength: 15 },
  postalCode: { required: true, minLength: 5, maxLength: 10 },
  "employment[0].monthlyIncome": { required: true, minValue: 0 },
  "banking_details[0].accountNumber": { required: true, minLength: 9, maxLength: 18 },
  "properties[0].propertyValue": { required: true, minValue: 0 }
};

// Helper function to transform API data to form data
export const transformApiToFormData = (apiData) => {
  return {
    ...apiData,
    // Convert nested arrays to the format expected by the form
    employment: apiData.employment || [initialFormData.employment[0]],
    banking_details: apiData.banking_details || [initialFormData.banking_details[0]],
    properties: apiData.properties || [initialFormData.properties[0]],
    proofs: apiData.proofs || []
  };
};

// Helper function to transform form data to API data
export const transformFormToApiData = (formData) => {
  return {
    ...formData,
    // Ensure all fields are in the correct format for the API
    employment: formData.employment.filter(emp => emp.employmentType),
    banking_details: formData.banking_details.filter(bank => bank.bankName),
    properties: formData.properties.filter(prop => prop.propertyType)
  };
};