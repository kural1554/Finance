import React, { useState, useEffect, useMemo } from "react"; // Added useMemo
import axios from "axios";
import {
    Card, CardHeader, Container, CardBody, Col, Row,
    FormGroup, Form, Label, Button, Input, Table, Spinner, Alert
} from "reactstrap";
import FeatherIcon from "feather-icons-react";

function Cashflow() {
    // Form states
    const [date, setDate] = useState("");
    const [incomeAmount, setIncomeAmount] = useState("");
    const [outgoingAmount, setOutgoingAmount] = useState("");
    
    // Data and UI states
    const [cashflows, setCashflows] = useState([]); // Original data from API
    const [filteredCashflows, setFilteredCashflows] = useState([]); // Data to display in table
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);

    // Filter states
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");

    // Summary states
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalOutgoing, setTotalOutgoing] = useState(0);
    const [netBalance, setNetBalance] = useState(0);


    // API base URL from .env
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const cashflowURL = `${API_BASE_URL}api/cashflow/`; // Make sure this ends with a slash if your DRF urls do

    // Fetch initial cashflows
    useEffect(() => {
        const fetchCashflows = async () => {
            setLoading(true);
            setError(null); // Reset error on new fetch
            try {
                const response = await axios.get(cashflowURL);
                setCashflows(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Fetch error:", error);
                setError("Failed to fetch cashflow data. " + (error.response?.data?.detail || error.message));
                setLoading(false);
            }
        };
        fetchCashflows();
    }, [cashflowURL]); // cashflowURL is stable, so this runs once

    // Apply filters when cashflows or filter dates change
    useEffect(() => {
        let filteredData = [...cashflows]; // Start with all cashflows

        if (filterStartDate) {
            filteredData = filteredData.filter(item => 
                new Date(item.date) >= new Date(filterStartDate)
            );
        }
        if (filterEndDate) {
            filteredData = filteredData.filter(item => 
                new Date(item.date) <= new Date(filterEndDate)
            );
        }
        setFilteredCashflows(filteredData.sort((a, b) => new Date(a.date) - new Date(b.date))); // Sort by date
    }, [cashflows, filterStartDate, filterEndDate]);

    // Calculate summary when filteredCashflows change
    useEffect(() => {
        let incomeSum = 0;
        let outgoingSum = 0;

        filteredCashflows.forEach(item => {
            incomeSum += parseFloat(item.income_amount || 0);
            outgoingSum += parseFloat(item.outgoing_amount || 0);
        });

        setTotalIncome(incomeSum);
        setTotalOutgoing(outgoingSum);
        setNetBalance(incomeSum - outgoingSum);
    }, [filteredCashflows]);


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Indicate loading during submission

        // Basic validation
        if (!date) {
            alert("Please select a date.");
            setLoading(false);
            return;
        }
        const income = parseFloat(incomeAmount || 0); // Default to 0 if empty
        const outgoing = parseFloat(outgoingAmount || 0); // Default to 0 if empty

        if (income < 0 || outgoing < 0) {
            alert("Amounts cannot be negative.");
            setLoading(false);
            return;
        }
        if (income === 0 && outgoing === 0) {
            alert("Please enter either an income or an outgoing amount.");
            setLoading(false);
            return;
        }


        const formData = {
            date: date,
            income_amount: income,
            outgoing_amount: outgoing,
        };

        try {
            if (editingId) {
                await axios.put(`${cashflowURL}${editingId}/`, formData);
                // Update local state more reliably by re-fetching or by using the response
                setCashflows((prev) =>
                    prev.map((item) => (item.id === editingId ? { id: editingId, ...formData } : item))
                );
                toast.success("Entry updated successfully!");
            } else {
                const response = await axios.post(cashflowURL, formData);
                setCashflows([...cashflows, response.data]); // Add new entry to original list
                toast.success("Entry added successfully!");
            }
            resetForm();
        } catch (error) {
            console.error("Error submitting data:", error);
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || "Failed to submit data.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            try {
                await axios.delete(`${cashflowURL}${id}/`);
                setCashflows(cashflows.filter((item) => item.id !== id)); // Remove from original list
                toast.success("Entry deleted successfully!");
            } catch (error) {
                console.error("Error deleting entry:", error);
                toast.error("Failed to delete entry.");
            }
        }
    };

    const handleEdit = (item) => {
        setDate(item.date); // Assumes date is in YYYY-MM-DD format
        setIncomeAmount(String(item.income_amount)); // Convert to string for input value
        setOutgoingAmount(String(item.outgoing_amount)); // Convert to string
        setEditingId(item.id);
        setShowForm(true); // Open the form for editing
    };

    const resetForm = () => {
        setDate("");
        setIncomeAmount("");
        setOutgoingAmount("");
        setEditingId(null);
        setShowForm(false); // Close form after submission/cancel
    };
    
    const handleClearFilters = () => {
        setFilterStartDate("");
        setFilterEndDate("");
    };


    document.title = "Cashflow | SPK Finance";

    return (
        <div className="page-content">
            <Container fluid>
                <Row className="justify-content-between align-items-center mt-3 mb-3">
                    <Col>
                        <h3>Cashflow Management</h3>
                    </Col>
                    <Col className="text-end">
                        <Button color="primary" onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); /* Reset if closing */}}>
                            <FeatherIcon icon={showForm ? "x-circle" : "plus-circle"} className="me-2" />
                            {showForm ? "Close Form" : "New Cashflow"}
                        </Button>
                    </Col>
                </Row>

                {error && <Alert color="danger" className="mt-2">{error}</Alert>}

                {showForm && (
                    <Row className="justify-content-center mt-3">
                        <Col md={8} lg={6}> {/* Adjusted column size */}
                            <Card>
                                <CardHeader className="text-center bg-light">
                                    <h4 className="card-title mb-0">{editingId ? "Edit Cashflow Entry" : "Add New Cashflow Entry"}</h4>
                                </CardHeader>
                                <CardBody>
                                    <Form onSubmit={handleSubmit}>
                                        <FormGroup>
                                            <Label for="date">Date <span className="text-danger">*</span></Label>
                                            <Input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                                        </FormGroup>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="incomeAmount">Income Amount</Label>
                                                    <Input type="number" id="incomeAmount" placeholder="0.00" value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} min="0" step="0.01" />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="outgoingAmount">Outgoing Amount</Label>
                                                    <Input type="number" id="outgoingAmount" placeholder="0.00" value={outgoingAmount} onChange={(e) => setOutgoingAmount(e.target.value)} min="0" step="0.01" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <div className="d-flex justify-content-end mt-2">
                                            <Button color="secondary" type="button" onClick={resetForm} className="me-2">
                                                Cancel
                                            </Button>
                                            <Button color="primary" type="submit" disabled={loading}>
                                                {loading ? <Spinner size="sm" /> : (editingId ? "Update Entry" : "Add Entry")}
                                            </Button>
                                        </div>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* Filter Section */}
                <Row className="mt-4 mb-3 align-items-end">
                    <Col md={4}>
                        <FormGroup>
                            <Label for="filterStartDate">Filter From Date:</Label>
                            <Input type="date" id="filterStartDate" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} />
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="filterEndDate">Filter To Date:</Label>
                            <Input type="date" id="filterEndDate" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} />
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                         <Button color="info" outline onClick={handleClearFilters} className="w-100 mb-3 mb-md-0" style={{paddingTop:'0.65rem', paddingBottom:'0.65rem'}}>
                            Clear Filters
                        </Button>
                    </Col>
                </Row>

                {/* Summary Section */}
                <Row className="mt-3 mb-4">
                    <Col md={4}>
                        <Card body className="text-center shadow-sm border-success">
                            <h5 className="text-success">Total Income</h5>
                            <h4>₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card body className="text-center shadow-sm border-danger">
                            <h5 className="text-danger">Total Outgoing</h5>
                            <h4>₹{totalOutgoing.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card body className={`text-center shadow-sm ${netBalance >= 0 ? 'border-primary' : 'border-warning'}`}>
                            <h5 className={netBalance >= 0 ? 'text-primary' : 'text-warning'}>Net Balance</h5>
                            <h4>₹{netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                        </Card>
                    </Col>
                </Row>


                {loading && !cashflows.length && <div className="text-center mt-3"><Spinner color="primary" /> <p>Loading records...</p></div>}

                <Row className="justify-content-center mt-3">
                    <Col md={10}> {/* Wider column for the table */}
                        <Card>
                            <CardHeader className="d-flex justify-content-between align-items-center bg-light">
                                <h4 className="mb-0">Cashflow Records {filteredCashflows.length > 0 && `(${filteredCashflows.length})`}</h4>
                                {/* Optional: Add export button or other actions here */}
                            </CardHeader>
                            <CardBody>
                                {filteredCashflows.length > 0 ? (
                                    <Table bordered hover responsive striped className="align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Date</th>
                                                <th className="text-end">Income (₹)</th>
                                                <th className="text-end">Outgoing (₹)</th>
                                                <th className="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCashflows.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{new Date(item.date).toLocaleDateString('en-GB')}</td>
                                                    <td className="text-end text-success">
                                                        {parseFloat(item.income_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="text-end text-danger">
                                                        {parseFloat(item.outgoing_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="text-center">
                                                        <Button color="warning" size="sm" onClick={() => handleEdit(item)} className="me-1">
                                                            <FeatherIcon icon="edit-2" size="16" />
                                                        </Button>
                                                        <Button color="danger" size="sm" onClick={() => handleDelete(item.id)}>
                                                            <FeatherIcon icon="trash-2" size="16" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <div className="text-center p-3">
                                        {loading ? <Spinner size="sm" /> : "No cashflow records found for the selected criteria."}
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

export default Cashflow;