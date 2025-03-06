import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Table,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  UncontrolledTooltip,
} from "reactstrap";
import Dropzone from "react-dropzone";
import { useReactToPrint } from "react-to-print";
import classnames from "classnames";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Link } from "react-router-dom";
import PDFPreview from "./PDFdocument";
import { initialFormData } from "../constants/formConfig";
import validateForm from "../utils/validation";
import LoanCalculator from "../utils/LoanCalculator";

const LoanApplicationForm = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);
  const [activeAccordion, setActiveAccordion] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [nominees, setNominees] = useState([]); // Store list of nominees
  const [newNominee, setNewNominee] = useState({
    nomineeName: "",
    nomineePhone: "",
    nomineeEmail: "",
    nomineeRelationship: "",
    nomineeOtherRelationship: "",
    nomineeidProofType: "",
    nomineeAddress: "",
    nomineeidProofNumber: "",
    nomineeidProofFile: null,
  });

  // Handle nominee field changes
  const handleNomineesChange = (field, value) => {
    setNewNominee((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add new nominee to the list
  const addNominee = () => {
    if (
      !newNominee.nomineeName ||
      !newNominee.nomineePhone ||
      !newNominee.nomineeEmail ||
      !newNominee.nomineeRelationship
    ) {
      alert("Please fill all nominee fields.");
      return;
    }

    setNominees((prevNominees) => {
      const updatedNominees = [...prevNominees, { ...newNominee }];

      // Sync nominees with formData
      setFormData((prevData) => ({
        ...prevData,
        nominees: updatedNominees,
      }));

      return updatedNominees;
    });

    // Reset newNominee fields after adding
    setNewNominee({
      nomineeName: "",
      nomineePhone: "",
      nomineeEmail: "",
      nomineeRelationship: "",
      nomineeOtherRelationship: "",
      nomineeidProofType: "",
      nomineeAddress: "",
      nomineeidProofNumber: "",
      nomineeidProofFile: null,
    });
  };

  // Handle nominee file uploads
  const handleNomineeFileUpload = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setNewNominee((prev) => ({
        ...prev,
        nomineeidProofFile: {
          name: file.name,
          size: file.size,
          type: file.type,
          preview: URL.createObjectURL(file),
          formattedSize: formatFileSize(file.size),
        },
      }));
    }
  };
  // Helper function to format file size
  const formatFileSize = (size) => {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    else return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Remove nominee file
  const removeNomineeFile = () => {
    setNewNominee((prev) => ({
      ...prev,
      nomineeidProofFile: null,
    }));
  };

  // Remove a nominee
  const removeNominee = (index) => {
    setNominees((prevNominees) => {
      const updatedNominees = prevNominees.filter((_, i) => i !== index);

      // Sync nominees with formData
      setFormData((prevData) => ({
        ...prevData,
        nominees: updatedNominees,
      }));

      return updatedNominees;
    });
  };

  // Ensure file URLs are cleaned up when component unmounts
  useEffect(() => {
    return () => {
      nominees.forEach(
        (nominee) =>
          nominee.nomineeidProofFile?.preview &&
          URL.revokeObjectURL(nominee.nomineeidProofFile.preview)
      );
    };
  }, [nominees]);

  useEffect(() => {
    return () => {
      selectedFiles.forEach(
        (file) => file.preview && URL.revokeObjectURL(file.preview)
      );
      Object.values(uploadedFiles).forEach(
        (file) => file.preview && URL.revokeObjectURL(file.preview)
      );
      nominees.forEach(
        (nominee) =>
          nominee.nomineeidProofFile?.preview &&
          URL.revokeObjectURL(nominee.nomineeidProofFile.preview)
      );
    };
  }, [selectedFiles, uploadedFiles, nominees]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      passportPhoto: selectedFiles[0]?.preview || null,
      uploadedFiles,
    }));
  }, [selectedFiles, uploadedFiles]);

  useEffect(() => {
    if (formData.idProofType) {
      setActiveAccordion(formData.idProofType);
    } else {
      setActiveAccordion(null);
    }
  }, [formData.idProofType]);

  const printRef = useRef();
  const [loanDetails, setLoanDetails] = useState(null);

  const handleLoadSchedule = () => {
    if (!formData.loanAmount || !formData.loanTerm || !formData.interestRate) {
      alert("Please enter valid loan details.");
      return;
    }

    setLoanDetails({
      initialLoanAmount: formData.loanAmount,
      initialLoanTerm: formData.loanTerm,
      initialTermType: formData.loanTermType,
      initialInterestRate: formData.interestRate,
    });

    setScheduleModalOpen(true);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleFileUpload = (acceptedFiles, docType) => {
    setUploadedFiles((prevFiles) => ({
      ...prevFiles,
      [docType]: acceptedFiles[0],
    }));
    setActiveAccordion(docType);
  };

  const removeFile = (docType) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = { ...prevFiles };
      delete updatedFiles[docType];
      return updatedFiles;
    });
  };

  const handleAcceptedFiles = (files) => {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setSelectedFiles(files);
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(`Input Change - Name: ${name}, Value: ${value}`);
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submitted:", formData);

    const isValid = validateForm(activeTab, formData, setErrors, uploadedFiles);

    if (isValid) {
      try {
        const response = await fetch("https://your-backend-url/api/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Success:", result);

        setActiveTab((prevTab) => Math.min(prevTab + 1, 9));
      } catch (error) {
        console.error("Error posting form:", error);
      }
    }
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab && tab >= 1 && tab <= 8) {
      if (tab > activeTab) {
        try {
          const isValid = validateForm(
            activeTab,
            formData,
            setErrors,
            uploadedFiles
          );
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

  const renderFormGroup = (
    label,
    name,
    type = "text",
    options = [],
    value,
    onChange = handleInputChange
  ) => (
    <FormGroup>
      <Label for={name}>{label}</Label>
      {type === "select" ? (
        <Input
          type="select"
          style={{ borderColor: "black" }}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          invalid={!!errors[name]}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </Input>
      ) : (
        <Input
          style={{ borderColor: "black" }}
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          invalid={!!errors[name]}
        />
      )}
    </FormGroup>
  );

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
                { tooltip: "Loan Details", icon: "bx-dollar" },
                { tooltip: "Employment Details", icon: "bx-briefcase" },
                { tooltip: "Bank Details", icon: "mdi mdi-bank" },
                { tooltip: "Property Details", icon: "bx-home" },
                { tooltip: "References", icon: "bx-group" },
                { tooltip: "Agreement", icon: "bx-check-shield" },
                { tooltip: "Final Review", icon: "bx-check-circle" },
              ].map(({ tooltip, icon }, index) => (
                <NavItem
                  key={index}
                  className="flex-sm-fill text-sm-center"
                  style={{ flex: "0 0 33.33%", minWidth: "120px" }}
                >
                  <NavLink
                    href="#"
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
                      "Loan Details",
                      "Employment Details",
                      "Bank Details",
                      "Property Details",
                      "References",
                      "Agreement",
                      "Final Review",
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
                <Row>
                  <Col className="col-12">
                    <CardBody className="position-relative">
                      {/* Preview images in a circular frame */}
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
                        {selectedFiles.map((f, i) => (
                          <div
                            key={i}
                            className="d-flex flex-column align-items-center"
                          >
                            {/* Circular Image Preview */}
                            <img
                              src={f.preview}
                              alt={f.name}
                              width="80"
                              height="80"
                              className="rounded-circle border"
                              style={{ objectFit: "cover" }} // Ensure full image fits inside the circle
                            />
                            <small className="d-block text-center">
                              {f.name}
                            </small>
                            <small className="text-muted">
                              {f.formattedSize}
                            </small>
                            <button
                              type="button"
                              className="btn btn-link btn-sm text-danger p-0"
                              onClick={() => {
                                setSelectedFiles(
                                  selectedFiles.filter(
                                    (_, index) => index !== i
                                  )
                                );
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>

                      <Form className="d-flex justify-content-end">
                        <div className="col-md-4 col-lg-3">
                          <Dropzone
                            onDrop={(acceptedFiles) =>
                              handleAcceptedFiles(acceptedFiles)
                            }
                            accept={{ "image/*": [] }}
                            maxFiles={1}
                            maxSize={2 * 1024 * 1024}
                            onDropRejected={() => {
                              alert(
                                "Invalid file type or size. Please upload a valid file."
                              );
                            }}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <div
                                className="dropzone"
                                style={{ minHeight: "100px" }}
                              >
                                <div
                                  {...getRootProps()}
                                  className="dz-message p-3 border rounded text-center"
                                  style={{ cursor: "pointer" }}
                                >
                                  <input {...getInputProps()} />
                                  <div className="d-flex flex-column align-items-center">
                                    {/* Placeholder Circle */}
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
                                    <h6 className="mb-0 mt-2">
                                      Upload Passport Photo
                                    </h6>
                                    <small className="text-muted">
                                      Click or drag an image
                                    </small>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Dropzone>
                          {errors.passportPhoto && (
                            <div className="text-danger small mt-2">
                              {errors.passportPhoto}
                            </div>
                          )}
                        </div>
                      </Form>
                    </CardBody>
                  </Col>
                </Row>
                <Form>
                  <Row>
                    {/* Title, First Name, Last Name */}
                    <Col md={2} sm={3}>
                      {renderFormGroup("Title", "title", "select", [
                        { value: "", label: "Select" },
                        { value: "Mr", label: "Mr." },
                        { value: "Mrs", label: "Mrs." },
                        { value: "Ms", label: "Ms." },
                        { value: "Dr", label: "Dr." },
                      ])}
                    </Col>
                    <Col md={5} sm={4}>
                      {renderFormGroup("First Name", "firstName")}
                    </Col>
                    <Col md={5} sm={5}>
                      {renderFormGroup("Last Name", "lastName")}
                    </Col>
                  </Row>

                  <Row>
                    {/* Date of Birth, Gender, Marital Status */}
                    <Col md={4} sm={12}>
                      {renderFormGroup("Date of Birth", "dateOfBirth", "date")}
                    </Col>
                    <Col md={4} sm={12}>
                      {renderFormGroup("Gender", "gender", "select", [
                        { value: "", label: "Select Gender" },
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                      ])}
                    </Col>
                    <Col md={4} sm={12}>
                      {renderFormGroup(
                        "Marital Status",
                        "maritalStatus",
                        "select",
                        [
                          { value: "", label: "Select Marital Status" },
                          { value: "single", label: "Single" },
                          { value: "married", label: "Married" },
                          { value: "divorced", label: "Divorced" },
                          { value: "widowed", label: "Widowed" },
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
                      {renderFormGroup("Phone Number", "phone", "phone")}
                    </Col>
                  </Row>

                  <Row>
                    {/* Address */}
                    <Col md={6} sm={12}>
                      {renderFormGroup("Address Line 1", "addressLine1")}
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

                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Choose ID Proof Type",
                        "idProofType",
                        "select",
                        [
                          { value: "", label: "Select ID Proof" },
                          { value: "pan", label: "PAN Card" },
                          { value: "aadhar", label: "Aadhar Card" },
                          { value: "voterId", label: "Voter ID" },
                        ]
                      )}
                    </Col>

                    <Col md={12} className="mt-4">
                      <div
                        className="accordion custom-accordion"
                        id="documentAccordion"
                      >
                        {["aadhar", "pan", "voterId"].map((docType, index) => (
                          <div
                            className="accordion-item shadow-sm mb-3"
                            key={index}
                          >
                            <h2
                              className="accordion-header"
                              id={`heading${index}`}
                            >
                              <button
                                className={`accordion-button rounded-3 d-flex align-items-center ${
                                  activeAccordion === docType
                                    ? "bg-primary text-white"
                                    : "bg-light text-dark"
                                }`}
                                type="button"
                                onClick={() =>
                                  setActiveAccordion(
                                    activeAccordion === docType ? null : docType
                                  )
                                }
                              >
                                <i className="bx bx-id-card fs-4 me-3"></i>
                                <span className="fw-semibold">
                                  Upload {docType.toUpperCase()} Document
                                </span>
                              </button>
                            </h2>
                            <div
                              id={`collapse${index}`}
                              className={`accordion-collapse collapse ${
                                activeAccordion === docType ? "show" : ""
                              }`}
                              aria-labelledby={`heading${index}`}
                            >
                              <div className="accordion-body bg-light-subtle">
                                <Row className="g-4 align-items-center">
                                  <Col md={6} sm={12}>
                                    {renderFormGroup(
                                      `${docType.toUpperCase()} Number`,
                                      docType
                                    )}
                                    <small className="form-text text-muted mt-1">
                                      {docType === "pan" &&
                                        "Format: ABCDE1234F"}
                                      {docType === "aadhar" &&
                                        "Format: 1234 5678 9012"}
                                      {docType === "voterId" &&
                                        "Format: ABC1234567"}
                                    </small>
                                    {errors[docType] && (
                                      <div className="text-danger small mt-2">
                                        {errors[docType]}
                                      </div>
                                    )}
                                  </Col>

                                  <Col md={6} sm={12}>
                                    <Dropzone
                                      onDrop={(acceptedFiles) =>
                                        handleFileUpload(acceptedFiles, docType)
                                      }
                                      accept={{
                                        "image/*": [],
                                        "application/pdf": [],
                                      }}
                                      maxFiles={1}
                                      maxSize={2 * 1024 * 1024}
                                    >
                                      {({
                                        getRootProps,
                                        getInputProps,
                                        isDragActive,
                                      }) => (
                                        <div className="dropzone">
                                          <div
                                            {...getRootProps()}
                                            className={`dz-message p-4 border-2 border-dashed rounded-3 ${
                                              isDragActive
                                                ? "border-primary bg-primary-10"
                                                : "border-secondary"
                                            }`}
                                            style={{ minHeight: "150px" }}
                                          >
                                            <input {...getInputProps()} />
                                            <div className="text-center">
                                              <div className="mb-2">
                                                <i
                                                  className={`bx bx-cloud-upload fs-1 ${
                                                    isDragActive
                                                      ? "text-primary"
                                                      : "text-secondary"
                                                  }`}
                                                />
                                              </div>
                                              <h6
                                                className={`mb-1 ${
                                                  isDragActive
                                                    ? "text-primary"
                                                    : "text-dark"
                                                }`}
                                              >
                                                {isDragActive
                                                  ? "Drop file here"
                                                  : "Upload document"}
                                              </h6>
                                              <small className="text-muted">
                                                Supported formats: JPG, PNG, PDF
                                                (Max 2MB)
                                              </small>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </Dropzone>
                                    {errors[`${docType}File`] && (
                                      <div className="text-danger small mt-2">
                                        {errors[`${docType}File`]}
                                      </div>
                                    )}

                                    {uploadedFiles[docType] && (
                                      <div className="mt-3 p-3 bg-white rounded-2 shadow-sm">
                                        <div className="d-flex align-items-center gap-3">
                                          <div className="flex-shrink-0">
                                            {uploadedFiles[docType].type ===
                                            "application/pdf" ? (
                                              <div className="bg-danger text-white rounded-2 p-2">
                                                <i className="bx bxs-file-pdf fs-4"></i>
                                              </div>
                                            ) : (
                                              <img
                                                src={
                                                  uploadedFiles[docType].preview
                                                }
                                                alt={
                                                  uploadedFiles[docType].name
                                                }
                                                className="rounded-2"
                                                style={{
                                                  width: "50px",
                                                  height: "50px",
                                                  objectFit: "cover",
                                                }}
                                              />
                                            )}
                                          </div>
                                          <div className="flex-grow-1">
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                              <span className="fw-medium text-truncate">
                                                {uploadedFiles[docType].name}
                                              </span>
                                              <span className="badge bg-primary rounded-pill">
                                                {
                                                  uploadedFiles[docType]
                                                    .formattedSize
                                                }
                                              </span>
                                            </div>
                                            <button
                                              type="button"
                                              className="btn btn-link text-danger p-0"
                                              onClick={() =>
                                                removeFile(docType)
                                              }
                                            >
                                              <i className="bx bx-trash me-1"></i>
                                              Remove
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </Col>
                                </Row>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Col>
                  </Row>
                </Form>
              </TabPane>

              {/* Tab 2: Loan Details */}
              <TabPane tabId={2}>
                <Form>
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Loan Amount ($)",
                        "loanAmount",
                        "number"
                      )}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Loan Term", "loanTerm", "number")}
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Loan Term Type",
                        "loanTermType",
                        "select",
                        [
                          { value: "daily", label: "Daily" },
                          { value: "weeks", label: "Weeks" },
                          { value: "months", label: "Months" },
                          { value: "years", label: "Years" },
                        ]
                      )}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Interest Rate (%)",
                        "interestRate",
                        "number"
                      )}
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12} sm={12}>
                      <Row>
                        <Col md={6}>
                          {renderFormGroup(
                            "Loan Purpose",
                            "loanPurpose",
                            "select",
                            [
                              { value: "", label: "Select Loan Purpose" },
                              {
                                value: "education",
                                label: "Children's Education",
                              },
                              { value: "medical", label: "Medical Expenses" },
                              { value: "business", label: "Business" },
                              { value: "home", label: "Home" },
                              {
                                value: "other",
                                label: "Other (Specify Below)",
                              },
                            ],
                            formData.loanPurpose, // Controlled component value
                            (e) => handleInputChange(e) // Handle selection
                          )}
                        </Col>

                        {/* Show "Other Purpose" input only if "Other" is selected */}
                        {formData.loanPurpose === "other" && (
                          <Col md={6}>
                            {renderFormGroup(
                              "Specify Other Purpose",
                              "loanPurposeOther",
                              "text",
                              [],
                              formData.loanPurposeOther, // Controlled component value
                              (e) => handleInputChange(e) // Handle text input
                            )}
                          </Col>
                        )}
                      </Row>
                    </Col>
                  </Row>

                  <Row className="text-center mt-3">
                    <Col>
                      <Button color="primary" onClick={handleLoadSchedule}>
                        Load Loan Schedule
                      </Button>
                    </Col>
                  </Row>

                  {/* Modal for Loan Repayment Schedule */}
                  <Modal
                    isOpen={scheduleModalOpen}
                    toggle={() => setScheduleModalOpen(false)}
                    size="lg"
                  >
                    <ModalHeader toggle={() => setScheduleModalOpen(false)}>
                      Loan Repayment Schedule
                    </ModalHeader>
                    <ModalBody>
                      {loanDetails ? (
                        <LoanCalculator
                          initialLoanAmount={10000}
                          initialLoanTerm={30}
                          initialTermType="daily"
                          initialInterestRate={5.0}
                          borrowerName="John Doe"
                          contactNumber="123-456-7890"
                          loanDate="2023-10-01"
                        />
                      ) : (
                        <p className="text-center">
                          Enter loan details to generate schedule.
                        </p>
                      )}
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="secondary"
                        onClick={() => setScheduleModalOpen(false)}
                      >
                        Close
                      </Button>
                    </ModalFooter>
                  </Modal>
                </Form>
              </TabPane>

              {/* Tab 3: Employment Details */}
              <TabPane tabId={3}>
                <Form>
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Employment Type", "employmentType")}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Job Title", "jobTitle")}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Years with Employer",
                        "yearsWithEmployer",
                        "number"
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Monthly Income",
                        "monthlyIncome",
                        "number"
                      )}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Other Income", "otherIncome", "number")}
                    </Col>
                  </Row>
                </Form>
              </TabPane>

              {/* Tab 4: Bank Details */}
              <TabPane tabId={4}>
                <Form>
                  <Row className="mt-4">
                    <Col md={6} sm={12}>
                      {renderFormGroup("Bank Name", "bankName")}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Account Holder Name",
                        "accountHolderName"
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Account Number", "accountNumber")}
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
                          { value: "savings", label: "Savings" },
                          { value: "current", label: "Current" },
                        ]
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Source of Repayment",
                        "repaymentSource"
                      )}
                    </Col>
                  </Row>
                </Form>
              </TabPane>

              {/* Tab 5: Property Details */}
              <TabPane tabId={5}>
                <Form>
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Property Type", "propertyType")}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Property Address", "propertyAddress")}
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
                          { value: "owned", label: "Owned" },
                          { value: "mortgaged", label: "Mortgaged" },
                        ]
                      )}
                    </Col>
                  </Row>
                </Form>
              </TabPane>

              {/* Tab 6: References */}
              <TabPane tabId={6}>
                <Form>
                  <div className="mb-4 p-3 border rounded">
                    <h5>Add Nominee</h5>
                    <Row>
                      <Col md={6} sm={12}>
                        {renderFormGroup(
                          "Nominee Name",
                          "nomineeName",
                          "text",
                          [],
                          newNominee.nomineeName,
                          (e) =>
                            handleNomineesChange("nomineeName", e.target.value)
                        )}
                        {errors["nominees.name"] && (
                          <div className="text-danger small mt-2">
                            {errors["nominees.name"]}
                          </div>
                        )}
                      </Col>
                      <Col md={6} sm={12}>
                        {renderFormGroup(
                          "Nominee Phone",
                          "nomineePhone",
                          "phone",
                          [],
                          newNominee.nomineePhone,
                          (e) =>
                            handleNomineesChange("nomineePhone", e.target.value)
                        )}
                        {errors["nominees.phone"] && (
                          <div className="text-danger small mt-2">
                            {errors["nominees.phone"]}
                          </div>
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} sm={12}>
                        {renderFormGroup(
                          "Nominee Email",
                          "nomineeEmail",
                          "email",
                          [],
                          newNominee.nomineeEmail,
                          (e) =>
                            handleNomineesChange("nomineeEmail", e.target.value)
                        )}
                        {errors["nominees.email"] && (
                          <div className="text-danger small mt-2">
                            {errors["nominees.email"]}
                          </div>
                        )}
                      </Col>
                      <Col md={6} sm={12}>
                        {renderFormGroup(
                          "Nominee Relationship",
                          "nomineeRelationship",
                          "select",
                          [
                            { value: "", label: "Select Relationship" },
                            { value: "spouse", label: "Spouse" },
                            { value: "child", label: "Child" },
                            { value: "parent", label: "Parent" },
                            { value: "sibling", label: "Sibling" },
                            { value: "other", label: "Other" },
                          ],
                          newNominee.nomineeRelationship,
                          (e) =>
                            handleNomineesChange(
                              "nomineeRelationship",
                              e.target.value
                            )
                        )}
                        {newNominee.nomineeRelationship === "other" && (
                          <div className="mt-2">
                            {renderFormGroup(
                              "Specify Relationship",
                              "nomineeOtherRelationship",
                              "text",
                              [],
                              newNominee.nomineeOtherRelationship,
                              (e) =>
                                handleNomineesChange(
                                  "nomineeOtherRelationship",
                                  e.target.value
                                )
                            )}
                          </div>
                        )}
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12} sm={12}>
                        {renderFormGroup(
                          "Nominee Address",
                          "nomineeAddress",
                          "text",
                          [],
                          newNominee.nomineeAddress,
                          (e) =>
                            handleNomineesChange(
                              "nomineeAddress",
                              e.target.value
                            )
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12} sm={12}>
                        <label
                          htmlFor="nomineesIdProofType"
                          className="form-label fw-bold text-primary"
                        >
                          Choose Nominee ID Proof Type
                        </label>
                        {renderFormGroup(
                          "Nominee ID Proof Type",
                          "nomineeidProofType",
                          "select",
                          [
                            { value: "", label: "Select ID Proof" },
                            { value: "pan", label: "PAN Card" },
                            { value: "aadhar", label: "Aadhar Card" },
                            { value: "voterId", label: "Voter ID" },
                          ],
                          newNominee.nomineeidProofType,
                          (e) =>
                            handleNomineesChange(
                              "nomineeidProofType",
                              e.target.value
                            )
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} sm={12}>
                        {renderFormGroup(
                          "Nominee ID Proof Number",
                          "nomineeidProofNumber",
                          "text",
                          [],
                          newNominee.nomineeidProofNumber,
                          (e) =>
                            handleNomineesChange(
                              "nomineeidProofNumber",
                              e.target.value
                            )
                        )}
                        <small className="form-text text-muted mt-1">
                          {newNominee.nomineeidProofType === "pan" &&
                            "Format: ABCDE1234F"}
                          {newNominee.nomineeidProofType === "aadhar" &&
                            "Format: 1234 5678 9012"}
                          {newNominee.nomineeidProofType === "voterId" &&
                            "Format: ABC1234567"}
                        </small>
                        {errors["nominees.idProofNumber"] && (
                          <div className="text-danger small mt-2">
                            {errors["nominees.idProofNumber"]}
                          </div>
                        )}
                      </Col>
                      <Col md={6} sm={12}>
                        <label
                          htmlFor="nomineesIdProofFile"
                          className="form-label fw-bold text-primary"
                        >
                          Upload Nominee ID Proof
                        </label>
                        <Dropzone
                          onDrop={(acceptedFiles) =>
                            handleNomineeFileUpload(acceptedFiles)
                          }
                          onDropRejected={() => {
                            alert(
                              "Invalid file type or size. Please upload a valid file."
                            );
                          }}
                          accept={{ "image/*": [], "application/pdf": [] }}
                          maxFiles={1}
                          maxSize={2 * 1024 * 1024}
                        >
                          {({ getRootProps, getInputProps, isDragActive }) => (
                            <div className="dropzone">
                              <div
                                {...getRootProps()}
                                className={`dz-message p-4 border-2 border-dashed rounded-3 ${
                                  isDragActive
                                    ? "border-primary bg-primary-10"
                                    : "border-secondary"
                                }`}
                                style={{ minHeight: "100px" }}
                              >
                                <input {...getInputProps()} />
                                <div className="text-center">
                                  <div className="mb-2">
                                    <i
                                      className={`bx bx-cloud-upload fs-1 ${
                                        isDragActive
                                          ? "text-primary"
                                          : "text-secondary"
                                      }`}
                                    />
                                  </div>
                                  <h6
                                    className={`mb-1 ${
                                      isDragActive
                                        ? "text-primary"
                                        : "text-dark"
                                    }`}
                                  >
                                    {isDragActive
                                      ? "Drop file here"
                                      : "Upload ID Proof"}
                                  </h6>
                                  <small className="text-muted">
                                    Supported formats: JPG, PNG, PDF (Max 2MB)
                                  </small>
                                </div>
                              </div>

                              {/* Display Image Preview */}
                              {newNominee.nomineeidProofFile && (
                                <div className="mt-3 text-center">
                                  <p className="mb-1">
                                    <strong>File:</strong>{" "}
                                    {newNominee.nomineeidProofFile.name} (
                                    {
                                      newNominee.nomineeidProofFile
                                        .formattedSize
                                    }
                                    )
                                  </p>
                                  {newNominee.nomineeidProofFile.type.startsWith(
                                    "image/"
                                  ) ? (
                                    <img
                                      src={
                                        newNominee.nomineeidProofFile.preview
                                      }
                                      alt="ID Proof"
                                      className="img-thumbnail"
                                      style={{
                                        maxWidth: "100px",
                                        height: "auto",
                                      }}
                                    />
                                  ) : (
                                    <a
                                      href={
                                        newNominee.nomineeidProofFile.preview
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-sm btn-primary"
                                    >
                                      View PDF
                                    </a>
                                  )}
                                  {/* Remove Button */}
                                  <div className="mt-2">
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent Dropzone click
                                        removeNomineeFile();
                                      }}
                                    >
                                      <i className="bx bx-trash"></i> Remove
                                      File
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </Dropzone>

                        {errors["nominees.idProofFile"] && (
                          <div className="text-danger small mt-2">
                            {errors["nominees.idProofFile"]}
                          </div>
                        )}
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col md={12} className="text-center">
                        <Button
                          color="primary"
                          aria-label="Add Nominee"
                          onClick={addNominee}
                        >
                          <i className="bx bx-plus me-1"></i>Add Nominee
                        </Button>
                      </Col>
                    </Row>
                  </div>

                  {/* Table to display nominees */}
                  <div className="mt-4">
                    <h5>Nominees List</h5>
                    <Table striped bordered responsive>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Address</th>
                          <th>Relationship</th>
                          <th>ID Proof</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nominees.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No nominees added yet.
                            </td>
                          </tr>
                        ) : (
                          nominees.map((nominees, index) => (
                            <tr key={index}>
                              <td>{nominees.nomineeName}</td>
                              <td>{nominees.nomineeAddress}</td>

                              <td>
                                {nominees.nomineeRelationship === "other"
                                  ? nominees.nomineeOtherRelationship
                                  : nominees.nomineeRelationship}
                              </td>
                              <td>
                                {nominees.nomineeidProofType}
                                {nominees.nomineeidProofFile ? (
                                  <a
                                    href={nominees.nomineeidProofFile.preview}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View ID Proof
                                  </a>
                                ) : (
                                  "Not Uploaded"
                                )}
                              </td>
                              <td>
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={() => removeNominee(index)}
                                >
                                  <i className="bx bx-trash"></i> Remove
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Form>
              </TabPane>
              <TabPane tabId={7}>
                <Form>
                  <Row>
                    <Col md={12}>
                      <div className="declaration-text mt-3">
                        <h5>
                          Declaration and Undertaking by Applicant to SPK Micro
                          Financial Services (Promoted by SPK Foundation)
                        </h5>
                        <p>
                          I/We, declare that all the information given in the
                          application form are true, correct and complete and
                          that they shall form the basis of any loan SPK Micro
                          Financial Services (Promoted by SPK Foundation) may
                          decide to grant me/us. SPK Micro Financial Services
                          (Promoted by SPK Foundation) may seek / receive
                          information from any source/person to consider this
                          application. I/We further agree that my/our loan shall
                          be governed by rules of SPK Micro Financial Services
                          (Promoted by SPK Foundation) which may be in force
                          time to time. I/We agree that SPK Micro Financial
                          Services (Promoted by SPK Foundation) reserves the
                          right to accept/reject this application without
                          assigning any reason whatsoever. I/We have read the
                          brochure and understood the contents. I/We understand
                          that the fee paid along with the loan application form
                          is non-refundable. I/We undertake to inform SPK Small
                          Finance Bank regarding any change in my/our
                          occupation/employment/residential address and to
                          provide any further information that SPK Micro
                          Financial Services (Promoted by SPK Foundation)
                          require. SPK Micro Financial Services (Promoted by SPK
                          Foundation) may make available any information
                          contained in this form, other documents submitted to
                          SPK Micro Financial Services (Promoted by SPK
                          Foundation) and, information pertaining to any
                          institution or body. I/We confirm that I/We have/had
                          no insolvency proceedings against me/us nor I/We
                          have/had ever been adjudicated insolvent. CIBIL- SPK
                          can initiate any Internal/External/3rd Party
                          Verification with respect to Loan Application.
                        </p>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            name="agreeTerms"
                            onChange={handleInputChange}
                          />{" "}
                          I agree to the terms and conditions
                        </Label>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            name="agreeCreditCheck"
                            onChange={handleInputChange}
                          />{" "}
                          I agree to a credit check
                        </Label>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            name="agreeDataSharing"
                            onChange={handleInputChange}
                          />{" "}
                          I agree to data sharing
                        </Label>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </TabPane>
              <TabPane tabId={8}>
                <Form>
                  <Row>
                    {/* Translator Name & Signature */}
                    <Col md={6} sm={12}>
                      {renderFormGroup("Translator Name", "translatorName")}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Translator Signature",
                        "translatorSignature"
                      )}
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={12}>
                      <FormGroup check className="d-flex align-items-center">
                        <Input
                          type="checkbox"
                          name="applicantThumbprint"
                          id="applicantThumbprint"
                          onChange={handleInputChange}
                        />
                        <Label for="applicantThumbprint" check className="ms-2">
                          Applicant's Thumbprint
                        </Label>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </TabPane>

              <TabPane tabId={9}>
                <div className="text-center mt-3">
                  <h5>Application Submitted Successfully</h5>
                  <p>You can download your form below.</p>
                </div>
              </TabPane>

              <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
                <ModalHeader toggle={toggleModal}>Form Preview</ModalHeader>
                <ModalBody>
                  <div ref={printRef}>
                    <PDFPreview
                      formData={formData}
                      passportPhoto={
                        selectedFiles.length > 0
                          ? selectedFiles[0].preview
                          : null
                      }
                      uploadedFiles={uploadedFiles}
                    />
                  </div>
                </ModalBody>
                <ModalFooter className="d-flex flex-wrap justify-content-between">
                  {/* Back Button - Full width on small screens */}
                  <Button
                    color="secondary"
                    onClick={toggleModal}
                    className="w-100 w-md-auto"
                  >
                    <i className="bx bx-arrow-back me-1"></i> Back
                  </Button>

                  {/* Print Button - Full width on small screens */}
                  <Button
                    color="primary"
                    onClick={handlePrint}
                    className="w-100 w-md-auto mt-2 mt-md-0"
                  >
                    <i className="bx bx-printer me-1"></i> Print Form
                  </Button>
                </ModalFooter>
              </Modal>
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
                {activeTab === 8 ? (
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
                ) : activeTab === 9 ? (
                  <PDFDownloadLink
                    document={<PDFPreview formData={formData} />}
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
