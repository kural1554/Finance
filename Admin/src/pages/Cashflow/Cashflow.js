import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Card,
    CardHeader,
    Container,
    CardBody,
    Col,
    Row,
    FormGroup,
    Form,
    Label,
    Button,
    Input,
    Table,
} from "reactstrap";
import FeatherIcon from "feather-icons-react";

function Cashflow() {
    const [date, setDate] = useState("");
    const [incomeAmount, setIncomeAmount] = useState("");
    const [outgoingAmount, setOutgoingAmount] = useState("");
    const [cashflows, setCashflows] = useState([]);
    const [showForm, setShowForm] = useState(false); // Control form visibility

    const API_URL = "http://localhost:8000/cashflows/";

    // Fetch data from Django API
    useEffect(() => {
        axios
            .get(API_URL)
            .then((response) => {
                setCashflows(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            date: date,
            income_amount: incomeAmount,
            outgoing_amount: outgoingAmount,
        };

        try {
            const response = await axios.post(API_URL, formData);
            alert("Data submitted successfully!");

            // Update UI with new entry
            setCashflows([...cashflows, response.data]);

            // Clear form fields
            setDate("");
            setIncomeAmount("");
            setOutgoingAmount("");

            // Hide form after submission
            setShowForm(false);
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };
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

                {/* Form Section */}
                {showForm && (
                    <Row className="justify-content-center mt-3">
                        <Col md={6}>
                            <Card>
                                <CardHeader className="text-center">
                                    <h4 className="card-title">CashFlow Form</h4>
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
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="outgoingAmount">Outgoing Amount</Label>
                                            <Input
                                                type="number"
                                                id="outgoingAmount"
                                                placeholder="Enter Outgoing Amount"
                                                min={0}
                                                value={outgoingAmount}
                                                onChange={(e) => setOutgoingAmount(e.target.value)}
                                               
                                            />
                                        </FormGroup>

                                        <div className="text-end">
                                            <Button color="primary" type="submit">
                                                Submit
                                            </Button>
                                        </div>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )}

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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cashflows.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.date}</td>
                                                <td>{item.income_amount}</td>
                                                <td>{item.outgoing_amount}</td>
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
