import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Spinner
} from 'reactstrap';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useParams } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const LoanApplicationView = () => {
  const { applicantId } = useParams();
  const [applicantData, setApplicantData] = useState({
    employment: [],
    properties: [],
    banking_details: [],
    proofs: []
  });
  const [loanData, setLoanData] = useState({
    nominees: [],
    emiSchedule: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  
        // Fetch applicant data
        const applicantResponse = await fetch(`${API_BASE_URL}api/applicants/applicants/${applicantId}/`);
        if (!applicantResponse.ok) throw new Error("Failed to fetch applicant data");
        const applicantJson = await applicantResponse.json();
  
        // Ensure arrays are initialized
        setApplicantData({
          ...applicantJson,
          employment: applicantJson.employment || [],
          properties: applicantJson.properties || [],
          banking_details: applicantJson.banking_details || [],
          proofs: applicantJson.proofs || []
        });
  
        // Fetch loan data
        const loanResponse = await fetch(`${API_BASE_URL}/apply-loan/loan-applications/`);
        if (!loanResponse.ok) throw new Error("Failed to fetch loan data");
        const loanJson = await loanResponse.json();
  
        // Match loans by phone number
        const applicantLoans = loanJson.find(loan => loan.phone === applicantJson.phone) || {};
  
        setLoanData({
          ...applicantLoans,
          nominees: applicantLoans.nominees || [],
          emiSchedule: applicantLoans.emiSchedule || []
        });
  
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (applicantId) {
      fetchData();
    }
  }, [applicantId]);

  // Helper functions to display enum values
  const getTitle = (value) => {
    const titles = { 1: "Mr.", 2: "Mrs.", 3: "Ms.", 4: "Dr." };
    return titles[value] || value;
  };

  const getGender = (value) => {
    const genders = { 1: "Male", 2: "Female", 3: "Other" };
    return genders[value] || value;
  };

  const getMaritalStatus = (value) => {
    const statuses = { 1: "Single", 2: "Married", 3: "Divorced", 4: "Widowed" };
    return statuses[value] || value;
  };

  const getEmploymentType = (value) => {
    const types = { 1: "Salaried", 2: "Self-Employed", 3: "Unemployed", 4: "Retired", 5: "Other" };
    return types[value] || value;
  };

  const getPropertyType = (value) => {
    const types = { 1: "Residential", 2: "Commercial", 3: "Land", 8: "Other" };
    return types[value] || value;
  };

  const getPropertyOwnership = (value) => {
    const types = { 1: "Owned", 2: "Rented", 3: "Leased" };
    return types[value] || value;
  };

  const getAccountType = (value) => {
    const types = { 1: "Savings", 2: "Current", 3: "Fixed Deposit" };
    return types[value] || value;
  };

  const getTermType = (value) => {
    const types = { 1: "Days", 2: "Weeks", 3: "Months", 4: "Years" };
    return types[value] || value;
  };

  const getPurpose = (value) => {
    const purposes = {
      1: "Home",
      2: "Car",
      3: "Education",
      4: "Medical",
      5: "Personal",
      6: "Business"
    };
    return purposes[value] || value;
  };

  const getRelationship = (value) => {
    const relationships = {
      1: "Spouse",
      2: "Parent",
      3: "Child",
      4: "Sibling",
      5: "Other"
    };
    return relationships[value] || value;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        Error: {error}
      </div>
    );
  }

  if (!applicantData || Object.keys(applicantData).length === 0) {
    return <div className="alert alert-warning">No applicant data found</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-gradient-primary text-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">
              <i className="fas fa-file-invoice-dollar me-2"></i>
              Loan Application Details
            </h3>
            <span className="badge bg-light text-dark fs-6">
              Status: {applicantData.is_approved ? "Approved" : "Pending"}
            </span>
          </div>
        </div>

        <div className="card-body">
          {/* Personal Information */}
          <div className="mb-5">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                <i className="fas fa-user text-primary fs-5"></i>
              </div>
              <h4 className="mb-0 text-dark fw-bold">Personal Information</h4>
            </div>

            <Row className="g-4">
              <Col md={9}>
                <Row className="g-3 mb-4">
                  {[
                    { label: 'User ID', value: applicantData.userID },
                    { label: 'Full Name', value: `${getTitle(applicantData.title)} ${applicantData.first_name} ${applicantData.last_name}` },
                    { label: 'Date of Birth', value: applicantData.dateOfBirth || '—' },
                    { label: 'Gender', value: getGender(applicantData.gender) || '—' }
                  ].map((item, index) => (
                    <Col md={6} lg={3} key={index}>
                      <div className="p-4 bg-white rounded border shadow-sm h-100">
                        <p className="text-muted small mb-1">{item.label}</p>
                        <p className="fw-semibold text-dark text-truncate mb-0">{item.value}</p>
                      </div>
                    </Col>
                  ))}
                </Row>

                <Row className="g-3">
                  <Col md={6}>
                    <div className="p-4 bg-white rounded border shadow-sm h-100">
                      <p className="text-muted small mb-3">Contact</p>
                      <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-phone-alt me-2 text-primary"></i>
                        <span className="fw-semibold text-dark">{applicantData.phone}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="fas fa-envelope me-2 text-primary"></i>
                        <span className="fw-semibold text-dark text-truncate">{applicantData.email}</span>
                      </div>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="p-4 bg-white rounded border shadow-sm h-100">
                      <p className="text-muted small mb-3">Address</p>
                      <p className="fw-semibold text-dark mb-0">
                        {applicantData.address || '—'}, {applicantData.city || '—'}<br />
                        {applicantData.state || '—'} – {applicantData.postalCode || '—'}
                      </p>
                    </div>
                  </Col>
                </Row>
              </Col>

              <Col md={3}>
                <div className="p-4 bg-white rounded border shadow-sm text-center h-100">
                  <p className="text-muted small mb-3">Profile Photo</p>
                  {applicantData.profile_photo ? (
                    <img
                      src={applicantData.profile_photo}
                      alt="Profile"
                      className="img-thumbnail rounded-circle mx-auto"
                      style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                        border: '3px solid #f0f2f5',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    />
                  ) : (
                    <div
                      className="bg-light text-secondary d-flex align-items-center justify-content-center rounded-circle mx-auto"
                      style={{
                        width: '150px',
                        height: '150px',
                        fontSize: '3rem',
                        border: '2px dashed #dee2e6',
                      }}
                    >
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </div>


          {/* Employment Information */}
          <style>
            {`
                  .hover-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    border-radius: 0.5rem;
                    cursor: pointer;
                  }

                  .hover-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
                    border-color: #d1e7dd;
                  }
              `}
          </style>
          <div className="mb-5">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                <i className="fas fa-briefcase text-success fs-4"></i>
              </div>
              <h4 className="mb-0 text-dark fw-bold">Employment Information</h4>
            </div>

            {applicantData.employment?.length > 0 ? (
              applicantData.employment.map((emp, index) => (
                <div key={index} className="card border-0 shadow-sm mb-4 hover-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                        {getEmploymentType(emp.employmentType)}
                      </span>
                    </div>

                    <div className="row g-4">
                      <div className="col-md-6 col-lg-3">
                        <p className="text-muted small mb-1">Job Title</p>
                        <p className="fw-semibold mb-0">{emp.jobTitle || '—'}</p>
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <p className="text-muted small mb-1">Experience</p>
                        <p className="fw-semibold mb-0">{emp.yearsWithEmployer} years</p>
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <p className="text-muted small mb-1">Monthly Income</p>
                        <p className="fw-semibold mb-0 text-primary">₹{emp.monthlyIncome}</p>
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <p className="text-muted small mb-1">Other Income</p>
                        <p className="fw-semibold mb-0">₹{emp.otherIncome}</p>
                      </div>

                      <div className="col-md-6 col-lg-4 mt-3">
                        <div className="bg-light rounded p-3 h-100 border-start border-success border-4">
                          <p className="text-muted small mb-1">Total Income</p>
                          <p className="fw-bold text-success fs-5 mb-0">
                            ₹{(parseFloat(emp.monthlyIncome) + parseFloat(emp.otherIncome)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-info">No employment information available</div>
            )}
          </div>

          {/* Property Information */}
          <div className="mb-5">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                <i className="fas fa-home text-warning fs-4"></i>
              </div>
              <h4 className="mb-0 text-dark">Property Information</h4>
            </div>

            {applicantData.properties?.length > 0 ? (
              applicantData.properties.map((property, index) => (
                <div key={index} className="card border-0 shadow-sm mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="badge bg-warning bg-opacity-25 text-warning">
                        {getPropertyOwnership(property.propertyOwnership)}
                      </span>
                    </div>

                    <div className="row g-4">
                      <div className="col-md-6 col-lg-3">
                        <p className="text-muted small mb-1">Property Type</p>
                        <p className="fw-semibold mb-0">{getPropertyType(property.propertyType)}</p>
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <p className="text-muted small mb-1">Property Value</p>
                        <p className="fw-bold mb-0 text-primary">₹{property.propertyValue}</p>
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <p className="text-muted small mb-1">Property Age</p>
                        <p className="fw-semibold mb-0">{property.propertyAge} years</p>
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <p className="text-muted small mb-1">Ownership</p>
                        <p className="fw-semibold mb-0">{getPropertyOwnership(property.propertyOwnership)}</p>
                      </div>

                      <div className="col-md-6 col-lg-4 mt-3">
                        <div className="bg-light rounded p-3 border-start border-4 border-warning">
                          <p className="text-muted small mb-1">Address</p>
                          <p className="fw-bold mb-0">{property.property_address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-info">No property information available</div>
            )}
          </div>

          {/* Banking Details */}
          <div className="mb-5">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-info bg-opacity-10 p-3 rounded-circle me-3">
                <i className="fas fa-university text-info fs-4"></i>
              </div>
              <h4 className="mb-0 text-dark">Banking Details</h4>
            </div>

            {applicantData.banking_details?.length > 0 ? (
              applicantData.banking_details.map((bank, index) => (
                <div key={index} className="card border-0 shadow-sm mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="badge bg-info bg-opacity-25 text-info">{bank.bankName}</span>
                    </div>

                    <div className="row g-4">
                      <div className="col-md-6 col-lg-4">
                        <p className="text-muted small mb-1">Account Holder</p>
                        <p className="fw-semibold mb-0">{bank.accountHolderName}</p>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <p className="text-muted small mb-1">Account Number</p>
                        <p className="fw-semibold mb-0">{bank.accountNumber}</p>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <p className="text-muted small mb-1">Account Type</p>
                        <p className="fw-semibold mb-0">{getAccountType(bank.accountType)}</p>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <p className="text-muted small mb-1">Bank Name</p>
                        <p className="fw-semibold mb-0">{bank.bankName}</p>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <p className="text-muted small mb-1">IFSC Code</p>
                        <p className="fw-semibold mb-0">{bank.ifscCode}</p>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <p className="text-muted small mb-1">Branch</p>
                        <p className="fw-semibold mb-0">{bank.bankBranch}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-info">No banking details available</div>
            )}
          </div>

          {/* ID Proofs */}
          <>
            <style>
              {`
      .hover-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        border-radius: 0.5rem;
        cursor: pointer;
      }

      .hover-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
        border-color: #f8d7da;
      }

      .proof-img {
        border-radius: 0.5rem;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        max-height: 150px;
        object-fit: contain;
      }

      .proof-btn-group a,
      .proof-btn-group button {
        min-width: 100px;
      }
    `}
            </style>

            <div className="mb-5">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-danger bg-opacity-10 p-2 rounded me-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                  <i className="fas fa-id-card text-danger fs-4"></i>
                </div>
                <h4 className="mb-0 fw-bold">ID Proofs</h4>
              </div>

              {applicantData.proofs?.length > 0 ? (
                <div className="row g-3">
                  {applicantData.proofs.map((proof, index) => (
                    <div key={index} className="col-md-6 col-lg-4">
                      <div className="card h-100 border-0 shadow-sm hover-card">
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-3">
                            <h5 className="mb-0 text-capitalize">{proof.type}</h5>
                          </div>

                          <div className="text-center mb-3">
                            <img
                              src={proof.file}
                              alt={proof.type}
                              className="img-fluid img-thumbnail proof-img"
                            />
                          </div>

                          <p className="text-muted small mb-1">ID Number</p>
                          <p className="fw-bold mb-3">{proof.idNumber}</p>

                          <div className="d-flex justify-content-between proof-btn-group">
                            <a
                              href={proof.file}
                              download
                              className="btn btn-outline-primary btn-sm"
                            >
                              <i className="fas fa-download me-1"></i>Download
                            </a>
                            <button
                              type="button"
                              onClick={() => window.open(proof.file, "_blank")}
                              className="btn btn-outline-secondary btn-sm"
                            >
                              <i className="fas fa-eye me-1"></i>View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-info">No ID proofs available</div>
              )}
            </div>
          </>

          {/* Loan Details - Only show if loan data exists */}
          {loanData && Object.keys(loanData).length > 0 && (
            <>
              <div className="mb-5">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-purple bg-opacity-10 p-2 rounded me-3">
                    <i className="fas fa-hand-holding-usd text-info fs-4"></i>
                  </div>
                  <h4 className="mb-0 text-dark">Loan Details</h4>
                </div>

                <div className="card border-0 mb-4 rounded-3">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6 col-lg-3">
                        <p className="text-muted small mb-1">Loan ID</p>
                        <p className="fw-bold mb-0 text-info">{loanData.loanID}</p>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <p className="text-muted small mb-1">Loan Amount</p>
                        <p className="fw-bold mb-0 text-info">₹{loanData.amount}</p>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <p className="text-muted small mb-1">Term</p>
                        <p className="fw-bold mb-0">{loanData.term} {getTermType(loanData.termType)}</p>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <p className="text-muted small mb-1">Interest Rate</p>
                        <p className="fw-bold mb-0">{loanData.interestRate}%</p>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <p className="text-muted small mb-1">Purpose</p>
                        <p className="fw-bold mb-0">{getPurpose(loanData.purpose)}</p>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <p className="text-muted small mb-1">Repayment Source</p>
                        <p className="fw-bold mb-0">{loanData.repaymentSource}</p>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <p className="text-muted small mb-1">Start Date</p>
                        <p className="fw-bold mb-0">{loanData.startDate}</p>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <p className="text-muted small mb-1">Registration Date</p>
                        <p className="fw-bold mb-0">{loanData.LoanRegDate}</p>
                      </div>
                      <div className="col-12">
                        <p className="text-muted small mb-1">Remarks</p>
                        <p className="fw-bold mb-0">{loanData.remarks || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agreements */}
                <div className="card border-0 rounded-3 mb-4">
                  <div className="card-body">
                    <h5 className="mb-3 text-dark"><i className="fas fa-scroll me-2 text-success"></i> Agreements</h5>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className={`p-3 rounded ${loanData.agreeTerms ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'} hover-shadow`}>
                          <p className="fw-bold mb-0 d-flex align-items-center">
                            <i className={`fas fa-${loanData.agreeTerms ? 'check-circle text-success' : 'times-circle text-danger'} me-2`}></i>
                            Terms Accepted: {loanData.agreeTerms ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className={`p-3 rounded ${loanData.agreeCreditCheck ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'} hover-shadow`}>
                          <p className="fw-bold mb-0 d-flex align-items-center">
                            <i className={`fas fa-${loanData.agreeCreditCheck ? 'check-circle text-success' : 'times-circle text-danger'} me-2`}></i>
                            Credit Check: {loanData.agreeCreditCheck ? "Agreed" : "Not Agreed"}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className={`p-3 rounded ${loanData.agreeDataSharing ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'} hover-shadow`}>
                          <p className="fw-bold mb-0 d-flex align-items-center">
                            <i className={`fas fa-${loanData.agreeDataSharing ? 'check-circle text-success' : 'times-circle text-danger'} me-2`}></i>
                            Data Sharing: {loanData.agreeDataSharing ? "Agreed" : "Not Agreed"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Translator Information */}
              {loanData.translatorName && (
                <div className="mb-5">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-secondary bg-opacity-10 p-2 rounded me-3">
                      <i className="fas fa-language text-secondary fs-4"></i>
                    </div>
                    <h4 className="mb-0">Translator Information</h4>
                  </div>

                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <p className="text-muted small mb-1">Translator Name</p>
                          <p className="fw-bold mb-0">{loanData.translatorName}</p>
                        </div>
                        <div className="col-md-6">
                          <p className="text-muted small mb-1">Translator Place</p>
                          <p className="fw-bold mb-0">{loanData.translatorPlace}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Nominees */}
              <>
                <style>
                  {`
      .nominee-card {
        border-radius: 0.5rem;
        transition: box-shadow 0.3s ease;
      }
      .nominee-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      }
      .nominee-photo {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 0.5rem;
        border: 1px solid #dee2e6;
      }
    `}
                </style>

                <div className="mb-5">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-dark bg-opacity-10 p-2 rounded me-3">
                      <i className="fas fa-users text-dark fs-4"></i>
                    </div>
                    <h4 className="mb-0">Nominees</h4>
                  </div>

                  {loanData.nominees?.length > 0 ? (
                    <div className="row g-3">
                      {loanData.nominees.map((nominee, index) => (
                        <div key={index} className="col-md-6">
                          <div className="card nominee-card h-100 border-0 shadow-sm">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="me-3">
                                  <div className="d-flex align-items-center mb-2">
                                    <div className="bg-success bg-opacity-10 p-2 rounded me-2">
                                      <i className="fas fa-user text-primary fs-5"></i>
                                    </div>
                                    <h5 className="mb-0">{nominee.name}</h5>
                                  </div>

                                  <div className="row g-2">
                                    <div className="col-6">
                                      <p className="text-muted small mb-1">Relationship</p>
                                      <p className="fw-bold mb-2">{getRelationship(nominee.relationship)}</p>
                                    </div>
                                    <div className="col-6">
                                      <p className="text-muted small mb-1">Phone</p>
                                      <p className="fw-bold mb-2">{nominee.phone}</p>
                                    </div>
                                    <div className="col-6">
                                      <p className="text-muted small mb-1">Email</p>
                                      <p className="fw-bold mb-2">{nominee.email || "N/A"}</p>
                                    </div>
                                    <div className="col-6">
                                      <p className="text-muted small mb-1">ID Proof</p>
                                      <p className="fw-bold mb-2">{nominee.idProofType}: {nominee.idProofNumber}</p>
                                    </div>
                                    <div className="col-12">
                                      <p className="text-muted small mb-1">Address</p>
                                      <p className="fw-bold mb-2">{nominee.address}</p>
                                    </div>
                                  </div>

                                  <div className="d-flex flex-wrap gap-2 mt-2">
                                    <a href={nominee.id_proof_file} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm">
                                      <i className="fas fa-file-alt me-1"></i> View ID Proof
                                    </a>
                                    <a href={nominee.profile_photo} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                                      <i className="fas fa-eye me-1"></i> View Full Photo
                                    </a>
                                  </div>
                                </div>

                                {nominee.profile_photo && (
                                  <img
                                    src={nominee.profile_photo}
                                    alt={`${nominee.name}'s Profile`}
                                    className="nominee-photo"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="alert alert-info">No nominees available</div>
                  )}
                </div>
              </>

              {/* EMI Schedule */}
              <>
                <style>
                  {`
                      .hover-scale {
                        transition: transform 0.2s ease;
                      }
                      .hover-scale:hover {
                        transform: scale(1.05);
                      }

                      .hover-shadow {
                        transition: box-shadow 0.3s ease;
                      }
                      .hover-shadow:hover {
                        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.05);
                      }

                      .hover-bg-light:hover {
                        background-color: #f9f9fc;
                      }

                      .card-summary {
                        border-radius: 0.5rem;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
                        transition: transform 0.2s ease, box-shadow 0.2s ease;
                      }

                      .card-summary:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
                      }

                      .status-badge {
                        padding: 0.35em 0.75em;
                        font-size: 0.85rem;
                        font-weight: 600;
                        border-radius: 0.375rem;
                      }
                  `}
                </style>

                <div className="mb-5">
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-info bg-opacity-10 p-3 rounded-circle me-3 hover-scale d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                      <i className="fas fa-calendar-alt text-info fs-4"></i>
                    </div>
                    <h4 className="mb-0 fw-semibold">EMI Payment Schedule</h4>
                  </div>

                  {loanData.emiSchedule?.length > 0 ? (
                    <>
                      {/* EMI Table */}
                      <div className="card border-0 shadow-sm hover-shadow transition-all">
                        <div className="card-body p-0">
                          <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th className="ps-4">Month</th>
                                  <th>Payment Date</th>
                                  <th className="text-end">EMI Amount</th>
                                  <th className="text-end">Principal</th>
                                  <th className="text-end">Interest</th>
                                  <th className="text-end">Balance</th>
                                  <th className="text-end">Status</th>
                                  <th className="text-end pe-4">Pending</th>
                                </tr>
                              </thead>
                              <tbody>
                                {[...loanData.emiSchedule]
                                  .sort((a, b) => a.month - b.month)
                                  .map((emi, index) => (
                                    <tr key={index} className="hover-bg-light">
                                      <td className="ps-4 fw-medium">{emi.month}</td>
                                      <td>
                                        <span className="badge bg-light text-dark border">
                                          {new Date(emi.emiStartDate).toLocaleDateString('en-IN')}
                                        </span>
                                      </td>
                                      <td className="text-end fw-semibold">₹{emi.emiTotalMonth.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                      <td className="text-end">₹{emi.principalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                      <td className="text-end">₹{emi.interest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                      <td className="text-end fw-semibold">
                                        {emi.remainingBalance > 0 ? (
                                          <span className="text-danger">₹{emi.remainingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                        ) : (
                                          <span className="text-success">₹{emi.remainingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                        )}
                                      </td>
                                      <td className="text-end">
                                        {emi.paymentAmount > 0 ? (
                                          <span className="badge bg-success bg-opacity-10 text-success status-badge">
                                            <i className="fas fa-check-circle me-1"></i> Paid
                                          </span>
                                        ) : new Date(emi.emiStartDate) < new Date() ? (
                                          <span className="badge bg-danger bg-opacity-10 text-danger status-badge">
                                            <i className="fas fa-times-circle me-1"></i> Overdue
                                          </span>
                                        ) : (
                                          <span className="badge bg-warning bg-opacity-10 text-warning status-badge">
                                            <i className="fas fa-clock me-1"></i> Pending
                                          </span>
                                        )}
                                      </td>
                                      <td className="text-end pe-4 fw-semibold">
                                        <span className={`badge status-badge ${emi.pendingAmount > 0 ? 'bg-danger bg-opacity-10 text-danger' : 'bg-success bg-opacity-10 text-success'}`}>
                                          ₹{(emi.pendingAmount !== undefined ? emi.pendingAmount : emi.emiTotalMonth).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* Summary Cards */}
                      <div className="row g-3 mb-4 mt-3">
                        <div className="col-md-6 col-lg-3">
                          <div className="p-3 bg-white card-summary border border-success border-opacity-25 h-100">
                            <h6 className="text-muted small mb-2">Total EMI Amount</h6>
                            <h4 className="text-dark fw-bold mb-0">
                              ₹{loanData.emiSchedule.reduce((sum, e) => sum + e.emiTotalMonth, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </h4>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="p-3 bg-white card-summary border border-success border-opacity-25 h-100">
                            <h6 className="text-muted small mb-2">Total Paid</h6>
                            <h4 className="text-success fw-bold mb-0">
                              ₹{loanData.emiSchedule.reduce((sum, e) => sum + (e.paymentAmount || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </h4>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="p-3 bg-white card-summary border border-danger border-opacity-25 h-100">
                            <h6 className="text-muted small mb-2">Total Pending</h6>
                            <h4 className="text-danger fw-bold mb-0">
                              ₹{loanData.emiSchedule.reduce((sum, e) => sum + (e.pendingAmount || e.emiTotalMonth), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </h4>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="p-3 bg-white card-summary border border-primary border-opacity-25 h-100">
                            <h6 className="text-muted small mb-2">EMIs Paid</h6>
                            <h4 className="text-primary fw-bold mb-0">
                              {loanData.emiSchedule.filter(e => e.paymentAmount > 0).length}/{loanData.emiSchedule.length}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="alert alert-info bg-info bg-opacity-10 border-info d-flex align-items-center">
                      <i className="fas fa-info-circle me-2"></i>
                      No EMI schedule available for this loan
                    </div>
                  )}
                </div>
              </>

            </>
          )}
        </div>

        <div className="card-footer bg-light d-flex justify-content-between">
          <button className="btn btn-outline-secondary">
            <i className="fas fa-print me-2"></i> Save Pdf
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationView;