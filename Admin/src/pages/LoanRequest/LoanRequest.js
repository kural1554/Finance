import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card, CardHeader, Container, CardBody, Col, Row,
  FormGroup, Form, Label, Button, Input, Table, Spinner, Alert
} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import { useNavigate } from "react-router-dom";

function LoanRequest() {
  const navigate = useNavigate();

  const handleChatRedirect = (item) => {
    console.log("Redirecting with item:", item); // Debug line

    navigate('/loanform', {
      state: {
        first_name: item.name || '',
        last_name: item.last_name || '',
        email: item.email || '',
        dateOfBirth: item.dateOfBirth || '',
        phone: item.phone || '',
      }
    });
  };


  // State for form fields
  const [name, setName] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const [loanRequests, setLoanRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const API_URL = `${process.env.REACT_APP_API_BASE_URL}/loanrequest/`;

  // Fetch loan requests from API
  useEffect(() => {
    setLoading(true);
    axios
      .get(API_URL)
      .then((response) => {
        setLoanRequests(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching loan requests:", error);
        setError("Failed to fetch loan request data.");
        setLoading(false);
      });
  }, []);
  //email validaction
  const [emailError, setEmailError] = useState("");

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (event) => {
    console.log('this funcation is tigreed');

    event.preventDefault();

    const formData = {
      name: name,
      last_name: last_name,
      email: email,
      phone: phone,
      address: address,
      dateOfBirth: dateOfBirth,
      loan_purpose: purpose,
      loan_amount: parseFloat(amount),
      date: date,
    };

    console.log("Form Data to Send: ", formData);
    try {
      if (editingId) {
        // Update existing record
        await axios.put(`${API_URL}${editingId}/`, formData);
        setLoanRequests((prev) =>
          prev.map((item) => (item.id === editingId ? { ...item, ...formData } : item))
        );
        alert("Loan request updated successfully!");
      } else {
        // Create new loan request
        const response = await axios.post(API_URL, formData);
        setLoanRequests([...loanRequests, response.data]);
        alert("Loan request added successfully!");
      }

      // Reset form
      resetForm();
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit loan request.");
    }
  };

  // Reset form state
  const resetForm = () => {
    setName("");
    setlast_name("");
    setEmail("");
    setPhone("");
    setAddress("");
    setDateOfBirth("");
    setPurpose("");
    setAmount("");
    setDate("");
    setEditingId(null);
    setShowForm(false);
  };

  // Handle edit action
  const handleEdit = (item) => {
    setName(item.name);
    setlast_name(item.last_name || "");
    setEmail(item.email || "");
    setPhone(item.phone);
    setAddress(item.address || "");
    setDateOfBirth(item.dateOfBirth || "");
    setPurpose(item.loan_purpose);
    setAmount(item.loan_amount);
    setDate(item.date);
    setEditingId(item.id);
    setShowForm(true);
  };

  // Handle delete action
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this loan request?")) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        setLoanRequests(loanRequests.filter((item) => item.id !== id));
        alert("Loan request deleted successfully!");
      } catch (error) {
        console.error("Error deleting loan request:", error);
        alert("Failed to delete loan request.");
      }
    }
  };

  document.title = "Loan Request | SPK Finance";

  return (
    <div className="page-content">
      <Container fluid>
        {/* Top Bar with Button */}
        <Row className="justify-content-between align-items-center mt-3">
          <Col>
            <h3>Loan Request Form</h3>
          </Col>
          <Col className="text-end">
            <Button color="primary" onClick={() => setShowForm(!showForm)}>
              <FeatherIcon icon="plus-circle" className="me-2" />
              {showForm ? "Close Form" : "New Loan Request"}
            </Button>
          </Col>
        </Row>

        {/* Error Message */}
        {error && <Alert color="danger">{error}</Alert>}

        {/* Form Section */}
        {showForm && (
          <Row className="justify-content-center mt-3">
            <Col md={8}>
              <Card>
                <CardHeader className="text-center">
                  <h4 className="card-title">{editingId ? "Edit Loan Request" : "Add Loan Request"}</h4>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="name">First Name</Label>
                          <Input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="last_name">Last Name</Label>
                          <Input
                            type="text"
                            id="last_name"
                            value={last_name}
                            onChange={(e) => setlast_name(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="email">Email</Label>
                          <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={validateEmail}
                            invalid={!!emailError}
                          />
                          {emailError && (
                            <div className="text-danger small mt-1">{emailError}</div>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="phone">Phone Number</Label>
                          <Input
                            type="text"
                            id="phone"
                            value={phone}
                            maxLength={10} // optional but useful
                            onChange={(e) => {
                              const value = e.target.value;
                              // Allow only digits
                              if (/^\d*$/.test(value)) {
                                setPhone(value);
                              }
                            }}
                            onBlur={() => {
                              if (phone.length !== 10) {
                                alert("Phone number must be exactly 10 digits");
                              }
                            }}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <FormGroup>
                      <Label for="address">Address</Label>
                      <Input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </FormGroup>

                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="dateOfBirth">Date of Birth</Label>
                          <Input
                            type="date"
                            id="dateOfBirth"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="date">Request Date</Label>
                          <Input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="purpose">Loan Purpose</Label>
                          <Input
                            type="text"
                            id="purpose"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="amount">Loan Amount</Label>
                          <Input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min={0}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="text-end">
                      <Button color="primary" type="submit">
                        {editingId ? "Update" : "Submit"}
                      </Button>
                      {editingId && (
                        <Button color="secondary" className="ms-2" onClick={resetForm}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        {/* Loading Spinner */}
        {loading && <Spinner color="primary" className="mt-3" />}

        {/* Loan Requests Table */}
        <Row className="justify-content-center mt-5">
          <Col md={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Loan Requests</h4>
              </CardHeader>
              <CardBody>
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>DOB</th>
                      <th>Purpose</th>
                      <th>Amount</th>
                      <th>Request Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...loanRequests].reverse().map((item, index) => (
                      <tr
                        key={item.id}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#ffffff' : '#dbefff',
                        }}
                      >
                        <td>{item.name}</td>
                        <td>{item.last_name || '-'}</td>
                        <td>{item.email || '-'}</td>
                        <td>{item.phone}</td>
                        <td>{item.address || '-'}</td>
                        <td>{item.dateOfBirth || '-'}</td>
                        <td>{item.loan_purpose}</td>
                        <td>{item.loan_amount}</td>
                        <td>{item.date}</td>
                        <td>
                          <div className="d-flex gap-3">
                            <Button color="warning" size="sm" onClick={() => handleEdit(item)}>
                              <FeatherIcon icon="edit" />
                            </Button>
                            <Button color="danger" size="sm" onClick={() => handleDelete(item.id)}>
                              <FeatherIcon icon="trash-2" />
                            </Button>
                            <Button color="success" size="sm" onClick={() => handleChatRedirect(item)}>
                              <FeatherIcon icon="zap" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LoanRequest;
