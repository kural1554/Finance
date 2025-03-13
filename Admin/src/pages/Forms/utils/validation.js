import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const validateForm = (activeTab, formData, setErrors, idProofFile) => {
  let isValid = true;
  const newErrors = {};
  console.log();
  

  // Helper function to check if a value is empty
  const isEmpty = (value) => {
    return value === null || value === undefined || value === "";
  };
  const requiredDocs = 3; // ✅ Set required document count
  console.log("formData:", formData);
  console.log("idProofFile:", idProofFile);
  // Tab 1: Personal Details
  if (activeTab === 1) {
    if (isEmpty(formData.title)) {
      newErrors.title = "Title is required.";
      isValid = false;
    }
    if (isEmpty(formData.firstName)) {
      newErrors.firstName = "First Name is required.";
      isValid = false;
    }
    if (isEmpty(formData.lastName)) {
      newErrors.lastName = "Last Name is required.";
      isValid = false;
    }
    if (isEmpty(formData.dateOfBirth)) {
      newErrors.dateOfBirth = "Date of Birth is required.";
      isValid = false;
    }
    if (isEmpty(formData.gender)) {
      newErrors.gender = "Gender is required.";
      isValid = false;
    }
    if (isEmpty(formData.maritalStatus)) {
      newErrors.maritalStatus = "Marital Status is required.";
      isValid = false;
    }
    if (isEmpty(formData.email)) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }
    if (isEmpty(formData.phone)) {
      newErrors.phone = "Phone Number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone Number must be 10 digits.";
      isValid = false;
    }
    if (isEmpty(formData.address)) {
      newErrors.address = "Address is required.";
      isValid = false;
    }
    if (isEmpty(formData.city)) {
      newErrors.city = "City is required.";
      isValid = false;
    }
    if (isEmpty(formData.state)) {
      newErrors.state = "State is required.";
      isValid = false;
    }
    if (isEmpty(formData.postalCode)) {
      newErrors.postalCode = "Postal Code is required.";
      isValid = false;
    }
    if (formData.idProofFile && formData.idProofFile.length > 0) {
      const uploadedDocs = formData.idProofFile.length;
      const remainingDocs = requiredDocs - uploadedDocs;
    
      if (remainingDocs > 0) {
        newErrors.idProofFile = `Please upload ${remainingDocs} more ${remainingDocs === 1 ? "document" : "documents"}.`;
        isValid = false;
      }
    } else {
      newErrors.idProofFile = `Please upload ${requiredDocs} documents.`;
      isValid = false;
    }}
  // Tab 2: Loan Details
  if (activeTab === 2) {
    if (isEmpty(formData.loanAmount)) {
      newErrors.loanAmount = "Loan Amount is required.";
      isValid = false;
    } else if (formData.loanAmount <= 0) {
      newErrors.loanAmount = "Loan Amount must be greater than 0.";
      isValid = false;
    }
    if (isEmpty(formData.loanTerm)) {
      newErrors.loanTerm = "Loan Term is required.";
      isValid = false;
    } else if (formData.loanTerm <= 0) {
      newErrors.loanTerm = "Loan Term must be greater than 0.";
      isValid = false;
    }
    if (isEmpty(formData.loanTermType)) {
      newErrors.loanTermType = "Loan Term Type is required.";
      isValid = false;
    }
    if (isEmpty(formData.interestRate)) {
      newErrors.interestRate = "Interest Rate is required.";
      isValid = false;
    } else if (formData.interestRate <= 0) {
      newErrors.interestRate = "Interest Rate must be greater than 0.";
      isValid = false;
    }
    if (formData.loanPurpose === "other" && isEmpty(formData.loanPurposeOther)) {
      newErrors.loanPurposeOther = "Please specify the loan purpose.";
      isValid = false;
    }
  }

  // Tab 3: Employment Details
  if (activeTab === 3) {
    if (isEmpty(formData.employmentType)) {
      newErrors.employmentType = "Employment Type is required.";
      isValid = false;
    }
    if (isEmpty(formData.jobTitle)) {
      newErrors.jobTitle = "Job Title is required.";
      isValid = false;
    }
    if (isEmpty(formData.yearsWithEmployer)) {
      newErrors.yearsWithEmployer = "Years with Employer is required.";
      isValid = false;
    }
    if (isEmpty(formData.monthlyIncome)) {
      newErrors.monthlyIncome = "Monthly Income is required.";
      isValid = false;
    } else if (formData.monthlyIncome <= 0) {
      newErrors.monthlyIncome = "Monthly Income must be greater than 0.";
      isValid = false;
    }
  }

  // Tab 4: Bank Details
  if (activeTab === 4) {
    if (isEmpty(formData.bankName)) {
      newErrors.bankName = "Bank Name is required.";
      isValid = false;
    }
    if (isEmpty(formData.accountHolderName)) {
      newErrors.accountHolderName = "Account Holder Name is required.";
      isValid = false;
    }
    if (isEmpty(formData.accountNumber)) {
      newErrors.accountNumber = "Account Number is required.";
      isValid = false;
    } else if (!/^\d+$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Account Number must contain only numbers.";
      isValid = false;
    } 
    // else if (formData.accountNumber.length < 8 || formData.accountNumber.length > 18) {
    //   newErrors.accountNumber = "Account Number must be between 8 and 18 digits.";
    //   isValid = false;
    // }
    
    if (isEmpty(formData.ifscCode)) {
      newErrors.ifscCode = "IFSC Code is required.";
      isValid = false;
    }
    if (isEmpty(formData.bankBranch)) {
      newErrors.bankBranch = "Bank Branch is required.";
      isValid = false;
    }
    if (isEmpty(formData.accountType)) {
      newErrors.accountType = "Account Type is required.";
      isValid = false;
    }
    if (isEmpty(formData.repaymentSource)) {
      newErrors.repaymentSource = "Source of Repayment is required.";
      isValid = false;
    }
  }

  // Tab 5: Property Details
  if (activeTab === 5) {
    if (isEmpty(formData.propertyType)) {
      newErrors.propertyType = "Property Type is required.";
      isValid = false;
    }
    if (isEmpty(formData.propertyAddress)) {
      newErrors.propertyAddress = "Property Address is required.";
      isValid = false;
    }
    if (isEmpty(formData.propertyValue)) {
      newErrors.propertyValue = "Property Value is required.";
      isValid = false;
    } else if (formData.propertyValue <= 0) {
      newErrors.propertyValue = "Property Value must be greater than 0.";
      isValid = false;
    }
    if (isEmpty(formData.propertyAge)) {
      newErrors.propertyAge = "Property Age is required.";
      isValid = false;
    }
    if (isEmpty(formData.propertyOwnership)) {
      newErrors.propertyOwnership = "Property Ownership is required.";
      isValid = false;
    }
  }

  // Tab 6: References (Nominees)
  if (activeTab === 6) {
    if (formData.nominees && formData.nominees.length > 0) {
      formData.nominees.forEach((nominee, index) => {
        if (isEmpty(nominee.nomineeName)) {
          newErrors[`nominees[${index}].name`] = "Nominee Name is required.";
          isValid = false;
        }
        if (isEmpty(nominee.nomineePhone)) {
          newErrors[`nominees[${index}].phone`] = "Nominee Phone is required.";
          isValid = false;
        } else if (!/^\d{10}$/.test(nominee.nomineePhone)) {
          newErrors[`nominees[${index}].phone`] = "Nominee Phone must be 10 digits.";
          isValid = false;
        }
        if (isEmpty(nominee.nomineeEmail)) {
          newErrors[`nominees[${index}].email`] = "Nominee Email is required.";
          isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nominee.nomineeEmail)) {
          newErrors[`nominees[${index}].email`] = "Invalid Nominee Email format.";
          isValid = false;
        }
        if (isEmpty(nominee.nomineeRelationship)) {
          newErrors[`nominees[${index}].relationship`] = "Nominee Relationship is required.";
          isValid = false;
        }
        if (isEmpty(nominee.nomineeidProofType)) {
          newErrors[`nominees[${index}].idProofType`] = "Nominee ID Proof Type is required.";
          isValid = false;
        }
        if (isEmpty(nominee.nomineeidProofNumber)) {
          newErrors[`nominees[${index}].idProofNumber`] = "Nominee ID Proof Number is required.";
          isValid = false;
        }
        if (!nominee.nomineeidProofFile) {
          newErrors[`nominees[${index}].idProofFile`] = "Nominee ID Proof File is required.";
          isValid = false;
        }
      });
    } else {
      newErrors.nominees = "At least one nominee is required.";
      isValid = false;
    }
  }

  // Tab 7: Agreement
  if (activeTab === 7) {
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions.";
      isValid = false;
    }
    if (!formData.agreeCreditCheck) {
      newErrors.agreeCreditCheck = "You must agree to a credit check.";
      isValid = false;
    }
    if (!formData.agreeDataSharing) {
      newErrors.agreeDataSharing = "You must agree to data sharing.";
      isValid = false;
    }
  }

  // Tab 8: Final Review
  if (activeTab === 8) {
    if (isEmpty(formData.translatorName)) {
      newErrors.translatorName = "Translator Name is required.";
      isValid = false;
    }
    if (isEmpty(formData.translatorPlace)) {
      newErrors.translatorPlace = "please Specify current place";
      isValid = false;
    }
  }

  // Set errors and return validation status
  setErrors(newErrors);
  console.log(newErrors);
  toast.error(newErrors);
  return isValid;
};
export default validateForm