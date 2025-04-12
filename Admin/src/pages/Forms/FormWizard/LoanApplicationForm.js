import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  TabContent,
  TabPane,
  NavItem,
  NavLink,
  Button,
  Row,
  Table, // Make sure Table is imported if used elsewhere, though not in final submit logic
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  UncontrolledTooltip,
} from "reactstrap";
import Dropzone from "react-dropzone";
import { useDropzone } from "react-dropzone"; // Import useDropzone
import Flatpickr from "react-flatpickr";
// import Dropzone from "react-dropzone"; // Dropzone is now inside DocumentUpload
import { useReactToPrint } from "react-to-print";
import classnames from "classnames";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Link } from "react-router-dom";
import PDFPreview from "./PDFdocument"; // Assuming this exists
import { initialFormData } from "../constants/formConfig"; // Assuming this exists
import validateForm from "../utils/validation"; // Assuming this exists
import DocumentUpload from "./IdProofSection"; // Import the separate component
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// NOTE: Removed unused imports like Table, Dropzone (if only used in DocumentUpload)

const LoanApplicationForm = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  // Use a more descriptive name for the state holding document info from child
  const [applicantDocuments, setApplicantDocuments] = useState([]);
  const printRef = useRef();
  const documentUploadRef = useRef(); // Ref for DocumentUpload if needed
  const [newApplicant, setNewApplicant] = useState({
    applicantProfilePhoto: null,
  });
  // --- Profile Photo State ---
  const [profilePhotoFile, setProfilePhotoFile] = useState(null); // Store the File object
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null); // Store the preview URL
 //-- data fectch in loan requist 
  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => {
      if (profilePhotoPreview) {
        URL.revokeObjectURL(profilePhotoPreview);
      }
    };
  }, [profilePhotoPreview]);

  // --- Dropzone Configuration for Profile Photo ---
  const onDropProfilePhoto = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        // Revoke previous preview URL if it exists
        if (profilePhotoPreview) {
          URL.revokeObjectURL(profilePhotoPreview);
        }
        // Set the new file and create a preview URL
        setProfilePhotoFile(file);
        setProfilePhotoPreview(URL.createObjectURL(file));
        console.log("Profile photo selected:", file);
        // Clear potential validation error for profile photo
        if (errors.profile_photo) {
          setErrors((prevErrors) => ({ ...prevErrors, profile_photo: null }));
        }
      } else {
        // Handle rejected files (e.g., wrong type, size)
        toast.error("Invalid file type or size. Please upload a valid image (JPG, PNG, GIF) under 2MB."); // Example error
      }
    },
    [profilePhotoPreview, errors.profile_photo] // Include errors in dependency if clearing it
  );

  const { getRootProps: getRootProfilePhotoProps, getInputProps: getInputProfilePhotoProps } =
    useDropzone({
      onDrop: onDropProfilePhoto,
      accept: {
        "image/jpeg": [],
        "image/png": [],
        "image/gif": [],
        "image/jpg": [],
      },
      maxSize: 2 * 1024 * 1024, // Example: 2MB limit
      multiple: false, // Only allow one profile photo
      onDropRejected: () => {
        toast.error("File rejected. Check type (JPG, PNG, GIF) and size (max 2MB).");
      }
    });

  // Function to remove the selected profile photo
  const removeProfilePhoto = (e) => {
    e.stopPropagation(); // Prevent dropzone click event if button is inside
    if (profilePhotoPreview) {
      URL.revokeObjectURL(profilePhotoPreview);
    }
    setProfilePhotoFile(null);
    setProfilePhotoPreview(null);
    console.log("Profile photo removed");
  };

  // Callback to receive document data from DocumentUpload component
  const handleDocumentsChange = useCallback((docs) => {
    console.log("Received documents from child:", docs);
    setApplicantDocuments(docs);
    // No longer need to store files directly in formData for submission
    // We'll get them from applicantDocuments state during submit
  }, []);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    let processedValue;

    if (type === "checkbox") {
      processedValue = checked;
    } else if (type === "number") {
      // Store numbers as numbers, handle empty string case
      processedValue = value === "" ? null : Number(value);
      // Handle potential NaN if user types non-numeric chars in number input
      if (isNaN(processedValue)) {
        processedValue = null; // Or keep the invalid string temporarily, validation should catch it
      }
    } else if (e.target.tagName === "SELECT") { // Check tag name for select
      // Handle numeric strings from select options
      processedValue = /^\d+$/.test(value) && value !== "" ? Number(value) : value;
    }
    else {
      processedValue = value;
    }

    console.log(
      `Input Change - Name: ${name}, Value: ${processedValue}, Type: ${typeof processedValue}`
    );

    setFormData((prevData) => ({
      ...prevData,
      [name]: processedValue,
    }));

    // Clear validation error for this field on change
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    }
  };

  // --- Remove transformFormData function - We build FormData directly ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data state on submit:", formData);
    console.log("Applicant documents state on submit:", applicantDocuments);

    // Optional: Add validation check for the entire form before creating FormData
    // const formIsValid = validateForm(null, formData, setErrors); // Assuming validateForm checks all
    // if (!formIsValid) {
    //    toast.error("Please fix the errors in the form.");
    //    return;
    // }

    // --- Create FormData ---
    const submissionData = new FormData();
    if (profilePhotoFile) {
      submissionData.append('profile_photo', profilePhotoFile);
    }
    // --- Append Simple Fields ---
    // Helper to safely append, handling null/undefined
    const safeAppend = (key, value) => {
      if (value !== null && value !== undefined) {
        submissionData.append(key, value);
      } else {
        submissionData.append(key, ''); // Send empty string for null/undefined
      }
    };

    safeAppend('userID', formData.userID);
    safeAppend('title', formData.title);
    safeAppend('first_name', formData.first_name);
    safeAppend('last_name', formData.last_name);
    safeAppend('dateOfBirth', formData.dateOfBirth); // Should be 'YYYY-MM-DD' string
    safeAppend('gender', formData.gender);
    safeAppend('maritalStatus', formData.maritalStatus);
    safeAppend('email', formData.email);
    safeAppend('phone', formData.phone);
    safeAppend('address', formData.address);
    safeAppend('city', formData.city);
    safeAppend('state', formData.state);
    safeAppend('postalCode', formData.postalCode);
    

    // --- Append Nested Fields (using dot notation - common for DRF, check your backend!) ---
    // Assuming only one entry for employment, banking, properties based on your form structure

    // Employment (index 0)
    safeAppend('employment[0]employmentType', formData.employmentType);
    safeAppend('employment[0]jobTitle', formData.jobTitle);
    safeAppend('employment[0]yearsWithEmployer', formData.yearsWithEmployer);
    safeAppend('employment[0]monthlyIncome', formData.monthlyIncome);
    safeAppend('employment[0]otherIncome', formData.otherIncome); // Handle optional field

    // Banking Details (index 0)
    safeAppend('banking_details[0]accountHolderName', formData.accountHolderName);
    safeAppend('banking_details[0]accountNumber', formData.accountNumber);
    safeAppend('banking_details[0]bankName', formData.bankName);
    safeAppend('banking_details[0]ifscCode', formData.ifscCode);
    safeAppend('banking_details[0]bankBranch', formData.bankBranch);
    safeAppend('banking_details[0]accountType', formData.accountType);

    // Properties (index 0)
    safeAppend('properties[0]propertyType', formData.propertyType);
    safeAppend('properties[0]property_address', formData.property_address);
    safeAppend('properties[0]propertyValue', formData.propertyValue);
    safeAppend('properties[0]propertyAge', formData.propertyAge);
    safeAppend('properties[0]propertyOwnership', formData.propertyOwnership);

    // --- Append ApplicantProof Documents ---
    // Check if the backend expects files under a single key or indexed keys
    // Option 1: Multiple files under the same key (common)
    // applicantDocuments.forEach((doc) => {
    //     if (doc.file) {
    //         submissionData.append('ApplicantProofFiles', doc.file, doc.file.name); // Key name might need adjustment
    //         // How to send associated metadata (type, idNumber)?
    //         // Requires backend coordination. Maybe send as separate fields?
    //         // submissionData.append('ApplicantProofTypes', doc.type); // Example - less common
    //         // submissionData.append('ApplicantProofNumbers', doc.idNumber); // Example - less common
    //     }
    // });

    // Option 2: Indexed structure matching other nested fields (if backend supports it)
    applicantDocuments.forEach((doc, index) => {
      if (doc.file) {
        // Append metadata for this document
        safeAppend(`ApplicantProof[${index}]type`, doc.type);
        safeAppend(`ApplicantProof[${index}]idNumber`, doc.idNumber);
        // Append the actual file
        submissionData.append(`ApplicantProof[${index}]file`, doc.file, doc.file.name);
      }
    });

    // --- Log FormData Contents (for debugging) ---
    console.log("--- FormData to be sent ---");
    for (let pair of submissionData.entries()) {
      console.log(pair[0] + ': ', pair[1]);
    }
    console.log("---------------------------");


    try {
      // --- Send FormData using Axios ---
      const response = await axios.post(
        "http://127.0.0.1:8080/api/applicants/applicants/",
        submissionData, // Pass the FormData object directly
        {
          // **IMPORTANT: Do NOT manually set Content-Type header**
          // Axios will automatically set it to multipart/form-data with the correct boundary
          // headers: {
          //   "Content-Type": "multipart/form-data", // REMOVE THIS LINE
          // },
        }
      );

      console.log("Success:", response.data);
      toast.success("Application submitted successfully!");
      setActiveTab(6); // Navigate to success tab

    } catch (error) {
      console.error("Error posting form:", error);
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
        // Try to extract a meaningful error message from the backend response
        let errorMsg = "Submission failed.";
        if (typeof error.response.data === 'object' && error.response.data !== null) {
          // Look for common error patterns
          const errors = error.response.data;
          if (errors.detail) {
            errorMsg = errors.detail;
          } else if (Array.isArray(errors.non_field_errors)) {
            errorMsg = errors.non_field_errors.join(' ');
          } else {
            // Generic fallback for object errors
            errorMsg = Object.entries(errors)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('; ');
          }
          errorMsg = `Submission failed: ${errorMsg}`
        } else {
          // If data is not an object or is null/undefined
          errorMsg = `Submission failed: Server responded with status ${error.response.status}.`;
        }
        toast.error(errorMsg);

      } else if (error.request) {
        console.error("Error Request:", error.request);
        toast.error(
          "Submission failed: No response from server. Please check network."
        );
      } else {
        console.error("Error Message:", error.message);
        toast.error(`Submission failed: ${error.message}`);
      }
    }
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab && tab >= 1 && tab <= 7) {
      if (tab > activeTab) {

        try {
          const isValid = validateForm(
            activeTab,
            formData,
            setErrors,
          );
          toast.error(`Please fix the errors before proceeding.${setErrors}`);
          // if (!isValid) return;//check form validity
        } catch (error) {
          console.error("Validation Error:", error);
          return;
        }
      }
      setActiveTab(tab);

      // Scroll to the active step icon smoothly
      setTimeout(() => {
        const activeStep = document.getElementById(`Step${tab}`);
        if (activeStep) {
          activeStep.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }, 100);
    }
  };


  const renderFormGroup = (label, name, type, options = [], value, onChange, disabled = false) => {
    // Convert select values to numbers if they are numeric
    const processedValue = type === "select" && value !== "" && !isNaN(value) ? Number(value) : value;

    // console.log(`Processed Value Type (${name}):`, typeof processedValue, processedValue); // Debugging

    return (
      <FormGroup>
        <Label for={name}>{label}</Label>
        {type === "select" ? (
          <Input
            type="select"
            style={{ borderColor: errors[name] ? "red" : "black" }}
            name={name}
            id={name}
            value={value}
            onChange={(e) => {
              const selectedValue = e.target.value;
              const finalValue = /^\d+$/.test(selectedValue) ? parseInt(selectedValue, 10) : selectedValue;
              (onChange || handleInputChange)({ target: { name, value: finalValue } });
            }}
            disabled={disabled}
            invalid={!!errors[name]}
          >
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </Input>
        ) : type === "date" ? (
          <Flatpickr
            style={{ borderColor: errors[name] ? "red" : "black" }}
            placeholder="DD M,YYYY"
            value={value}
            options={{
              altInput: true,
              altFormat: "F j, Y",
              dateFormat: "Y-m-d",
            }}
            onChange={(selectedDates) => {
              const dateValue = selectedDates[0] ? selectedDates[0].toISOString().split("T")[0] : "";
              (onChange || handleInputChange)({ target: { name, value: dateValue } });
            }}
            disabled={disabled}
            invalid={!!errors[name]}
          />
        ) : (
          <Input
            style={{ borderColor: errors[name] ? "red" : "black" }}
            type={type}
            name={name}
            id={name}
            value={value}
            placeholder={`Enter ${label}`}
            onChange={onChange || handleInputChange}
            disabled={disabled}
            invalid={!!errors[name]}
            {...(type === "number" && { min: 0 })}
          />
        )}
        {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
      </FormGroup>
    );
  };




  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <h3 className="card-title mb-0">Loan Application Form</h3>
        </CardHeader>
        <CardBody>
          <div id="basic-pills-wizard" className="twitter-bs-wizard">
            <ul
              className="twitter-bs-wizard-nav nav nav-pills nav-justified"
              style={{
                display: "flex",
                flexWrap: "nowrap",
                paddingLeft: "15px",
                marginBottom: "0",
                listStyle: "none",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                overflowX: "scroll",
                whiteSpace: "nowrap",
                maxWidth: "100%",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {[
                { tooltip: "Personal Details", icon: "bx-user" },
                { tooltip: "Employment Details", icon: "bx-briefcase" },
                { tooltip: "Bank Details", icon: "mdi mdi-bank" },
                { tooltip: "Property Details", icon: "bx-home" },
              ].map(({ tooltip, icon }, index) => (
                <NavItem
                  key={index}
                  className="flex-sm-fill text-sm-center"
                  style={{ flex: "0 0 33.33%", minWidth: "120px" }}
                >
                  <NavLink

                    className={classnames({ active: activeTab === index + 1 })}
                    onClick={() => toggleTab(index + 1)}
                  >
                    <div
                      className="step-icon"
                      data-bs-toggle="tooltip"
                      id={`Step${index + 1}`}
                    >
                      <i className={`bx ${icon}`}></i>
                      <UncontrolledTooltip
                        placement="top"
                        target={`Step${index + 1}`}
                      >
                        {tooltip}
                      </UncontrolledTooltip>
                    </div>
                  </NavLink>
                </NavItem>
              ))}
            </ul>
            <TabContent activeTab={activeTab}>
              <div className="text-center mt-2 mb-3">
                <h5>
                  {activeTab &&
                    [
                      "Personal Details",
                      "Employment Details",
                      "Bank Details",
                      "Property Details",
                    ][activeTab - 1]}
                </h5>
                <p className="card-title-desc">
                  {activeTab < 8
                    ? "Fill all information below"
                    : "Review your details before submitting"}
                </p>
              </div>

              {/* Tab 1: Personal Details */}
              <TabPane tabId={1}>
                <Form>
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
                          {profilePhotoPreview && (
                            <div className="d-flex flex-column align-items-center">
                              <img
                                src={profilePhotoPreview}
                                alt="Applicant Profile"
                                width="80"
                                height="80"
                                
                                className="rounded-circle border"
                                style={{ 
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                  marginRight:"36px",
                                  borderRadius: "50%",
                                  border: "1px solid #ddd"
                                }}
                              />
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={removeProfilePhoto}
                              >
                                <i className="bx bx-trash"></i> Remove Photo
                              </button>
                            </div>
                          )}
                        </div>

                        <Form className="d-flex justify-content-end">
                          <div className="col-md-4 col-lg-3">
                            <div
                              {...getRootProfilePhotoProps()}
                              className="dropzone"
                              style={{ minHeight: "100px" }}
                            >
                              <input {...getInputProfilePhotoProps()} />
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
                                  <h6 className="mb-0 mt-2">Upload Passport Photo</h6>
                                  <small className="text-muted">Click or drag an image</small>
                                </div>
                              </div>
                            </div>
                            {errors.applicantProfilePhoto && (
                              <div className="text-danger small mt-2">
                                {errors.applicantProfilePhoto}
                              </div>
                            )}
                          </div>
                        </Form>
                      </CardBody>
                    </Col>
                  </Row>
                  {/* --- Profile Photo Upload Section --- */}

                  <Row>
                    {/* Title, First Name, Last Name */}
                    <Col md={1} sm={2}>
                      {renderFormGroup("Title", "title", "select", [
                        { value: "", label: "Select" },
                        { value: "1", label: "Mr." },
                        { value: "2", label: "Mrs." },
                        { value: "3", label: "Ms." },
                        { value: "4", label: "Dr." },
                      ])}
                    </Col>
                    <Col md={5} sm={10}>
                      {renderFormGroup("First Name", "first_name", "text")}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Last Name", "last_name", "text")}
                    </Col>
                  </Row>

                  <Row>
                    {/* Date of Birth, Gender, Marital Status */}
                    <Col md={2} sm={12}>
                      {renderFormGroup("Date of Birth", "dateOfBirth", "date", [], formData.dateOfBirth)}        {errors.dateOfBirth && <p className="text-danger">{errors.dateOfBirth}</p>}
                    </Col>
                    <Col md={4} sm={12}>
                      {renderFormGroup("Gender", "gender", "select", [
                        { value: "", label: "Select Gender" },
                        { value: "1", label: "Male" },
                        { value: "2", label: "Female" },
                      ])}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Marital Status",
                        "maritalStatus",
                        "select",
                        [
                          { value: "", label: "Select Marital Status" },
                          { value: "1", label: "Single" },
                          { value: "2", label: "Married" },
                          { value: "3", label: "Divorced" },
                          { value: "4", label: "Widowed" },
                        ]
                      )}
                    </Col>
                  </Row>

                  <Row>
                    {/* Email, Phone */}
                    <Col md={6} sm={12}>
                      {renderFormGroup("Email", "email", "email")}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Phone Number", "phone", "tel")}
                    </Col>
                  </Row>

                  <Row>
                    {/* Address */}
                    <Col md={6} sm={12}>
                      {renderFormGroup("Address  ", "address")}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup("City", "city")}
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup("State", "state")}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Postal Code", "postalCode")}
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col md={12}>

                      <h5>Upload ID Proof Documents</h5>
                      <p className="text-muted">Upload clear images of your PAN Card, Aadhar Card, and Voter ID.</p>
                      {/* Pass the ref and the callback */}
                      <DocumentUpload
                        ref={documentUploadRef} // Pass the ref
                        onDocumentsChange={handleDocumentsChange} // Callback to update metadata/state
                      // Pass initial data if needed for updates
                      />

                    </Col>
                  </Row>
                </Form>
              </TabPane>
              {/* Tab 3: Employment Details */}
              <TabPane tabId={2}>
                <Form>
                  <Row className="align-items-center mb-3">
                    <Col md={6} sm={12}>
                      {renderFormGroup("Employment Type", "employmentType")}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Job Title", "jobTitle")}
                    </Col>
                  </Row>
                  <Row className="align-items-center mb-3">
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Years with Employer",
                        "yearsWithEmployer",
                        "number"
                      )}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Monthly Income",
                        "monthlyIncome",
                        "number"
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Other Income (optional)",
                        "otherIncome",
                        "number",
                        [],
                        formData.otherIncome,
                        handleInputChange
                      )}
                    </Col>
                  </Row>
                </Form>
              </TabPane>

              {/* Tab 4: Bank Details */}
              <TabPane tabId={3}>
                <Form>
                  <Row className="mt-4">
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Account Holder Name",
                        "accountHolderName"
                      )}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Account Number", "accountNumber")}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Bank Name", "bankName")}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup("IFSC Code", "ifscCode")}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Bank Branch", "bankBranch")}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Account Type",
                        "accountType",
                        "select",
                        [
                          { value: "", label: "Select Account Type" },
                          { value: "1", label: "Savings" },
                          { value: "2", label: "Current" },
                        ]
                      )}
                    </Col>
                  </Row>
                </Form>
              </TabPane>

              {/* Tab 5: Property Details */}
              <TabPane tabId={4}>
                <Form>
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Property Type", "propertyType")}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Property Address", "property_address")}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Property Value",
                        "propertyValue",
                        "number"
                      )}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Property Age (Years)",
                        "propertyAge",
                        "number"
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      {renderFormGroup(
                        "Property Ownership",
                        "propertyOwnership",
                        "select",
                        [
                          { value: "", label: "Select Ownership" },
                          { value: "1", label: "Owned" },
                          { value: "2", label: "Mortgaged" },
                        ]
                      )}
                    </Col>
                  </Row>
                </Form>
              </TabPane>
              <TabPane tabId={6}>
                <div className="text-center mt-3">
                  <h5>Application Submitted Successfully</h5>
                  <p>You can download your form below.</p>
                </div>
              </TabPane>


            </TabContent>
            <ul className="pager wizard twitter-bs-wizard-pager-link d-flex flex-wrap justify-content-between mt-3">
              <li
                className={activeTab === 1 ? "previous disabled" : "previous"}
              >
                <Link
                  to="#"
                  className={`btn btn-primary ${activeTab === 1 ? "disabled" : ""} w-100 w-md-auto`}
                  onClick={() => toggleTab(activeTab - 1)}
                >
                  <i className="bx bx-chevron-left me-1"></i> Previous
                </Link>
              </li>

              <li className="next">
                {activeTab === 4 ? (
                  <div className="d-flex flex-wrap gap-3">
                    <Button
                      color="success"
                      onClick={handleSubmit}
                      className="w-100 w-md-auto"
                    >
                      Submit Application{" "}
                      <i className="bx bx-check-circle ms-1"></i>
                    </Button>
                    <Button
                      color="warning"
                      onClick={toggleModal}
                      className="w-100 w-md-auto"
                    >
                      <i className="bx bx-search-alt ms-1"></i> Preview Form
                    </Button>
                  </div>
                ) : activeTab === 4 ? (
                  <PDFDownloadLink
                    document={<PDFPreview formData={formData} />} // PDF Document to download
                    fileName="Loan_Application.pdf"
                    className="btn btn-info d-flex align-items-center w-100 w-md-auto"
                  >
                    <i className="bx bx-download me-1"></i> Download PDF
                  </PDFDownloadLink>
                ) : (
                  <Link
                    to="#"
                    className="btn btn-primary w-100 w-md-auto"
                    onClick={() => toggleTab(activeTab + 1)}
                  >
                    Next <i className="bx bx-chevron-right ms-1"></i>
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default LoanApplicationForm;
