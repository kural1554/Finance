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
        navigate('/loanform', { state: { first_name: item.name } });
    };
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
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

    // Handle form submission (Create or Update)
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            name: name,
            phone: phone,
            loan_purpose: purpose,
            loan_amount: parseFloat(amount),
            date: date,
        };
        console.log(formData);
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
        setPhone("");
        setPurpose("");
        setAmount("");
        setDate("");
        setEditingId(null);
        setShowForm(false);
    };

    // Handle edit action
    const handleEdit = (item) => {
        setName(item.name);
        setPhone(item.phone);
        setPurpose(item.loan_purpose);
        setAmount(item.loan_amount);
        setDate(item.date)
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
                        <Col md={6}>
                            <Card>
                                <CardHeader className="text-center">
                                    <h4 className="card-title">{editingId ? "Edit Loan Request" : "Add Loan Request"}</h4>
                                </CardHeader>
                                <CardBody>
                                    <Form onSubmit={handleSubmit}>
                                        <FormGroup>
                                            <Label for="name">Name</Label>
                                            <Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="phone">Phone Number</Label>
                                            <Input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="purpose">Loan Purpose</Label>
                                            <Input type="text" id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} required />
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="amount">Loan Amount</Label>
                                            <Input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} min={0} required />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="date">Request Data</Label>
                                            <Input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                                        </FormGroup>

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
                    <Col md={8}>
                        <Card>
                            <CardHeader className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">Loan Requests</h4>
                            </CardHeader>
                            <CardBody>
                                <Table bordered>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Phone Number</th>
                                            <th>Loan Purpose</th>
                                            <th>Loan Amount</th>
                                            <th>Request Date</th>
                                            {/* <th>Status</th> */}
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loanRequests.map((item) => (
                                            <tr key={item.id} style={{ backgroundColor: item.status === 'approved' ? 'green' : 'red', color: 'white' }}>
                                                <td>{item.name}</td>
                                                <td>{item.phone}</td>
                                                <td>{item.loan_purpose}</td>
                                                <td>{item.loan_amount}</td>
                                                <td>{item.date}</td>
                                                {/* <td>{item.status}</td> */}
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
