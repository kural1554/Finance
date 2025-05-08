import React, { useState, useEffect } from "react"; // Added useEffect
import {
  CardBody,
  NavItem,
  TabContent,
  TabPane,
  NavLink,
  UncontrolledTooltip,
  Card,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Row,
  Label,
  Button,
  Table,
  Modal, // Added Modal
  ModalHeader, // Added ModalHeader
  ModalBody, // Added ModalBody
  ModalFooter, // Added ModalFooter
} from "reactstrap";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  Line,
  BarChart,
  Bar,
} from "recharts";
import Dropzone from "react-dropzone";
import { useForm, Controller } from "react-hook-form"; // Added Controller
import classnames from "classnames";
import { Link } from "react-router-dom";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer"; // Combined imports
import LoanPDFdocument, { PDFPreview } from './LoanPDFdocument'; // Assuming this exists and works
import { toast } from "react-toastify";
import axios from "axios";
// API URL for applicant data

const LoanProcess = () => {


  // drop down optision 
  const termTypeOptions = [
    { value: "", label: "Select term type..." },
    { value: "1", label: "Days" },
    { value: "2", label: "Weeks" },
    { value: "3", label: "Months" },
    { value: "4", label: "Years" }
  ];
  const purposeOptions = [
    { value: "", label: "Select purpose..." },
    { value: "1", label: "Children's Education" },
    { value: "2", label: "Medical Expenses" },
    { value: "3", label: "Business" },
    { value: "4", label: "Home Improvement/Purchase" },
    { value: "5", label: "Vehicle Purchase" },
    { value: "6", label: "Personal Expense" },
    { value: "7", label: "Debt Consolidation" },
    { value: "8", label: "Other" }
  ];
  const relationshipOptions = [
    { value: "", label: "Select..." },
    { value: "1", label: "Spouse" },
    { value: "2", label: "Child" },
    { value: "3", label: "Parent" },
    { value: "4", label: "Sibling" },
    { value: "5", label: "Other" }
  ];
  const InterestOptions = [
    { value: "", label: "Select..." },
    { value: "1", label: "Diminishing interest rate" },
    { value: "2", label: "Flat interest rate" },
  ];
  //emi loan interest 

  const [interestRate, setInterestRate] = useState(0);
  // Handler for loan amount change
  const handleLoanAmountChange = (e) => {
    const amount = parseFloat(e.target.value) || 0;
    let rate = 0;

    // Determine interest rate based on amount
    if (amount <= 100000) rate = 3;
    else if (amount <= 199999) rate = 2.5;
    else if (amount > 200000) rate = 2;

    // Update interest rate field
    setValue('interestRate', rate, { shouldValidate: true });
  };

  // Use RHF for the entire multi-step form state
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
    control,
    setValue,
    watch, // Make sure watch is destructured
    reset,
  } = useForm({
    mode: "onBlur", // Validate on change for better UX
    defaultValues: { // Set default values for the entire form
      first_name: "",
      phone: "",
      amount: "",
      term: "",
      termType: "months",
      interestRate: 0,
      purpose: "",
      repaymentSource: "",
      agreeTerms: false,
      agreeCreditCheck: false,
      agreeDataSharing: false,
      translatorName: "",
      translatorPlace: "",
      LoanRegDate: "",
      remarks: "",

    }

  });
  console.log(useForm);

  // Watch the specific values
  const firstNameValue = watch("first_name");
  const phoneValue = watch("phone");

  // Log them when they change
  useEffect(() => {
    console.log("RHF WATCH:", { firstNameValue, phoneValue });
  }, [firstNameValue, phoneValue]); // Re-run when these values change

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  // --- Tab 2 State (Loan Details) ---
  // Use watch from RHF instead of separate state if possible, or sync them
  const loanAmount = watch("amount");
  const loanInterestRate = watch("interestRate");

  // --- Tab 3 State (EMI) ---
  const [emiDetails, setEmiDetails] = useState([]);
  const [viewMode, setViewMode] = useState("table");

  // --- Tab 4 State (Nominee) ---
  const [nominees, setNominees] = useState([]);
  const [newNominee, setNewNominee] = useState({
    nomineeName: "",
    nomineePhone: "",
    nomineeEmail: "",
    nomineeRelationship: "",
    nomineeOtherRelationship: "",
    nomineeAddress: "",
    nomineeidProofType: "",
    nomineeidProofNumber: "",
    nomineeidProofFile: null,
    nomineeProfilePhoto: null,
  });

  // --- Tab 5 State (Agreement) ---
  // Checkbox state is handled by RHF (agreeTerms, etc.)

  // --- Tab 6 State (Documents) ---
  // const [profilephoto, setprofilephoto] = useState([]); // For applicant passport photo

  // --- PDF Preview Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);


  const toggleTab = (tab) => {
    // Allow navigation only up to the current highest reached valid step
    // Or implement logic to ensure previous steps are valid before allowing forward navigation
    if (tab >= 1 && tab <= 6) {
      setActiveTab(tab);
    }
  };

  // Consistent Backend Validation Function
  const validateApplicantBackend = async (applicantData) => {
    setLoading(true);

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const VALIDATION_URL = `${BASE_URL}api/applicants/validate-applicant/`;

    try {
      const response = await axios.post(VALIDATION_URL, applicantData);

      setLoading(false);
      console.log("Backend Raw Response:", response);
      console.log("Backend Response Data:", response.data);

      if (response.data && response.data.valid === true) {
        console.log("Backend validation SUCCESS");
        return { valid: true, message: response.data.message || "Applicant verified" };
      } else {
        const message =
          response.data?.message ||
          response.data?.error ||
          "Applicant not found or invalid";
        toast.error(`❌ ${message}`);
        return { valid: false, message };
      }
    } catch (error) {
      setLoading(false);
      console.error("Axios error during validation:", error);

      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
        console.error("Error Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error Request:", error.request);
      } else {
        console.error("Error Message:", error.message);
      }

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Server error during validation.";
      toast.error(`❌ ${errorMessage}`);
      return { valid: false, message: errorMessage };
    }
  };
  // Final Submit Handler (triggered by RHF's handleSubmit)
  const onFinalSubmit = async (data) => {
    console.log("🟢 onFinalSubmit triggered");
    console.log("Submitted data:", data);
    setLoading(true);
    console.log("Nominees:", nominees);
    console.log("RHF Data Received by onFinalSubmit:", data);

    // Prepare full JSON payload for submission
    const fullJsonPayload = {
      ...data,
      nominees: nominees.map((nominee) => ({
        name: nominee.nomineeName,
        phone: nominee.nomineePhone,
        email: nominee.nomineeEmail,
        relationship: nominee.nomineeRelationship === '5' ? nominee.nomineeOtherRelationship : nominee.nomineeRelationship,
        address: nominee.nomineeAddress,
        idProofType: nominee.nomineeidProofType,
        idProofNumber: nominee.nomineeidProofNumber,
        profile_photo: nominee.nomineeProfilePhoto?.name || null,
        id_proof_file: nominee.nomineeidProofFile?.name || null
      })),
      emiSchedule: emiDetails,  // assuming emiDetails is correctly structured
    };

    const preview = JSON.stringify(fullJsonPayload, null, 2);
    console.log("🚀 Full JSON Payload Preview:");
    console.log(preview);

    // Prepare FormData to send files and data
    const formDataToSubmit = new FormData();

    // Add all non-file data to FormData
    for (const key in fullJsonPayload) {
      if (fullJsonPayload[key] && typeof fullJsonPayload[key] !== 'object') {
        formDataToSubmit.append(key, fullJsonPayload[key]);
      }
    }

    // Add nominees array as JSON string
    formDataToSubmit.append('nominees', JSON.stringify(fullJsonPayload.nominees));

    // Add EMI schedule array as JSON string
    formDataToSubmit.append('emiSchedule', JSON.stringify(fullJsonPayload.emiSchedule));

    // Add files (photos, proof files) for each nominee
    nominees.forEach((nominee, index) => {
      if (nominee?.nomineeProfilePhoto instanceof File) {
        formDataToSubmit.append(`nominee_${index}_profile_photo`, nominee.nomineeProfilePhoto);
      }
      if (nominee?.nomineeidProofFile instanceof File) {
        formDataToSubmit.append(`nominee_${index}_id_proof`, nominee.nomineeidProofFile);
      }
    });

    // API URL for submission
    const API_URL = `${process.env.REACT_APP_API_BASE_URL}api/apply-loan/loan-applications/`;

    try {
      // Submit the form with multipart/form-data headers for file uploads
      const response = await axios.post(API_URL, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',  // for file uploads
        },
      });

      setLoading(false);
      console.log("Submission Response:", response.data);
      toast.success('✅ Loan Application Submitted Successfully!');
      reset();  // Reset form state if necessary
      setActiveTab(1);  // Reset the active tab if necessary
    } catch (error) {
      setLoading(false);
      console.error("Submission Error:", error.response || error.message || error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        '❌ Error submitting loan application. Please check details.';
      toast.error(errorMessage);
    }
  };

  // --- EMI Calculation ---
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  const [emiSummary, setEmiSummary] = useState({
    totalPrincipal: 0,
    totalInterest: 0,
    totalPayment: 0,
    schedule: [],
    loanDate: [],
  });
  const calculateEMIStartDates = (loanDate) => {
    const { term, } = getValues();

    // Create a Date object from the loan date
    const loanDateObj = new Date(loanDate);

    // Calculate the first EMI date, which is 5th of the next month
    let firstEMIDate = new Date(loanDateObj);
    firstEMIDate.setMonth(loanDateObj.getMonth() + 1); // Move to next month
    firstEMIDate.setDate(5); // Set day to 5th

    // If the loan date is after the 28th, the first EMI will be on the 5th of the second next month
    if (loanDateObj.getDate() > 28) {
      firstEMIDate.setMonth(firstEMIDate.getMonth() + 1);
    }

    // Generate 10 EMI dates starting from the firstEMIDate
    const emiDates = [];
    for (let i = 0; i < term; i++) {
      let emiDate = new Date(firstEMIDate);
      emiDate.setMonth(firstEMIDate.getMonth() + i); // Move to the next month for each EMI
      emiDates.push(emiDate);
    }
    const formattedEMIDates = emiDates.map(date => date.toISOString().split('T')[0]);

    return formattedEMIDates;
  };

  // Example usage
  const loanDate = "2025-04-10"; // Example loan date
  const emiStartDates = calculateEMIStartDates(loanDate);
  console.log(emiStartDates);
  const calculateEMI = () => {
    const { amount, term, interestRate, termType, startDate, interestType } = getValues();
  
    if (!amount || !term || !interestRate || !termType || !startDate || !interestType) {
      toast.error("Please fill all required loan details!");
      return;
    }
  
    let principal = parseFloat(amount);
    let rate = parseFloat(interestRate) / 100; // Convert percentage to decimal (3% → 0.03)
    const termValue = parseInt(term);
    let numberOfMonths = 0;
  
    switch (termType) {
      case "days": numberOfMonths = Math.ceil(termValue / 30); break;
      case "weeks": numberOfMonths = Math.ceil(termValue / 4); break;
      case "months": numberOfMonths = termValue; break;
      case "years": numberOfMonths = termValue * 12; break;
      default: numberOfMonths = termValue;
    }
  
    if (numberOfMonths <= 0) {
      toast.error("Invalid loan term.");
      return;
    }
  
    const emiStartDates = calculateEMIStartDates(startDate);
    let emiBreakdown = [];
  
    if (interestType === "1") {
      // Diminishing Interest Rate (Original Calculation)
      let fixedPrincipalPayment = principal / numberOfMonths;
      let remainingPrincipal = principal;
  
      for (let i = 1; i <= numberOfMonths; i++) {
        let interestForMonth = remainingPrincipal * rate;
        let emiTotalMonth = interestForMonth + fixedPrincipalPayment;
        remainingPrincipal -= fixedPrincipalPayment;
  
        emiBreakdown.push({
          month: i,
          emiStartDate: emiStartDates[i - 1] || "N/A",
          emiTotalMonth: parseFloat(emiTotalMonth.toFixed(2)),
          interest: parseFloat(interestForMonth.toFixed(2)),
          principalPaid: parseFloat(fixedPrincipalPayment.toFixed(2)),
          remainingBalance: parseFloat(Math.max(0, remainingPrincipal).toFixed(2))
        });
  
        if (remainingPrincipal <= 0.01) break;
      }
    } else if (interestType === "2") {
      // Flat Interest Rate (New Logic)
      // Step 1: Calculate total interest using diminishing method
      let totalInterest = 0;
      let remainingPrincipalForInterest = principal;
      const fixedPrincipalPayment = principal / numberOfMonths;
  
      for (let i = 1; i <= numberOfMonths; i++) {
        let interestForMonth = remainingPrincipalForInterest * rate;
        totalInterest += interestForMonth;
        remainingPrincipalForInterest -= fixedPrincipalPayment;
      }
  
      // Step 2: Add to principal and divide by months
      const totalRepayment = principal + totalInterest;
      const fixedEMI = totalRepayment / numberOfMonths;
      let remainingPrincipal = principal;
  
      // Step 3: Generate schedule with equal EMIs
      for (let i = 1; i <= numberOfMonths; i++) {
        const principalPaid = principal / numberOfMonths;
        const interestPaid = fixedEMI - principalPaid;
        remainingPrincipal -= principalPaid;
  
        emiBreakdown.push({
          month: i,
          emiStartDate: emiStartDates[i - 1] || "N/A",
          emiTotalMonth: parseFloat(fixedEMI.toFixed(2)),
          interest: parseFloat(interestPaid.toFixed(2)),
          principalPaid: parseFloat(principalPaid.toFixed(2)),
          remainingBalance: parseFloat(Math.max(0, remainingPrincipal).toFixed(2))
        });
      }
    }
  
    setEmiDetails(emiBreakdown);
    toast.success("✅ EMI Schedule Calculated");
    toggleTab(3);
  };
  const sendLoanApplication = async () => {
    try {
      if (emiDetails.length === 0) {
        calculateEMI();
      }

      const formData = getValues();

      const loanApplication = {
        loanDetails: {
          amount: parseFloat(formData.amount),
          term: parseInt(formData.term),
          termType: formData.termType,
          interestRate: parseFloat(formData.interestRate),
          purpose: formData.purpose,
          repaymentSource: formData.repaymentSource,
          startDate: formData.startDate,
        },
        emiSchedule: {
          totalPrincipal: summary.totalPrincipal,
          totalInterest: summary.totalInterest,
          totalEMI: summary.totalPayment,
          schedule: emiDetails.map(item => ({
            month: item.month,
            emiDate: item.emiStartDate, // Include EMI date
            emi: item.emiTotalMonth,
            principal: item.principalPaid,
            interest: item.interest,
            balance: item.remainingBalance,
          })),
        }
      };

      console.log("Loan Application JSON:", loanApplication);
      toast.success("Loan application submitted successfully!");

      return loanApplication;
    } catch (error) {
      console.error("Error submitting loan application:", error);
      toast.error("Failed to submit loan application");
      throw error;
    }
  };
  // --- Nominee Functions ---
  const handleNomineesChange = (field, value) => {
    setNewNominee((prev) => ({ ...prev, [field]: value }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleNomineeProfileUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const newFile = Object.assign(file, { // Use Object.assign for compatibility
        preview: URL.createObjectURL(file),
        formattedSize: formatFileSize(file.size),
      });
      setNewNominee({ ...newNominee, nomineeProfilePhoto: newFile });
    }
  };

  const handleNomineeFileUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatFileSize(file.size),
      });
      setNewNominee({ ...newNominee, nomineeidProofFile: newFile });
    }
  };

  const removeNomineeProfilePhoto = () => {
    if (newNominee.nomineeProfilePhoto?.preview) {
      URL.revokeObjectURL(newNominee.nomineeProfilePhoto.preview); // Clean up memory
    }
    setNewNominee({ ...newNominee, nomineeProfilePhoto: null });
  }
  const removeNomineeFile = () => {
    if (newNominee.nomineeidProofFile?.preview) {
      URL.revokeObjectURL(newNominee.nomineeidProofFile.preview); // Clean up memory
    }
    setNewNominee({ ...newNominee, nomineeidProofFile: null });
  }

  const addNominee = () => {
    // Simple validation
    if (!newNominee.nomineeName || !newNominee.nomineePhone || !newNominee.nomineeRelationship || (newNominee.nomineeRelationship === '5' && !newNominee.nomineeOtherRelationship) || !newNominee.nomineeAddress) {
      toast.error("Please fill all required nominee fields (Name, Phone, Relationship, Address).");
      return;
    }

    setNominees([...nominees, newNominee]);
    // Reset nominee form
    setNewNominee({
      nomineeName: "",
      nomineePhone: "",
      nomineeEmail: "",
      nomineeRelationship: "",
      nomineeOtherRelationship: "",
      nomineeAddress: "",
      nomineeidProofType: "",
      nomineeidProofNumber: "",
      nomineeidProofFile: null,
      nomineeProfilePhoto: null,
    });
    toast.success("Nominee added.");
  };

  const removeNominee = (indexToRemove) => {
    // Clean up preview URLs before removing
    const nomineeToRemove = nominees[indexToRemove];
    if (nomineeToRemove.nomineeProfilePhoto?.preview) {
      URL.revokeObjectURL(nomineeToRemove.nomineeProfilePhoto.preview);
    }
    if (nomineeToRemove.nomineeidProofFile?.preview) {
      URL.revokeObjectURL(nomineeToRemove.nomineeidProofFile.preview);
    }
    setNominees(nominees.filter((_, index) => index !== indexToRemove));
    toast.info("Nominee removed.");
  }

  const editNominee = (indexToEdit) => {
    const nomineeToEdit = nominees[indexToEdit];
    setNewNominee(nomineeToEdit); // Load data into the form
    // Remove the nominee from the list temporarily; will be re-added on 'Add Nominee' click if modified
    setNominees(nominees.filter((_, index) => index !== indexToEdit));
    toast.info("Editing nominee. Click 'Add Nominee' again to save changes.");
  };

  // --- Cleanup useEffect ---
  useEffect(() => {
    // Clean up object URLs when component unmounts or files change
    return () => {
      // profilephoto.forEach(file => URL.revokeObjectURL(file.preview));
      nominees.forEach(nominee => {
        if (nominee.nomineeProfilePhoto?.preview) URL.revokeObjectURL(nominee.nomineeProfilePhoto.preview);
        if (nominee.nomineeidProofFile?.preview) URL.revokeObjectURL(nominee.nomineeidProofFile.preview);
      });
      if (newNominee.nomineeProfilePhoto?.preview) URL.revokeObjectURL(newNominee.nomineeProfilePhoto.preview);
      if (newNominee.nomineeidProofFile?.preview) URL.revokeObjectURL(newNominee.nomineeidProofFile.preview);
    };
  }, [nominees, newNominee]); // Add dependencies

  // --- Helper Functions ---
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value);

  // --- Recharts Custom Tooltip ---
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip p-2 bg-white border shadow-sm rounded">
          <p className="mb-1">
            <strong>Month {label}</strong>
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="mb-0" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // --- Calculated Totals for EMI Summary ---
  const totalInterest = emiDetails.reduce((sum, row) => sum + row.interest, 0);
  // Use RHF's value for consistency
  const totalPrincipal = parseFloat(loanAmount || 0);
  const totalPayment = totalInterest + totalPrincipal;

  // --- Handle Next Button Click ---
  const handleNext = async () => {
    console.log(`--- handleNext called for activeTab: ${activeTab} ---`); // Log entry
    let isValid = true;
    let fieldsToValidate = [];

    // --- Step 1 Validation ---
    if (activeTab === 1) {
      fieldsToValidate = ["first_name", "phone"];
      console.log("Tab 1: Triggering validation for:", fieldsToValidate);
      try {
        isValid = await trigger(fieldsToValidate);
        console.log(`Tab 1: Trigger result (isValid): ${isValid}`); // Log trigger result
        // Log current values being validated
        const currentValues = getValues(['first_name', 'phone']);
        console.log("Tab 1: Values being validated:", currentValues);
        // Log current errors state from RHF
        console.log("Tab 1: RHF errors state:", errors);

        if (!isValid) {
          toast.error("Please fill Applicant Information correctly.");
          console.log("Tab 1: Validation failed, stopping.");
          return; // Stop if RHF validation fails
        }

        // ---- Backend check ONLY if RHF validation passed ----
        console.log("Tab 1: RHF validation passed. Proceeding to backend check.");
        const values = getValues(); // Get values again just to be sure
        const applicantData = {
          first_name: values.first_name,
          phone: values.phone
        };
        console.log("Tab 1: Calling validateApplicantBackend with:", applicantData);
        const backendResponse = await validateApplicantBackend(applicantData);
        console.log("Tab 1: Backend response:", backendResponse);

        if (!backendResponse.valid) {
          // Toast is shown inside validateApplicantBackend on error
          console.log("Tab 1: Backend validation failed, stopping.");
          return; // Stop if backend validation fails
        }
        // Backend validation succeeded
        toast.success(backendResponse.message || '✅ Applicant verified');

      } catch (error) {
        console.error("Tab 1: Error during validation or backend call:", error);
        toast.error("An unexpected error occurred during validation.");
        return;
      }

    }
    //json data
    // --- Step 2 Validation (Loan Details) ---
    else if (activeTab === 2) {
      // ... (add similar logging if needed for other tabs)
      fieldsToValidate = ["amount", "term", "termType", "interestRate", "purpose", "repaymentSource"];
      console.log("Tab 2: Triggering validation for:", fieldsToValidate);
      isValid = await trigger(fieldsToValidate);
      console.log(`Tab 2: Trigger result (isValid): ${isValid}`);
      console.log("Tab 2: RHF errors state:", errors);
      if (!isValid) {
        toast.error("Please fill all Loan Details correctly.");
        return;
      }
      toast.info("Please click 'Calculate EMI & View Schedule' to proceed.");
      return;
    }

    // --- Add similar console logs for other tabs if debugging them ---

    // --- Proceed to next tab if valid ---
    console.log(`Current isValid status before potentially switching tab: ${isValid}`);
    if (isValid && activeTab < 6) {
      console.log(`Validation passed for Tab ${activeTab}. Switching to Tab ${activeTab + 1}`);
      toggleTab(activeTab + 1);
    } else if (activeTab >= 6) {
      console.log("Already on the last tab or validation failed on previous steps.");
    } else {
      console.log(`Validation failed for Tab ${activeTab} (isValid: ${isValid}), staying on current tab.`);
    }
  };


  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <h4 className="card-title mb-0">Loan Application Process</h4>
        </CardHeader>
        <CardBody>
          {/* Wizard Navigation */}
          <div id="basic-pills-wizard" className="twitter-bs-wizard">
            <ul className="twitter-bs-wizard-nav nav nav-pills nav-justified">
              {[1, 2, 3, 4, 5, 6].map((tabIndex) => (
                <NavItem key={tabIndex}>
                  <NavLink
                    className={classnames({ active: activeTab === tabIndex })}
                    onClick={() => {
                      // Optional: Allow clicking back to previous tabs if needed,
                      // but might require re-validation logic or state management
                      // For now, only allow clicking the *current* tab (or handled by prev/next)
                      // toggleTab(tabIndex);
                    }}
                    style={{ cursor: activeTab === tabIndex ? 'default' : 'pointer' }} // Indicate clickable state
                  >
                    <div className="step-icon" id={`step${tabIndex}`}>
                      <i className={`bx ${tabIndex === 1 ? 'bx-user' :
                        tabIndex === 2 ? 'bx-rupee' :
                          tabIndex === 3 ? 'bxs-calculator' :
                            tabIndex === 4 ? 'bx-user-plus' :
                              tabIndex === 5 ? 'bx-file' :
                                'bx-check-shield'
                        }`}></i>
                      <UncontrolledTooltip placement="top" target={`step${tabIndex}`}>
                        {
                          tabIndex === 1 ? 'Applicant' :
                            tabIndex === 2 ? 'Loan Details' :
                              tabIndex === 3 ? 'EMI Schedule' :
                                tabIndex === 4 ? 'Nominee' :
                                  tabIndex === 5 ? 'Agreement' :
                                    'Documents & Submit'
                        }
                      </UncontrolledTooltip>
                    </div>
                  </NavLink>
                </NavItem>
              ))}
            </ul>

            {/* Tab Content */}
            {/* Wrap entire content in a Form tag handled by RHF's handleSubmit */}
            <Form onSubmit={handleSubmit(onFinalSubmit)}>
              <TabContent activeTab={activeTab}>
                {/* Tab 1 - Applicant Info */}
                <TabPane tabId={1}>
                  <div className="text-center mb-4">
                    <h5>Applicant Information</h5>
                    <p className="card-title-desc">
                      Enter applicant name and phone to verify.
                    </p>
                  </div>

                  <Row className="justify-content-center">
                    <Col md={6}>

                      {/* Debug Box */}


                      {/* --- First Name using Controller --- */}
                      <FormGroup>
                        <Label htmlFor="first_name">Full Name</Label>
                        <Controller
                          name="first_name" // Field name
                          control={control} // Pass RHF control object
                          rules={{ required: "Full name is required" }} // Validation rules
                          render={({ field, fieldState: { error } }) => (
                            <Input
                              id="first_name"
                              type="text"
                              placeholder="Enter applicant's full name"
                              autoComplete="name"
                              invalid={!!error} // Use error from fieldState
                              {...field} // Spread the necessary props (value, onChange, onBlur, ref)
                            />
                          )}
                        />
                        {/* You can still use ErrorMessage or manual display */}
                        {errors.first_name && (
                          <span className="text-danger small">
                            {errors.first_name.message}
                          </span>
                        )}
                      </FormGroup>

                      {/* --- Phone using Controller --- */}
                      <FormGroup>
                        <Label htmlFor="phone">Mobile Number</Label>
                        <Controller
                          name="phone" // Field name
                          control={control} // Pass RHF control object
                          rules={{
                            required: "Mobile number is required",
                            pattern: {
                              value: /^[6-9]\d{9}$/,
                              message: "Invalid Indian Mobile number (10 digits, starting 6-9)",
                            },
                          }} // Validation rules
                          render={({ field, fieldState: { error } }) => (
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="Enter 10-digit Mobile number"
                              autoComplete="tel-national"
                              invalid={!!error} // Use error from fieldState
                              {...field} // Spread the necessary props (value, onChange, onBlur, ref)
                            />
                          )}
                        />
                        {/* You can still use ErrorMessage or manual display */}
                        {errors.phone && (
                          <span className="text-danger small">
                            {errors.phone.message}
                          </span>
                        )}
                      </FormGroup>

                      {/* Loading indicator */}
                      {/* {loading && activeTab === 1 && (...)} */}

                    </Col>
                  </Row>
                </TabPane>

                {/* Tab 2 - Loan Details Form */}
                <TabPane tabId={2}>
                  <div className="text-center mb-4">
                    <h5>Loan Details</h5>
                    <p className="card-title-desc">Fill all information below</p>
                  </div>

                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="amount">Loan Amount (₹)</Label>
                        <Controller
                          name="amount"
                          control={control}
                          rules={{
                            required: "Loan amount is required",
                            min: { value: 1000, message: "Minimum amount is ₹1000" }
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="amount"
                              type="number"
                              placeholder="Enter loan amount"
                              min="1000"
                              step="100"
                              invalid={!!errors.amount}
                              onChange={(e) => {
                                field.onChange(e); // Call the original onChange
                                handleLoanAmountChange(e); // Call our custom handler
                              }}
                            />
                          )}
                        />
                        {errors.amount && <span className="text-danger small">{errors.amount.message}</span>}
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="startDate">Loan Date</Label>
                        <Controller
                          name="startDate"
                          control={control}
                          rules={{ required: "Start date is required" }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="startDate"
                              type="date"
                              min={new Date().toISOString().split('T')[0]} // Restrict to today or future dates
                              invalid={!!errors.startDate}
                            />
                          )}
                        />
                        {errors.startDate && <span className="text-danger small">{errors.startDate.message}</span>}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                  <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="interestType">Interest Type</Label>
                        <Controller
                          name="interestType"
                          control={control}
                          rules={{ required: "Interest type is required" }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="interestType"
                              type="select"
                              invalid={!!errors.interestType}
                            >
                              {InterestOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Input>
                          )}
                        />
                        {errors.interestType && <span className="text-danger small">{errors.interestType.message}</span>}
                      </FormGroup>
                    </Col>
                    

                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="termType">Loan Term Type</Label>
                        <Controller
                          name="termType"
                          control={control}
                          rules={{ required: "Term type is required" }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="termType"
                              type="select"
                              invalid={!!errors.termType}
                            >
                              {termTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Input>
                          )}
                        />
                        {errors.termType && <span className="text-danger small">{errors.termType.message}</span>}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="interestRate">Interest Rate (% Per Annum)</Label>
                        <Controller
                          name="interestRate"
                          control={control}
                          rules={{
                            required: "Interest rate is required",
                            min: { value: 0, message: "Rate cannot be negative" },
                            max: { value: 100, message: "Rate seems too high" }
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="interestRate"
                              type="number"
                              placeholder="Enter annual interest rate"
                              min="0"
                              max="100"
                              step="0.1"
                              invalid={!!errors.interestRate}
                            />
                          )}
                        />
                        {errors.interestRate && <span className="text-danger small">{errors.interestRate.message}</span>}
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="term">Loan Term</Label>
                        <Controller
                          name="term"
                          control={control}
                          rules={{
                            required: "Loan term is required",
                            min: { value: 1, message: "Term must be at least 1" }
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="term"
                              type="number"
                              placeholder="Enter loan term duration"
                              min="1"
                              invalid={!!errors.term}
                            />
                          )}
                        />
                        {errors.term && <span className="text-danger small">{errors.term.message}</span>}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="purpose">Loan Purpose</Label>
                        <Controller
                          name="purpose"
                          control={control}
                          rules={{ required: "Loan purpose is required" }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="purpose"
                              type="select"
                              invalid={!!errors.purpose}
                            >
                              {purposeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Input>
                          )}
                        />
                        {errors.purpose && <span className="text-danger small">{errors.purpose.message}</span>}
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="repaymentSource">Source of Repayment</Label>
                        <Controller
                          name="repaymentSource"
                          control={control}
                          rules={{ required: "Repayment source is required" }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="repaymentSource"
                              type="text"
                              placeholder="e.g., Salary, Business Income"
                              invalid={!!errors.repaymentSource}
                            />
                          )}
                        />
                        {errors.repaymentSource && <span className="text-danger small">{errors.repaymentSource.message}</span>}
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="text-center mt-4 d-flex justify-content-center gap-2">
                    <Button color="primary" type="button" onClick={calculateEMI}>
                      <i className="bx bxs-calculator me-1"></i> Calculate EMI & View Schedule
                    </Button>
                  </div>
                </TabPane>


                {/* Tab 3 - EMI Schedule */}
                <TabPane tabId={3}>
                  <div className="text-center mb-4">
                    <h5>EMI Repayment Schedule</h5>
                    <p className="card-title-desc">
                      {emiDetails.length > 0
                        ? `Loan of ${formatCurrency(loanAmount)} at ${loanInterestRate}% interest per annum`
                        : "Calculate your EMI in Tab 2 to view schedule"}
                    </p>
                  </div>

                  {emiDetails.length > 0 ? (
                    <>
                      <div className="text-center mb-3">
                        <Button
                          color={viewMode === "table" ? "primary" : "light"}
                          onClick={() => setViewMode("table")}
                          className="me-2 btn-sm" // Smaller buttons
                        >
                          <i className="bx bx-table"></i> Table
                        </Button>
                        <Button
                          color={viewMode === "chart" ? "primary" : "light"}
                          onClick={() => setViewMode("chart")}
                          className="btn-sm" // Smaller buttons
                        >
                          <i className="bx bx-line-chart"></i> Chart
                        </Button>
                      </div>

                      {viewMode === "table" ? (
                        <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}> {/* Scrollable table */}
                          <Table striped bordered hover size="sm">
                            <thead>
                              <tr>
                                <th>Month</th>
                                <th>EMI Date</th> {/* New column for EMI date */}
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
                                  <td>{row.emiStartDate}</td> {/* Display the EMI date */}
                                  <td>{formatCurrency(row.emiTotalMonth)}</td>
                                  <td>{formatCurrency(row.principalPaid)}</td>
                                  <td>{formatCurrency(row.interest)}</td>
                                  <td>{formatCurrency(row.remainingBalance)}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="table-light fw-bold">
                                <td colSpan="2">Total</td> {/* Adjusted colspan */}
                                <td>{formatCurrency(totalPayment)}</td>
                                <td>{formatCurrency(totalPrincipal)}</td>
                                <td>{formatCurrency(totalInterest)}</td>
                                <td>-</td>
                              </tr>
                            </tfoot>
                          </Table>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={400}>
                          <LineChart data={emiDetails} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottomRight', offset: -5 }} />
                            <YAxis
                              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} // Format ticks
                              label={{ value: 'Amount (INR)', angle: -90, position: 'insideLeft' }}
                            />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="emiTotalMonth" name="EMI" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="principalPaid" name="Principal" stroke="#82ca9d" strokeWidth={2} />
                            <Line type="monotone" dataKey="interest" name="Interest" stroke="#ff7300" strokeWidth={2} />
                            <Line type="monotone" dataKey="remainingBalance" name="Balance" stroke="#cccccc" strokeDasharray="5 5" /> {/* Optional: Show balance */}

                          </LineChart>
                        </ResponsiveContainer>
                      )}

                      {/* Summary Card */}
                      <Card className="mt-4 bg-light">
                        <CardBody>
                          <Row>
                            <Col md={4} className="text-center border-end"> {/* Added borders */}
                              <p className="text-muted mb-1">Loan Amount</p>
                              <h5 className="text-primary mb-0">{formatCurrency(totalPrincipal)}</h5>
                            </Col>
                            <Col md={4} className="text-center border-end"> {/* Added borders */}
                              <p className="text-muted mb-1">Total Interest</p>
                              <h5 className="text-danger mb-0">{formatCurrency(totalInterest)}</h5>
                            </Col>
                            <Col md={4} className="text-center">
                              <p className="text-muted mb-1">Total Payment</p>
                              <h5 className="text-success mb-0">{formatCurrency(totalPayment)}</h5>
                            </Col>
                          </Row>
                          {emiDetails.length > 0 && (
                            <div className="text-center mt-4"> {/* Centers the button */}
                              {/* <Button color="success" type="button" onClick={sendLoanApplication}>
                                <i className="bx bx-send me-1"></i> Submit Application
                              </Button> */}
                            </div>
                          )}
                        </CardBody>
                      </Card>

                      {/* Removed Edit Button - Use Previous Button Instead */}
                      {/* <div className="text-center mt-4">
                           <Button color="secondary" onClick={() => toggleTab(2)} className="me-2">
                           <i className="bx bx-edit"></i> Edit Loan Details
                           </Button>
                        </div> */}
                    </>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bx bx-calculator display-4 text-muted mb-3"></i>
                      <h5>No EMI Schedule Available</h5>
                      <p className="text-muted mb-4">
                        Go back to the 'Loan Details' tab, fill in the required fields, and click "Calculate EMI" to view your repayment schedule.
                      </p>
                      <Button color="secondary" onClick={() => toggleTab(2)}>
                        <i className="bx bx-arrow-back"></i> Go to Loan Details
                      </Button>


                    </div>
                  )}
                </TabPane>


                {/* Tab 4 - Nominee */}
                <TabPane tabId={4}>
                  <Form>
                    <div className="text-center mb-4">
                      <h5>Nominee Details</h5>
                      <p className="card-title-desc">Add one or more nominees for the loan.</p>
                    </div>

                    {/* Nominee Input Form Section */}
                    <Card className="mb-4 border">
                      <CardHeader className="bg-light">
                        <h6 className="mb-0">Add / Edit Nominee</h6>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col className="col-12">
                            <CardBody className="position-relative">
                              <div
                                className="position-absolute"
                                style={{
                                  top: "40px",
                                  right: "82px",
                                  zIndex: "100",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                {newNominee.nomineeProfilePhoto && (
                                  <div className="d-flex flex-column align-items-center">
                                    <img
                                      src={newNominee.nomineeProfilePhoto.preview}
                                      alt="Nominee Profile"
                                      width="80"
                                      height="80"
                                      className="rounded-circle border"
                                      style={{
                                        width: "80px",
                                        height: "80px",
                                        objectFit: "cover",
                                        marginRight: "36px",
                                        borderRadius: "50%",
                                        border: "1px solid #ddd"
                                      }}
                                    />
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={removeNomineeProfilePhoto}
                                    >
                                      <i className="bx bx-trash"></i> Remove Photo
                                    </button>
                                  </div>
                                )}
                              </div>

                              <Form className="d-flex justify-content-end">
                                <div className="col-md-4 col-lg-3">
                                  <Dropzone
                                    onDrop={handleNomineeProfileUpload}
                                    accept={{ "image/*": [".jpeg", ".jpg", ".png"] }}
                                    maxFiles={1}
                                    maxSize={2 * 1024 * 1024}
                                  >
                                    {({ getRootProps, getInputProps }) => (
                                      <div {...getRootProps()} className="dropzone" style={{ minHeight: "100px" }}>
                                        <input {...getInputProps()} />
                                        <div className="dz-message p-3 border rounded text-center" style={{ cursor: "pointer" }}>
                                          <div className="d-flex flex-column align-items-center">
                                            <div
                                              className="rounded-circle d-flex align-items-center justify-content-center border"
                                              style={{
                                                width: "80px",
                                                height: "80px",
                                                backgroundColor: "#f8f9fa",
                                              }}
                                            >
                                              <i className="bx bx-camera fs-3 text-muted" />
                                            </div>
                                            <h6 className="mb-0 mt-2">Upload Nominee Photo</h6>
                                            <small className="text-muted">Click or drag an image</small>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </Dropzone>
                                </div>
                              </Form>
                            </CardBody>
                          </Col>
                        </Row>

                        <Row>
                          {/* Nominee Name, Phone */}
                          <Col md={6} sm={12}>
                            <FormGroup className="mb-3">
                              <Label>Nominee Name <span className="text-danger">*</span></Label>
                              <Input
                                type="text"
                                value={newNominee.nomineeName}
                                onChange={(e) => handleNomineesChange("nomineeName", e.target.value)}
                                placeholder="Enter name"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={6} sm={12}>
                            <FormGroup className="mb-3">
                              <Label>Nominee Phone <span className="text-danger">*</span></Label>
                              <Input
                                type="text"
                                value={newNominee.nomineePhone}
                                onChange={(e) => handleNomineesChange("nomineePhone", e.target.value)}
                                placeholder="Enter 10-digit mobile"
                              />
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row>
                          {/* Email, Relationship */}
                          <Col md={6} sm={12}>
                            <FormGroup className="mb-3">
                              <Label>Nominee Email (Optional)</Label>
                              <Input
                                type="email"
                                value={newNominee.nomineeEmail}
                                onChange={(e) => handleNomineesChange("nomineeEmail", e.target.value)}
                                placeholder="Enter email"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={6} sm={12}>
                            <FormGroup className="mb-3">
                              <Label>Relationship <span className="text-danger">*</span></Label>
                              <Input
                                type="select"
                                value={newNominee.nomineeRelationship}
                                onChange={(e) => handleNomineesChange("nomineeRelationship", e.target.value)}
                              >
                                {relationshipOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </Input>
                            </FormGroup>
                            {newNominee.nomineeRelationship === "5" && (
                              <FormGroup className="mb-3">
                                <Label>Specify Relationship <span className="text-danger">*</span></Label>
                                <Input
                                  type="text"
                                  value={newNominee.nomineeOtherRelationship}
                                  onChange={(e) => handleNomineesChange("nomineeOtherRelationship", e.target.value)}
                                  placeholder="e.g., Uncle, Friend"
                                />
                              </FormGroup>
                            )}
                          </Col>
                        </Row>

                        <Row>
                          {/* Address */}
                          <Col md={12} sm={12}>
                            <FormGroup className="mb-3">
                              <Label>Nominee Address <span className="text-danger">*</span></Label>
                              <Input
                                type="textarea"
                                rows="2"
                                value={newNominee.nomineeAddress}
                                onChange={(e) => handleNomineesChange("nomineeAddress", e.target.value)}
                                placeholder="Enter full address"
                              />
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row className="mt-3">
                          {/* ID Proof Type and Number */}
                          <Col md={4} sm={12}>
                            <FormGroup className="mb-3">
                              <Label>ID Proof Type</Label>
                              <Input
                                type="select"
                                value={newNominee.nomineeidProofType}
                                onChange={(e) => handleNomineesChange("nomineeidProofType", e.target.value)}
                              >
                                <option value="">Select ID...</option>
                                <option value="PAN Card">PAN Card</option>
                                <option value="Aadhar Card">Aadhar Card</option>
                                <option value="Voter ID">Voter ID</option>
                                <option value="Driving License">Driving License</option>
                                <option value="Passport">Passport</option>
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col md={4} sm={12}>
                            <FormGroup className="mb-3">
                              <Label>ID Proof Number</Label>
                              <Input
                                type="text"
                                value={newNominee.nomineeidProofNumber}
                                onChange={(e) => handleNomineesChange("nomineeidProofNumber", e.target.value)}
                                placeholder="Enter ID number"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={4} sm={12}>
                            <FormGroup className="mb-3">
                              <Label>Upload ID Proof</Label>
                              <Dropzone
                                onDrop={handleNomineeFileUpload}
                                accept={{ 'image/*': ['.jpeg', '.jpg', '.png'], 'application/pdf': ['.pdf'] }}
                                maxFiles={1}
                                maxSize={2 * 1024 * 1024}
                              >
                                {({ getRootProps, getInputProps, isDragActive }) => (
                                  <div {...getRootProps()} className="dropzone" style={{ minHeight: "100px" }}>
                                    <input {...getInputProps()} />
                                    <div className={`dz-message p-3 border rounded text-center ${isDragActive ? 'border-primary' : ''}`} style={{ cursor: "pointer" }}>
                                      {newNominee.nomineeidProofFile ? (
                                        <div>
                                          <i className="bx bx-file fs-3 text-success"></i>
                                          <p className="mb-0 small text-truncate">{newNominee.nomineeidProofFile.name}</p>
                                          <small className="text-muted">{newNominee.nomineeidProofFile.formattedSize}</small> <br />
                                          <Button
                                            color="link"
                                            size="sm"
                                            className="text-danger p-0"
                                            onClick={(e) => { e.stopPropagation(); removeNomineeFile(); }}
                                          >
                                            Remove
                                          </Button>
                                        </div>
                                      ) : (
                                        <>
                                          <i className={`bx bx-cloud-upload fs-3 ${isDragActive ? 'text-primary' : 'text-muted'}`}></i>
                                          <h6 className="fs-13 mt-1 mb-1">{isDragActive ? "Drop here" : "Upload ID Proof"}</h6>
                                          <small className="text-muted">JPG, PNG, PDF (Max 2MB)</small>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Dropzone>
                            </FormGroup>
                          </Col>
                        </Row>

                        {/* Add Button */}
                        <Row className="mt-3">
                          <Col className="text-center">
                            <Button color="primary" type="button" onClick={addNominee}>
                              <i className="bx bx-user-plus me-1"></i> Add / Update Nominee
                            </Button>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>

                    {/* Nominees List Table */}
                    <div className="mt-4">
                      <h5 className="mb-3">Added Nominees</h5>
                      {nominees.length === 0 ? (
                        <p className="text-muted text-center py-3">No nominees added yet.</p>
                      ) : (
                        <div className="table-responsive">
                          <Table striped bordered hover size="sm" className="mb-0">
                            <thead className="table-light">
                              <tr>
                                <th style={{ width: '60px' }}>Photo</th>
                                <th>Name</th>
                                <th style={{ width: '120px' }}>Phone</th>
                                <th style={{ width: '120px' }}>Relationship</th>
                                <th>Address</th>
                                <th style={{ width: '100px' }}>ID Proof</th>
                                <th style={{ width: '100px' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {nominees.map((nominee, index) => (
                                <tr key={index}>
                                  <td className="text-center align-middle">
                                    {nominee.nomineeProfilePhoto ? (
                                      <img
                                        src={nominee.nomineeProfilePhoto.preview}
                                        alt=" "
                                        width="40"
                                        height="40"
                                        className="rounded-circle"
                                        style={{ objectFit: 'cover' }}
                                      />
                                    ) : (
                                      <i className="bx bx-user-circle fs-3 text-muted"></i>
                                    )}
                                  </td>
                                  <td className="align-middle">{nominee.nomineeName}</td>
                                  <td className="align-middle">{nominee.nomineePhone}</td>
                                  <td className="align-middle">
                                    {nominee.nomineeRelationship === '5' ? nominee.nomineeOtherRelationship : nominee.nomineeRelationship}
                                  </td>
                                  <td className="align-middle" style={{ maxWidth: '200px', whiteSpace: 'normal' }}>
                                    {nominee.nomineeAddress}
                                  </td>
                                  <td className="text-center align-middle">
                                    {nominee.nomineeidProofFile ? (
                                      <a
                                        href={nominee.nomineeidProofFile.preview}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-outline-primary"
                                      >
                                        <i className="bx bx-show"></i> View
                                      </a>
                                    ) : (
                                      <span className="text-muted">N/A</span>
                                    )}
                                  </td>
                                  <td className="text-center align-middle">
                                    <Button
                                      color="warning"
                                      size="sm"
                                      onClick={() => editNominee(index)}
                                      className="me-1 px-2 py-1"
                                    >
                                      <i className="bx bx-edit"></i>
                                    </Button>
                                    <Button
                                      color="danger"
                                      size="sm"
                                      onClick={() => removeNominee(index)}
                                      className="px-2 py-1"
                                    >
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
                  </Form>
                </TabPane>

                {/* Tab 5 - Agreement */}
                <TabPane tabId={5}>
                  <div className="text-center mb-4">
                    <h5>Declaration and Agreement</h5>
                    <p className="card-title-desc">Please read and agree to the terms.</p>
                  </div>
                  {/* Removed nested Form tag */}
                  <Row>
                    <Col md={12}>
                      <div className="declaration-text p-3 border rounded bg-light mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <h6>
                          Declaration and Undertaking by Applicant to SPK Micro Financial Services (Promoted by SPK Foundation)
                        </h6>
                        <p className="small"> {/* Smaller text */}
                          I/We, declare that all the information given in the application form are true, correct and complete and that they shall form the basis of any loan SPK Micro Financial Services (Promoted by SPK Foundation) may decide to grant me/us. SPK Micro Financial Services (Promoted by SPK Foundation) may seek / receive information from any source/person to consider this application. I/We further agree that my/our loan shall be governed by rules of SPK Micro Financial Services (Promoted by SPK Foundation) which may be in force time to time. I/We agree that SPK Micro Financial Services (Promoted by SPK Foundation) reserves the right to accept/reject this application without assigning any reason whatsoever. I/We have read the brochure and understood the contents. I/We understand that the fee paid along with the loan application form is non-refundable. I/We undertake to inform SPK Small Finance Bank regarding any change in my/our occupation/employment/residential address and to provide any further information that SPK Micro Financial Services (Promoted by SPK Foundation) require. SPK Micro Financial Services (Promoted by SPK Foundation) may make available any information contained in this form, other documents submitted to SPK Micro Financial Services (Promoted by SPK Foundation) and, information pertaining to any institution or body. I/We confirm that I/We have/had no insolvency proceedings against me/us nor I/We have/had ever been adjudicated insolvent. CIBIL- SPK can initiate any Internal/External/3rd Party Verification with respect to Loan Application.
                        </p>
                      </div>
                    </Col>
                  </Row>
                  {/* Use Controller for checkboxes with RHF */}
                  <FormGroup check className="mb-2">
                    <Controller
                      name="agreeTerms"
                      control={control}
                      rules={{ required: "You must agree to the terms and conditions." }}
                      render={({ field }) => (
                        <Input
                          type="checkbox"
                          id="agreeTerms"
                          checked={field.value}
                          onChange={field.onChange}
                          invalid={!!errors.agreeTerms}
                        />
                      )}
                    />
                    <Label check htmlFor="agreeTerms" className={errors.agreeTerms ? 'text-danger' : ''}>
                      I agree to the terms and conditions <span className="text-danger">*</span>
                    </Label>
                    {errors.agreeTerms && <div className="invalid-feedback d-block">{errors.agreeTerms.message}</div>}
                  </FormGroup>

                  <FormGroup check className="mb-2">
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
                        />
                      )}
                    />
                    <Label check htmlFor="agreeCreditCheck" className={errors.agreeCreditCheck ? 'text-danger' : ''}>
                      I agree to a credit check <span className="text-danger">*</span>
                    </Label>
                    {errors.agreeCreditCheck && <div className="invalid-feedback d-block">{errors.agreeCreditCheck.message}</div>}
                  </FormGroup>

                  <FormGroup check className="mb-3">
                    <Controller
                      name="agreeDataSharing"
                      control={control}
                      rules={{ required: "You must agree to data sharing." }}
                      render={({ field }) => (
                        <Input
                          type="checkbox"
                          id="agreeDataSharing"
                          checked={field.value}
                          onChange={field.onChange}
                          invalid={!!errors.agreeDataSharing}
                        />
                      )}
                    />
                    <Label check htmlFor="agreeDataSharing" className={errors.agreeDataSharing ? 'text-danger' : ''}>
                      I agree to data sharing as described <span className="text-danger">*</span>
                    </Label>
                    {errors.agreeDataSharing && <div className="invalid-feedback d-block">{errors.agreeDataSharing.message}</div>}
                  </FormGroup>
                </TabPane>

                {/* Tab 6 - Documents & Final Details */}
                <TabPane tabId={6}>
                  <div className="text-center mb-5">
                    <h4 className="fw-bold">Final Details & Declaration</h4>
                    <p className="text-muted">Please enter final application details including translator info if applicable.</p>
                  </div>

                  <Form>
                    <Row className="gy-4">
                      {/* Translator Name (Optional) */}
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="translatorName" className="fw-semibold">Translator Name <small className="text-muted">(If Applicable)</small></Label>
                          <Controller
                            name="translatorName"
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="text"
                                id="translatorName"
                                placeholder="Enter Translator Name"
                                invalid={!!errors.translatorName}
                                {...field}
                              />
                            )}
                          />
                        </FormGroup>
                      </Col>

                      {/* Place of Application */}
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="translatorPlace" className="fw-semibold">
                            Place of Application <span className="text-danger">*</span>
                          </Label>
                          <Controller
                            name="translatorPlace"
                            control={control}
                            rules={{ required: "Place is required" }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                id="translatorPlace"
                                placeholder="Enter Place"
                                invalid={!!errors.translatorPlace}
                                {...field}
                              />
                            )}
                          />
                          {errors.translatorPlace && (
                            <p className="text-danger small">{errors.translatorPlace.message}</p>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Application Date */}
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="LoanRegDate" className="fw-semibold">Application Date <span className="text-danger">*</span></Label>
                          <Controller
                            name="LoanRegDate"
                            control={control}
                            rules={{ required: "Date is required" }}
                            render={({ field }) => (
                              <Input
                                type="date"
                                id="LoanRegDate"
                                invalid={!!errors.LoanRegDate}
                                {...field}
                              />
                            )}
                          />
                          {errors.LoanRegDate && (
                            <p className="text-danger small">{errors.LoanRegDate.message}</p>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Remarks */}
                      <Col md={12}>
                        <FormGroup>
                          <Label htmlFor="remarks" className="fw-semibold">Remarks <small className="text-muted">(Optional)</small></Label>
                          <Controller
                            name="remarks"
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="textarea"
                                id="remarks"
                                rows="3"
                                placeholder="Enter any additional remarks"
                                {...field}
                              />
                            )}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </TabPane>


              </TabContent>

              {/* Wizard Navigation Buttons (Prev/Next/Submit) */}
              <ul className="pager wizard twitter-bs-wizard-pager-link mt-4">
                <li className={activeTab === 1 ? "previous disabled" : "previous"}>
                  <Button
                    color="primary"
                    onClick={() => toggleTab(activeTab - 1)}
                    disabled={activeTab === 1 || loading} // Disable when loading
                  >
                    <i className="bx bx-chevron-left me-1"></i> Previous
                  </Button>
                </li>

                <li className="next d-flex gap-2"> {/* Use flex for button alignment */}
                  {activeTab === 6 ? (
                    <>
                      <Button
                        color="warning"
                        type="button" // Important: type="button" to prevent form submission
                        onClick={toggleModal}
                        disabled={loading}
                      >
                        <i className="bx bx-show me-1"></i> Preview Form
                      </Button>
                      <Button
                        color="success"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Submitting...
                          </>
                        ) : (
                          <> Submit Application <i className="bx bx-check-circle ms-1"></i> </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      color="primary"
                      type="button" // Important: type="button" to prevent default form submission
                      onClick={handleNext} // Use the refined handleNext function
                      disabled={loading} // Disable when loading
                    >
                      {loading && activeTab === 1 ? ( // Specific loading for step 1 validation
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Verifying...
                        </>
                      ) : (
                        <> Next <i className="bx bx-chevron-right ms-1"></i> </>
                      )}
                    </Button>
                  )}
                </li>
              </ul>
            </Form> {/* End of the main RHF Form */}
          </div> {/* End Wizard */}
        </CardBody>
      </Card>

      {/* PDF Preview Modal */}
      {/* Make sure PDFPreview and PDFDocument components can accept all the necessary data */}
      <Modal isOpen={isModalOpen} toggle={toggleModal} size="xl">
        <ModalHeader toggle={toggleModal}>Application Preview</ModalHeader>
        <ModalBody style={{ height: '80vh' }}> {/* Set height for viewer */}
          {/* Pass necessary data to PDFPreview/PDFDocument */}
          {/* You might need to get all form values: const allData = getValues(); */}
          <PDFViewer width="100%" height="100%">
            <LoanPDFdocument
              formData={getValues()}
              emiDetails={emiDetails}
              nominees={nominees}
            />
          </PDFViewer>
        </ModalBody>
        <ModalFooter>
          {/* Provide PDFDownloadLink inside the Modal as well? */}
          <PDFDownloadLink
            document={
              <LoanPDFdocument
                formData={getValues()}
                emiDetails={emiDetails}
                nominees={nominees}
              />
            }
            fileName="loan_application.pdf"
          >
            {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
          </PDFDownloadLink>
          <Button color="secondary" onClick={toggleModal}>Close</Button>
        </ModalFooter>
      </Modal>

    </React.Fragment>
  );
};

export default LoanProcess;