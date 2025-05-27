// src/pages/LoanApprovals/LoanActionPage.js
import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Button,
  Card,
  CardHeader,
  CardBody,
  Alert,
  Input,
  FormGroup,
  Label,
  Badge,
} from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FeatherIcon from "feather-icons-react";

// Simplified status badge renderer for this page, or import if made common
const getSimpleLoanStatusBadge = (status) => {
  let color = "light";
  if (!status) status = "Unknown";
  switch (status.toUpperCase()) {
    case "PENDING": color = "warning"; break;
    case "MANAGER_APPROVED": color = "info"; break;
    case "APPROVED": color = "primary"; break;
    case "ACTIVE": color = "success"; break;
    case "REJECTED": color = "danger"; break;
    case "PAID": color = "secondary"; break;
    case "OVERDUE": color = "danger"; break;
    default: color = "light";
  }
  return <Badge color={color} className={color === "warning" ? "text-dark" : ""} pill>{status}</Badge>;
};


const LoanRemark = () => {
  const { loanApplicationPk } = useParams();
  const navigate = useNavigate();

  const [loanData, setLoanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  useEffect(() => {
    const roleFromStorage = localStorage.getItem("userRole");
    if (roleFromStorage) {
      setUserRole(roleFromStorage.toLowerCase());
    } else {
      toast.error("User role not found. Cannot perform actions.");
      navigate(-1); // Or to login page
    }
  }, [navigate]);

  const fetchLoanDetails = useCallback(async () => {
    if (!loanApplicationPk) {
      setError("Loan Application PK is missing.");
      setLoading(false);
      toast.error("Loan Application PK is missing.");
      return;
    }
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("accessToken");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    if (!token || !API_BASE_URL) {
      setError("Configuration error.");
      setLoading(false);
      toast.error("Configuration error.");
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.get(
        `${API_BASE_URL}api/loan-applications/loan-applications/${loanApplicationPk}/`,
        { headers }
      );
      setLoanData(response.data);
    } catch (err) {
      console.error("Error fetching loan details for action:", err);
      const errorMsg =
        err.response?.data?.detail || "Failed to fetch loan details.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [loanApplicationPk]);

  useEffect(() => {
    if (userRole) { // Fetch loan details only after userRole is determined
      fetchLoanDetails();
    }
  }, [fetchLoanDetails, userRole]);

  const handleLoanAction = async (newStatus, actionRemarks) => {
    if (!loanData || !loanData.id) {
      toast.error("Loan data not loaded or loan ID missing.");
      return;
    }
    if (!userRole) {
      toast.error("User role not determined. Cannot perform action.");
      return;
    }
    if (!actionRemarks.trim()) {
      toast.warn("Remarks are required to change the loan status.");
      return;
    }

    setIsSubmittingAction(true);
    const token = localStorage.getItem("accessToken");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const headers = { Authorization: `Bearer ${token}` };

    const payload = { status: newStatus };
    if (userRole === "manager") payload.manager_remarks = actionRemarks.trim();
    else if (userRole === "admin") payload.admin_remarks = actionRemarks.trim();
    
    try {
      const response = await axios.patch(
        `${API_BASE_URL}api/loan-applications/loan-applications/${loanData.id}/`,
        payload,
        { headers }
      );
      toast.success(`Loan application status updated to ${newStatus}.`);
      // Navigate back to the detail page after action
      navigate(`/loan-approvals`);
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

  if (loading) {
    return (
      <div className="page-content d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
        <p className="ms-3 fs-5">Loading Loan Action Page...</p>
      </div>
    );
  }

  if (error || !loanData) {
    return (
      <div className="page-content">
        <Container>
          <Alert color="danger" className="text-center mt-4">
            <h4 className="alert-heading"><FeatherIcon icon="alert-triangle" className="me-2" /> Error</h4>
            <p>{error || "Could not load loan data for action."}</p>
            <Button color="primary" onClick={() => navigate(-1)}>Go Back</Button>
          </Alert>
        </Container>
      </div>
    );
  }

  const canPerformAction =
    (userRole === "manager" && loanData.status === "PENDING") ||
    (userRole === "admin" && (loanData.status === "MANAGER_APPROVED" || loanData.status === "PENDING"));

  return (
    <div className="page-content">
      <Container>
        <Row className="mb-3 align-items-center">
            <Col xs="auto">
                <Button color="light" onClick={() => navigate(`/loan-application/action/${loanApplicationPk}`)} className="border shadow-sm">
                    <FeatherIcon icon="arrow-left" size="16" className="me-1" /> Back to Details
                </Button>
            </Col>
            <Col>
                <h2 className="mb-0 text-primary">
    <FeatherIcon icon="edit-3" className="me-2" /> Add Remarks & Process Loan Action
</h2>
            </Col>
        </Row>

        <Card className="shadow-sm">
          <CardHeader className="bg-light">
            <h5 className="mb-0">
    Remarks & Action for Loan ID: {loanData.loanID || `(PK: ${loanData.id})`}
</h5>
            Current Status: {getSimpleLoanStatusBadge(loanData.status)}
          </CardHeader>
          <CardBody>
            {canPerformAction ? (
              <>
                {loanData.manager_remarks && (
                    <div className="mb-3">
                        <strong className="text-muted">Existing Manager Remarks:</strong>
                        <p className="bg-light p-2 rounded border fst-italic">{loanData.manager_remarks}</p>
                    </div>
                )}
                {loanData.admin_remarks && userRole !== "admin" && ( // Show admin remarks if manager is viewing and admin already remarked (e.g. on a previous cycle)
                     <div className="mb-3">
                        <strong className="text-muted">Existing Admin Remarks:</strong>
                        <p className="bg-light p-2 rounded border fst-italic">{loanData.admin_remarks}</p>
                    </div>
                )}
                 {loanData.admin_remarks && userRole === "admin" && loanData.status === "MANAGER_APPROVED" && ( // Show admin remarks if admin is viewing and they are acting on a manager approved loan (admin remarks here would be from a previous cycle if any)
                     <div className="mb-3">
                        <strong className="text-muted">Previous Admin Remarks (if any):</strong>
                        <p className="bg-light p-2 rounded border fst-italic">{loanData.admin_remarks}</p>
                    </div>
                )}


                <FormGroup>
                  <Label for="actionRemarksInput" className="fw-bold">
                    {userRole === "manager" ? "Manager Remarks:" : "Admin Remarks:"} (Required)
                  </Label>
                  <Input
                    type="textarea"
                    name="remarks"
                    id="actionRemarksInput"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows="5"
                    placeholder={`Enter your ${userRole} remarks for this action...`}
                    disabled={isSubmittingAction}
                    className="mb-3"
                  />
                </FormGroup>
                <div className="d-flex justify-content-end mt-3">
                  {userRole === "manager" && loanData.status === "PENDING" && (
                    <>
                      <Button
                        color="success"
                        className="me-2"
                        onClick={() => handleLoanAction("MANAGER_APPROVED", remarks)}
                        disabled={isSubmittingAction || !remarks.trim()}
                      >
                        {isSubmittingAction ? <Spinner size="sm" /> : <><FeatherIcon icon="check-circle" size={16} className="me-1"/> Approve (Manager)</>}
                      </Button>
                      <Button
                        color="danger"
                        onClick={() => handleLoanAction("REJECTED", remarks)}
                        disabled={isSubmittingAction || !remarks.trim()}
                      >
                        {isSubmittingAction ? <Spinner size="sm" /> : <><FeatherIcon icon="x-circle" size={16} className="me-1"/> Reject</>}
                      </Button>
                    </>
                  )}
                  {userRole === "admin" && loanData.status === "MANAGER_APPROVED" && (
                    <>
                      <Button
                        color="success"
                        className="me-2"
                        onClick={() => handleLoanAction("APPROVED", remarks)}
                        disabled={isSubmittingAction || !remarks.trim()}
                      >
                        {isSubmittingAction ? <Spinner size="sm" /> : <><FeatherIcon icon="award" size={16} className="me-1"/> Final Approve</>}
                      </Button>
                      <Button
                        color="danger"
                        onClick={() => handleLoanAction("REJECTED", remarks)}
                        disabled={isSubmittingAction || !remarks.trim()}
                      >
                        {isSubmittingAction ? <Spinner size="sm" /> : <><FeatherIcon icon="x-circle" size={16} className="me-1"/> Reject</>}
                      </Button>
                    </>
                  )}
                  {userRole === "admin" && loanData.status === "PENDING" && (
                     <Button
                        color="danger"
                        onClick={() => handleLoanAction("REJECTED", remarks)}
                        disabled={isSubmittingAction || !remarks.trim()}
                        className="ms-auto" // Ensure it's at the end if it's the only button
                      >
                        {isSubmittingAction ? <Spinner size="sm" /> : <><FeatherIcon icon="x-circle" size={16} className="me-1"/> Reject (Admin)</>}
                      </Button>
                  )}
                </div>
              </>
            ) : (
              <Alert color="info" className="text-center">
                No actions are currently available for this loan application based on its status ({loanData.status}) or your role.
              </Alert>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default LoanRemark;