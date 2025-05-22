import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  NavItem,
  NavLink,
  Table,
  TabContent,
  TabPane,
  UncontrolledTooltip,
  Modal,         // For PDF Preview
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import Dropzone from 'react-dropzone';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import { post as apiPost } from '../../helpers/api_helper'; // Adjust this path if needed

 

const LoanProcess = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verifiedApplicantInfo, setVerifiedApplicantInfo] = useState({ pk: null, userID: null });
  const [emiDetails, setEmiDetails] = useState([]);
  const [nominees, setNominees] = useState([]);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
   const [viewMode, setViewMode] = useState('table');
 
   // --- Dropdown Options ---
  const termTypeOptions = [
    { value: "", label: "Select term type..." },
    { value: "Days", label: "Days" },
    { value: "Weeks", label: "Weeks" },
    { value: "Months", label: "Months" },
    { value: "Years", label: "Years" }
  ];

   const purposeOptions = [
    { value: "", label: "Select purpose..." },
    { value: "Childrens Education", label: "Children's Education" },
    { value: "Medical Expenses", label: "Medical Expenses" },
    { value: "Business", label: "Business" },
    { value: "Home Improvement/Purchase", label: "Home Improvement/Purchase" },
    { value: "Vehicle Purchase", label: "Vehicle Purchase" },
    { value: "Personal Expense", label: "Personal Expense" },
    { value: "Debt Consolidation", label: "Debt Consolidation" },
    { value: "Other", label: "Other" }
  ];

   const InterestOptions = [
    { value: "", label: "Select Interest Type..." },
    { value: "1", label: "Diminishing interest rate" }, // Assuming 1 for Diminishing
    { value: "2", label: "Flat interest rate" },       // Assuming 2 for Flat
  ];
   const [newNominee, setNewNominee] = useState({
    nomineeName: "",
    nomineePhone: "",
    nomineeEmail: "",
    nomineeRelationship: "",
    nomineeOtherRelationship: "", // For "Other" relationship
    nomineeAddress: "",
    nomineeidProofType: "",
    nomineeidProofNumber: "",
    nomineeProfilePhoto: null, // Will hold File object
    nomineeidProofFile: null,   // Will hold File object
  });

   // --- Dropdown Options for Nominee Tab ---
  const relationshipOptions = [
    { value: "", label: "Select..." },
    { value: "Spouse", label: "Spouse" }, // Using string values directly
    { value: "Child", label: "Child" },
    { value: "Parent", label: "Parent" },
    { value: "Sibling", label: "Sibling" },
    { value: "Other", label: "Other" } // Special value for "Other"
  ];

  const idProofTypeOptions = [
    { value: "", label: "Select ID..." },
    { value: "PAN Card", label: "PAN Card" },
    { value: "Aadhar Card", label: "Aadhar Card" },
    { value: "Voter ID", label: "Voter ID" },
    { value: "Driving License", label: "Driving License" },
    { value: "Passport", label: "Passport" },
  ];

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    getValues,
    setValue,
    watch,
    reset,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
       // Tab 1
      first_name: '',
      phone: '',
       // Tab 2
      amount: '',
       startDate: new Date().toISOString().split('T')[0], 
      term: '',
      termType: 'Months',
      interestRate: 0,
      interestType: '',
      purpose: '',
      repaymentSource: '',
      // Tab 5 - Agreement Checkboxes
      agreeTerms: false,
      agreeCreditCheck: false,
      agreeDataSharing: false,
      // Tab 6 - Final Details
      translatorName: '',
      translatorPlace: '', // Corresponds to Place of Application
      LoanRegDate: new Date().toISOString().split('T')[0], // Defaults to today
      remarks: '',
    },
  });

  const watchedLoanAmount= watch("amount");

 // --- useEffect Hooks ---
  useEffect(() => { // Auto-set interest rate based on loan amount
    if (watchedLoanAmount === undefined || watchedLoanAmount === null || watchedLoanAmount === '') return;
    const amount = parseFloat(watchedLoanAmount) || 0;
    let rate = 0;
    if (amount <= 100000) rate = 3;
    else if (amount <= 199999) rate = 2.5;
    else if (amount > 200000) rate = 2;
    if (getValues('interestRate') !== rate) {
      setValue('interestRate', rate, { shouldValidate: true, shouldDirty: true });
    }
  }, [watchedLoanAmount, setValue, getValues]);


  useEffect(() => { // Cleanup for nominee file previews
    return () => {
      nominees.forEach(nominee => {
        if (nominee.nomineeProfilePhoto?.preview) URL.revokeObjectURL(nominee.nomineeProfilePhoto.preview);
        if (nominee.nomineeidProofFile?.preview) URL.revokeObjectURL(nominee.nomineeidProofFile.preview);
      });
      if (newNominee.nomineeProfilePhoto?.preview) URL.revokeObjectURL(newNominee.nomineeProfilePhoto.preview);
      if (newNominee.nomineeidProofFile?.preview) URL.revokeObjectURL(newNominee.nomineeidProofFile.preview);
    };
  }, [nominees, newNominee.nomineeProfilePhoto, newNominee.nomineeidProofFile]);


  // --- Helper function to format currency ---
  const formatCurrency = (value) => {
    if (isNaN(parseFloat(value))) return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString) => { // Your provided formatDate
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

   const togglePdfModal = () => setIsPdfModalOpen(!isPdfModalOpen);
  

  // calculateEMIStartDates (NEW - adapted to be a method of the component)
  const calculateEMIStartDatesForSchedule = (loanDateInput) => { // Renamed to avoid conflict if used elsewhere
    const { term } = getValues(); // Get term from RHF

    if (!loanDateInput || !term) {
        console.error("Loan date or term is missing for EMI date calculation.");
        toast.error("Loan Date and Term are required to calculate EMI dates.");
        return [];
    }
    const termValue = parseInt(term);
    if (isNaN(termValue) || termValue <= 0) {
        console.error("Invalid term value for EMI date calculation.");
        toast.error("Invalid Loan Term for EMI date calculation.");
        return [];
    }


    const loanDateObj = new Date(loanDateInput);
    if (isNaN(loanDateObj.getTime())) {
        console.error("Invalid loan date provided for EMI date calculation.");
        toast.error("Invalid Loan Date for EMI date calculation.");
        return [];
    }


    let firstEMIDate = new Date(loanDateObj);
    firstEMIDate.setMonth(loanDateObj.getMonth() + 1);
    firstEMIDate.setDate(5);

    if (loanDateObj.getDate() > 28) {
      firstEMIDate.setMonth(firstEMIDate.getMonth() + 1);
    }

    const emiDates = [];
    for (let i = 0; i < termValue; i++) { // Use termValue (parsed integer)
      let emiDate = new Date(firstEMIDate);
      emiDate.setMonth(firstEMIDate.getMonth() + i);
      emiDates.push(emiDate.toISOString().split('T')[0]);
    }
    return emiDates;
  };

  // calculateEMI (NEW - adapted from your snippet)
  const calculateNewEMI = () => {
    const { amount, term, interestRate, termType, startDate, interestType } = getValues();
    console.log("Calculating EMI with new logic. Inputs:", { amount, term, interestRate, termType, startDate, interestType });

    // Validation for RHF fields (already done by button click, but good for direct calls)
    const requiredFields = ['amount', 'term', 'interestRate', 'termType', 'startDate', 'interestType'];
    for (const field of requiredFields) {
        if (!getValues(field)) {
            toast.error(`Please fill the '${field.replace(/([A-Z])/g, ' $1').toLowerCase()}' field.`);
            return;
        }
    }

    let principal = parseFloat(amount);
    const annualRateDecimal = parseFloat(interestRate) / 100; // e.g., 3% -> 0.03
    const termValue = parseInt(term);
    let numberOfInstallments; 
     let periodicRate;      

   
    switch (termType.toLowerCase()) { // Use toLowerCase for consistency
        case "days":
            numberOfInstallments = termValue;
            periodicRate = annualRateDecimal ;
            break;
        case "weeks":
            numberOfInstallments = termValue;
            periodicRate = annualRateDecimal ;
            break;
        case "months":
            numberOfInstallments = termValue;
            periodicRate = annualRateDecimal;
            break;
        case "years":
            numberOfInstallments = termValue ; // Assuming monthly payments for yearly term
            periodicRate = annualRateDecimal ;
            break;
        default:
            toast.error("Invalid loan term type.");
            return;
    }

    if (numberOfInstallments <= 0 || periodicRate < 0) {
      toast.error("Invalid loan term or interest rate for calculation.");
      return;
    }

    const generatedEmiStartDates = calculateEMIStartDatesForSchedule(startDate); // Use the adapted function
    if (!generatedEmiStartDates || generatedEmiStartDates.length !== numberOfInstallments) {
        toast.error("Could not generate correct EMI dates. Check loan start date and term.");
        console.error("EMI Dates mismatch:", generatedEmiStartDates, "Expected count:", numberOfInstallments);
        return;
    }

    let emiBreakdown = [];
    let currentRemainingPrincipal = principal;

    if (interestType === "1") { // Diminishing
      const principalPerInstallment = principal / numberOfInstallments;
      
      for (let i = 0; i < numberOfInstallments; i++) {
        const interestForPeriod = currentRemainingPrincipal * periodicRate;
        
        let actualPrincipalPaid = principalPerInstallment;

       
        if (i === numberOfInstallments - 1) {
            actualPrincipalPaid = currentRemainingPrincipal; // Pay off exact remaining
            
        }
         const emiForPeriod = actualPrincipalPaid + interestForPeriod; 
        
       currentRemainingPrincipal -= actualPrincipalPaid;
       if (Math.abs(currentRemainingPrincipal) < 0.001) { // If very close to zero
            currentRemainingPrincipal = 0;
        }
       
        if (currentRemainingPrincipal < 0 && i === numberOfInstallments -1) {
            actualPrincipalPaidThisInstallment += currentRemainingPrincipal; // currentRemainingPrincipal is negative
          
            currentRemainingPrincipal = 0;
        }
        emiBreakdown.push({
          month: i + 1,
          emiStartDate: generatedEmiStartDates[i] || "N/A",
          emiTotalMonth: parseFloat(emiForPeriod.toFixed(2)),
          interest: parseFloat(interestForPeriod.toFixed(2)),
          principalPaid: parseFloat(actualPrincipalPaid.toFixed(2)),
          remainingBalance: parseFloat(Math.max(0, currentRemainingPrincipal).toFixed(2)),
        });

        if (currentRemainingPrincipal <= 0 && i < numberOfInstallments -1) {
            if(emiBreakdown.length > 0) emiBreakdown[emiBreakdown.length-1].remainingBalance = 0;
            break; 
        }
      }
    } else if (interestType === "2") {
    // Flat Interest Rate (New Logic)
    // Step 1: Calculate total interest using diminishing method <<-- KAVANIKKAVUM!
    let totalInterest = 0;
    let remainingPrincipalForInterest = principal;
    // const fixedPrincipalPayment = principal / numberOfMonths; // numberOfMonths inga define aagala
    const fixedPrincipalPayment = principal / numberOfInstallments; // numberOfInstallments use pannunga

    for (let i = 1; i <= numberOfInstallments; i++) { // numberOfInstallments use pannunga
        // let interestForMonth = remainingPrincipalForInterest * rate; // 'rate' inga define aagala, 'periodicRate' use pannunga
        let interestForMonth = remainingPrincipalForInterest * periodicRate; // 'periodicRate' use pannunga
        totalInterest += interestForMonth;
        remainingPrincipalForInterest -= fixedPrincipalPayment;
    }

    // Step 2: Add to principal and divide by months
    const totalRepayment = principal + totalInterest;
    // const fixedEMI = totalRepayment / numberOfMonths; // numberOfMonths inga define aagala
    const fixedEMI = totalRepayment / numberOfInstallments; // numberOfInstallments use pannunga
    let remainingPrincipal = principal;

    // Step 3: Generate schedule with equal EMIs
    for (let i = 1; i <= numberOfInstallments; i++) { // numberOfInstallments use pannunga
        const principalPaid = principal / numberOfInstallments; // numberOfInstallments use pannunga
        const interestPaid = fixedEMI - principalPaid;
        remainingPrincipal -= principalPaid;

        emiBreakdown.push({
            month: i,
            // emiStartDate: emiStartDates[i - 1] || "N/A", // 'emiStartDates' inga define aagala, 'generatedEmiStartDates' use pannunga
            emiStartDate: generatedEmiStartDates[i - 1] || "N/A", // 'generatedEmiStartDates' use pannunga
            emiTotalMonth: parseFloat(fixedEMI.toFixed(2)),
            interest: parseFloat(interestPaid.toFixed(2)),
            principalPaid: parseFloat(principalPaid.toFixed(2)),
            remainingBalance: parseFloat(Math.max(0, remainingPrincipal).toFixed(2))
        });
    }
} else {
        toast.error("Invalid interest type selected.");
        return;
    }

    setEmiDetails(emiBreakdown);
    if (emiBreakdown.length > 0) {
      toast.success("✅ EMI Schedule Calculated");
      setActiveTab(3);
    } else {
      toast.error("Could not calculate EMI schedule.");
    }
  };

  

  const watchedInterestRate = watch("interestRate");




  // Wizard steps configuration
    const wizardSteps = [
    { id: 1, title: 'Applicant', icon: 'bx-user' },
    { id: 2, title: 'Loan Details', icon: 'bx-rupee' },
    { id: 3, title: 'EMI Schedule', icon: 'bxs-calculator' },
    { id: 4, title: 'Nominee', icon: 'bx-user-plus' },
    { id: 5, title: 'Agreement', icon: 'bx-file' },
    { id: 6, title: 'Documents & Submit', icon: 'bx-check-shield' },
  ];


// --- Applicant Validation ---
  const validateApplicantOnBackend = async (applicantData) => {
    setLoading(true);
    const VALIDATION_URL = 'api/applicants/validate-applicant/'; // Example URL
    try {
      const response = await apiPost(VALIDATION_URL, applicantData);
      setLoading(false);
      if (response && response.valid === true) {
        toast.success(response.message || "Applicant verified!");
        setVerifiedApplicantInfo({ pk: response.applicant_pk, userID: response.applicant_userID });
        return { valid: true, message: response.message, applicantId: response.applicant_userID };
      } else {
        const errorMessage = response?.error || "Applicant validation failed.";
        toast.error(errorMessage);
        setVerifiedApplicantInfo(null);
        return { valid: false, message: errorMessage };
      }
    } catch (error) {
      setLoading(false);
      const detailedMessage = error.response?.data?.error || error.message || "An error occurred during applicant validation.";
      toast.error(detailedMessage);
      setVerifiedApplicantId(null);
      return { valid: false, message: detailedMessage };
    }
  };
 
  // --- Nominee Handling Functions ---
  const handleNomineesChange = (field, value) => {
    setNewNominee((prev) => ({ ...prev, [field]: value }));
  };

const handleNomineeProfileUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatFileSize(file.size),
      });
      setNewNominee({ ...newNominee, nomineeProfilePhoto: newFile });
      toast.info("Nominee photo selected.");
    }
  };

  const removeNomineeProfilePhoto = (e) => {
    e.stopPropagation();
    if (newNominee.nomineeProfilePhoto?.preview) {
      URL.revokeObjectURL(newNominee.nomineeProfilePhoto.preview);
    }
    setNewNominee({ ...newNominee, nomineeProfilePhoto: null });
    toast.info("Nominee photo removed.");
  };

  const handleNomineeIdProofUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatFileSize(file.size),
      });
      setNewNominee({ ...newNominee, nomineeidProofFile: newFile });
      toast.info("Nominee ID proof selected.");
    }
  };

  const removeNomineeIdProofFile = (e) => {
    e.stopPropagation();
    if (newNominee.nomineeidProofFile?.preview) {
      URL.revokeObjectURL(newNominee.nomineeidProofFile.preview);
    }
    setNewNominee({ ...newNominee, nomineeidProofFile: null });
    toast.info("Nominee ID proof removed.");
  };

  const addOrUpdateNominee = () => {
    if (!newNominee.nomineeName.trim() ||
        !newNominee.nomineePhone.trim() ||
        !newNominee.nomineeRelationship ||
        (newNominee.nomineeRelationship === "Other" && !newNominee.nomineeOtherRelationship.trim()) ||
        !newNominee.nomineeAddress.trim()
    ) {
      toast.error("Please fill all required nominee fields: Name, Phone, Relationship, Address.");
      console.error("Nominee validation failed. Required fields missing.");
      return;
    }

    if (typeof newNominee.editingIndex === 'number') {
        const updatedNominees = [...nominees];
        const indexToUpdate = newNominee.editingIndex;
        const { editingIndex, ...nomineeDataToSave } = newNominee;
        updatedNominees[indexToUpdate] = nomineeDataToSave;
        setNominees(updatedNominees);
        toast.success("Nominee updated successfully!");
    } else {
        setNominees([...nominees, { ...newNominee }]);
        toast.success("Nominee added successfully!");
    }

    setNewNominee({
      nomineeName: "", nomineePhone: "", nomineeEmail: "",
      nomineeRelationship: "", nomineeOtherRelationship: "", nomineeAddress: "",
      nomineeidProofType: "", nomineeidProofNumber: "",
      nomineeProfilePhoto: null, nomineeidProofFile: null,
    });
  };

  const editNomineeDetails = (indexToEdit) => {
    const nomineeToEdit = nominees[indexToEdit];
    setNewNominee({ ...nomineeToEdit, editingIndex: indexToEdit });
    toast.info("Editing nominee. Make changes and click 'Add / Update Nominee'.");
  };

  const deleteNomineeFromList = (indexToDelete) => {
    const nomineeToRemove = nominees[indexToDelete];
    if (nomineeToRemove.nomineeProfilePhoto?.preview) {
      URL.revokeObjectURL(nomineeToRemove.nomineeProfilePhoto.preview);
    }
    if (nomineeToRemove.nomineeidProofFile?.preview) {
      URL.revokeObjectURL(nomineeToRemove.nomineeidProofFile.preview);
    }
    setNominees(nominees.filter((_, index) => index !== indexToDelete));
    toast.warn("Nominee removed.");
  };

  const onFinalSubmit = async (dataFromRHF) => {
    console.log("🟢 onFinalSubmit triggered with RHF data:", dataFromRHF);
     console.log("NOMINEES STATE AT SUBMIT:", JSON.stringify(nominees, null, 2));
    setLoading(true);

    if (emiDetails.length === 0) {
      toast.error("EMI Schedule not calculated. Please calculate it before submitting.");
      
      setLoading(false);
      return;
    }

    const isTab6Valid = await trigger(['translatorPlace', 'LoanRegDate']); // Removed translatorName unless it's required
    if (!isTab6Valid) {
        toast.error("Please fill all required fields in the final step.");
        console.error("Validation failed for Tab 6 on final submit.");
        setLoading(false);
        return;
    }

    
     const formDataPayload = new FormData();
    for (const key in dataFromRHF) {
      if (Object.prototype.hasOwnProperty.call(dataFromRHF, key) &&
          dataFromRHF[key] !== null && dataFromRHF[key] !== undefined &&
          key !== 'nominees' && key !== 'emiSchedule') {
        if (typeof dataFromRHF[key] === 'boolean') {
          formDataPayload.append(key, String(dataFromRHF[key]));
        } else {
          formDataPayload.append(key, dataFromRHF[key]);
        }
      }
    }

    const nomineeDataForJson = nominees.map(nom => ({
        name: nom.nomineeName,
        phone: nom.nomineePhone,
        email: nom.nomineeEmail,
        relationship: nom.nomineeRelationship === 'Other' ? nom.nomineeOtherRelationship : nom.nomineeRelationship,
        address: nom.nomineeAddress,
        idProofType: nom.nomineeidProofType,
        idProofNumber: nom.nomineeidProofNumber,
    }));

    formDataPayload.append('nominees_payload', JSON.stringify(nomineeDataForJson));

    nominees.forEach((nominee, index) => {
      if (nominee.nomineeProfilePhoto instanceof File) {
       formDataPayload.append(`nominee_${index}_profile_photo`, nominee.nomineeProfilePhoto, nominee.nomineeProfilePhoto.name);
      }
      if (nominee.nomineeidProofFile instanceof File) {
        formDataPayload.append(`nominee_${index}_id_proof_file`, nominee.nomineeidProofFile, nominee.nomineeidProofFile.name);
      }
    });
 const currentTotalPrincipal = parseFloat(dataFromRHF.amount || 0);
    const currentTotalInterest = emiDetails.reduce((sum, row) => sum + row.interest, 0);
    const currentTotalPayment = currentTotalPrincipal + currentTotalInterest;
    const emiScheduleForBackendCreate = emiDetails.map(item => ({
    month: item.month,
    emiStartDate: item.emiStartDate,
    emiTotalMonth: item.emiTotalMonth,
    interest: item.interest,
    principalPaid: item.principalPaid,
    remainingBalance: item.remainingBalance,
    paymentAmount: item.paymentAmount !== undefined ? parseFloat(item.paymentAmount) : 0.0,
    pendingAmount: item.pendingAmount !== undefined ? parseFloat(item.pendingAmount) : parseFloat(item.emiTotalMonth)
}));
formDataPayload.append('emi_schedule_payload', JSON.stringify(emiScheduleForBackendCreate));
    if (verifiedApplicantInfo && verifiedApplicantInfo.userID) {
    formDataPayload.append('applicant_record', verifiedApplicantInfo.userID); // Pudhusu - APFAA8D1 maari
} else {
    toast.error("Applicant not verified or userID missing. Cannot submit.");
    setLoading(false);
    return;
}

    console.log("🚀 FormData to be submitted:");
    for (let [key, value] of formDataPayload.entries()) {
      console.log(key, value);
    }

    const SUBMISSION_URL = 'api/loan-applications/loan-applications/';

    try {
      const response = await apiPost(SUBMISSION_URL, formDataPayload);
      setLoading(false);
      console.log("✅ Submission Response:", response);
      toast.success(response.message || 'Loan Application Submitted Successfully!');
      reset();
      setEmiDetails([]);
      setNominees([]);
      setNewNominee({
        nomineeName: "", nomineePhone: "", nomineeEmail: "",
        nomineeRelationship: "", nomineeOtherRelationship: "", nomineeAddress: "",
        nomineeidProofType: "", nomineeidProofNumber: "",
        nomineeProfilePhoto: null, nomineeidProofFile: null,
      });
      setActiveTab(1);
    } catch (error) {
      setLoading(false);
      console.error("❌ Submission Error:", error.response || error.message || error);
      const errorMessage = error.response?.data?.detail ||
                           error.response?.data?.error ||
                           error.response?.data?.message ||
                           'Error submitting loan application. Please check details.';
      toast.error(errorMessage);
        if (error.response && error.response.data) {
            console.error("Backend error details:", error.response.data);
        }
    }
  };

  const handleNext = async () => {
    console.log(`Attempting to move from Tab ${activeTab}`);
    let isStepFieldsValid = false;

    if (activeTab === 1) {
      isStepFieldsValid = await trigger(['first_name', 'phone']);
      if (errors.first_name) console.error("First Name Error:", errors.first_name.message);
      if (errors.phone) console.error("Phone Error:", errors.phone.message);

      if (isStepFieldsValid) {
        const currentValues = getValues();
        const backendValidationResult = await validateApplicantOnBackend({
          first_name: currentValues.first_name,
          phone: currentValues.phone,
        });

        if (backendValidationResult.valid) {
          setActiveTab(activeTab + 1);
        } else {
          console.log("Staying on Tab 1 due to backend validation failure.");
        }
      } else {
        toast.error("Please fill Applicant Name and Phone Number.");
        console.log("Staying on Tab 1 due to RHF validation failure.");
        }
    }
     else if (activeTab === 2) {
      const fieldsToValidateTab2 = [
        'amount', 'startDate', 'term', 'termType', 'interestRate', 'interestType', 'purpose', 'repaymentSource'
      ];
       isStepFieldsValid = await trigger(fieldsToValidateTab2);
      if (isStepFieldsValid) {
        console.log("Tab 2 fields valid via Next button.");
        if(emiDetails.length === 0) {
            toast.warn("EMI Schedule not calculated. Please click 'Calculate EMI & View Schedule'.");
            // Optionally, you could automatically calculate it here:
            // calculateAndSetEMI();
            // However, calculateAndSetEMI itself moves to tab 3 if successful.
            // So, it's better to guide the user to use the button.
            return; // Stay on Tab 2
        }
        setActiveTab(activeTab + 1);
      } else {
        console.error("Tab 2 fields are invalid. Please correct them.");
        toast.error("Please fill all Loan Details correctly.");
      }
    }
    else if (activeTab === 5) {
      const fieldsToValidateTab5 = ['agreeTerms', 'agreeCreditCheck', 'agreeDataSharing'];
      isStepFieldsValid = await trigger(fieldsToValidateTab5);
      if (isStepFieldsValid) {
        console.log("Tab 5 (Agreement) is valid. Proceeding to Tab 6.");
        setActiveTab(activeTab + 1);
      } else {
        toast.error("Please agree to all terms and conditions.");
        console.error("Tab 5 (Agreement) is invalid. Please check all boxes.");
      }
    }
    else if (activeTab < wizardSteps.length) {
        console.log(`Proceeding to Tab ${activeTab + 1}`);
        setActiveTab(activeTab + 1);
    }
  };

  const handlePrevious = () => {
    if (activeTab > 1) {
      setActiveTab(activeTab - 1);
    }
  };

  const totalCalculatedInterest = emiDetails.reduce((sum, row) => sum + row.interest, 0);
  const totalCalculatedPrincipal = parseFloat(watchedLoanAmount || 0);
  const totalCalculatedPayment = totalCalculatedInterest + totalCalculatedPrincipal;

  console.log("LoanProcess Logic Loaded. Current Active Tab:", activeTab, "EMI Details Count:", emiDetails.length);
  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <h4 className="card-title mb-0">Loan Application Process</h4>
        </CardHeader>
        <CardBody>
          <div id="basic-pills-wizard" className="twitter-bs-wizard">
            <ul className="twitter-bs-wizard-nav nav nav-pills nav-justified">
              {wizardSteps.map((step) => (
                <NavItem key={step.id}>
                  <NavLink
                    className={classnames({ active: activeTab === step.id })}
                    // onClick={() => setActiveTab(step.id)} // Allow direct navigation for now, can restrict later
                    style={{ cursor: 'default' }} // Make it look non-clickable if direct nav is off
                  >
                    <span className="step-number">{/* You can add step numbers if needed */}</span>
                    <div className="step-icon" id={`tooltip-step${step.id}`}>
                      <i className={`bx ${step.icon}`}></i>
                    </div>
                    <UncontrolledTooltip placement="top" target={`tooltip-step${step.id}`}>
                      {step.title}
                    </UncontrolledTooltip>
                  </NavLink>
                </NavItem>
              ))}
            </ul>

            <Form onSubmit={handleSubmit(onFinalSubmit)} className="mt-4">
              <TabContent activeTab={activeTab}>
                <TabPane tabId={1}>
                  <div className="text-center mb-4">
                    <h5>Applicant Information</h5>
                    <p className="card-title-desc">
                      Enter applicant name and phone to verify.
                    </p>
                  </div>
                  <Row className="justify-content-center">
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label htmlFor="first_name">Full Name</Label>
                        <Controller
                          name="first_name"
                          control={control}
                          rules={{ required: "Full name is required." }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="first_name"
                              type="text"
                              placeholder="Enter applicant's full name"
                              invalid={!!errors.first_name}
                              disabled={loading}
                            />
                          )}
                        />
                        {errors.first_name && (
                          <div className="text-danger small mt-1">
                            {errors.first_name.message}
                          </div>
                        )}
                      </FormGroup>

                      <FormGroup className="mb-3">
                        <Label htmlFor="phone">Mobile Number</Label>
                        <Controller
                          name="phone"
                          control={control}
                          rules={{
                            required: "Mobile number is required.",
                            pattern: {
                              value: /^[6-9]\d{9}$/,
                              message: "Enter a valid 10-digit Indian mobile number.",
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="phone"
                              type="tel"
                              placeholder="Enter 10-digit Mobile number"
                              invalid={!!errors.phone}
                              disabled={loading}
                            />
                          )}
                        />
                        {errors.phone && (
                          <div className="text-danger small mt-1">
                            {errors.phone.message}
                          </div>
                        )}
                      </FormGroup>
                      {/* Loading indicator specific to Tab 1 validation */}
                      {loading && activeTab === 1 && (
                        <div className="text-center my-3">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Verifying...</span>
                          </div>
                          <p className="mt-2 text-muted">Verifying applicant details...</p>
                        </div>
                      )}
                    </Col>
                  </Row>
                </TabPane>
                  
                {/* --- Tab 2: Loan Details --- */}
                <TabPane tabId={2}>
                  <div className="text-center mb-4">
                    <h5>Loan Details </h5>
                    <p className="card-title-desc">
                      Fill all information below
                    </p>
                  </div>
                  <Row>
                    {/* Loan Amount */}
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label htmlFor="amount">Loan Amount (₹)</Label>
                        <Controller
                          name="amount"
                          control={control}
                          rules={{
                            required: "Loan amount is required.",
                            min: { value: 1000, message: "Minimum amount is ₹1000." },
                            pattern: { value: /^[0-9]+$/, message: "Please enter a valid number."}
                          }}
                          render={({ field }) => (
                            <Input {...field} id="amount" type="number" placeholder="Enter loan amount" invalid={!!errors.amount} />
                          )}
                        />
                        {errors.amount && <div className="text-danger small mt-1">{errors.amount.message}</div>}
                      </FormGroup>
                    </Col>

                    {/* Loan Date (startDate) */}
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label htmlFor="startDate">Loan Date</Label>
                        <Controller
                          name="startDate"
                          control={control}
                          rules={{ required: "Loan date is required." }}
                          render={({ field }) => (
                            <Input {...field} id="startDate" type="date" placeholder="dd-mm-yyyy" invalid={!!errors.startDate}  min={new Date().toISOString().split('T')[0]} />
                          )}
                        />
                        {errors.startDate && <div className="text-danger small mt-1">{errors.startDate.message}</div>}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    {/* Loan Term */}
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label htmlFor="term">Loan Term</Label>
                        <Controller
                          name="term"
                          control={control}
                          rules={{
                            required: "Loan term is required.",
                            min: { value: 1, message: "Term must be at least 1." },
                            pattern: { value: /^[0-9]+$/, message: "Please enter a valid number."}
                          }}
                          render={({ field }) => (
                            <Input {...field} id="term" type="number" placeholder="Enter loan term duration" invalid={!!errors.term} />
                          )}
                        />
                        {errors.term && <div className="text-danger small mt-1">{errors.term.message}</div>}
                      </FormGroup>
                    </Col>

                    {/* Loan Term Type */}
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label htmlFor="termType">Loan Term Type</Label>
                        <Controller
                          name="termType"
                          control={control}
                          rules={{ required: "Term type is required." }}
                          render={({ field }) => (
                            <Input {...field} id="termType" type="select" invalid={!!errors.termType}>
                              {termTypeOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </Input>
                          )}
                        />
                        {errors.termType && <div className="text-danger small mt-1">{errors.termType.message}</div>}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                     {/* Interest Type */}
                     <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label htmlFor="interestType">Interest Type</Label>
                        <Controller
                          name="interestType"
                          control={control}
                          rules={{ required: "Interest type is required." }}
                          render={({ field }) => (
                            <Input {...field} id="interestType" type="select" invalid={!!errors.interestType}>
                              {InterestOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </Input>
                          )}
                        />
                        {errors.interestType && <div className="text-danger small mt-1">{errors.interestType.message}</div>}
                      </FormGroup>
                    </Col>
                    {/* Interest Rate */}
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label htmlFor="interestRate">Interest Rate (% Per Annum)</Label>
                        <Controller
                          name="interestRate"
                          control={control}
                          rules={{
                            required: "Interest rate is required.",
                            min: { value: 0, message: "Rate cannot be negative." },
                            max: { value: 100, message: "Rate seems too high." },
                          }}
                          render={({ field }) => (
                            <Input {...field} id="interestRate" type="number" placeholder="0" step="0.1" invalid={!!errors.interestRate} />
                          )}
                        />
                        {errors.interestRate && <div className="text-danger small mt-1">{errors.interestRate.message}</div>}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    {/* Loan Purpose */}
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label htmlFor="purpose">Loan Purpose</Label>
                        <Controller
                          name="purpose"
                          control={control}
                          rules={{ required: "Loan purpose is required." }}
                          render={({ field }) => (
                            <Input {...field} id="purpose" type="select" invalid={!!errors.purpose}>
                              {purposeOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </Input>
                          )}
                        />
                        {errors.purpose && <div className="text-danger small mt-1">{errors.purpose.message}</div>}
                      </FormGroup>
                    </Col>

                    {/* Source of Repayment */}
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label htmlFor="repaymentSource">Source of Repayment</Label>
                        <Controller
                          name="repaymentSource"
                          control={control}
                          rules={{ required: "Source of repayment is required." }}
                          render={({ field }) => (
                            <Input {...field} id="repaymentSource" type="text" placeholder="e.g., Salary, Business Income" invalid={!!errors.repaymentSource} />
                          )}
                        />
                        {errors.repaymentSource && <div className="text-danger small mt-1">{errors.repaymentSource.message}</div>}
                      </FormGroup>
                    </Col>
                  </Row>
                  {/* Calculate EMI Button */}
                  <div className="text-center mt-4 d-flex justify-content-center gap-2">
                    <Button
                      color="primary"
                      type="button" // Important: type="button"
                      onClick={calculateNewEMI}
                      disabled={loading} >
                      <i className="bx bxs-calculator me-1"></i> Calculate EMI & View Schedule
                    </Button>
                  </div>
                </TabPane>
                {/* --- Tab 3: EMI Schedule --- */}
                 <TabPane tabId={3}> 
                 <div className="text-center p-4">
                 <h5>EMI Repayment Schedule</h5>
                    <p className="card-title-desc">
                      {emiDetails.length > 0
                        ? `Loan of ${formatCurrency(watchedLoanAmount)} at ${watchedInterestRate}% interest per annum  (${getValues('interestType') === '1' ? 'Diminishing' : 'Flat Rate'})`
                        : "Calculate your EMI in Tab 2 to view schedule."}
                    </p>
                  </div>
                    
                    {emiDetails.length > 0 && ( // Add buttons only if schedule exists
                    <div className="text-center mb-3">
                        <Button
                          color={viewMode === "table" ? "primary" : "light"}
                          onClick={() => setViewMode("table")}
                          className="me-2 btn-sm"
                        >
                          <i className="bx bx-table"></i> Table
                        </Button>
                        {/* <Button
                          color={viewMode === "chart" ? "primary" : "light"} // Assuming you'll add chart later
                          onClick={() => setViewMode("chart")}
                          className="btn-sm"
                          disabled // Disable chart button for now
                        >
                          <i className="bx bx-line-chart"></i> Chart (Coming Soon)
                        </Button> */}
                    </div>
                  )}

                  {emiDetails.length > 0 ? (
                    <>
                      <div className="table-responsive mb-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <Table striped bordered hover size="sm">
                          <thead className="table-light">
                            <tr>
                              <th>Installment</th>
                              <th>EMI Date</th>
                              <th>EMI</th>
                              <th>Principal</th>
                              <th>Interest</th>
                              <th>Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {emiDetails.map((row) => (
                              <tr key={row.month}>
                                <td>{row.month}</td>
                                <td>{row.emiStartDate}</td>
                                <td>{formatCurrency(row.emiTotalMonth)}</td>
                                <td>{formatCurrency(row.principalPaid)}</td>
                                <td>{formatCurrency(row.interest)}</td>
                                <td>{formatCurrency(row.remainingBalance)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="table-light fw-bold">
                              <td colSpan="2">Total</td>
                              <td>{formatCurrency(totalCalculatedPayment)}</td>
                              <td>{formatCurrency(totalCalculatedPrincipal)}</td>
                              <td>{formatCurrency(totalCalculatedInterest)}</td>
                              <td>-</td>
                            </tr>
                          </tfoot>
                        </Table>
                      </div>

                      {/* Summary Card */}
                      <Card className="bg-light">
                        <CardBody>
                          <Row>
                            <Col md={4} className="text-center border-end">
                              <p className="text-muted mb-1">Loan Amount</p>
                              <h5 className="text-primary mb-0">{formatCurrency(totalCalculatedPrincipal)}</h5>
                            </Col>
                            <Col md={4} className="text-center border-end">
                              <p className="text-muted mb-1">Total Interest</p>
                              <h5 className="text-danger mb-0">{formatCurrency(totalCalculatedInterest)}</h5>
                            </Col>
                            <Col md={4} className="text-center">
                              <p className="text-muted mb-1">Total Payment</p>
                              <h5 className="text-success mb-0">{formatCurrency(totalCalculatedPayment)}</h5>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </>
                  ) : (
                    
                    <div className="text-center py-5">
                      <i className="bx bx-calculator display-4 text-muted mb-3"></i>
                      <h5>No EMI Schedule Available</h5>
                      <p className="text-muted mb-4">
                        Go back to 'Loan Details', fill required fields, and click "Calculate EMI" to view schedule.
                      </p>
                      <Button color="secondary" type="button" onClick={() => setActiveTab(2)}>
                        <i className="bx bx-arrow-back me-1"></i> Go to Loan Details
                      </Button>
                    </div>
                  )}
                </TabPane>
                {/* --- Tab 4: Nominee Details --- */}
                <TabPane tabId={4}>
                  <div className="text-center mb-4">
                    <h5>Nominee Details</h5>
                    <p className="card-title-desc">Add one or more nominees for the loan.</p>
                  </div>

                  {/* Nominee Input Form Section */}
                  <Card className="mb-4 border">
                    <CardHeader className="bg-light py-2"> {/* Reduced padding */}
                      <h6 className="mb-0">{typeof newNominee.editingIndex === 'number' ? 'Edit Nominee' : 'Add Nominee'}</h6>
                    </CardHeader>
                    <CardBody>
                      {/* Nominee Photo Upload - Row 1 */}
                      <Row className="mb-3 justify-content-end">
                        <Col md={4} lg={3}>
                           <Label>Nominee Photo</Label>
                          <Dropzone
                            onDrop={handleNomineeProfileUpload}
                            accept={{ 'image/*': ['.jpeg', '.jpg', '.png'] }}
                            maxFiles={1}
                            maxSize={2 * 1024 * 1024} // 2MB
                          >
                            {({ getRootProps, getInputProps, isDragActive }) => (
                              <div
                                {...getRootProps()}
                                className="dropzone text-center p-3 border rounded"
                                style={{ minHeight: '120px', cursor: 'pointer', backgroundColor: isDragActive ? '#e9ecef' : '#f8f9fa' }}
                              >
                                <input {...getInputProps()} />
                                {newNominee.nomineeProfilePhoto ? (
                                  <div>
                                    <img
                                      src={newNominee.nomineeProfilePhoto.preview}
                                      alt="Nominee"
                                      className="rounded-circle avatar-lg img-thumbnail" // Using avatar-lg for bigger preview
                                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    />
                                    <p className="mt-2 mb-0 small text-truncate">{newNominee.nomineeProfilePhoto.name}</p>
                                    <small className="text-muted">{newNominee.nomineeProfilePhoto.formattedSize}</small>
                                    <Button color="danger" size="sm" className="mt-1" onClick={removeNomineeProfilePhoto}>Remove</Button>
                                  </div>
                                ) : (
                                  <div className="dz-message-text">
                                    <div className="mb-2">
                                      <i className="display-4 text-muted bx bx-camera"></i>
                                    </div>
                                    <h6>Upload Nominee Photo</h6>
                                    <small className="text-muted">Click or drag an image (Max 2MB)</small>
                                  </div>
                                )}
                              </div>
                            )}
                          </Dropzone>
                        </Col>
                      </Row>

                      {/* Nominee Details - Row 2 */}
                      <Row>
                        <Col md={6}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="nomineeName">Nominee Name <span className="text-danger">*</span></Label>
                            <Input type="text" id="nomineeName" value={newNominee.nomineeName} onChange={(e) => handleNomineesChange("nomineeName", e.target.value)} placeholder="Enter name" />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="nomineePhone">Nominee Phone <span className="text-danger">*</span></Label>
                            <Input type="text" id="nomineePhone" value={newNominee.nomineePhone} onChange={(e) => handleNomineesChange("nomineePhone", e.target.value)} placeholder="Enter 10-digit mobile" />
                          </FormGroup>
                        </Col>
                      </Row>

                      {/* Nominee Details - Row 3 */}
                      <Row>
                        <Col md={6}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="nomineeEmail">Nominee Email (Optional)</Label>
                            <Input type="email" id="nomineeEmail" value={newNominee.nomineeEmail} onChange={(e) => handleNomineesChange("nomineeEmail", e.target.value)} placeholder="Enter email" />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="nomineeRelationship">Relationship <span className="text-danger">*</span></Label>
                            <Input type="select" id="nomineeRelationship" value={newNominee.nomineeRelationship} onChange={(e) => handleNomineesChange("nomineeRelationship", e.target.value)}>
                              {relationshipOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </Input>
                          </FormGroup>
                          {newNominee.nomineeRelationship === "Other" && (
                            <FormGroup className="mb-3">
                              <Label htmlFor="nomineeOtherRelationship">Specify Other Relationship <span className="text-danger">*</span></Label>
                              <Input type="text" id="nomineeOtherRelationship" value={newNominee.nomineeOtherRelationship} onChange={(e) => handleNomineesChange("nomineeOtherRelationship", e.target.value)} placeholder="e.g., Uncle, Friend" />
                            </FormGroup>
                          )}
                        </Col>
                      </Row>

                      {/* Nominee Address - Row 4 */}
                      <Row>
                        <Col md={12}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="nomineeAddress">Nominee Address <span className="text-danger">*</span></Label>
                            <Input type="textarea" rows="2" id="nomineeAddress" value={newNominee.nomineeAddress} onChange={(e) => handleNomineesChange("nomineeAddress", e.target.value)} placeholder="Enter full address" />
                          </FormGroup>
                        </Col>
                      </Row>

                      {/* ID Proof - Row 5 */}
                      <Row>
                        <Col md={4}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="nomineeidProofType">ID Proof Type</Label>
                            <Input type="select" id="nomineeidProofType" value={newNominee.nomineeidProofType} onChange={(e) => handleNomineesChange("nomineeidProofType", e.target.value)}>
                               {idProofTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="nomineeidProofNumber">ID Proof Number</Label>
                            <Input type="text" id="nomineeidProofNumber" value={newNominee.nomineeidProofNumber} onChange={(e) => handleNomineesChange("nomineeidProofNumber", e.target.value)} placeholder="Enter ID number" />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup className="mb-3">
                            <Label>Upload ID Proof</Label>
                            <Dropzone
                              onDrop={handleNomineeIdProofUpload}
                              accept={{ 'image/*': ['.jpeg', '.jpg', '.png'], 'application/pdf': ['.pdf'] }}
                              maxFiles={1}
                              maxSize={2 * 1024 * 1024} // 2MB
                            >
                              {({ getRootProps, getInputProps, isDragActive }) => (
                                <div
                                  {...getRootProps()}
                                  className="dropzone text-center p-3 border rounded"
                                  style={{ minHeight: '100px', cursor: 'pointer', backgroundColor: isDragActive ? '#e9ecef' : '#f8f9fa' }}
                                >
                                  <input {...getInputProps()} />
                                  {newNominee.nomineeidProofFile ? (
                                    <div>
                                      <i className={`bx ${newNominee.nomineeidProofFile.type.startsWith('image/') ? 'bx-image-alt' : 'bxs-file-pdf'} display-4 text-success`}></i>
                                      <p className="mt-1 mb-0 small text-truncate">{newNominee.nomineeidProofFile.name}</p>
                                      <small className="text-muted">{newNominee.nomineeidProofFile.formattedSize}</small>
                                      <Button color="danger" size="sm" className="mt-1" onClick={removeNomineeIdProofFile}>Remove</Button>
                                    </div>
                                  ) : (
                                    <div className="dz-message-text">
                                      <div className="mb-2">
                                        <i className="display-4 text-muted bx bx-cloud-upload"></i>
                                      </div>
                                      <h6>Upload ID Proof</h6>
                                      <small className="text-muted">JPG, PNG, PDF (Max 2MB)</small>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Dropzone>
                          </FormGroup>
                        </Col>
                      </Row>

                      {/* Add / Update Nominee Button */}
                      <Row className="mt-2">
                        <Col className="text-center">
                          <Button color="primary" type="button" onClick={addOrUpdateNominee}>
                            <i className={`bx ${typeof newNominee.editingIndex === 'number' ? 'bx-check-double' : 'bx-user-plus'} me-1`}></i>
                            {typeof newNominee.editingIndex === 'number' ? 'Update Nominee' : 'Add Nominee'}
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>

                  {/* Added Nominees List Table */}
                  <div className="mt-4">
                    <h5 className="mb-3">Added Nominees</h5>
                    {nominees.length === 0 ? (
                      <p className="text-muted text-center py-3">No nominees added yet.</p>
                    ) : (
                      <div className="table-responsive">
                        <Table striped bordered hover size="sm" className="mb-0">
                          <thead className="table-light">
                            <tr>
                              <th style={{width: '60px'}}>Photo</th>
                              <th>Name</th>
                              <th>Phone</th>
                              <th>Relationship</th>
                              <th style={{maxWidth: '200px', whiteSpace: 'normal'}}>Address</th>
                              <th style={{width: '100px'}}>ID Proof</th>
                              <th style={{width: '100px'}}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {nominees.map((nominee, index) => (
                              <tr key={index}>
                                <td className="text-center align-middle">
                                  {nominee.nomineeProfilePhoto ? (
                                    <img src={nominee.nomineeProfilePhoto.preview} alt="Nominee" width="40" height="40" className="rounded-circle" style={{objectFit: 'cover'}} />
                                  ) : ( <i className="bx bx-user-circle fs-3 text-muted"></i> )}
                                </td>
                                <td className="align-middle">{nominee.nomineeName}</td>
                                <td className="align-middle">{nominee.nomineePhone}</td>
                                <td className="align-middle">
                                  {nominee.nomineeRelationship === "Other" ? nominee.nomineeOtherRelationship : nominee.nomineeRelationship}
                                </td>
                                <td className="align-middle">{nominee.nomineeAddress}</td>
                                <td className="text-center align-middle">
                                  {nominee.nomineeidProofFile ? (
                                    <a href={nominee.nomineeidProofFile.preview} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary py-0 px-1">
                                      <i className="bx bx-show"></i> View
                                    </a>
                                  ) : (<span className="text-muted">N/A</span>)}
                                </td>
                                <td className="text-center align-middle">
                                  <Button color="warning" size="sm" onClick={() => editNomineeDetails(index)} className="me-1 px-2 py-1">
                                    <i className="bx bx-edit"></i>
                                  </Button>
                                  <Button color="danger" size="sm" onClick={() => deleteNomineeFromList(index)} className="px-2 py-1">
                                    <i className="bx bx-trash"></i>
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </div>
                </TabPane>
                {/* --- Tab 5: Declaration and Agreement --- */}
                <TabPane tabId={5}>
                  <div className="text-center mb-4">
                    <h5>Declaration and Agreement</h5>
                    <p className="card-title-desc">Please read and agree to the terms.</p>
                  </div>
                  <Row className="justify-content-center">
                    <Col md={10} lg={8}> {/* Centering the content */}
                      <div className="declaration-text p-3 border rounded bg-light mb-4" style={{ maxHeight: '250px', overflowY: 'auto', textAlign: 'justify', fontSize: '0.85rem' }}>
                        <h6>
                          Declaration and Undertaking by Applicant to SPK Micro Financial Services (Promoted by SPK Foundation)
                        </h6>
                        <p>
                          I/We, declare that all the information given in the application form are true, correct and complete and that they shall form the basis of any loan SPK Micro Financial Services (Promoted by SPK Foundation) may decide to grant me/us. SPK Micro Financial Services (Promoted by SPK Foundation) may seek / receive information from any source/person to consider this application. I/We further agree that my/our loan shall be governed by rules of SPK Micro Financial Services (Promoted by SPK Foundation) which may be in force time to time. I/We agree that SPK Micro Financial Services (Promoted by SPK Foundation) reserves the right to accept/reject this application without assigning any reason whatsoever. I/We have read the brochure and understood the contents. I/We understand that the fee paid along with the loan application form is non-refundable. I/We undertake to inform SPK Small Finance Bank regarding any change in my/our occupation/employment/residential address and to provide any further information that SPK Micro Financial Services (Promoted by SPK Foundation) require. SPK Micro Financial Services (Promoted by SPK Foundation) may make available any information contained in this form, other documents submitted to SPK Micro Financial Services (Promoted by SPK Foundation) and, information pertaining to any institution or body. I/We confirm that I/We have/had no insolvency proceedings against me/us nor I/We have/had ever been adjudicated insolvent. CIBIL- SPK can initiate any Internal/External/3rd Party Verification with respect to Loan Application.
                        </p>
                      </div>

                      <FormGroup check className="mb-3">
                        <Controller
                          name="agreeTerms"
                          control={control}
                          rules={{ required: "You must agree to the terms and conditions." }}
                          render={({ field }) => (
                            <Input
                              type="checkbox"
                              id="agreeTerms"
                              checked={field.value}
                              onChange={field.onChange} // RHF handles the value update
                              invalid={!!errors.agreeTerms}
                              {...field} // Spread field to include onBlur, ref etc.
                            />
                          )}
                        />
                        <Label check htmlFor="agreeTerms" className={`ms-2 ${errors.agreeTerms ? 'text-danger' : ''}`}>
                          I agree to the terms and conditions <span className="text-danger">*</span>
                        </Label>
                        {errors.agreeTerms && <div className="invalid-feedback d-block ms-4 ps-1">{errors.agreeTerms.message}</div>}
                      </FormGroup>

                      <FormGroup check className="mb-3">
                        <Controller
                          name="agreeCreditCheck"
                          control={control}
                          rules={{ required: "You must agree to the credit check." }}
                          render={({ field }) => (
                            <Input
                              type="checkbox"
                              id="agreeCreditCheck"
                              checked={field.value}
                              onChange={field.onChange}
                              invalid={!!errors.agreeCreditCheck}
                              {...field}
                            />
                          )}
                        />
                        <Label check htmlFor="agreeCreditCheck" className={`ms-2 ${errors.agreeCreditCheck ? 'text-danger' : ''}`}>
                          I agree to a credit check <span className="text-danger">*</span>
                        </Label>
                        {errors.agreeCreditCheck && <div className="invalid-feedback d-block ms-4 ps-1">{errors.agreeCreditCheck.message}</div>}
                      </FormGroup>

                      <FormGroup check className="mb-3">
                        <Controller
                          name="agreeDataSharing"
                          control={control}
                          rules={{ required: "You must agree to data sharing as described." }}
                          render={({ field }) => (
                            <Input
                              type="checkbox"
                              id="agreeDataSharing"
                              checked={field.value}
                              onChange={field.onChange}
                              invalid={!!errors.agreeDataSharing}
                              {...field}
                            />
                          )}
                        />
                        <Label check htmlFor="agreeDataSharing" className={`ms-2 ${errors.agreeDataSharing ? 'text-danger' : ''}`}>
                          I agree to data sharing as described <span className="text-danger">*</span>
                        </Label>
                        {errors.agreeDataSharing && <div className="invalid-feedback d-block ms-4 ps-1">{errors.agreeDataSharing.message}</div>}
                      </FormGroup>
                    </Col>
                  </Row>
                </TabPane>

                                {/* --- Tab 6: Final Details & Declaration --- */}
                <TabPane tabId={6}>
                  <div className="text-center mb-4">
                    <h5>Final Details & Declaration</h5>
                    <p className="card-title-desc">Please enter final application details including translator info if applicable.</p>
                  </div>
                  <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                      <Row>
                        <Col md={6}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="translatorName">Translator Name <small className="text-muted">(If Applicable)</small></Label>
                            <Controller
                              name="translatorName"
                              control={control}
                              render={({ field }) => (
                                <Input {...field} type="text" id="translatorName" placeholder="Enter Translator Name" />
                              )}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="translatorPlace">Place of Application <span className="text-danger">*</span></Label>
                            <Controller
                              name="translatorPlace"
                              control={control}
                              rules={{ required: "Place of application is required." }}
                              render={({ field }) => (
                                <Input {...field} type="text" id="translatorPlace" placeholder="Enter Place" invalid={!!errors.translatorPlace} />
                              )}
                            />
                            {errors.translatorPlace && <div className="text-danger small mt-1">{errors.translatorPlace.message}</div>}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="LoanRegDate">Application Date <span className="text-danger">*</span></Label>
                            <Controller
                              name="LoanRegDate"
                              control={control}
                              rules={{ required: "Application date is required." }}
                              render={({ field }) => (
                                <Input {...field} type="date" id="LoanRegDate" placeholder="dd-mm-yyyy" invalid={!!errors.LoanRegDate} />
                              )}
                            />
                            {errors.LoanRegDate && <div className="text-danger small mt-1">{errors.LoanRegDate.message}</div>}
                          </FormGroup>
                        </Col>
                         <Col md={6}> {/* Empty column for alignment if needed, or add another field */}
                         </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="remarks">Remarks <small className="text-muted">(Optional)</small></Label>
                            <Controller
                              name="remarks"
                              control={control}
                              render={({ field }) => (
                                <Input {...field} type="textarea" rows="3" id="remarks" placeholder="Enter any additional remarks" />
                              )}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </TabPane>

              </TabContent>

               {/* Wizard Navigation Buttons (Prev/Next/Submit) */}
              <ul className="pager wizard twitter-bs-wizard-pager-link mt-4">
                <li className={activeTab === 1 ? "previous disabled" : "previous"}>
                  <Button type="button" color="primary" onClick={handlePrevious} disabled={activeTab === 1 || loading}>
                    <i className="bx bx-chevron-left me-1"></i> Previous
                  </Button>
                </li>
                <li className="next d-flex align-items-center gap-2"> {/* Use flex and gap for button spacing */}
                  {activeTab === wizardSteps.length ? ( // If on the last tab (Tab 6)
                    <>
                      <Button
                        color="warning" // Orange color
                        type="button"
                        onClick={togglePdfModal} // Implement this function for PDF preview
                        disabled={loading}
                        className="btn-md" // Adjust size if needed
                      >
                        <i className="bx bx-show me-1"></i> Preview Form
                      </Button>
                      <Button
                        color="success" // Green color
                        type="submit" // This triggers RHF's handleSubmit(onFinalSubmit)
                        disabled={loading}
                        className="btn-md" // Adjust size if needed
                      >
                        {loading ? (
                          <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting...</>
                        ) : (
                          <>Submit Application <i className="bx bx-check-circle ms-1"></i></>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button type="button" color="primary" onClick={handleNext} disabled={loading || (activeTab === 2 && emiDetails.length === 0) }>
                      {/* Loading state for Next button */}
                      {loading && (activeTab === 1) ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Verifying...</>
                      ) : (
                        <>Next <i className="bx bx-chevron-right ms-1"></i></>
                      )}
                    </Button>
                  )}
                </li>
              </ul>
            </Form>
          </div>
        </CardBody>
      </Card>

       {/* PDF Preview Modal (Basic Structure) */}
      <Modal isOpen={isPdfModalOpen} toggle={togglePdfModal} size="xl" centered>
        <ModalHeader toggle={togglePdfModal}>Application Preview</ModalHeader>
        <ModalBody style={{ height: '80vh' }}>
          <p>PDF Preview will be shown here.</p>
          {/*
          // Later, you'll integrate react-pdf:
          // <PDFViewer width="100%" height="100%">
          //   <LoanPDFdocument
          //     formData={getValues()} // Pass all RHF form data
          //     emiDetails={emiDetails}
          //     nominees={nominees}
          //     // Pass any other necessary data
          //   />
          // </PDFViewer>
          */}
        </ModalBody>
        <ModalFooter>
          {/*
          // <PDFDownloadLink
          //   document={
          //     <LoanPDFdocument
          //       formData={getValues()}
          //       emiDetails={emiDetails}
          //       nominees={nominees}
          //     />
          //   }
          //   fileName="loan_application.pdf"
          // >
          //   {({ loading: pdfLoading }) => (pdfLoading ? 'Loading document...' : 'Download PDF')}
          // </PDFDownloadLink>
          */}
          <Button color="secondary" onClick={togglePdfModal}>Close</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default LoanProcess;