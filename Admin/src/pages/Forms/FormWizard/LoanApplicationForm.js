import React, { useState, useRef } from "react";
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
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
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
import LoanCalculator from "../utils/LoanCalculator"

const LoanApplicationForm = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [idProofFiles, setIdProofFiles] = useState([]); // Store ID proof files
  const toggleModal = () => setModalOpen(!modalOpen);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const printRef = useRef();
  const [loanDetails, setLoanDetails] = useState(null);
  const handleLoadSchedule = () => {
    if (!formData.loanAmount || !formData.loanTerm || !formData.interestRate) {
      alert("Please enter valid loan details.");
      return;
    }
    const currentDate = new Date().toISOString().split("T")[0];
  
    setLoanDetails({
      initialLoanAmount: formData.loanAmount,
      initialLoanTerm: formData.loanTerm,
      initialTermType: formData.loanTermType,
      initialInterestRate: formData.interestRate,
      borrowerName: formData.firstName, 
      contactNumber: formData.phone,
      loanDate: currentDate,
    });
  
    setScheduleModalOpen(true);
  };
  const handlePrint = useReactToPrint({
    content: () => printRef.current, // Ensure this is correctly pointing to the component
  });
  const [selectedFiles, setselectedFiles] = useState([]);
  const handleIdProofFiles = (files) => {
    const newFiles = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file), // Preview image or PDF
        formattedSize: formatBytes(file.size),
      })
    );
    setIdProofFiles(newFiles);
  };

  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }

  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm(activeTab, formData, setErrors);

    if (isValid) {
      console.log("Form submitted:", formData);
      setActiveTab((prevTab) => Math.min(prevTab + 1, 9)); // Move to the next tab
    }
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab && tab >= 1 && tab <= 9) {
      if (tab > activeTab) {
        const isValid = validateForm(activeTab, formData, setErrors);
        if (!isValid) return;
      }
      setActiveTab(tab);
    }
  };

  const renderFormGroup = (label, name, type = "text", options = []) => (
    <FormGroup>
      <Label for={name}>{label}</Label>
      {type === "select" ? (
        <Input
          type="select"
          name={name}
          id={name}
          onChange={handleInputChange}
          invalid={!!errors[name]} // ✅ Ensure validation works for select inputs
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </Input>
      ) : (
        <Input
          type={type}
          name={name}
          id={name}
          onChange={handleInputChange}
          invalid={!!errors[name]} // ✅ Ensure validation works for text inputs
        />
      )}
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}{" "}
      {/* ✅ Show error message */}
    </FormGroup>
  );

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <h3 className="card-title mb-0 ">Loan Application Form</h3>
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
                scrollbarWidth: "none", // ✅ Firefox
                msOverflowStyle: "none", // ✅ IE/Edge
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
                      // style={{
                      //   minWidth: "60px",
                      //   textAlign: "center",
                      //   fontSize: "1.5em",
                      // }} // Increased size
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

              <TabPane tabId={1}>
                {/* <Breadcrumbs title="Forms" breadcrumbItem="File Upload" /> */}

                <Row>
                  <Col className="col-12">
                    <CardBody className="position-relative">
                      {/* Preview images in top-right corner */}
                      <div
                        className="position-absolute "
                        style={{
                          top: "40px",
                          right: "82px",
                          background:
                            "linear-gradient(to bottom, #e9ecef, #dee2e6)",
                          zIndex: "100",
                        }}
                      >
                        {selectedFiles.map((f, i) => (
                          <div
                            key={i}
                            className="d-flex align-items-center mb-1"
                          >
                            <img
                              src={f.preview}
                              alt={f.name}
                              width="60"
                              height="60"
                              className="rounded me-2"
                            />
                            <div className="d-flex flex-column">
                              <small className="d-block">{f.name}</small>
                              <small className="text-muted">
                                {f.formattedSize}
                              </small>
                              <button
                                type="button"
                                className="btn btn-link btn-sm text-danger p-0 text-start"
                                onClick={() => {
                                  setselectedFiles(
                                    selectedFiles.filter(
                                      (_, index) => index !== i
                                    )
                                  );
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Form className="d-flex justify-content-end">
                        <div className="col-md-4 col-lg-3">
                          <Dropzone
                            onDrop={(acceptedFiles) =>
                              handleAcceptedFiles(acceptedFiles)
                            }
                            accept={{ "image/*": [] }} // ✅ Correct prop type
                            maxFiles={1}
                            maxSize={2 * 1024 * 1024}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <div
                                className="dropzone"
                                style={{ minHeight: "100px" }}
                              >
                                <div
                                  {...getRootProps()}
                                  className="dz-message p-3 border rounded"
                                  style={{ cursor: "pointer" }}
                                >
                                  <input {...getInputProps()} />
                                  <div className="d-flex align-items-center justify-content-center">
                                    <i className="bx bx-cloud-upload me-2" />
                                    <div>
                                      <h6 className="mb-0">
                                        Upload passport photo
                                      </h6>
                                      <small className="text-muted">
                                        Click or drag an image
                                      </small>
                                    </div>
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
                      {renderFormGroup("Phone Number", "phone")}
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
                    {/* ID Proof Type Selection */}
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Choose ID Proof Type",
                        "idProofType",
                        "select",
                        [
                          { value: "", label: "Select ID Proof" },
                          { value: "pan", label: "PAN" },
                          { value: "aadhar", label: "Aadhar" },
                          { value: "voter", label: "Voter ID" },
                          { value: "driving", label: "Driving License" },
                          { value: "other", label: "Other" },
                        ]
                      )}
                    </Col>
                  </Row>

                  <Row>
                    {/* Conditional ID Proof Input Based on Selection */}
                    <Col md={6} sm={12}>
                      {formData.idProofType &&
                        formData.idProofType !== "" &&
                        formData.idProofType !== "other" && (
                          <FormGroup>
                            <Label for="idProof">
                              Enter {formData.idProofType.toUpperCase()} Number
                            </Label>
                            <Input
                              type="text"
                              name="idProof"
                              id="idProof"
                              placeholder={`Enter ${formData.idProofType.toUpperCase()} Number`}
                              onChange={handleInputChange}
                              maxLength={
                                formData.idProofType === "aadhar" ? 12 : 20
                              }
                              pattern={
                                formData.idProofType === "aadhar"
                                  ? "\\d{12}"
                                  : undefined
                              }
                              inputMode={
                                formData.idProofType === "aadhar"
                                  ? "numeric"
                                  : "text"
                              }
                            />
                          </FormGroup>
                        )}

                      {/* Show input if "Other" is selected */}
                      {formData.idProofType === "other" && (
                        <FormGroup>
                          <Label for="otherIdProof">Specify ID Proof</Label>
                          <Input
                            type="text"
                            name="otherIdProof"
                            id="otherIdProof"
                            placeholder="Enter ID Proof Type"
                            onChange={handleInputChange}
                          />
                        </FormGroup>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12}>
                      <Label>ID Proof Upload</Label>
                      <Dropzone
                        onDrop={handleIdProofFiles}
                        accept={{ "image/*": [], "application/pdf": [] }} // Accept images and PDFs
                        maxFiles={1}
                        maxSize={2 * 1024 * 1024} // 2MB limit
                      >
                        {({ getRootProps, getInputProps }) => (
                          <div className="dropzone">
                            <div
                              {...getRootProps()}
                              className="dz-message p-3 border rounded"
                              style={{ cursor: "pointer" }}
                            >
                              <input {...getInputProps()} />
                              <div className="d-flex align-items-center justify-content-center">
                                <i className="bx bx-cloud-upload me-2" />
                                <div>
                                  <h6 className="mb-0">Upload ID Proof</h6>
                                  <small className="text-muted">
                                    Click or drag a file
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Dropzone>

                      {/* Preview uploaded file */}
                      {idProofFiles.length > 0 && (
                        <div className="mt-2">
                          {idProofFiles.map((file, index) => (
                            <div
                              key={index}
                              className="d-flex align-items-center mb-1"
                            >
                              {file.type === "application/pdf" ? (
                                <a
                                  href={file.preview}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View PDF
                                </a>
                              ) : (
                                <img
                                  src={file.preview}
                                  alt={file.name}
                                  width="30"
                                  height="30"
                                  className="rounded me-2"
                                />
                              )}
                              <div className="d-flex flex-column">
                                <small className="d-block">{file.name}</small>
                                <small className="text-muted">
                                  {file.formattedSize}
                                </small>
                                <button
                                  type="button"
                                  className="btn btn-link btn-sm text-danger p-0 text-start"
                                  onClick={() =>
                                    setIdProofFiles(
                                      idProofFiles.filter((_, i) => i !== index)
                                    )
                                  }
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Col>
                  </Row>
                </Form>
              </TabPane>
              <TabPane tabId={2}>
  <Form>
    <Row>
      <Col md={6} sm={12}>
        {renderFormGroup("Loan Amount ($)", "loanAmount", "number")}
      </Col>
      <Col md={6} sm={12}>
        {renderFormGroup("Loan Term", "loanTerm", "number")} {/* General term input */}
      </Col>
    </Row>

    <Row>
      <Col md={6} sm={12}>
        {renderFormGroup("Loan Term Type", "loanTermType", "select", [
          { value: "months", label: "Months" },
          { value: "years", label: "Years" },
        ])}
      </Col>
      <Col md={6} sm={12}>
        {renderFormGroup("Interest Rate (%)", "interestRate", "number")}
      </Col>
    </Row>


    <Row>
      <Col md={12} sm={12}>
        {renderFormGroup("Loan Purpose", "loanPurpose")} {/* New Loan Purpose field */}
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
    <Modal isOpen={scheduleModalOpen} toggle={() => setScheduleModalOpen(false)} size="lg">
  <ModalHeader toggle={() => setScheduleModalOpen(false)}>Loan Repayment Schedule</ModalHeader>
  <ModalBody>
    {loanDetails ? (
    <LoanCalculator
    initialLoanAmount={loanDetails.initialLoanAmount}
    initialLoanTerm={loanDetails.initialLoanTerm}
    initialTermType={loanDetails.initialTermType}
    initialInterestRate={loanDetails.initialInterestRate}
    borrowerName={loanDetails.borrowerName}
    contactNumber={loanDetails.contactNumber}
    loanDate={loanDetails.loanDate} // Current date is passed here
  />
    ) : (
      <p className="text-center">Enter loan details to generate schedule.</p>
    )}
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" onClick={() => setScheduleModalOpen(false)}>
      Close
    </Button>
  </ModalFooter>
</Modal>
  </Form>
</TabPane>
              <TabPane tabId={3}>
                <Form>
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Employment Type", "employmentType")}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Employer Name", "employerName")}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Job Title", "jobTitle")}
                    </Col>
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
              <TabPane tabId={4}>
                <Form>
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Loan Purpose Detail",
                        "loanPurposeDetail"
                      )}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Source of Repayment",
                        "repaymentSource"
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      {renderFormGroup(
                        "Additional Comments",
                        "additionalComments",
                        "textarea"
                      )}
                    </Col>
                  </Row>
                </Form>
              </TabPane>
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
              <TabPane tabId={6}>
                <Form>
                  {/* Finance Holder Details */}
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Finance Holder Name",
                        "financeHolderName"
                      )}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Finance Holder Phone",
                        "financeHolderPhone"
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Finance Holder Email",
                        "financeHolderEmail",
                        "email"
                      )}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Finance Holder Relationship",
                        "financeHolderRelationship"
                      )}
                    </Col>
                  </Row>

                  {/* Reference 1 Details */}
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Reference 1 Name", "reference1Name")}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Reference 1 Relationship",
                        "reference1Relationship"
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Reference 1 Phone", "reference1Phone")}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Reference 1 Email",
                        "reference1Email",
                        "email"
                      )}
                    </Col>
                  </Row>

                  {/* Reference 2 Details */}
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Reference 2 Name", "reference2Name")}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Reference 2 Relationship",
                        "reference2Relationship"
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12}>
                      {renderFormGroup("Reference 2 Phone", "reference2Phone")}
                    </Col>
                    <Col md={6} sm={12}>
                      {renderFormGroup(
                        "Reference 2 Email",
                        "reference2Email",
                        "email"
                      )}
                    </Col>
                  </Row>
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
        passportPhoto={selectedFiles.length > 0 ? selectedFiles[0].preview : null}
      />
    </div>
  </ModalBody>
  <ModalFooter className="d-flex flex-wrap justify-content-between">
    {/* Back Button - Full width on small screens */}
    <Button color="secondary" onClick={toggleModal} className="w-100 w-md-auto">
      <i className="bx bx-arrow-back me-1"></i> Back
    </Button>

    {/* Print Button - Full width on small screens */}
    <Button color="primary" onClick={handlePrint} className="w-100 w-md-auto mt-2 mt-md-0">
      <i className="bx bx-printer me-1"></i> Print Form
    </Button>
  </ModalFooter>
</Modal>
            </TabContent>
            <ul className="pager wizard twitter-bs-wizard-pager-link d-flex flex-wrap justify-content-between mt-3">
  <li className={activeTab === 1 ? "previous disabled" : "previous"}>
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
        <Button color="success" onClick={handleSubmit} className="w-100 w-md-auto">
          Submit Application <i className="bx bx-check-circle ms-1"></i>
        </Button>
        <Button color="warning" onClick={toggleModal} className="w-100 w-md-auto">
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
