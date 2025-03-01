// utils/validations.js
const validateForm = (activeTab, formData, setErrors) => {
    const newErrors = {};
  
    // Validate fields based on the active tab
    switch (activeTab) {
      case 1:
        if (!formData.firstName) newErrors.firstName = "First name is required.";
        if (!formData.lastName) newErrors.lastName = "Last name is required.";
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required.";
        if (!formData.gender) newErrors.gender = "Gender is required.";
  
        if (!formData.email) {
          newErrors.email = "Email is required.";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
          newErrors.email = "Enter a valid email address.";
        }
  
        if (!formData.phone) {
          newErrors.phone = "Phone number is required.";
        } else if (!/^\d{10}$/.test(formData.phone)) {
          newErrors.phone = "Enter a valid 10-digit phone number.";
        }
  
        if (!formData.addressLine1) newErrors.addressLine1 = "Address Line 1 is required.";
        if (!formData.city) newErrors.city = "City is required.";
        if (!formData.state) newErrors.state = "State is required.";
  
        if (!formData.postalCode) {
          newErrors.postalCode = "Postal code is required.";
        } else if (!/^\d{5,6}$/.test(formData.postalCode)) {
          newErrors.postalCode = "Enter a valid postal code.";
        }
  
        if (!formData.idProofType) newErrors.idProofType = "ID proof type is required.";
  
        if (!formData.idProof) {
          newErrors.idProof = "ID proof number is required.";
        } else if (
          formData.idProofType === "pan" &&
          !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.idProof)
        ) {
          newErrors.idProof = "Enter a valid PAN number (ABCDE1234F).";
        } else if (
          formData.idProofType === "aadhar" &&
          !/^\d{12}$/.test(formData.idProof)
        ) {
          newErrors.idProof = "Enter a valid 12-digit Aadhar number.";
        }
        break;
  
      case 2:
        if (!formData.loanAmount) newErrors.loanAmount = "Loan amount is required.";
        if (!formData.loanTerm) newErrors.loanTerm = "Loan term is required.";
        if (!formData.interestRate) newErrors.interestRate = "Interest rate is required.";
        break;
  
      case 3:
        if (!formData.employmentType) newErrors.employmentType = "Employment type is required.";
        if (!formData.employerName) newErrors.employerName = "Employer name is required.";
        break;
  
      case 4:
        if (!formData.loanPurposeDetail) newErrors.loanPurposeDetail = "Loan purpose detail is required.";
        if (!formData.repaymentSource) newErrors.repaymentSource = "Source of repayment is required.";
        break;
  
      case 5:
        if (!formData.propertyType) newErrors.propertyType = "Property type is required.";
        if (!formData.propertyAddress) newErrors.propertyAddress = "Property address is required.";
        break;
  
      case 6:
        if (!formData.reference1Name) newErrors.reference1Name = "Reference 1 name is required.";
        if (!formData.reference1Phone) {
          newErrors.reference1Phone = "Reference 1 phone is required.";
        } else if (!/^\d{10}$/.test(formData.reference1Phone)) {
          newErrors.reference1Phone = "Enter a valid 10-digit phone number.";
        }
        break;
  
      case 7:
        if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms.";
        break;
  
      case 8:
        if (!formData.translatorName) newErrors.translatorName = "Translator name is required.";
        break;
  
      default:
        break;
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  
  export default validateForm;