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
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FeatherIcon from "feather-icons-react";

// Helper function to calculate loan summary figures
const calculateLoanSummary = (currentLoanData) => {
    let totalPaid = 0;
    let totalPending = 0;
    let paidEmis = 0;
    let totalEmiAmount = 0;
    let totalPrincipalPaid = 0; 

    const emiSchedule = currentLoanData?.emiSchedule;

    if (!emiSchedule || emiSchedule.length === 0) {
        return { totalPaid, totalPending, paidEmis, totalEmiAmount, totalPrincipalPaid };
    }

    emiSchedule.forEach((emi) => {
      totalPaid += parseFloat(emi.paymentAmount || 0);
      // Directly use backend provided pendingAmount. This is what Loanpayment.js would save.
      totalPending += parseFloat(emi.pendingAmount || 0); 
      totalEmiAmount += parseFloat(emi.emiTotalMonth || 0);
      // Directly use backend provided principalPaid. This is what Loanpayment.js would save.
      totalPrincipalPaid += parseFloat(emi.principalPaid || 0); 

      // Paid EMI condition consistent with Loanpayment.js
      if (
        emi.paymentAmount &&
        parseFloat(emi.paymentAmount) > 0 && // Some payment was made for this EMI
        parseFloat(emi.pendingAmount || 0) === 0 // And the pending amount for this EMI is zero
      ) {
        paidEmis++;
      }
    });

    return {
      totalPaid,
      totalPending, // This can be negative if total overpayment for EMIs > total underpayment
      paidEmis,
      totalEmiAmount,
      totalPrincipalPaid, // This is the sum of 'principalPaid' fields from each emiSchedule item
    };
};


const Applicantstatusview = () => {
  const { applicantId } = useParams();
  const navigate = useNavigate();

  const [applicantData, setApplicantData] = useState(null);
  const [loanData, setLoanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Helper Functions ---
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
    const types = { "1": "Owned", "2": "Mortgaged" };
    return types[String(value)] || value || 'N/A';
  };
  const getAccountType = (value) => {
    const types = { "1": "Savings Account", "2": "Current Account", "3": "Salary Account", "4": "Fixed Deposit Account" };
    return types[String(value)] || value || 'N/A';
  };
  const getRelationship = (value) => {
    const relationships = { "1": "Spouse", "2": "Parent", "3": "Child", "4": "Sibling", "5": "Other" };
    return relationships[String(value)] || value || 'N/A';
  };
  const getProofType = (value) => {
    const types = {
        'pan': 'PAN Card',
        'aadhar': 'Aadhar Card',
        'voterid': 'Voter ID', 
        'drivinglicense': 'Driving License',
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
      const applicantApiUrl = `${API_BASE_URL}api/applicants/applicants/${applicantId}/`;
      const applicantResponse = await axios.get(applicantApiUrl, { headers });
      const fetchedApplicantData = applicantResponse.data;
      
      setApplicantData({
        ...fetchedApplicantData,
        employment: Array.isArray(fetchedApplicantData.employment) ? fetchedApplicantData.employment : [],
        properties: Array.isArray(fetchedApplicantData.properties) ? fetchedApplicantData.properties : [],
        banking_details: Array.isArray(fetchedApplicantData.banking_details) ? fetchedApplicantData.banking_details : [],
        proofs: Array.isArray(fetchedApplicantData.ApplicantProof) ? fetchedApplicantData.ApplicantProof : (Array.isArray(fetchedApplicantData.proofs) ? fetchedApplicantData.proofs : [])
      });

      if (fetchedApplicantData.userID) { 
        const latestLoanApiUrl = `${API_BASE_URL}api/loan-applications/loan-applications/?applicant_record__userID=${fetchedApplicantData.userID}&ordering=-LoanRegDate`;
        try {
            const loanResponse = await axios.get(latestLoanApiUrl, { headers });
            const loansArray = loanResponse.data.results || loanResponse.data; 

            if (Array.isArray(loansArray) && loansArray.length > 0) {
                const latestLoan = loansArray[0];
                setLoanData({
                    ...latestLoan,
                    nominees: Array.isArray(latestLoan.nominees) ? latestLoan.nominees : [],
                    emiSchedule: Array.isArray(latestLoan.emiSchedule) ? latestLoan.emiSchedule : []
                });
            } else {
                console.log("No loan applications found for applicant userID:", fetchedApplicantData.userID);
                setLoanData(null);
            }
        } catch (loanFetchError) {
            console.error("Error fetching LATEST loan for applicant:", loanFetchError);
            // Store the error specific to loan fetching if applicant data was successful
            if(fetchedApplicantData){ // if applicant data is there, show it, but with loan error
                setError( prevError => prevError ? `${prevError} Additionally, could not fetch loan details.` : `Could not fetch loan details for applicant ${fetchedApplicantData.userID}.`);
                toast.warn(`Could not fetch loan details for applicant ${fetchedApplicantData.userID}.`);
            } else { // if applicant data also failed, this error might be masked by the main catch
                 setError("Error fetching loan details.");
            }
            setLoanData(null); 
        }
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

  if (loading && !applicantData) {
    return (
      <div className="page-content d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner color="primary" style={{ width: '3rem', height: '3rem' }}>Loading...</Spinner>
        <p className="ms-3 fs-5">Fetching Application Details...</p>
      </div>
    );
  }

  if (error && !applicantData) { // Only show full page error if applicant data itself fails
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

  const SectionWrapper = ({ title, icon, children, iconColor = "primary", cardClassName = "shadow-sm mb-4" }) => (
    <Card className={cardClassName}>
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
            {isCurrency && (value !== null && value !== undefined && !isNaN(parseFloat(value))) ? `₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
             : isDate ? formatDate(value)
             : (value || 'N/A')}
          </p>
        )}
      </div>
    </Col>
  );

  return (
    <div className="page-content">
      <Container fluid>
        {/* Display error related to loan fetching here if applicant data loaded */}
        {error && applicantData && error.includes("loan details") && ( 
             <Alert color="warning" className="text-center my-3">
                <FeatherIcon icon="alert-circle" className="me-2" /> {error}
            </Alert>
        )}

        {applicantData && (
            <>
                <Row className="mb-4 align-items-center">
                  <Col xs="auto">
                    <Button color="light" onClick={() => navigate(-1)} className="border shadow-sm">
                      <FeatherIcon icon="arrow-left" size="16" className="me-1" />
                      Back
                    </Button>
                  </Col>
                  <Col>
                    <h2 className="mb-0 text-primary">
                      <FeatherIcon icon="user-check" className="me-2" /> Applicant Status Overview
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
                        Applicant: {applicantData.is_deleted ? "Deleted" : (applicantData.is_approved ? "Approved Profile" : "Pending Profile")}
                    </Badge>
                  </Col>
                </Row>

                <Card className="shadow-lg mb-4 border-0 overflow-hidden">
                  <CardBody className="p-0">
                    <Row className="g-0">
                      <Col md={3} className="text-center bg-light p-4 d-flex flex-column align-items-center justify-content-center border-end">
                        {applicantData.profile_photo ? (
                          <img
                            src={applicantData.profile_photo}
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

                <SectionWrapper title="Personal & Contact Details" icon="user" iconColor="primary">
                    <Row>
                        <DetailItem label="Applicant ID" value={applicantData.userID} />
                        <DetailItem label="Full Name" value={`${getTitle(applicantData.title)} ${applicantData.first_name || ''} ${applicantData.last_name || ''}`.trim()} />
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

                {applicantData.employment && applicantData.employment.length > 0 && (
                    <SectionWrapper title="Employment Information" icon="briefcase" iconColor="success">
                        {applicantData.employment.map((emp, index) =>(
                            <div key={emp.id || index} className={applicantData.employment.length > 1 && index < applicantData.employment.length -1 ? "mb-4 pb-4 border-bottom" : ""}>
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

                {applicantData.properties && applicantData.properties.length > 0 && (
                    <SectionWrapper title="Property Details" icon="home" iconColor="warning">
                        {applicantData.properties.map((prop, index) =>(
                             <div key={prop.id || index} className={applicantData.properties.length > 1 && index < applicantData.properties.length -1 ? "mb-4 pb-4 border-bottom" : ""}>
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

                {applicantData.banking_details && applicantData.banking_details.length > 0 && (
                    <SectionWrapper title="Banking Information" icon="credit-card" iconColor="info">
                         {applicantData.banking_details.map((bank, index) =>(
                             <div key={bank.id || index} className={applicantData.banking_details.length > 1 && index < applicantData.banking_details.length -1 ? "mb-4 pb-4 border-bottom" : ""}>
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

                {applicantData.proofs && applicantData.proofs.length > 0 && (
                    <SectionWrapper title="Identification Documents" icon="shield" iconColor="danger">
                        <Row className="g-3">
                        {applicantData.proofs.map((proof, index) => (
                            <Col md={6} lg={4} key={proof.id || index}>
                                <Card className="h-100 shadow-sm border">
                                    <CardBody className="text-center p-3">
                                    <h6 className="text-capitalize text-primary mb-2">{getProofType(proof.type) || proof.type}</h6>
                                    {proof.file ? (
                                        <a href={proof.file} target="_blank" rel="noopener noreferrer" className="d-block mb-2">
                                        <img
                                            src={proof.file}
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
                                    {proof.file &&
                                        <Button
                                            color="outline-primary"
                                            size="sm"
                                            href={proof.file}
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
        {loading && applicantData && !loanData && <div className="text-center my-3"><Spinner size="sm" className="me-2" />Loading loan details...</div>}

        {loanData && (
            <SectionWrapper title="Loan Application Status" icon="info" iconColor="primary" cardClassName="shadow-lg mt-4 border-info">
                <Row>
                    <Col md={12} className="mb-3">
                        <h5 className="mb-1">Current Loan Status:
                            <Badge
                                color={
                                    loanData.status === 'REJECTED' ? 'danger' :
                                    loanData.status === 'APPROVED' ? 'success' :
                                    loanData.status === 'ACTIVE' ? 'success' :
                                    loanData.status === 'MANAGER_APPROVED' ? 'info' :
                                    loanData.status === 'PENDING' ? 'warning' :
                                    'secondary'
                                }
                                pill
                                className={`ms-2 fs-6 ${loanData.status === 'PENDING' ? 'text-dark' : ''}`}
                            >
                                {loanData.status ? loanData.status.replace(/_/g, ' ') : 'N/A'}
                            </Badge>
                        </h5>
                        {loanData.loanID && <p className="text-muted mb-0">Loan ID: {loanData.loanID}</p>}
                    </Col>
                </Row>

                {loanData.manager_remarks && (
                    <Row className="mb-3">
                        <Col>
                            <strong className="text-muted d-block mb-1">
                                <FeatherIcon icon="message-square" size={16} className="me-1"/>Manager Remarks:
                            </strong>
                            <p className="bg-light p-3 rounded border fst-italic mb-0">{loanData.manager_remarks}</p>
                        </Col>
                    </Row>
                )}

                {loanData.admin_remarks && (
                    <Row className="mb-3">
                        <Col>
                            <strong className="text-muted d-block mb-1">
                                <FeatherIcon icon="edit" size={16} className="me-1"/>Admin Remarks:
                            </strong>
                            <p className="bg-light p-3 rounded border fst-italic mb-0">{loanData.admin_remarks}</p>
                        </Col>
                    </Row>
                )}

                {loanData.status === 'PENDING' && (
                    <Alert color="warning" className="mt-2">This loan application is currently pending approval.</Alert>
                )}
                {loanData.status === 'MANAGER_APPROVED' && !loanData.admin_remarks && (
                    <Alert color="info" className="mt-2">This loan has been approved by the manager and is awaiting final admin review.</Alert>
                )}
                 {loanData.status === 'APPROVED' && (
                     <Alert color="success" className="mt-2">This loan application has been fully approved.</Alert>
                )}
                {loanData.status === 'ACTIVE' && (
                     <Alert color="success" className="mt-2">This loan is currently active.</Alert>
                )}
                {loanData.status === 'REJECTED' && (
                     <Alert color="danger" className="mt-2">This loan application has been rejected.</Alert>
                )}
            </SectionWrapper>
        )}
        
        {!loading && applicantData && !loanData && error && error.includes("Could not fetch loan details") && ( 
             <SectionWrapper title="Loan Information" icon="dollar-sign" iconColor="secondary">
                <Alert color="danger" className="text-center m-0">
                    <FeatherIcon icon="alert-triangle" className="me-2" />
                    {error}
                </Alert>
            </SectionWrapper>
        )}

        {!loading && applicantData && !loanData && (!error || !error.includes("Could not fetch loan details")) && (
            <SectionWrapper title="Loan Information" icon="dollar-sign" iconColor="secondary">
                <Alert color="info" className="text-center m-0">
                    <FeatherIcon icon="info" className="me-2" />
                    No loan applications found for this applicant.
                </Alert>
            </SectionWrapper>
        )}

        {loanData && (
            <SectionWrapper title={loanData.status === 'ACTIVE' ? "Current Active Loan Summary" : "Loan Application Summary"} icon="dollar-sign" iconColor="purple">
                <Row>
                    <DetailItem label="Loan ID" value={loanData.loanID} />
                    <DetailItem label="Loan Amount" value={loanData.amount} isCurrency />
                    <DetailItem label="Term" value={`${loanData.term || ''} ${loanData.termType || ''}`} />
                    <DetailItem label="Interest Rate" value={loanData.interestRate ? `${loanData.interestRate}%` : 'N/A'} />
                    <DetailItem label="Purpose of Loan" value={loanData.purpose || 'N/A'} />
                    <DetailItem label="Repayment Source" value={loanData.repaymentSource} />
                    <DetailItem label="Loan Start Date" value={loanData.startDate} isDate />
                    <DetailItem label="Loan Registration Date" value={loanData.LoanRegDate} isDate />
                </Row>
                {loanData.remarks && ( 
                    <Row className="mt-3">
                        <Col>
                            <small className="text-muted d-block">Application Remarks/Notes</small>
                            <p className="fw-semibold mb-0 bg-light p-3 rounded border">{loanData.remarks}</p>
                        </Col>
                    </Row>
                )}
            </SectionWrapper>
        )}

        {loanData && (
            <SectionWrapper title={loanData.status === 'ACTIVE' ? "Nominee Details (Current Active Loan)" : "Nominee Details (Loan Application)"} icon="users" iconColor="dark">
                {loanData.nominees && loanData.nominees.length > 0 ? (
                    loanData.nominees.map((nominee, index) => (
                        <Card key={nominee.id || index} className={`mb-3 shadow-none border ${index < loanData.nominees.length - 1 ? "mb-3" : ""}`}>
                            <CardBody>
                                <Row className="align-items-center">
                                    <Col md={2} className="text-center mb-3 mb-md-0">
                                        {nominee.profile_photo ? (
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

       
       {loanData && (loanData.status === 'ACTIVE' || loanData.status === 'APPROVED') && (
             <SectionWrapper 
                title={
                    loanData.status === 'ACTIVE' 
                    ? "EMI Payment Schedule & Summary (Active Loan)" 
                    : "EMI Payment Schedule & Summary (Approved Loan)"
                } 
                icon="calendar" 
                iconColor="teal" 
             >
                {loanData.emiSchedule && loanData.emiSchedule.length > 0 ? (
                    <>
                        <div className="table-responsive mb-4">
                        <Table hover striped responsive className="mb-0 align-middle"> 
                            <thead className="table-light">
                            <tr>
                                <th>EMI No.</th>
                                <th>Due Date</th>
                                <th className="text-end">EMI Amount (₹)</th>
                                <th className="text-end">Interest (₹)</th>
                                <th className="text-end">Principal (₹)</th>
                                <th className="text-end">Balance (₹)</th>
                                <th className="text-end">Pending Amount (₹)</th>
                                <th className="text-end">Payment Amount (₹)</th> 
                            </tr>
                            </thead>
                            <tbody>
                            {loanData.emiSchedule.sort((a, b) => (a.month || 0) - (b.month || 0)).map((emi, index) => {
                                
                                const paymentAmount = parseFloat(emi.paymentAmount || 0);
                                const emiTotalMonth = parseFloat(emi.emiTotalMonth || 0);
                                
                                let pendingAmountValue;
                                if (emi.pendingAmount !== undefined && emi.pendingAmount !== null && emi.pendingAmount !== "") {
                                    pendingAmountValue = parseFloat(emi.pendingAmount);
                                } else {
                                    pendingAmountValue = Math.max(0, emiTotalMonth - paymentAmount);
                                }
                                return (
                                <tr key={emi.id || index}>
                                    <td className="fw-medium">{emi.month}</td>
                                    <td>{formatDate(emi.emiStartDate)}</td>
                                    <td className="text-end">₹{emiTotalMonth.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                    <td className="text-end">₹{parseFloat(emi.interest || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                    <td className="text-end">₹{parseFloat(emi.principalPaid || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                    <td className="text-end fw-semibold">
                                        <span className={parseFloat(emi.remainingBalance || 0) > 0 ? 'text-danger' : 'text-success'}>
                                        ₹{parseFloat(emi.remainingBalance || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                        </span>
                                    </td>
                                  
                                    <td className="text-end fw-semibold">
                                        <Badge 
                                            color={pendingAmountValue > 0 ? 'danger-lighten' : (emiTotalMonth > 0 ? 'success-lighten' : 'light')}
                                            className={pendingAmountValue > 0 ? 'text-danger' : (emiTotalMonth > 0 ? 'text-success' : 'text-muted')} pill>
                                        ₹{pendingAmountValue.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                        </Badge>
                                    </td>
                                      <td className="text-end">
                                        ₹{paymentAmount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                    </td>
                                </tr>
                                );
                            })}
                            </tbody>
                        </Table>
                        </div>
                        
                        {/* PAYMENT SUMMARY SECTION STARTS HERE */}
                        <div className="mt-4 pt-4 border-top">
                            <h5 className="mb-3 d-flex align-items-center">
                                <FeatherIcon icon="bar-chart-2" className="me-2 text-primary" /> Payment Summary
                            </h5>
                            <Row className="g-3">
                            {(() => {
                                const summary = calculateLoanSummary(loanData);
                                const formatCurrency = (value) => value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                                return (
                                <>
                                    <Col md={4}>
                                    <div className="p-3 bg-success bg-opacity-10 rounded border border-success">
                                        <div className="d-flex align-items-center">
                                        <div className="me-3"> 
                                            <span className="avatar-title bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height:'40px'}}>
                                            <FeatherIcon icon="check-circle" size="20" />
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-muted mb-1">Total Paid</p>
                                            <h5 className="mb-0 text-success">
                                            ₹{formatCurrency(summary.totalPaid)}
                                            </h5>
                                        </div>
                                        </div>
                                    </div>
                                    </Col>

                                    <Col md={4}>
                                    <div className="p-3 bg-danger bg-opacity-10 rounded border border-danger">
                                        <div className="d-flex align-items-center">
                                        <div className="me-3">
                                            <span className="avatar-title bg-danger text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height:'40px'}}>
                                            <FeatherIcon icon="alert-circle" size="20" />
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-muted mb-1">Total Pending</p>
                                            <h5 className="mb-0 text-danger">
                                            ₹{formatCurrency(summary.totalPending)}
                                            </h5>
                                        </div>
                                        </div>
                                    </div>
                                    </Col>

                                    <Col md={4}>
                                    <div className="p-3 bg-green bg-opacity-10 rounded border border-primary">
                                        <div className="d-flex align-items-center">
                                        <div className="me-3">
                                            <span className="avatar-title bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height:'40px'}}>
                                            <FeatherIcon icon="list" size="20" />
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-muted mb-1">EMIs Paid</p>
                                            <h5 className="mb-0 text-primary">
                                            {summary.paidEmis}
                                            </h5>
                                        </div>
                                        </div>
                                    </div>
                                    </Col>

                                    <Col md={6}>
                                    <div className="p-3 bg-info bg-opacity-10 rounded border border-info">
                                        <div className="d-flex align-items-center">
                                        <div className="me-3">
                                            <span className="avatar-title bg-info text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height:'40px'}}>
                                            <FeatherIcon icon="credit-card" size="20" />
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-muted mb-1">Total EMI Amount</p>
                                            <h5 className="mb-0 text-info">
                                            ₹{formatCurrency(summary.totalEmiAmount)}
                                            </h5>
                                        </div>
                                        </div>
                                    </div>
                                    </Col>

                                    <Col md={6}>
                                    <div className="p-3 bg-warning bg-opacity-10 rounded border border-warning">
                                        <div className="d-flex align-items-center">
                                        <div className="me-3">
                                            <span className="avatar-title bg-warning text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height:'40px'}}>
                                            <FeatherIcon icon="dollar-sign" size="20" />
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-muted mb-1">Principal Paid</p>
                                            <h5 className="mb-0 text-warning">
                                            ₹{formatCurrency(summary.totalPrincipalPaid)}
                                            </h5>
                                        </div>
                                        </div>
                                    </div>
                                    </Col>
                                </>
                                );
                            })()}
                            </Row>
                        </div>
                        {/* PAYMENT SUMMARY SECTION ENDS HERE */}
                    </>
                ) : (
                    <p className="text-muted text-center m-0">EMI schedule is not available for this loan.</p>
                )}
            </SectionWrapper>
        )}

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