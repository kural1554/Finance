// constants/formConfig.js
export const formTabs = [
        { id: 1, title: "Personal Details", icon: "bx-user" },
       
        { id: 2, title: "Employment Details", icon: "bx-briefcase" },
        { id: 3, title: "Bank Details", icon: "mdi mdi-bank" },
        { id: 4, title: "Property Details", icon: "bx-home" },
        
];
  
  export const initialFormData = {
    // Personal Details
    userID:"",
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
    property_address: "",
    propertyValue: "",
    propertyAge: "",
    propertyOwnership: "",
  

    
  };
  