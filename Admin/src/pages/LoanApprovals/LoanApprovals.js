// src/pages/LoanApprovals/LoanApproval.js
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, CardTitle, Table, Button, Spinner, Alert, Badge } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import FeatherIcon from "feather-icons-react";

// A more robust way to get user info, including roles, would be from an Auth Context or Redux store
// For this example, we'll stick to localStorage but acknowledge its limitations.
const getUserAuthData = () => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole"); // e.g., 'admin', 'manager', 'applicant'
    // You might also store username or other details if needed for display
    const isAuthenticated = !!token; // Simple check if token exists

    return { token, role, isAuthenticated };
};

const LoanApproval = () => {
    const [loansToReview, setLoansToReview] = useState([]);
    const [loading, setLoading] = useState(true); // Unified loading state for initial setup & fetching
    const [error, setError] = useState(null);
    
    const [authData, setAuthData] = useState(getUserAuthData()); // Store auth data in state
    const [pageTitle, setPageTitle] = useState("Loan Approval Queue");
    
    const navigate = useNavigate();

    // Effect to update authData if localStorage changes (e.g., after login/logout in another tab, though this is limited)
    // A better approach for real-time auth changes involves context/event listeners.
    useEffect(() => {
        const handleStorageChange = () => {
            setAuthData(getUserAuthData());
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);


    const fetchLoansForReview = useCallback(async (roleToFetchFor, currentToken) => {
        if (!roleToFetchFor || !currentToken) {
            setError("User role not determined or not authenticated for fetching loans.");
            setLoading(false);
            if (!currentToken) toast.error("Authentication token missing.");
            return;
        }

        setLoading(true); // Start loading for API call
        setError(null);
        
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        if (!API_BASE_URL) {
            setError("API base URL is not configured.");
            setLoading(false);
            toast.error("API base URL is not configured.");
            return;
        }
        const headers = { 'Authorization': `Bearer ${currentToken}` };

        let statusToFetch = '';
        let dynamicPageTitle = "Loan Approval Queue";

        if (roleToFetchFor === 'Manager') {
            statusToFetch = 'PENDING';
            dynamicPageTitle = "Manager Loan Review Queue";
        } else if (roleToFetchFor === 'Admin') {
            statusToFetch = 'MANAGER_APPROVED';
            dynamicPageTitle = "Admin Final Approval Queue";
        } else {
            setError(`Invalid user role ('${roleToFetchFor}') for fetching loans.`);
            setLoading(false);
            toast.error(`Your role ('${roleToFetchFor}') does not have an assigned loan queue.`);
            return; // Do not proceed if role is not manager or admin
        }
        
        setPageTitle(dynamicPageTitle); // Set title before fetching

        try {
            console.log(`Fetching loans for role: ${roleToFetchFor}, status: ${statusToFetch}`);
            const response = await axios.get(
                `${API_BASE_URL}api/loan-applications/loan-applications/?status=${statusToFetch}`,
                { headers }
            );
            setLoansToReview(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error(`Error fetching loans for ${roleToFetchFor}:`, err);
            const errorMsg = err.response?.data?.detail || `Failed to fetch loan applications for ${roleToFetchFor}.`;
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array as it gets role and token as arguments


    // Main effect for initialization and data fetching based on authentication and role
    useEffect(() => {
        const { isAuthenticated, role, token } = authData;

        if (!isAuthenticated) {
            setError("You must be logged in to view this page.");
            setLoading(false);
            toast.error("Authentication required. Please login.");
            // Optionally, redirect to login: navigate('/login');
            return;
        }

        if (role === 'Manager' || role === 'Admin') {
            setPageTitle(role === 'admin' ? "Admin Final Approval Queue" : "Manager Loan Review Queue");
            fetchLoansForReview(role, token);
        } else {
            // Handle cases where role is authenticated but not manager/admin
            setError(`Access Denied. Your role ('${role || 'unknown'}') does not have permission to view this approval queue.`);
            setLoading(false);
            toast.warn(`Access Denied for role: ${role || 'unknown'}`);
        }
    }, [authData, fetchLoansForReview, navigate]); // Depend on authData

    // Helper to get status badge color
    const getStatusBadgeColor = (status) => {
        if (status === 'PENDING') return 'warning';
        if (status === 'MANAGER_APPROVED') return 'info';
        return 'secondary';
    };

    // Initial Loading State (before auth check completes or if still loading data)
    if (loading) {
        return (
            <div className="page-content d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner color="primary" /> <p className="ms-2">Loading {pageTitle}...</p>
            </div>
        );
    }

    // Error State (after loading has attempted)
    if (error) {
        return (
            <div className="page-content">
                <Container fluid>
                    <Alert color="danger">
                        <h4 className="alert-heading">
                            <FeatherIcon icon="alert-triangle" className="me-2"/>
                            Error
                        </h4>
                        <p>{error}</p>
                        {/* Optionally suggest login if the error is auth-related */}
                        {!authData.isAuthenticated && (
                            <Button color="link" onClick={() => navigate('')}>Go to Login</Button>
                        )}
                    </Alert>
                </Container>
            </div>
        );
    }
    
    // If user is authenticated but not manager/admin, error state above should have caught it.
    // This is a fallback or if error wasn't set explicitly for role mismatch.
    if (authData.isAuthenticated && !(authData.role === 'Manager' || authData.role === 'Admin')) {
         return (
            <div className="page-content">
                <Container fluid> <Alert color="warning">You do not have the necessary permissions (Manager/Admin) to view this page.</Alert> </Container>
            </div>
        )
    }


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h5" className="mb-0">{pageTitle}</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    {loansToReview.length === 0 ? (
                                        <Alert color="info">No loan applications currently in this queue.</Alert>
                                    ) : (
                                        <div className="table-responsive">
                                            <Table className="table-centered table-nowrap table-hover mb-0">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>App. PK</th>
                                                        <th>Applicant Name</th>
                                                        <th>Applicant UserID</th>
                                                        <th>Loan Amount</th>
                                                        <th>Term</th>
                                                        <th>Status</th>
                                                        <th>Applied On</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loansToReview.map((loan) => (
                                                        <tr key={loan.id}>
                                                            <td>{loan.id}</td>
                                                            {/* Make sure your serializer provides 'first_name' for the loan or a display name */}
                                                            <td>{loan.first_name || loan.applicant_name || 'N/A'}</td>
                                                            {/* 'applicant_record' should be the Applicant's userID */}
                                                            <td>{loan.applicant_record || 'N/A'}</td>
                                                            <td>₹{parseFloat(loan.amount).toLocaleString('en-IN')}</td>
                                                            <td>{loan.term} {loan.termType}</td>
                                                            <td>
                                                                <Badge color={getStatusBadgeColor(loan.status)} pill>
                                                                    {loan.status ? loan.status.replace('_', ' ') : 'N/A'}
                                                                </Badge>
                                                            </td>
                                                            <td>{loan.LoanRegDate ? new Date(loan.LoanRegDate).toLocaleDateString() : 'N/A'}</td>
                                                            <td>
                                                                <Button
                                                                    color="primary"
                                                                    size="sm"
                                                                    onClick={() => navigate(`/loan-application/action/${loan.id}`)}
                                                                >
                                                                    View & Action
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default LoanApproval;