// constants/formConfig.js
export const formTabs = [
        { id: 1, title: "Personal Details", icon: "bx-user" },
        { id: 2, title: "Loan Details", icon: "bx-rupee" },
        { id: 3, title: "Employment Details", icon: "bx-briefcase" },
        { id: 4, title: "Bank Details", icon: "mdi mdi-bank" },
        { id: 5, title: "Property Details", icon: "bx-home" },
        { id: 6, title: "References", icon: "bx-group" },
        { id: 7, title: "Agreement", icon: "bx-check-shield" },
        { id: 8, title: "Final Review", icon: "bx-check-circle" },
      
      
   
  ];
  
  export const initialFormData = {
    // Personal Details
    title: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  
    // Loan Details
    loanAmount: "",
    loanTerm: "",
    loanTermType: "",
    interestRate: "",
    loanPurpose: "",
    loanPurposeOther: "",
    repaymentSource: "",
  
    // Employment Details
    employmentType: "",
    jobTitle: "",
    yearsWithEmployer: "",
    monthlyIncome: "",
    otherIncome: "",
  
    // Bank Details
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    bankBranch: "",
    accountType: "",
  
    // Property Details
    propertyType: "",
    propertyAddress: "",
    propertyValue: "",
    propertyAge: "",
    propertyOwnership: "",
  
    // References (Nominees)
    nominees: [],
  
    // Agreement
    agreeTerms: false,
    agreeCreditCheck: false,
    agreeDataSharing: false,
  
    // Final Review
    translatorName: "",
    translatorPlace: "",
    translatorDate: "",
    remarks: "",
  
    // File Uploads
    passportPhoto: null,
    idProofFile: {},
  };