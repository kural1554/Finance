import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Card, CardHeader, Container, CardBody, Col, Row,
    FormGroup, Form, Label, Button, Input, Table, Spinner, Alert
} from "reactstrap";
import FeatherIcon from "feather-icons-react";

function Cashflow() {
    const [date, setDate] = useState("");
    const [incomeAmount, setIncomeAmount] = useState("");
    const [outgoingAmount, setOutgoingAmount] = useState("");
    const [cashflows, setCashflows] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null); // Track edit mode

    const API_URL = "http://127.0.0.1:8080/api/cashflow/";

    // Fetch data from API
    useEffect(() => {
        setLoading(true);
        axios.get(API_URL)
            .then((response) => {
                setCashflows(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError("Failed to fetch cashflow data.");
                setLoading(false);
            });
    }, []);

    // Handle form submission (Create or Update)
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            date: date,
            income_amount: parseFloat(incomeAmount),
            outgoing_amount: parseFloat(outgoingAmount),
        };

        try {
            if (editingId) {
                // Update existing record
                await axios.put(`${API_URL}${editingId}/`, formData);
                setCashflows((prev) =>
                    prev.map((item) => (item.id === editingId ? { ...item, ...formData } : item))
                );
                alert("Entry updated successfully!");
            } else {
                // Create new entry
                const response = await axios.post(API_URL, formData);
                setCashflows([...cashflows, response.data]);
                alert("Entry added successfully!");
            }

            // Reset form
            resetForm();
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Failed to submit data.");
        }
    };

    // Handle delete action
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            try {
                await axios.delete(`${API_URL}${id}/`);
                setCashflows(cashflows.filter((item) => item.id !== id));
                alert("Entry deleted successfully!");
            } catch (error) {
                console.error("Error deleting entry:", error);
                alert("Failed to delete entry.");
            }
        }
    };

    // Handle edit action
    const handleEdit = (item) => {
        setDate(item.date);
        setIncomeAmount(item.income_amount);
        setOutgoingAmount(item.outgoing_amount);
        setEditingId(item.id);
        setShowForm(true);
    };

    // Reset form state
    const resetForm = () => {
        setDate("");
        setIncomeAmount("");
        setOutgoingAmount("");
        setEditingId(null);
        setShowForm(false);
    };

    // Calculate total cashflow balance
    // const totalIncome = cashflows.reduce((sum, item) => sum + item.income_amount, 0);
    // const totalOutgoing = cashflows.reduce((sum, item) => sum + item.outgoing_amount, 0);
    // const netBalance = totalIncome - totalOutgoing;

    document.title = "Cashflow | SPK Finance";

    return (
        <div className="page-content">
            <Container fluid>
                {/* Top Bar with Button */}
                <Row className="justify-content-between align-items-center mt-3">
                    <Col>
                        <h3>Cashflow Management</h3>
                    </Col>
                    <Col className="text-end">
                        <Button color="primary" onClick={() => setShowForm(!showForm)}>
                            <FeatherIcon icon="plus-circle" className="me-2" />
                            {showForm ? "Close Form" : "New Cashflow"}
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
                                    <h4 className="card-title">{editingId ? "Edit Cashflow" : "Add Cashflow"}</h4>
                                </CardHeader>
                                <CardBody>
                                    <Form onSubmit={handleSubmit}>
                                        <FormGroup>
                                            <Label for="date">Date</Label>
                                            <Input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="incomeAmount">Income Amount</Label>
                                            <Input type="number" id="incomeAmount" placeholder="Enter Income Amount" value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} min={0} required />
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="outgoingAmount">Outgoing Amount</Label>
                                            <Input type="number" id="outgoingAmount" placeholder="Enter Outgoing Amount" value={outgoingAmount} onChange={(e) => setOutgoingAmount(e.target.value)} min={0} required />
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

                {/* Cashflow Records */}
                <Row className="justify-content-center mt-5">
                    <Col md={8}>
                        <Card>
                            <CardHeader className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">Cashflow Records</h4>
                            </CardHeader>
                            <CardBody>
                                <Table bordered>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Income Amount</th>
                                            <th>Outgoing Amount</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cashflows.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.date}</td>
                                                <td>{item.income_amount}</td>
                                                <td>{item.outgoing_amount}</td>
                                                <td>
                                                    <Button color="warning" size="sm" onClick={() => handleEdit(item)}>
                                                        <FeatherIcon icon="edit" />
                                                    </Button>{" "}
                                                    <Button color="danger" size="sm" onClick={() => handleDelete(item.id)}>
                                                        <FeatherIcon icon="trash-2" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>

                                {/* Total Balance */}
                                {/* <h5 className="mt-3">Total Balance: ₹{netBalance.toFixed(2)}</h5> */}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Cashflow;
