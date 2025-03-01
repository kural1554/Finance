// constants/formConfig.js
export const formTabs = [
        { id: 1, title: "Personal Details", icon: "bx-user" },
        { id: 2, title: "Loan Details", icon: "bx-dollar" },
        { id: 3, title: "Employment Details", icon: "bx-briefcase" },
        { id: 4, title: "Bank Details", icon: "mdi mdi-bank" },
        { id: 5, title: "Property Details", icon: "bx-home" },
        { id: 6, title: "References", icon: "bx-group" },
        { id: 7, title: "Agreement", icon: "bx-check-shield" },
        { id: 8, title: "Final Review", icon: "bx-check-circle" },
      
      
   
  ];
  
  export const initialFormData = {
    // Personal Information
    title: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    education: "",
    email: "",
    phone: "",
    alternatePhone: "",
  
    // Identification
    panNumber: "",
    aadharNumber: "",
  
    // Address Details
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    residenceType: "",
    yearsAtCurrentAddress: "",
  
    // Employment Details
    employmentType: "",
    employerName: "",
    jobTitle: "",
    employerAddress: "",
    employerPhone: "",
    yearsWithEmployer: "",
    monthlyIncome: "",
    otherIncome: "",
  
    // Loan Details
    loanType: "",
    loanAmount: "",
    loanTermType:"",
    interestRate: "",
    purposeOfLoan: "",
    loanPurposeDetail: "",
    repaymentSource: "",
    additionalComments: "",
  
    // Property Details
    propertyType: "",
    propertyAddress: "",
    propertyValue: "",
    propertyAge: "",
    propertySize: "",
    propertyOwnership: "",
  
    // References
    reference1Name: "",
    reference1Relationship: "",
    reference1Phone: "",
    reference1Email: "",
    reference2Name: "",
    reference2Relationship: "",
    reference2Phone: "",
    reference2Email: "",
  
    // Agreement & Signatures
    agreeTerms: false,
    agreeCreditCheck: false,
    agreeDataSharing: false,
    needsTranslator: false,
    translatorName: "",
    translatorSignature: "",
    applicantThumbprint: false,
    applicantSignature: null,
  };
  