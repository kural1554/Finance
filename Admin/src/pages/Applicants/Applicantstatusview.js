import React, { useState, useEffect, useCallback } from 'react';
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
} from 'reactstrap';
import { useParams, useNavigate } from "react-router-dom"; // Link import ah neekkalaam, use aagala
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FeatherIcon from "feather-icons-react";

const Applicantstatusview = () => {
  const { applicantId } = useParams(); // applicantId is Applicant.userID (e.g., APFAA8D1)
  const navigate = useNavigate();

  const [applicantData, setApplicantData] = useState(null);
  const [loanData, setLoanData] = useState(null); // Can be a loan object or null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Helper Functions (Keep these as they are) ---
  const getTitle = (value) => {
    const titles = { "1": "Mr.", "2": "Mrs.", "3": "Ms.", "4": "Dr." };
    return titles[String(value)] || value || 'N/A';
  };
  const getGender = (value) => {
    const genders = { "1": "Male", "2": "Female", "3": "Other" };
    return genders[String(value)] || value || 'N/A';
  };
  const getMaritalStatus = (value) => {
    const statuses = { "1": "Single", "2": "Married", "3": "Divorced", "4": "Widowed" };
    return statuses[String(value)] || value || 'N/A';
  };
  const getEmploymentType = (value) => {
    const types = { "1": "Agricultural Laborers", "2": "Private Jobs", "3": "Daily Wage Laborers", "4": "Cottage Industry Workers", "5": "Dairy Workers", "6": "Rural Shopkeepers", "7": "Government", "8": "Transport Operators" };
    return types[String(value)] || value || 'N/A';
  };
  const getPropertyType = (value) => {
    const types = { "1": "Agricultural Land", "2": "Kutcha House", "3": "Pucca House", "4": "Farm House", "5": "Cattle Shed", "6": "Storage Shed", "7": "Residential Plot", "8": "Village Shop", "9": "Joint Family House", "10": "Vacant Land" };
    return types[String(value)] || value || 'N/A';
  };
  const getPropertyOwnership = (value) => {
    const types = { "1": "Owned", "2": "Rented", "3": "Leased" }; // Unga model la 'Mortgaged' irundhuchu
    return types[String(value)] || value || 'N/A';
  };
  const getAccountType = (value) => {
    const types = { "1": "Savings", "2": "Current", "3": "Fixed Deposit" }; // Unga model la 'Salary Account' um irundhuchu
    return types[String(value)] || value || 'N/A';
  };
  const getTermType = (value) => {
    const types = { "1": "Days", "2": "Weeks", "3": "Months", "4": "Years" };
    return types[String(value)] || value || 'N/A';
  };
  const getPurpose = (value) => {
    const purposes = { "1": "Home", "2": "Car", "3": "Education", "4": "Medical", "5": "Personal", "6": "Business" };
    return purposes[String(value)] || value || 'N/A';
  };
  const getRelationship = (value) => {
    const relationships = { "1": "Spouse", "2": "Parent", "3": "Child", "4": "Sibling", "5": "Other" };
    return relationships[String(value)] || value || 'N/A';
  };
  const getProofType = (value) => {
    // Idhukku unga ApplicantProof model la irukkura choices ah vechi map pannunga
    const types = {
        'pan': 'PAN Card',
        'aadhar': 'Aadhar Card',
        'voterId': 'Voter ID',
        'drivingLicense': 'Driving License',
    };
    return types[String(value).toLowerCase()] || String(value) || 'N/A';
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };
  // --- End Helper Functions ---

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setApplicantData(null);
    setLoanData(null);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Authentication token not found. Please login.");
      toast.error("Authentication token not found. Please login.");
      setLoading(false);
      return;
    }

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    if (!API_BASE_URL) {
      setError("API base URL is not configured.");
      toast.error("API base URL is not configured.");
      setLoading(false);
      return;
    }
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      // --- Step 1: Applicant Details ah Fetch Pannunga ---
      const applicantApiUrl = `${API_BASE_URL}api/applicants/applicants/${applicantId}/`;
      console.log("Fetching Applicant from URL:", applicantApiUrl);
      const applicantResponse = await axios.get(applicantApiUrl, { headers });
      const fetchedApplicantData = applicantResponse.data;
      
      setApplicantData({
        ...fetchedApplicantData,
        employment: Array.isArray(fetchedApplicantData.employment) ? fetchedApplicantData.employment : [],
        properties: Array.isArray(fetchedApplicantData.properties) ? fetchedApplicantData.properties : [],
        banking_details: Array.isArray(fetchedApplicantData.banking_details) ? fetchedApplicantData.banking_details : [],
        proofs: Array.isArray(fetchedApplicantData.proofs) ? fetchedApplicantData.proofs : []
      });
      console.log("Fetched Applicant Data:", fetchedApplicantData);

      // --- Step 2: Andha Applicant oda ACTIVE Loan ah Fetch Pannunga ---
      if (applicantId) {
        const activeLoanApiUrl = `${API_BASE_URL}api/loan-applications/loan-applications/?applicant_record__userID=${applicantId}&status=ACTIVE`;
        console.log("Fetching ACTIVE loan from URL:", activeLoanApiUrl);
        try {
            const loanResponse = await axios.get(activeLoanApiUrl, { headers });
            const activeLoansArray = loanResponse.data;
            console.log("FILTERED ACTIVE LOAN(S) FROM BACKEND:", JSON.stringify(activeLoansArray, null, 2));

            if (Array.isArray(activeLoansArray) && activeLoansArray.length > 0) {
                const currentActiveLoan = activeLoansArray[0];
                console.log("SETTING ACTIVE LOAN DATA:", JSON.stringify(currentActiveLoan, null, 2));
                setLoanData({
                    ...currentActiveLoan,
                    nominees: Array.isArray(currentActiveLoan.nominees) ? currentActiveLoan.nominees : [],
                    emiSchedule: Array.isArray(currentActiveLoan.emiSchedule) ? currentActiveLoan.emiSchedule : []
                });
            } else {
                console.log("No ACTIVE loan found for applicant userID:", applicantId);
                setLoanData(null);
            }
        } catch (loanFetchError) {
            console.error("Error fetching ACTIVE loan for applicant:", loanFetchError);
            if (loanFetchError.response && loanFetchError.response.status === 404) {
                toast.error(`Error accessing loan data endpoint for applicant ${applicantId}.`);
            } else {
                toast.warn(`Could not fetch active loan details for applicant ${applicantId}.`);
            }
            setLoanData(null);
        }
      } else {
        setLoanData(null);
      }
    } catch (err) {
      console.error("Error during data fetching (Applicant or Loan):", err);
      let errorMsg = "An error occurred while fetching data.";
      if (err.response) {
          if (err.response.status === 401) errorMsg = "Unauthorized access. Please login again.";
          else if (err.config?.url?.includes(`/api/applicants/applicants/${applicantId}/`) && err.response.status === 404) {
               errorMsg = `Applicant data not found for ID: ${applicantId}.`;
          }
          else if (err.response.data?.detail) errorMsg = err.response.data.detail;
          else errorMsg = `Failed to fetch data (Status: ${err.response.status}) from ${err.config?.url || 'unknown URL'}`;
      } else if (err.request) errorMsg = "No response from server.";
      else errorMsg = err.message;
      
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [applicantId]);

  useEffect(() => {
    if (applicantId) {
      fetchData();
    } else {
      const errMsg = "Applicant ID (userID) is missing in the URL.";
      setError(errMsg);
      toast.error(errMsg);
      setLoading(false);
    }
  }, [applicantId, fetchData]);

  // --- Loading State ---
  if (loading && !applicantData) { // Initial full page load
    return (
      <div className="page-content d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner color="primary" style={{ width: '3rem', height: '3rem' }}>Loading...</Spinner>
        <p className="ms-3 fs-5">Fetching Application Details...</p>
      </div>
    );
  }

  // --- Error State (If applicantData itself couldn't be fetched) ---
  if (error && !applicantData) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger" className="text-center">
            <h4 className="alert-heading">
              <FeatherIcon icon="alert-triangle" className="me-2" /> Error Loading Applicant Data
            </h4>
            <p>{error}</p>
            <hr />
            <p className="mb-0">
              Please try refreshing the page or go back.
              <Button color="link" onClick={() => navigate(-1)} className="ms-2">Go Back</Button>
            </p>
          </Alert>
        </Container>
      </div>
    );
  }
  
  // --- No Applicant Data State ---
  if (!loading && !applicantData && !error) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="warning" className="text-center">
            <h4 className="alert-heading">
                <FeatherIcon icon="info" className="me-2" /> No Applicant Data Found
            </h4>
            <p>No information found for Applicant ID: <strong>{applicantId}</strong>.</p>
             <Button color="link" onClick={() => navigate(-1)}>Go Back to List</Button>
          </Alert>
        </Container>
      </div>
    );
  }

  // --- Reusable UI Components (Keep these as they are) ---
  const SectionWrapper = ({ title, icon, children, iconColor = "primary" }) => (
    <Card className="shadow-sm mb-4">
      <CardHeader className="bg-light py-3">
        <h4 className="mb-0 card-title d-flex align-items-center">
          {icon && <FeatherIcon icon={icon} className={`me-2 text-${iconColor}`} />}
          {title}
        </h4>
      </CardHeader>
      <CardBody className="p-4">
        {children}
      </CardBody>
    </Card>
  );

  const DetailItem = ({ label, value,icon, colProps = { md: 6, lg: 4 }, isCurrency = false, isDate = false, isBadge = false, badgeColor = "secondary" }) => (
    <Col {...colProps} className="mb-3">
      <div className="detail-item">
        <small className="text-muted d-block">
        {icon && <FeatherIcon icon={icon} size={14} className="me-1 text-muted" />}
        {label}
        </small>
        {isBadge ? (
          <Badge color={badgeColor} pill>{value || 'N/A'}</Badge>
        ) : (
          <p className="fw-bold mb-0">
            {isCurrency && typeof value === 'number' ? `₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
             : isDate ? formatDate(value)
             : (value || 'N/A')}
          </p>
        )}
      </div>
    </Col>
  );
  // --- End Reusable UI Components ---

  return (
    <div className="page-content">
      <Container fluid>
        {/* General page error (e.g., if loan fetch failed but applicant data exists) */}
        {error && applicantData && (
             <Alert color="warning" className="text-center">
                <FeatherIcon icon="alert-circle" className="me-2" /> {error}
            </Alert>
        )}

        {applicantData && (
            <>
                {/* Back Button and Page Title */}
                <Row className="mb-4 align-items-center">
                  <Col xs="auto">
                    <Button color="light" onClick={() => navigate(-1)} className="border shadow-sm">
                      <FeatherIcon icon="arrow-left" size="16" className="me-1" />
                      Back
                    </Button>
                  </Col>
                  <Col>
                    <h2 className="mb-0 text-primary">
                      <FeatherIcon icon="file-text" className="me-2" /> Applicant & Loan Overview
                    </h2>
                  </Col>
                  <Col xs="auto">
                    <Badge
                        color={applicantData.is_deleted ? "danger" : (applicantData.is_approved ? "success" : "warning")}
                        className="px-3 py-2 fs-6 shadow-sm"
                        pill
                    >
                        <FeatherIcon
                            icon={applicantData.is_deleted ? "trash-2" : (applicantData.is_approved ? "check-circle" : "clock")}
                            size="14" className="me-1"
                        />
                        Status: {applicantData.is_deleted ? "Deleted" : (applicantData.is_approved ? "Approved" : "Pending")}
                    </Badge>
                  </Col>
                </Row>

                {/* Main Summary Card */}
                <Card className="shadow-lg mb-4 border-0 overflow-hidden">
                  <CardBody className="p-0">
                    <Row className="g-0">
                      <Col md={3} className="text-center bg-light p-4 d-flex flex-column align-items-center justify-content-center border-end">
                        {applicantData.profile_photo ? (
                          <img
                            src={applicantData.profile_photo} // Assuming this is a full URL
                            alt={`${applicantData.first_name} ${applicantData.last_name}`}
                            className="img-fluid rounded-circle shadow-sm mb-3"
                            style={{ width: '130px', height: '130px', objectFit: 'cover', border: '4px solid white' }}
                            onError={(e) => { e.target.src="https://via.placeholder.com/130?text=No+Photo"; }}
                          />
                        ) : (
                          <div className="bg-white text-secondary d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3 shadow-sm"
                               style={{ width: '130px', height: '130px', fontSize: '3.5rem', border: '4px solid white' }}>
                            <FeatherIcon icon="user" />
                          </div>
                        )}
                         <h4 className="mb-1">{`${getTitle(applicantData.title)} ${applicantData.first_name || ''} ${applicantData.last_name || ''}`.trim()}</h4>
                         <p className="text-muted mb-0">{applicantData.userID || 'N/A'}</p>
                      </Col>
                      <Col md={9} className="p-4">
                          <h5 className="mb-3 text-primary">Key Information</h5>
                          <Row>
                              <DetailItem label="Email" value={applicantData.email} colProps={{md:6, lg:6}} icon="mail"/>
                              <DetailItem label="Phone" value={applicantData.phone} colProps={{md:6, lg:6}} icon="phone"/>
                              <DetailItem label="Date of Birth" value={applicantData.dateOfBirth} isDate icon="calendar"  />
                              <DetailItem label="Gender" value={getGender(applicantData.gender)} icon="users" />
                              <DetailItem label="Marital Status" value={getMaritalStatus(applicantData.maritalStatus)} icon="heart"/>
                              <Col md={12} className="mt-2">
                                   <small className="text-muted d-block"> <FeatherIcon icon="map-pin" size="14" className="me-1 text-muted" /> Address</small>
                                   <p className="fw-semibold mb-0">
                                      {`${applicantData.address || ''}, ${applicantData.city || ''}, ${applicantData.state || ''} - ${applicantData.postalCode || ''}`}
                                   </p>
                              </Col>
                          </Row>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>

                {/* Personal & Contact Details */}
                <SectionWrapper title="Personal & Contact Details" icon="user" iconColor="primary">
                    <Row>
                        <DetailItem label="Applicant ID" value={applicantData.userID} />
                        <DetailItem label="Full Name" value={`${getTitle(applicantData.title)} ${applicantData.first_name || ''} ${applicantData.last_name || ''}`.trim()} />
                        {/* <DetailItem label="Username (if applicable)" value={applicantData.username} /> */}
                        <DetailItem label="Date of Birth" value={applicantData.dateOfBirth} isDate />
                        <DetailItem label="Gender" value={getGender(applicantData.gender)} />
                        <DetailItem label="Marital Status" value={getMaritalStatus(applicantData.maritalStatus)} />
                        <DetailItem label="Email Address" value={applicantData.email} colProps={{md:6}} icon="mail" />
                        <DetailItem label="Phone Number" value={applicantData.phone} colProps={{md:6}} icon="phone"/>
                        <Col md={12}>
                            <small className="text-muted d-block">Full Address</small>
                            <p className="fw-bold mb-0">
                                {`${applicantData.address || ''}, ${applicantData.city || ''}, ${applicantData.state || ''} - ${applicantData.postalCode || ''}`}
                            </p>
                        </Col>
                    </Row>
                </SectionWrapper>

                {/* Employment Information */}
                {applicantData.employment && applicantData.employment.length > 0 && (
                    <SectionWrapper title="Employment Information" icon="briefcase" iconColor="success">
                        {applicantData.employment.map((emp, index) =>(
                            <div key={index} className={applicantData.employment.length > 1 && index < applicantData.employment.length -1 ? "mb-4 pb-4 border-bottom" : ""}>
                                {applicantData.employment.length > 1 && <h6 className="text-muted mb-3">Employment Record {index + 1}</h6>}
                                <Row>
                                    <DetailItem label="Employment Type" value={getEmploymentType(emp.employmentType)} />
                                    <DetailItem label="Job Title" value={emp.jobTitle} />
                                    <DetailItem label="Years with Employer" value={emp.yearsWithEmployer ? `${emp.yearsWithEmployer} yrs` : 'N/A'} />
                                    <DetailItem label="Monthly Income" value={emp.monthlyIncome} isCurrency />
                                    <DetailItem label="Other Income" value={emp.otherIncome} isCurrency />
                                    <DetailItem
                                        label="Total Monthly Income"
                                        value={(parseFloat(emp.monthlyIncome || 0) + parseFloat(emp.otherIncome || 0))}
                                        isCurrency
                                    />
                                </Row>
                            </div>
                        ))}
                    </SectionWrapper>
                )}

                {/* Property Details */}
                {applicantData.properties && applicantData.properties.length > 0 && (
                    <SectionWrapper title="Property Details" icon="home" iconColor="warning">
                        {applicantData.properties.map((prop, index) =>(
                             <div key={index} className={applicantData.properties.length > 1 && index < applicantData.properties.length -1 ? "mb-4 pb-4 border-bottom" : ""}>
                                {applicantData.properties.length > 1 && <h6 className="text-muted mb-3">Property {index + 1}</h6>}
                                <Row>
                                    <DetailItem label="Property Type" value={getPropertyType(prop.propertyType)} />
                                    <DetailItem label="Property Address" value={prop.property_address} colProps={{md:6, lg:8}} />
                                    <DetailItem label="Property Value" value={prop.propertyValue} isCurrency />
                                    <DetailItem label="Property Age" value={prop.propertyAge ? `${prop.propertyAge} yrs` : 'N/A'} />
                                    <DetailItem label="Ownership" value={getPropertyOwnership(prop.propertyOwnership)} />
                                    {prop.remarks && <DetailItem label="Remarks" value={prop.remarks} colProps={{md:12}} />}
                                </Row>
                            </div>
                        ))}
                    </SectionWrapper>
                )}

                {/* Banking Information */}
                {applicantData.banking_details && applicantData.banking_details.length > 0 && (
                    <SectionWrapper title="Banking Information" icon="credit-card" iconColor="info">
                         {applicantData.banking_details.map((bank, index) =>(
                             <div key={index} className={applicantData.banking_details.length > 1 && index < applicantData.banking_details.length -1 ? "mb-4 pb-4 border-bottom" : ""}>
                                {applicantData.banking_details.length > 1 && <h6 className="text-muted mb-3">Bank Account {index + 1}</h6>}
                                <Row>
                                    <DetailItem label="Account Holder Name" value={bank.accountHolderName} />
                                    <DetailItem label="Account Number" value={bank.accountNumber} />
                                    <DetailItem label="Bank Name" value={bank.bankName} />
                                    <DetailItem label="IFSC Code" value={bank.ifscCode} />
                                    <DetailItem label="Bank Branch" value={bank.bankBranch} />
                                    <DetailItem label="Account Type" value={getAccountType(bank.accountType)} />
                                </Row>
                            </div>
                        ))}
                    </SectionWrapper>
                )}

                {/* Identification Documents */}
                {applicantData.proofs && applicantData.proofs.length > 0 && (
                    <SectionWrapper title="Identification Documents" icon="shield" iconColor="danger">
                        <Row className="g-3">
                        {applicantData.proofs.map((proof, index) => (
                            <Col md={6} lg={4} key={proof.id || index}>
                                <Card className="h-100 shadow-sm border">
                                    <CardBody className="text-center p-3">
                                    <h6 className="text-capitalize text-primary mb-2">{getProofType(proof.type) || proof.type}</h6>
                                    {(proof.file || proof.document_file_url) ? (
                                        <a href={proof.document_file_url || proof.file} target="_blank" rel="noopener noreferrer" className="d-block mb-2">
                                        <img
                                            src={proof.document_file_url || proof.file} // Assuming this is a full URL
                                            alt={getProofType(proof.type) || proof.type}
                                            className="img-fluid rounded"
                                            style={{maxHeight: '100px', border: '1px solid #eee', objectFit: 'contain'}}
                                            onError={(e) => { e.target.src="https://via.placeholder.com/120x80?text=No+Preview"; }}
                                        />
                                        </a>
                                    ) : (
                                        <div className="bg-light d-flex align-items-center justify-content-center rounded mb-2" style={{height: '100px', border: '1px dashed #ccc'}}>
                                            <FeatherIcon icon="image" size="30" className="text-muted"/>
                                        </div>
                                    )}
                                    <p className="mb-1"><small className="text-muted">ID No:</small> <strong>{proof.idNumber || 'N/A'}</strong></p>
                                    {(proof.file || proof.document_file_url) &&
                                        <Button
                                            color="outline-primary"
                                            size="sm"
                                            href={proof.document_file_url || proof.file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 w-100"
                                        >
                                            <FeatherIcon icon="external-link" size={14} className="me-1"/> View Document
                                        </Button>
                                    }
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                        </Row>
                    </SectionWrapper>
                )}
            </>
        )}

        {/* --- Loan Related Sections --- */}
        {/* Loan data load aagum bodhu kaatradhukku (applicantData irundha mattum) */}
        {loading && applicantData && <div className="text-center my-3"><Spinner size="sm" className="me-2" />Loading loan details...</div>}

        {/* Applicant data irundhu, loan data illaati (active loan illaati), error um illaati */}
        {!loading && applicantData && !loanData && !error && (
            <SectionWrapper title="Active Loan Status" icon="dollar-sign" iconColor="secondary">
                <Alert color="info" className="text-center m-0">
                    <FeatherIcon icon="info" className="me-2" />
                    No active loan application found for this applicant at the moment.
                </Alert>
            </SectionWrapper>
        )}

        {/* Loan data sariyaa vandha mattum Loan Summary kaatunga */}
        {loanData && loanData.loanID && (
            <SectionWrapper title="Current Active Loan Summary" icon="dollar-sign" iconColor="purple">
                <Row>
                    <DetailItem label="Loan ID" value={loanData.loanID} />
                    <DetailItem label="Loan Amount" value={loanData.amount} isCurrency />
                    <DetailItem label="Term" value={`${loanData.term || ''} ${getTermType(loanData.termType)}`} />
                    <DetailItem label="Interest Rate" value={loanData.interestRate ? `${loanData.interestRate}%` : 'N/A'} />
                    <DetailItem label="Purpose of Loan" value={getPurpose(loanData.purpose)} />
                    <DetailItem label="Repayment Source" value={loanData.repaymentSource} />
                    <DetailItem label="Loan Start Date" value={loanData.startDate} isDate />
                    <DetailItem label="Loan Registration Date" value={loanData.LoanRegDate} isDate />
                </Row>
                {loanData.remarks && (
                    <Row className="mt-3">
                        <Col>
                            <small className="text-muted d-block">Remarks/Notes</small>
                            <p className="fw-semibold mb-0 bg-light p-3 rounded border">{loanData.remarks}</p>
                        </Col>
                    </Row>
                )}
                {/* Agreements and Translator Info - Unga original code la irundha maari ingayum serthukonga */}
            </SectionWrapper>
        )}

        {/* Nominees Section */}
        {loanData && loanData.loanID && (
            <SectionWrapper title="Nominee Details (Current Active Loan)" icon="users" iconColor="dark">
                {loanData.nominees && loanData.nominees.length > 0 ? (
                    loanData.nominees.map((nominee, index) => (
                        <Card key={nominee.id || index} className={`mb-3 shadow-none border ${index < loanData.nominees.length - 1 ? "mb-3" : ""}`}>
                            <CardBody>
                                <Row className="align-items-center">
                                    <Col md={2} className="text-center mb-3 mb-md-0">
                                        {nominee.profile_photo ? ( // Assuming nominee.profile_photo is a full URL
                                            <img src={nominee.profile_photo} alt={nominee.name} className="img-fluid rounded-circle" style={{width: '80px', height: '80px', objectFit: 'cover'}} onError={(e) => { e.target.src="https://via.placeholder.com/80?text=N"; }}/>
                                        ) : (
                                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{width: '80px', height: '80px'}}>
                                                <FeatherIcon icon="user" size="30" className="text-muted"/>
                                            </div>
                                        )}
                                    </Col>
                                    <Col md={10}>
                                        <h5 className="mb-1 text-primary">{nominee.name || 'N/A'}</h5>
                                        <Row>
                                            <DetailItem label="Relationship" value={getRelationship(nominee.relationship)} colProps={{md:6, lg:3}}/>
                                            <DetailItem label="Phone" value={nominee.phone} colProps={{md:6, lg:3}}/>
                                            <DetailItem label="Email" value={nominee.email} colProps={{md:6, lg:3}}/>
                                            <DetailItem label="ID Proof" value={`${getProofType(nominee.idProofType) || nominee.idProofType}: ${nominee.idProofNumber || ''}`} colProps={{md:6, lg:3}}/>
                                            <Col md={12} className="mt-1">
                                                <small className="text-muted">Address:</small>
                                                <p className="fw-semibold small mb-2">{nominee.address || 'N/A'}</p>
                                            </Col>
                                            {(nominee.id_proof_file || nominee.profile_photo) &&
                                                <Col md={12} className="mt-1">
                                                    {nominee.id_proof_file &&
                                                        <Button outline color="info" size="sm" href={nominee.id_proof_file} target="_blank" rel="noopener noreferrer" className="me-2">
                                                            <FeatherIcon icon="file-text" size={14} className="me-1"/> View ID File
                                                        </Button>}
                                                    {nominee.profile_photo &&
                                                        <Button outline color="info" size="sm" href={nominee.profile_photo} target="_blank" rel="noopener noreferrer">
                                                            <FeatherIcon icon="image" size={14} className="me-1"/> View Nominee Photo
                                                        </Button>}
                                                </Col>
                                            }
                                        </Row>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    ))
                ) : (
                    <p className="text-muted text-center m-0">No nominees added for this loan.</p>
                )}
            </SectionWrapper>
        )}

        {/* EMI Schedule Section */}
        {loanData && loanData.loanID && (
             <SectionWrapper title="EMI Payment Schedule (Current Active Loan)" icon="calendar" iconColor="teal">
                {loanData.emiSchedule && loanData.emiSchedule.length > 0 ? (
                    <>
                        <div className="table-responsive mb-4">
                        <Table hover striped responsive className="mb-0">
                            <thead className="table-light">
                            <tr>
                                <th>Month</th>
                                <th>Payment Date</th>
                                <th className="text-end">EMI Amount</th>
                                <th className="text-end">Principal</th>
                                <th className="text-end">Interest</th>
                                <th className="text-end">Balance</th>
                                <th className="text-center">Status</th>
                                <th className="text-end">Pending Amt</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loanData.emiSchedule.sort((a, b) => a.month - b.month).map((emi, index) => (
                                <tr key={index}>
                                <td className="fw-medium">{emi.month}</td>
                                <td>{formatDate(emi.emiStartDate)}</td>
                                <td className="text-end">₹{parseFloat(emi.emiTotalMonth || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                <td className="text-end">₹{parseFloat(emi.principalPaid || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                <td className="text-end">₹{parseFloat(emi.interest || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                <td className="text-end fw-semibold">
                                    <span className={parseFloat(emi.remainingBalance || 0) > 0 ? 'text-danger' : 'text-success'}>
                                    ₹{parseFloat(emi.remainingBalance || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                                    </span>
                                </td>
                                <td className="text-center">
                                    {parseFloat(emi.paymentAmount || 0) >= parseFloat(emi.emiTotalMonth || 0) ? ( // Full or more payment
                                        <Badge color="success" pill><FeatherIcon icon="check-circle" size={12} className="me-1"/> Paid</Badge>
                                    ) : parseFloat(emi.paymentAmount || 0) > 0 ? ( // Partial payment
                                        <Badge color="primary" pill><FeatherIcon icon="alert-circle" size={12} className="me-1"/> Partially Paid</Badge>
                                    ) : new Date(emi.emiStartDate) < new Date() ? ( // Overdue
                                        <Badge color="danger" pill><FeatherIcon icon="alert-triangle" size={12} className="me-1"/> Overdue</Badge>
                                    ) : ( // Pending
                                        <Badge color="warning" pill className="text-dark"><FeatherIcon icon="clock" size={12} className="me-1"/> Pending</Badge>
                                    )}
                                </td>
                                <td className="text-end fw-semibold">
                                    <Badge 
                                        color={parseFloat(emi.pendingAmount !== undefined ? emi.pendingAmount : (emi.emiTotalMonth || 0)) > 0 ? 'danger-lighten' : 'success-lighten'}
                                        className={parseFloat(emi.pendingAmount !== undefined ? emi.pendingAmount : (emi.emiTotalMonth || 0)) > 0 ? 'text-danger' : 'text-success'} pill>
                                    ₹{parseFloat(emi.pendingAmount !== undefined ? emi.pendingAmount : (emi.emiTotalMonth || 0)).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                                    </Badge>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        </div>
                        {/* EMI Summary Cards */}
                        <Row className="g-3">
                            {/* ... (unga existing EMI Summary Cards JSX) ... */}
                        </Row>
                    </>
                ) : (
                    <p className="text-muted text-center m-0">EMI schedule is not available for this loan.</p>
                )}
            </SectionWrapper>
        )}

        {/* Action Buttons */}
        <div className="text-center mt-5 mb-3">
            <Button color="outline-secondary" onClick={() => window.print()} className="me-2 shadow-sm">
                <FeatherIcon icon="printer" className="me-1" /> Print Page
            </Button>
            <Button color="primary" onClick={() => navigate(-1)} className="shadow-sm">
                <FeatherIcon icon="arrow-left" className="me-1" /> Back to Previous
            </Button>
        </div>

      </Container>
    </div>
  );
};

export default Applicantstatusview;