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
    const [editingId, setEditingId] = useState(null);

    // API base URL from .env
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ;
    const cashflowURL = `${API_BASE_URL}api/cashflow/`;

    useEffect(() => {
        const fetchCashflows = async () => {
            setLoading(true);
            try {
                const response = await axios.get(cashflowURL);
                setCashflows(response.data);
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch cashflow data.");
                setLoading(false);
            }
        };
        fetchCashflows();
    }, [cashflowURL]);

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
                await axios.put(`${cashflowURL}${editingId}/`, formData);
                setCashflows((prev) =>
                    prev.map((item) => (item.id === editingId ? { ...item, ...formData } : item))
                );
                alert("Entry updated successfully!");
            } else {
                // Create new entry
                const response = await axios.post(cashflowURL, formData);
                setCashflows([...cashflows, response.data]);
                alert("Entry added successfully!");
            }

            resetForm();
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Failed to submit data.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            try {
                await axios.delete(`${cashflowURL}${id}/`);
                setCashflows(cashflows.filter((item) => item.id !== id));
                alert("Entry deleted successfully!");
            } catch (error) {
                console.error("Error deleting entry:", error);
                alert("Failed to delete entry.");
            }
        }
    };

    const handleEdit = (item) => {
        setDate(item.date);
        setIncomeAmount(item.income_amount);
        setOutgoingAmount(item.outgoing_amount);
        setEditingId(item.id);
        setShowForm(true);
    };

    const resetForm = () => {
        setDate("");
        setIncomeAmount("");
        setOutgoingAmount("");
        setEditingId(null);
        setShowForm(false);
    };

    document.title = "Cashflow | SPK Finance";

    return (
        <div className="page-content">
            <Container fluid>
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

                {error && <Alert color="danger">{error}</Alert>}

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
                                            <Input
                                                type="date"
                                                id="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                required
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="incomeAmount">Income Amount</Label>
                                            <Input
                                                type="number"
                                                id="incomeAmount"
                                                placeholder="Enter Income Amount"
                                                value={incomeAmount}
                                                onChange={(e) => setIncomeAmount(e.target.value)}
                                                min={0}
                                                required
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="outgoingAmount">Outgoing Amount</Label>
                                            <Input
                                                type="number"
                                                id="outgoingAmount"
                                                placeholder="Enter Outgoing Amount"
                                                value={outgoingAmount}
                                                onChange={(e) => setOutgoingAmount(e.target.value)}
                                                min={0}
                                                required
                                            />
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

                {loading && <Spinner color="primary" className="mt-3" />}

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
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Cashflow;
