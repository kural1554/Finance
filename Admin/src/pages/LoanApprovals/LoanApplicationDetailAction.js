// src/pages/LoanApprovals/LoanApplicationDetailAction.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Button,
  Table,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Alert,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FeatherIcon from "feather-icons-react";

// Assuming helper functions are defined here or imported
// If imported: import { getTitle, getGender, ... } from './path-to-helpers';

const getTitle = (value) => {
  const titles = { 1: "Mr.", 2: "Mrs.", 3: "Ms.", 4: "Dr." };
  return titles[String(value)] || value || "N/A";
};
const getGender = (value) => {
  const genders = { 1: "Male", 2: "Female", 3: "Other" };
  return genders[String(value)] || value || "N/A";
};
const getMaritalStatus = (value) => {
  const statuses = { 1: "Single", 2: "Married", 3: "Divorced", 4: "Widowed" };
  return statuses[String(value)] || value || "N/A";
};
const getEmploymentType = (value) => {
  const types = {
    1: "Agricultural Laborers",
    2: "Private Jobs",
    3: "Daily Wage Laborers",
    4: "Cottage Industry Workers",
    5: "Dairy Workers",
    6: "Rural Shopkeepers",
    7: "Government",
    8: "Transport Operators",
  };
  return types[String(value)] || value || "N/A";
};
const getPropertyType = (value) => {
  const types = {
    1: "Agricultural Land",
    2: "Kutcha House",
    3: "Pucca House",
    4: "Farm House",
    5: "Cattle Shed",
    6: "Storage Shed",
    7: "Residential Plot",
    8: "Village Shop",
    9: "Joint Family House",
    10: "Vacant Land",
  };
  return types[String(value)] || value || "N/A";
};
const getPropertyOwnership = (value) => {
  const types = { 1: "Owned", 2: "Mortgaged" };
  return types[String(value)] || value || "N/A";
};
const getAccountType = (value) => {
  const types = {
    1: "Savings Account",
    2: "Current Account",
    3: "Salary Account",
    4: "Fixed Deposit Account",
  };
  return types[String(value)] || value || "N/A";
};
const getTermTypeDisplay = (value) => {
  const types = { Months: "Months", Years: "Years", Days: "Days" };
  return types[String(value)] || value || "";
};
const getPurposeDisplay = (value) => {
  return value || "N/A";
};
const getRelationshipDisplay = (value) => {
  return value || "N/A";
};
const getProofTypeDisplay = (value) => {
  const types = {
    pan: "PAN Card",
    aadhar: "Aadhar Card",
    voterid: "Voter ID", // Ensure consistent casing with your data
    drivinglicense: "Driving License",
  };
  return types[String(value).toLowerCase()] || String(value) || "N/A";
};
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return dateString;
  }
};
const getLoanStatusBadgeRender = (status) => {
  // Renamed to avoid conflict with Badge component
  switch (
    status ? status.toUpperCase() : "" // Handle undefined status and normalize to uppercase
  ) {
    case "PENDING":
      return (
        <Badge color="warning" className="text-dark" pill>
          Pending
        </Badge>
      );
    case "MANAGER_APPROVED":
      return (
        <Badge color="info" pill>
          Manager Approved
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge color="primary" pill>
          Approved (Final)
        </Badge>
      );
    case "ACTIVE":
      return (
        <Badge color="success" pill>
          Active
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge color="danger" pill>
          Rejected
        </Badge>
      );
    case "PAID":
      return (
        <Badge color="secondary" pill>
          Paid
        </Badge>
      );
    case "OVERDUE":
      return (
        <Badge color="danger" pill>
          Overdue
        </Badge>
      );
    default:
      return (
        <Badge color="light" pill>
          {status || "Unknown"}
        </Badge>
      );
  }
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(parseFloat(value))) {
    // Return a default for invalid inputs, e.g., for fields that might be initially null
    return "₹0.00";
  }
  return `₹${parseFloat(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
const LoanApplicationDetailAction = () => {
  const { loanApplicationPk } = useParams();
  const [loanData, setLoanData] = useState(null);
  const [applicantData, setApplicantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("LoanApplicationDetailAction MOUNTED");
    const roleFromStorage = localStorage.getItem("userRole");
    if (roleFromStorage) {
      setUserRole(roleFromStorage.toLowerCase());
    } else {
      console.warn("User role not found in localStorage.");
    }

    return () => {
      console.log("LoanApplicationDetailAction UNMOUNTED");
    };
  }, []);

  const fetchData = useCallback(async () => {
    console.log("fetchData called. loanApplicationPk:", loanApplicationPk);
    if (!loanApplicationPk) {
      setError("Loan Application PK is missing from URL.");
      setLoading(false);
      toast.error("Loan Application PK is missing.");
      return;
    }
    setLoading(true);
    setError(null);
    setLoanData(null); // Reset previous data
    setApplicantData(null); // Reset previous data

    const token = localStorage.getItem("accessToken");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    if (!token || !API_BASE_URL) {
      setError("Configuration error: Missing token or API URL.");
      setLoading(false);
      toast.error("Configuration error.");
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // 1. Fetch the specific loan application
      console.log(`Fetching loan details for PK: ${loanApplicationPk}`);
      const loanResponse = await axios.get(
        `${API_BASE_URL}api/loan-applications/loan-applications/${loanApplicationPk}/`, // Use PK here
        { headers }
      );
      const fetchedLoan = loanResponse.data;
      setLoanData({
        ...fetchedLoan,
        nominees: Array.isArray(fetchedLoan.nominees)
          ? fetchedLoan.nominees
          : [],
        emiSchedule: Array.isArray(fetchedLoan.emiSchedule)
          ? fetchedLoan.emiSchedule
          : [],
      });
      console.log("Fetched Loan Data:", fetchedLoan);

      // 2. Fetch applicant details using applicant_record (Applicant.userID) from the loan data
      if (fetchedLoan.applicant_record) {
        // This should be the Applicant's userID
        console.log(
          `Fetching applicant details for UserID: ${fetchedLoan.applicant_record}`
        );
        const applicantResponse = await axios.get(
          `${API_BASE_URL}api/applicants/applicants/${fetchedLoan.applicant_record}/`, // Use Applicant's userID
          { headers }
        );
        setApplicantData({
          ...applicantResponse.data,
          employment: Array.isArray(applicantResponse.data.employment)
            ? applicantResponse.data.employment
            : [],
          properties: Array.isArray(applicantResponse.data.properties)
            ? applicantResponse.data.properties
            : [],
          banking_details: Array.isArray(applicantResponse.data.banking_details)
            ? applicantResponse.data.banking_details
            : [],
          // Ensure 'ApplicantProof' matches your ApplicantSerializer's related name for proofs
          proofs: Array.isArray(applicantResponse.data.ApplicantProof)
            ? applicantResponse.data.ApplicantProof
            : [],
        });
        console.log("Fetched Applicant Data:", applicantResponse.data);
      } else {
        console.warn(
          "Applicant record ID (userID) not found in loan data. Cannot fetch applicant details."
        );
        // Keep loan data, but applicant details will be missing
        setError(
          "Applicant details could not be fetched: ID missing from loan."
        );
      }
    } catch (err) {
      console.error("Error fetching details:", err);
      const errorMsg =
        err.response?.data?.detail || "Failed to fetch application details.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [loanApplicationPk]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // fetchData will re-run if loanApplicationPk changes

  const handleLoanAction = async (newStatus, actionRemarks) => {
    if (!loanData || !loanData.id) {
      toast.error("No loan selected or loan ID missing.");
      return;
    }
    if (!userRole) {
      toast.error("User role not determined. Cannot perform action.");
      return;
    }
    // Remarks are required for any state change by manager/admin
    if (!actionRemarks.trim() && newStatus !== loanData.status) {
      toast.warn("Remarks are required to change the loan status.");
      return;
    }

    setIsSubmittingAction(true);

    const token = localStorage.getItem("accessToken");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const headers = { Authorization: `Bearer ${token}` };

    const payload = { status: newStatus };
    // Add remarks based on role
    if (userRole === "manager") payload.manager_remarks = actionRemarks.trim();
    else if (userRole === "admin") payload.admin_remarks = actionRemarks.trim();
    // If general remarks field is used, add it too
    // payload.remarks = remarks.trim(); // If you have a general 'remarks' field updated by current actor

    try {
      const response = await axios.patch(
        `${API_BASE_URL}api/loan-applications/loan-applications/${loanData.id}/`, // Use loanData.id (PK)
        payload,
        { headers }
      );
      toast.success(`Loan application status updated to ${newStatus}.`);
      setLoanData(response.data); // Update displayed loan with new data from response
      setRemarks(""); // Clear remarks input
      // Optionally navigate back or refresh the list from where the user came.
      // navigate('/loan-approvals'); // Navigate to the queue page
    } catch (err) {
      console.error("Error updating loan status:", err.response);
      const errorDetail =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to update loan status.";
      toast.error(errorDetail);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const emiTotals = useMemo(() => {
    if (
      !loanData ||
      !loanData.emiSchedule ||
      loanData.emiSchedule.length === 0
    ) {
      return { totalPayment: 0, totalPrincipal: 0, totalInterest: 0 };
    }
    const totals = loanData.emiSchedule.reduce(
      (acc, row) => {
        acc.totalPayment += parseFloat(row.emiTotalMonth || 0); // Or row.emi, whatever your field is for the EMI amount of that installment
        acc.totalPrincipal += parseFloat(row.principalPaid || 0);
        acc.totalInterest += parseFloat(row.interest || 0);
        return acc;
      },
      { totalPayment: 0, totalPrincipal: 0, totalInterest: 0 }
    );
    return totals;
  }, [loanData]);

  // --- UI Rendering Logic ---
  if (loading) {
    return (
      <div
        className="page-content d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
        <p className="ms-3 fs-5">Loading Application Details...</p>
      </div>
    );
  }

  if (error && (!loanData || !applicantData)) {
    // If essential data failed to load
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger" className="text-center">
            <h4 className="alert-heading">
              <FeatherIcon icon="alert-triangle" className="me-2" /> Error
              Loading Details
            </h4>
            <p>{error}</p>
            <Button color="primary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  if (!loanData) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="warning" className="text-center">
            <h4 className="alert-heading">
              <FeatherIcon icon="info" className="me-2" /> No Loan Data
            </h4>
            <p>
              Loan application details could not be loaded. It might have been
              removed or the ID is incorrect.
            </p>
            <Button color="primary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  // --- Reusable UI Components (can be moved to a separate file) ---
  const SectionWrapper = ({
    title,
    icon,
    children,
    iconColor = "primary",
    cardClassName = "shadow-sm mb-4",
  }) => (
    <Card className={cardClassName}>
      <CardHeader className="bg-light py-3">
        <h4 className="mb-0 card-title d-flex align-items-center">
          {icon && (
            <FeatherIcon icon={icon} className={`me-2 text-${iconColor}`} />
          )}
          {title}
        </h4>
      </CardHeader>
      <CardBody className="p-4">{children}</CardBody>
    </Card>
  );

  const DetailItem = ({
    label,
    value,
    icon,
    colProps = { md: 6, lg: 4 },
    isCurrency = false,
    isDate = false,
    isBadge = false,
  }) => (
    <Col {...colProps} className="mb-3">
      <div className="detail-item">
        <small className="text-muted d-block">
          {icon && (
            <FeatherIcon icon={icon} size={14} className="me-1 text-muted" />
          )}
          {label}
        </small>
        {isBadge ? (
          getLoanStatusBadgeRender(value)
        ) : (
          <p className="fw-bold mb-0">
            {isCurrency &&
            (typeof value === "number" ||
              (typeof value === "string" && !isNaN(parseFloat(value))))
              ? `₹${parseFloat(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : isDate
                ? formatDate(value)
                : value || "N/A"}
          </p>
        )}
      </div>
    </Col>
  );
  // --- End Reusable UI Components ---

  // Main JSX starts here, using applicantData and loanData states
  return (
    <div className="page-content">
      <Container fluid>
        {/* Display general error if it occurred after some data might have loaded */}
        {error && (applicantData || loanData) && (
          <Alert color="warning" className="text-center my-3">
            <FeatherIcon icon="alert-circle" className="me-2" /> {error}
          </Alert>
        )}

        {/* Applicant Details Section - Renders if applicantData is available */}
        {/* This section and others above "Loan Actions" are uneditable (display-only) */}
        {applicantData ? (
          <>
            <Row className="mb-4 align-items-center">
              <Col xs="auto">
                <Button
                  color="light"
                  onClick={() => navigate(-1)}
                  className="border shadow-sm"
                >
                  <FeatherIcon icon="arrow-left" size="16" className="me-1" />{" "}
                  Back
                </Button>
              </Col>
              <Col>
                <h2 className="mb-0 text-primary">
                  <FeatherIcon icon="file-text" className="me-2" /> Loan
                  Application Review
                </h2>
              </Col>
              <Col xs="auto">
                <Badge
                  color={
                    applicantData.is_deleted
                      ? "danger"
                      : applicantData.is_approved
                        ? "success"
                        : "warning"
                  }
                  className="px-3 py-2 fs-6 shadow-sm"
                  pill
                >
                  <FeatherIcon
                    icon={
                      applicantData.is_deleted
                        ? "trash-2"
                        : applicantData.is_approved
                          ? "check-circle"
                          : "clock"
                    }
                    size="14"
                    className="me-1"
                  />
                  Applicant:{" "}
                  {applicantData.is_deleted
                    ? "Deleted"
                    : applicantData.is_approved
                      ? "Approved"
                      : "Pending"}
                </Badge>
              </Col>
            </Row>
            <Card className="shadow-lg mb-4 border-0 overflow-hidden">
              {" "}
              {/* Main Summary Card */}
              <CardBody className="p-0">
                {" "}
                <Row className="g-0">
                  {" "}
                  {/* ... Content as per your UI ... */}
                  <Col
                    md={3}
                    className="text-center bg-light p-4 d-flex flex-column align-items-center justify-content-center border-end"
                  >
                    {applicantData.profile_photo ? (
                      <img
                        src={applicantData.profile_photo}
                        alt={`${applicantData.first_name} ${applicantData.last_name}`}
                        className="img-fluid rounded-circle shadow-sm mb-3"
                        style={{
                          width: "130px",
                          height: "130px",
                          objectFit: "cover",
                          border: "4px solid white",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/130?text=No+Photo";
                        }}
                      />
                    ) : (
                      <div
                        className="bg-white text-secondary d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3 shadow-sm"
                        style={{
                          width: "130px",
                          height: "130px",
                          fontSize: "3.5rem",
                          border: "4px solid white",
                        }}
                      >
                        {" "}
                        <FeatherIcon icon="user" />{" "}
                      </div>
                    )}
                    <h4 className="mb-1">
                      {`${getTitle(applicantData.title)} ${applicantData.first_name || ""} ${applicantData.last_name || ""}`.trim()}
                    </h4>
                    <p className="text-muted mb-0">
                      {applicantData.userID || "N/A"}
                    </p>
                  </Col>
                  <Col md={9} className="p-4">
                    <h5 className="mb-3 text-primary">
                      Key Applicant Information
                    </h5>
                    <Row>
                      <DetailItem
                        label="Email"
                        value={applicantData.email}
                        colProps={{ md: 6, lg: 6 }}
                        icon="mail"
                      />
                      <DetailItem
                        label="Phone"
                        value={applicantData.phone}
                        colProps={{ md: 6, lg: 6 }}
                        icon="phone"
                      />
                      <DetailItem
                        label="Date of Birth"
                        value={applicantData.dateOfBirth}
                        isDate
                        icon="calendar"
                      />
                      <DetailItem
                        label="Gender"
                        value={getGender(applicantData.gender)}
                        icon="users"
                      />
                      <DetailItem
                        label="Marital Status"
                        value={getMaritalStatus(applicantData.maritalStatus)}
                        icon="heart"
                      />
                      <Col md={12} className="mt-2">
                        <small className="text-muted d-block">
                          {" "}
                          <FeatherIcon
                            icon="map-pin"
                            size="14"
                            className="me-1 text-muted"
                          />{" "}
                          Address
                        </small>
                        <p className="fw-semibold mb-0">
                          {" "}
                          {`${applicantData.address || ""}, ${applicantData.city || ""}, ${applicantData.state || ""} - ${applicantData.postalCode || ""}`}{" "}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>{" "}
              </CardBody>
            </Card>
            <SectionWrapper
              title="Personal & Contact Details"
              icon="user"
              iconColor="primary"
            >
              {" "}
              {/* Personal Details */}
              <Row>
                <DetailItem label="Applicant ID" value={applicantData.userID} />
                <DetailItem
                  label="Full Name"
                  value={`${getTitle(applicantData.title)} ${applicantData.first_name || ""} ${applicantData.last_name || ""}`.trim()}
                />
                <DetailItem
                  label="Date of Birth"
                  value={applicantData.dateOfBirth}
                  isDate
                />
                <DetailItem
                  label="Gender"
                  value={getGender(applicantData.gender)}
                />
                <DetailItem
                  label="Marital Status"
                  value={getMaritalStatus(applicantData.maritalStatus)}
                />
                <DetailItem
                  label="Email Address"
                  value={applicantData.email}
                  colProps={{ md: 6 }}
                  icon="mail"
                />
                <DetailItem
                  label="Phone Number"
                  value={applicantData.phone}
                  colProps={{ md: 6 }}
                  icon="phone"
                />
                <Col md={12}>
                  {" "}
                  <small className="text-muted d-block">
                    Full Address
                  </small>{" "}
                  <p className="fw-bold mb-0">
                    {" "}
                    {`${applicantData.address || ""}, ${applicantData.city || ""}, ${applicantData.state || ""} - ${applicantData.postalCode || ""}`}{" "}
                  </p>{" "}
                </Col>
              </Row>
            </SectionWrapper>
            {/* Employment Information */}
            {applicantData.employment && applicantData.employment.length > 0 ? (
              <SectionWrapper
                title="Employment Information"
                icon="briefcase"
                iconColor="success"
              >
                {applicantData.employment.map((emp, index) => (
                  <div
                    key={emp.id || index}
                    className={
                      applicantData.employment.length > 1 &&
                      index < applicantData.employment.length - 1
                        ? "mb-4 pb-4 border-bottom"
                        : ""
                    }
                  >
                    {applicantData.employment.length > 1 && (
                      <h6 className="text-muted mb-3">
                        Employment Record {index + 1}
                      </h6>
                    )}
                    <Row>
                      <DetailItem
                        label="Employment Type"
                        value={getEmploymentType(emp.employmentType)}
                      />
                      <DetailItem label="Job Title" value={emp.jobTitle} />
                      <DetailItem
                        label="Years with Employer"
                        value={
                          emp.yearsWithEmployer
                            ? `${emp.yearsWithEmployer} yrs`
                            : "N/A"
                        }
                      />
                      <DetailItem
                        label="Monthly Income"
                        value={emp.monthlyIncome}
                        isCurrency
                      />
                      <DetailItem
                        label="Other Income"
                        value={emp.otherIncome}
                        isCurrency
                      />
                      <DetailItem
                        label="Total Monthly Income"
                        value={
                          parseFloat(emp.monthlyIncome || 0) +
                          parseFloat(emp.otherIncome || 0)
                        }
                        isCurrency
                      />
                    </Row>
                  </div>
                ))}
              </SectionWrapper>
            ) : (
              <SectionWrapper
                title="Employment Information"
                icon="briefcase"
                iconColor="success"
              >
                <p className="text-muted">No employment details provided.</p>
              </SectionWrapper>
            )}

            {/* Property Details */}
            {applicantData.properties && applicantData.properties.length > 0 ? (
              <SectionWrapper
                title="Property Details"
                icon="home"
                iconColor="warning"
              >
                {applicantData.properties.map((prop, index) => (
                  <div
                    key={prop.id || index}
                    className={
                      applicantData.properties.length > 1 &&
                      index < applicantData.properties.length - 1
                        ? "mb-4 pb-4 border-bottom"
                        : ""
                    }
                  >
                    {applicantData.properties.length > 1 && (
                      <h6 className="text-muted mb-3">Property {index + 1}</h6>
                    )}
                    <Row>
                      <DetailItem
                        label="Property Type"
                        value={getPropertyType(prop.propertyType)}
                      />
                      <DetailItem
                        label="Property Address"
                        value={prop.property_address}
                        colProps={{ md: 6, lg: 8 }}
                      />
                      <DetailItem
                        label="Property Value"
                        value={prop.propertyValue}
                        isCurrency
                      />
                      <DetailItem
                        label="Property Age"
                        value={
                          prop.propertyAge ? `${prop.propertyAge} yrs` : "N/A"
                        }
                      />
                      <DetailItem
                        label="Ownership"
                        value={getPropertyOwnership(prop.propertyOwnership)}
                      />
                      {prop.remarks && (
                        <DetailItem
                          label="Remarks"
                          value={prop.remarks}
                          colProps={{ md: 12 }}
                        />
                      )}
                    </Row>
                  </div>
                ))}
              </SectionWrapper>
            ) : (
              <SectionWrapper
                title="Property Details"
                icon="home"
                iconColor="warning"
              >
                <p className="text-muted">No property details provided.</p>
              </SectionWrapper>
            )}

            {/* Banking Information */}
            {applicantData.banking_details &&
            applicantData.banking_details.length > 0 ? (
              <SectionWrapper
                title="Banking Information"
                icon="credit-card"
                iconColor="info"
              >
                {applicantData.banking_details.map((bank, index) => (
                  <div
                    key={bank.id || index}
                    className={
                      applicantData.banking_details.length > 1 &&
                      index < applicantData.banking_details.length - 1
                        ? "mb-4 pb-4 border-bottom"
                        : ""
                    }
                  >
                    {applicantData.banking_details.length > 1 && (
                      <h6 className="text-muted mb-3">
                        Bank Account {index + 1}
                      </h6>
                    )}
                    <Row>
                      <DetailItem
                        label="Account Holder Name"
                        value={bank.accountHolderName}
                      />
                      <DetailItem
                        label="Account Number"
                        value={bank.accountNumber}
                      />
                      <DetailItem label="Bank Name" value={bank.bankName} />
                      <DetailItem label="IFSC Code" value={bank.ifscCode} />
                      <DetailItem label="Bank Branch" value={bank.bankBranch} />
                      <DetailItem
                        label="Account Type"
                        value={getAccountType(bank.accountType)}
                      />
                    </Row>
                  </div>
                ))}
              </SectionWrapper>
            ) : (
              <SectionWrapper
                title="Banking Information"
                icon="credit-card"
                iconColor="info"
              >
                <p className="text-muted">No banking details provided.</p>
              </SectionWrapper>
            )}
          </>
        ) : (
          <Alert color="secondary" className="mt-3">
            Applicant details could not be loaded or are not available.
          </Alert>
        )}

        {/* Loan Application Details Section - Renders if loanData is available */}
        {loanData && (
          <>
            <SectionWrapper
              title={`Loan Application: ${loanData.loanID || `(PK: ${loanData.id})`}`}
              icon="dollar-sign"
              iconColor="purple"
              cardClassName="shadow-lg mt-4 border-primary"
            >
              <Row>
                <DetailItem
                  label="Loan ID"
                  value={loanData.loanID || "Not Generated Yet"}
                  colProps={{ md: 6, lg: 3 }}
                />
                <DetailItem
                  label="Application PK"
                  value={loanData.id}
                  colProps={{ md: 6, lg: 3 }}
                />
                <DetailItem
                  label="Current Status"
                  value={loanData.status}
                  isBadge
                  colProps={{ md: 6, lg: 3 }}
                />
                <DetailItem
                  label="Loan Amount Requested"
                  value={loanData.amount}
                  isCurrency
                  colProps={{ md: 6, lg: 3 }}
                />
                <DetailItem
                  label="Term"
                  value={`${loanData.term || ""} ${getTermTypeDisplay(loanData.termType)}`}
                  colProps={{ md: 6, lg: 3 }}
                />
                <DetailItem
                  label="Interest Rate"
                  value={
                    loanData.interestRate ? `${loanData.interestRate}%` : "N/A"
                  }
                  colProps={{ md: 6, lg: 3 }}
                />
                <DetailItem
                  label="Purpose"
                  value={getPurposeDisplay(loanData.purpose)}
                  colProps={{ md: 6, lg: 3 }}
                />
                <DetailItem
                  label="Repayment Source"
                  value={loanData.repaymentSource}
                  colProps={{ md: 6, lg: 3 }}
                />
                <DetailItem
                  label="Application Date"
                  value={loanData.LoanRegDate}
                  isDate
                  colProps={{ md: 6, lg: 3 }}
                />
                <DetailItem
                  label="Approved Start Date"
                  value={loanData.startDate}
                  isDate
                  colProps={{ md: 6, lg: 3 }}
                />
                <DetailItem
                  label="Applicant Name (on App)"
                  value={loanData.first_name}
                  colProps={{ md: 6, lg: 3 }}
                />
                <DetailItem
                  label="Applicant Phone (on App)"
                  value={loanData.phone}
                  colProps={{ md: 6, lg: 3 }}
                />
              </Row>
              <Row className="mt-3">
                {" "}
                {/* Agreements */}
                <Col md={4}>
                  <FeatherIcon
                    icon={loanData.agreeTerms ? "check-square" : "square"}
                    className="me-1"
                  />{" "}
                  Agreed to Terms
                </Col>
                <Col md={4}>
                  <FeatherIcon
                    icon={loanData.agreeCreditCheck ? "check-square" : "square"}
                    className="me-1"
                  />{" "}
                  Agreed to Credit Check
                </Col>
                <Col md={4}>
                  <FeatherIcon
                    icon={loanData.agreeDataSharing ? "check-square" : "square"}
                    className="me-1"
                  />{" "}
                  Agreed to Data Sharing
                </Col>
              </Row>
              {(loanData.translatorName ||
                loanData.translatorPlace) /* Translator */ && (
                <Row className="mt-3 pt-3 border-top">
                  {" "}
                  <DetailItem
                    label="Translator Name"
                    value={loanData.translatorName}
                    colProps={{ md: 6 }}
                  />{" "}
                  <DetailItem
                    label="Translator Place"
                    value={loanData.translatorPlace}
                    colProps={{ md: 6 }}
                  />{" "}
                </Row>
              )}
              {loanData.remarks && (
                <Row className="mt-3 pt-3 border-top">
                  {" "}
                  <Col>
                    <small className="text-muted">
                      General Remarks (from application):
                    </small>
                    <p className="fw-semibold bg-light p-2 rounded border">
                      {loanData.remarks}
                    </p>
                  </Col>{" "}
                </Row>
              )}
              {loanData.manager_remarks && (
                <Row className="mt-2">
                  {" "}
                  <Col>
                    <small className="text-muted">Manager Remarks:</small>
                    <p className="fw-semibold bg-light p-2 rounded border">
                      {loanData.manager_remarks}
                    </p>
                  </Col>{" "}
                </Row>
              )}
              {loanData.admin_remarks && (
                <Row className="mt-2">
                  {" "}
                  <Col>
                    <small className="text-muted">Admin Remarks:</small>
                    <p className="fw-semibold bg-light p-2 rounded border">
                      {loanData.admin_remarks}
                    </p>
                  </Col>{" "}
                </Row>
              )}
            </SectionWrapper>

            {/* Nominees Section */}
            <SectionWrapper
              title="Nominee Details"
              icon="users"
              iconColor="dark"
            >
              {loanData.nominees && loanData.nominees.length > 0 ? (
                loanData.nominees.map((nominee, index) => (
                  <Card
                    key={nominee.id || index}
                    className={`mb-3 shadow-none border ${index < loanData.nominees.length - 1 ? "mb-3" : ""}`}
                  >
                    {" "}
                    <CardBody>
                      {" "}
                      {/* ... Nominee details structure ... */}
                      <Row className="align-items-center">
                        {" "}
                        <Col md={2} className="text-center mb-3 mb-md-0">
                          {" "}
                          {nominee.profile_photo ? (
                            <img
                              src={nominee.profile_photo}
                              alt={nominee.name}
                              className="img-fluid rounded-circle"
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/80?text=N";
                              }}
                            />
                          ) : (
                            <div
                              className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto"
                              style={{ width: "80px", height: "80px" }}
                            >
                              {" "}
                              <FeatherIcon
                                icon="user"
                                size="30"
                                className="text-muted"
                              />{" "}
                            </div>
                          )}{" "}
                        </Col>{" "}
                        <Col md={10}>
                          {" "}
                          <h5 className="mb-1 text-primary">
                            {nominee.name || "N/A"}
                          </h5>{" "}
                          <Row>
                            {" "}
                            <DetailItem
                              label="Relationship"
                              value={getRelationshipDisplay(
                                nominee.relationship
                              )}
                              colProps={{ md: 6, lg: 3 }}
                            />{" "}
                            <DetailItem
                              label="Phone"
                              value={nominee.phone}
                              colProps={{ md: 6, lg: 3 }}
                            />{" "}
                            <DetailItem
                              label="Email"
                              value={nominee.email}
                              colProps={{ md: 6, lg: 3 }}
                            />{" "}
                            <DetailItem
                              label="ID Proof"
                              value={`${getProofTypeDisplay(nominee.idProofType)}: ${nominee.idProofNumber || ""}`}
                              colProps={{ md: 6, lg: 3 }}
                            />{" "}
                            <Col md={12} className="mt-1">
                              {" "}
                              <small className="text-muted">
                                Address:
                              </small>{" "}
                              <p className="fw-semibold small mb-2">
                                {nominee.address || "N/A"}
                              </p>{" "}
                            </Col>{" "}
                            {(nominee.id_proof_file ||
                              nominee.profile_photo) && (
                              <Col md={12} className="mt-1">
                                {" "}
                                {nominee.id_proof_file && (
                                  <Button
                                    outline
                                    color="info"
                                    size="sm"
                                    href={nominee.id_proof_file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="me-2"
                                  >
                                    {" "}
                                    <FeatherIcon
                                      icon="file-text"
                                      size={14}
                                      className="me-1"
                                    />{" "}
                                    View ID File{" "}
                                  </Button>
                                )}{" "}
                                {nominee.profile_photo && (
                                  <Button
                                    outline
                                    color="info"
                                    size="sm"
                                    href={nominee.profile_photo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {" "}
                                    <FeatherIcon
                                      icon="image"
                                      size={14}
                                      className="me-1"
                                    />{" "}
                                    View Nominee Photo{" "}
                                  </Button>
                                )}{" "}
                              </Col>
                            )}{" "}
                          </Row>{" "}
                        </Col>{" "}
                      </Row>
                    </CardBody>{" "}
                  </Card>
                ))
              ) : (
                <p className="text-muted text-center m-0">
                  No nominees provided for this loan application.
                </p>
              )}
            </SectionWrapper>

            {/* EMI Schedule Section */}
            <SectionWrapper
              title="EMI Payment Schedule"
              icon="calendar"
              iconColor="teal"
            >
              {loanData.emiSchedule && loanData.emiSchedule.length > 0 ? (
                <>
                  <div className="text-center p-3">
                    <h5>EMI Repayment Schedule</h5>
                    {loanData.amount &&
                      loanData.interestRate && ( // Show description if basic loan data exists
                        <p className="card-title-desc">
                          Loan of {formatCurrency(loanData.amount)} at{" "}
                          {loanData.interestRate}% interest per annum.
                          {/* Add diminishing/flat rate if available: {loanData.interestType === 'DIMINISHING' ? '(Diminishing)' : '(Flat Rate)'} */}
                        </p>
                      )}
                  </div>
                  <div
                    className="table-responsive mb-4"
                    style={{ maxHeight: "450px", overflowY: "auto" }}
                  >
                    <Table striped bordered hover size="sm" className="mb-0">
                      <thead
                        className="table-light"
                        style={{ position: "sticky", top: 0, zIndex: 1 }}
                      >
                        <tr>
                          <th>Installment No.</th>
                          <th>Due Date</th>
                          <th className="text-end">EMI Amount</th>
                          <th className="text-end">Principal Paid</th>
                          <th className="text-end">Interest Paid</th>
                          <th className="text-end">Remaining Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loanData.emiSchedule
                          .sort(
                            (a, b) =>
                              (a.month || a.installment_number || 0) -
                              (b.month || b.installment_number || 0)
                          ) // Sort by month/installment
                          .map((emi, index) => (
                            <tr key={emi.id || index}>
                              <td>
                                {emi.month ||
                                  emi.installment_number ||
                                  index + 1}
                              </td>
                              <td>
                                {formatDate(emi.emiStartDate || emi.due_date)}
                              </td>
                              <td className="text-end">
                                {formatCurrency(
                                  emi.emiTotalMonth || emi.emi_amount
                                )}
                              </td>
                              <td className="text-end">
                                {formatCurrency(
                                  emi.principalPaid || emi.principal_component
                                )}
                              </td>
                              <td className="text-end">
                                {formatCurrency(
                                  emi.interest || emi.interest_component
                                )}
                              </td>
                              <td className="text-end">
                                {formatCurrency(emi.remainingBalance)}
                              </td>
                              {/* Render other EMI fields if they exist */}
                            </tr>
                          ))}
                      </tbody>
                      {/* Totals Row - if emiTotals are calculated */}
                      {(emiTotals.totalPayment > 0 ||
                        emiTotals.totalPrincipal > 0 ||
                        emiTotals.totalInterest > 0) && (
                        <tfoot className="table-light fw-bold">
                          <tr>
                            <td colSpan="2" className="text-end">
                              Total
                            </td>
                            <td className="text-end">
                              {formatCurrency(emiTotals.totalPayment)}
                            </td>
                            <td className="text-end">
                              {formatCurrency(emiTotals.totalPrincipal)}
                            </td>
                            <td className="text-end">
                              {formatCurrency(emiTotals.totalInterest)}
                            </td>
                            <td>-</td>
                          </tr>
                        </tfoot>
                      )}
                    </Table>
                  </div>

                  {/* Summary Card for EMI Totals */}
                  <Card className="bg-light mt-3">
                    <CardBody>
                      <Row>
                        <Col
                          md={4}
                          className="text-center border-end mb-2 mb-md-0"
                        >
                          <p className="text-muted mb-1">Total Principal</p>
                          <h5 className="text-primary mb-0">
                            {formatCurrency(loanData.amount)}
                          </h5>
                          {/* Or use emiTotals.totalPrincipal if more accurate from schedule */}
                        </Col>
                        <Col
                          md={4}
                          className="text-center border-end mb-2 mb-md-0"
                        >
                          <p className="text-muted mb-1">
                            Total Interest Paid (from schedule)
                          </p>
                          <h5 className="text-danger mb-0">
                            {formatCurrency(emiTotals.totalInterest)}
                          </h5>
                        </Col>
                        <Col md={4} className="text-center">
                          <p className="text-muted mb-1">
                            Total Amount Payable (from schedule)
                          </p>
                          <h5 className="text-success mb-0">
                            {formatCurrency(emiTotals.totalPayment)}
                          </h5>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </>
              ) : (
                <p className="text-muted text-center m-0">
                  EMI schedule not available or not yet generated.
                </p>
              )}
            </SectionWrapper>

            {/* Action Section for Manager/Admin */}
            {/* This section is conditionally editable based on role and loan status */}
            {loanData && (userRole === "manager" || userRole === "admin") && (
                
              <SectionWrapper
                title="Loan Actions"
                icon="tool"
                iconColor="primary"
                cardClassName="shadow-sm my-4"
              >
                {/* 
                  The "bracket" condition:
                  This block determines if the remarks input and action buttons are rendered.
                  If true, user can input remarks and perform actions.
                  If false, "No actions available..." message is shown.
                */}
                {(userRole === "manager" && loanData.status === "PENDING") ||
                (userRole === "admin" &&
                  (loanData.status === "MANAGER_APPROVED" ||
                    loanData.status === "PENDING")) ? (
                  <>
                    <FormGroup>
                      <Label for="actionRemarksInput" className="fw-bold">
                        {userRole === "manager"
                          ? "Manager Remarks:"
                          : "Admin Remarks:"}
                      </Label>
                      <Input
                        type="textarea"
                        name="remarks"
                        id="actionRemarksInput"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        rows="4" // Increased rows for better visibility
                        placeholder={`Enter ${userRole === "manager" ? "manager" : "admin"} remarks for this action... (Required for status change)`}
                        disabled={isSubmittingAction}
                        className="mb-3"
                        style={{ color: "#212529" }} // Add some margin below the input
                      />
                    </FormGroup>

                    <div className="d-flex justify-content-end mt-3">
                      {userRole === "manager" &&
                        loanData.status === "PENDING" && (
                          <>
                            <Button
                              color="success"
                              className="me-2"
                              onClick={() =>
                                handleLoanAction("MANAGER_APPROVED", remarks)
                              }
                              disabled={isSubmittingAction || !remarks.trim()}
                            >
                              {isSubmittingAction ? (
                                <Spinner size="sm" />
                              ) : (
                                <>
                                  <FeatherIcon
                                    icon="check-circle"
                                    size={16}
                                    className="me-1"
                                  />
                                  Approve (Mgr)
                                </>
                              )}
                            </Button>
                            <Button
                              color="danger"
                              onClick={() =>
                                handleLoanAction("REJECTED", remarks)
                              }
                              disabled={isSubmittingAction || !remarks.trim()}
                            >
                              {isSubmittingAction ? (
                                <Spinner size="sm" />
                              ) : (
                                <>
                                  <FeatherIcon
                                    icon="x-circle"
                                    size={16}
                                    className="me-1"
                                  />
                                  Reject
                                </>
                              )}
                            </Button>
                          </>
                        )}

                      {userRole === "admin" &&
                        loanData.status === "MANAGER_APPROVED" && (
                          <>
                            <Button
                              color="success"
                              className="me-2"
                              onClick={() =>
                                handleLoanAction("APPROVED", remarks)
                              }
                              disabled={isSubmittingAction || !remarks.trim()}
                            >
                              {isSubmittingAction ? (
                                <Spinner size="sm" />
                              ) : (
                                <>
                                  <FeatherIcon
                                    icon="award"
                                    size={16}
                                    className="me-1"
                                  />
                                  Final Approve
                                </>
                              )}
                            </Button>
                            <Button
                              color="danger"
                              onClick={() =>
                                handleLoanAction("REJECTED", remarks)
                              }
                              disabled={isSubmittingAction || !remarks.trim()}
                            >
                              {isSubmittingAction ? (
                                <Spinner size="sm" />
                              ) : (
                                <>
                                  <FeatherIcon
                                    icon="x-circle"
                                    size={16}
                                    className="me-1"
                                  />
                                  Reject
                                </>
                              )}
                            </Button>
                          </>
                        )}

                      {userRole === "admin" &&
                        loanData.status === "PENDING" && (
                          <Button
                            color="danger"
                            onClick={() =>
                              handleLoanAction("REJECTED", remarks)
                            }
                            disabled={isSubmittingAction || !remarks.trim()}
                            className="ms-auto"
                          >
                            {isSubmittingAction ? (
                              <Spinner size="sm" />
                            ) : (
                              <>
                                <FeatherIcon
                                  icon="x-circle"
                                  size={16}
                                  className="me-1"
                                />
                                Reject (Admin)
                              </>
                            )}
                          </Button>
                        )}
                    </div>
                  </>
                ) : (
                  <p className="text-muted text-center m-0">
                    No actions available for this loan application's current
                    status ({loanData.status}) by your role, or remarks already
                    submitted.
                  </p>
                )}
              </SectionWrapper>
            )}
          </>
        )}

        <div className="text-center mt-5 mb-3">
          <Button
            color="outline-secondary"
            onClick={() => window.print()}
            className="me-2 shadow-sm"
          >
            <FeatherIcon icon="printer" className="me-1" /> Print Page
          </Button>
          <Button
            color="primary"
            onClick={() => navigate(-1)} // Or navigate to a specific queue page
            className="shadow-sm"
          >
            <FeatherIcon icon="arrow-left" className="me-1" /> Back to Queue
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default LoanApplicationDetailAction;