import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import axios from "axios";
import {
  Card, CardHeader, Container, CardBody, Col, Row,
  Form, FormGroup, Label, Button, Input, Table, Spinner, Alert
} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoanRequest() {
  const navigate = useNavigate();

  // State for form fields and component
  const [name, setName] = useState("");
  const [last_name, setLastName] = useState(""); // Changed variable name for consistency
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(""); // Request Date

  const [loanRequests, setLoanRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false); // For table loading
  const [submitting, setSubmitting] = useState(false); // For form submission
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [emailError, setEmailError] = useState("");

  const API_URL = `${process.env.REACT_APP_API_BASE_URL}api/loanrequest/`;

  // Consistent token retrieval
  const getToken = useCallback(() => {
    return localStorage.getItem("accessToken"); // Assuming "accessToken" is your key
  }, []);

  // Fetch loan requests from API
  const fetchLoanRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = getToken();
    if (!token) {
      toast.error("Authentication token not found. Please login.");
      setLoading(false);
      setError("User not authenticated.");
      return;
    }
    try {
      const response = await axios.get(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setLoanRequests(response.data);
    } catch (err) {
      console.error("Error fetching loan requests:", err);
      const errorMsg = err.response?.data?.detail || err.message || "Failed to fetch loan request data.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [API_URL, getToken]);

  useEffect(() => {
    fetchLoanRequests();
  }, [fetchLoanRequests]);

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) { // Only validate if email is not empty
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };
  
  const validatePhone = () => {
    if (phone && phone.length !== 10) {
        toast.warn("Phone number should be 10 digits.");
        return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validatePhone()) return; // Stop submission if phone is invalid
    if (emailError) {
        toast.error("Please correct the email address.");
        return;
    }

    setSubmitting(true);
    const token = getToken();
    if (!token) {
      toast.error("Authentication token not found. Please login.");
      setSubmitting(false);
      return;
    }

    const requestFormData = { // Renamed to avoid conflict with browser FormData
      name: name,
      last_name: last_name,
      email: email,
      phone: phone,
      address: address,
      dateOfBirth: dateOfBirth || null, // Send null if empty
      loan_purpose: purpose,
      loan_amount: parseFloat(amount) || null, // Send null if empty or invalid
      date: date,
    };

    console.log("Form Data to Send: ", requestFormData);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      if (editingId) {
        await axios.put(`${API_URL}${editingId}/`, requestFormData, { headers });
        // Update local state more reliably by re-fetching or using the response
        // For now, optimistic update:
        setLoanRequests((prev) =>
          prev.map((item) => (item.id === editingId ? { ...item, ...requestFormData, id: editingId } : item))
        );
        toast.success("Loan request updated successfully!");
      } else {
        const response = await axios.post(API_URL, requestFormData, { headers });
        setLoanRequests((prev) => [...prev, response.data]);
        toast.success("Loan request added successfully!");
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting data:", error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || (editingId ? "Failed to update loan request." : "Failed to add loan request.");
      // If backend returns field errors:
      if (error.response?.data && typeof error.response.data === 'object' && !error.response.data.detail && !error.response.data.message) {
          let fieldErrors = Object.entries(error.response.data).map(([key, value]) => `${key}: ${value.join ? value.join(', ') : value}`).join('; ');
          toast.error(`Submission failed: ${fieldErrors}`);
      } else {
          toast.error(errorMsg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setDateOfBirth("");
    setPurpose("");
    setAmount("");
    setDate("");
    setEditingId(null);
    setShowForm(false);
    setEmailError("");
  };

  const handleEdit = (item) => {
    setName(item.name || "");
    setLastName(item.last_name || "");
    setEmail(item.email || "");
    setPhone(item.phone || "");
    setAddress(item.address || "");
    setDateOfBirth(item.dateOfBirth || "");
    setPurpose(item.loan_purpose || "");
    setAmount(String(item.loan_amount || "")); // Ensure amount is string for input
    setDate(item.date || "");
    setEditingId(item.id);
    setShowForm(true);
    setEmailError(""); // Clear email error on edit
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this loan request?")) {
      const token = getToken();
      if (!token) {
        toast.error("Authentication token not found. Please login.");
        return;
      }
      try {
        await axios.delete(`${API_URL}${id}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setLoanRequests(loanRequests.filter((item) => item.id !== id));
        toast.success("Loan request deleted successfully!");
      } catch (error) {
        console.error("Error deleting loan request:", error);
        const errorMsg = error.response?.data?.detail || "Failed to delete loan request.";
        toast.error(errorMsg);
      }
    }
  };

  const handleChatRedirect = (item) => {
    console.log("Redirecting with item to /loanform:", item);
    navigate('/applicantform', { // Assuming '/loanform' is your LoanApplicationForm route
      state: { // Pass data as state to prefill the form
        first_name: item.name || '',
        last_name: item.last_name || '',
        email: item.email || '',
        dateOfBirth: item.dateOfBirth || '', // Ensure this is in YYYY-MM-DD if date input
        phone: item.phone || '',
        // Add other fields from 'item' that LoanApplicationForm expects
      }
    });
  };

  document.title = "Loan Request | SPK Finance";

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="mb-3 align-items-center">
          <Col>
            <h2 className="page-title mb-0">Loan Requests Management</h2>
          </Col>
          <Col className="text-end">
            <Button color="primary" onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); else setEditingId(null); }} className="shadow-sm">
              <FeatherIcon icon={showForm ? "x" : "plus-circle"} className="me-2" />
              {showForm ? "Close Form" : "New Loan Request"}
            </Button>
          </Col>
        </Row>

        {showForm && (
          <Row className="justify-content-center mt-3 mb-4">
            <Col lg={10} xl={8}> {/* Adjusted column size for better form layout */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-light py-3">
                  <h4 className="card-title mb-0 text-primary text-center">
                    <FeatherIcon icon={editingId ? "edit" : "file-plus"} className="me-2" />
                    {editingId ? "Edit Loan Request" : "Add New Loan Request"}
                  </h4>
                </CardHeader>
                <CardBody className="p-4">
                  <Form onSubmit={handleSubmit}>
                    {/* Form groups... */}
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="name">First Name <span className="text-danger">*</span></Label>
                          <Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="last_name">Last Name</Label>
                          <Input type="text" id="last_name" value={last_name} onChange={(e) => setLastName(e.target.value)} />
                        </FormGroup>
                      </Col>
                    </Row>
                     <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="email">Email</Label>
                          <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={validateEmail} invalid={!!emailError} />
                          {emailError && <div className="invalid-feedback d-block">{emailError}</div>}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="phone">Phone Number <span className="text-danger">*</span></Label>
                          <Input type="tel" id="phone" value={phone} maxLength={10} onChange={(e) => /^\d*$/.test(e.target.value) && setPhone(e.target.value)} onBlur={validatePhone} required />
                        </FormGroup>
                      </Col>
                    </Row>
                    <FormGroup>
                      <Label for="address">Address</Label>
                      <Input type="textarea" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </FormGroup>
                     <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="dateOfBirth">Date of Birth</Label>
                          <Input type="date" id="dateOfBirth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="date">Request Date <span className="text-danger">*</span></Label>
                          <Input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="purpose">Loan Purpose <span className="text-danger">*</span></Label>
                          <Input type="text" id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} required />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="amount">Loan Amount <span className="text-danger">*</span></Label>
                          <Input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" step="any" required />
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-3">
                      <Button color="primary" type="submit" disabled={submitting} className="me-2">
                        {submitting ? <Spinner size="sm" className="me-1" /> : <FeatherIcon icon={editingId ? "save" : "plus"} size="16" className="me-1" />}
                        {editingId ? "Update Request" : "Submit Request"}
                      </Button>
                      <Button color="secondary" type="button" onClick={resetForm}>
                        <FeatherIcon icon="x" size="16" className="me-1" /> Cancel
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
        
        {/* Table Section */}
        <Row className="mt-4">
          <Col>
            <Card className="shadow-sm border-0">
              <CardHeader className="bg-light py-3">
                <h4 className="card-title mb-0 text-primary d-flex align-items-center">
                    <FeatherIcon icon="list" className="me-2" /> Current Loan Requests
                </h4>
              </CardHeader>
              <CardBody>
                {loading && (
                  <div className="text-center my-3">
                    <Spinner color="primary" /> <p>Loading requests...</p>
                  </div>
                )}
                {error && !loading && <Alert color="danger">{error}</Alert>}
                {!loading && !error && loanRequests.length === 0 && (
                  <Alert color="info">No loan requests found.</Alert>
                )}
                {!loading && !error && loanRequests.length > 0 && (
                  <div className="table-responsive">
                    <Table hover striped bordered className="align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Full Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Purpose</th>
                          <th className="text-end">Amount</th>
                          <th>Req. Date</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loanRequests.slice().reverse().map((item, index) => ( // Show newest first
                          <tr key={item.id}>
                            <td>{loanRequests.length - index}</td>
                            <td>{item.name} {item.last_name || ''}</td>
                            <td>{item.email || '-'}</td>
                            <td>{item.phone}</td>
                            <td>{item.loan_purpose}</td>
                            <td className="text-end">₹{parseFloat(item.loan_amount || 0).toLocaleString('en-IN')}</td>
                            <td>{item.date ? new Date(item.date).toLocaleDateString('en-IN') : '-'}</td>
                            <td className="text-center">
                              <Button color="light" size="sm" className="btn-icon me-1 border" title="Edit" onClick={() => handleEdit(item)}>
                                <FeatherIcon icon="edit-2" size="16" className="text-primary" />
                              </Button>
                              <Button color="light" size="sm" className="btn-icon me-1 border" title="Delete" onClick={() => handleDelete(item.id)}>
                                <FeatherIcon icon="trash-2" size="16" className="text-danger" />
                              </Button>
                              <Button color="light" size="sm" className="btn-icon border" title="Proceed to Loan Application" onClick={() => handleChatRedirect(item)}>
                                <FeatherIcon icon="arrow-right-circle" size="16" className="text-success" />
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
  );
}

export default LoanRequest;