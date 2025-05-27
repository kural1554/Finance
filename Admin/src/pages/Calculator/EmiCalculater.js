import React, { useState } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, CardTitle, Table, Button, Spinner, Alert, FormGroup, Form, Input, Label, FormText } from 'reactstrap';
import { toast } from "react-toastify";
import FeatherIcon from "feather-icons-react";

// Helper to format currency
const formatCurrency = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "₹0.00";
    return `₹${numValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Helper to calculate EMI start dates (first EMI one period after loan start)
const calculateEMIStartDatesForSchedule = (startDateString, numberOfInstallments, termType) => {
    if (!startDateString || !numberOfInstallments || !termType) return [];
    const dates = [];
    let emiDateBase = new Date(startDateString); 

    for (let i = 0; i < numberOfInstallments; i++) {
        let currentEmiDate = new Date(emiDateBase); // Work with a copy for each iteration's start
        if (i === 0) { // First EMI is one period from loan start date
             switch (termType.toLowerCase()) {
                case "days": currentEmiDate.setDate(currentEmiDate.getDate() + 1); break;
                case "weeks": currentEmiDate.setDate(currentEmiDate.getDate() + 7); break;
                case "months": currentEmiDate.setMonth(currentEmiDate.getMonth() + 1); break;
                case "years": currentEmiDate.setMonth(currentEmiDate.getMonth() + 1); break;
                default: return [];
            }
        } else { // Subsequent EMIs are one period from the previous EMI date
            let previousEmiDate = new Date(dates[i-1]); // Get previous YYYY-MM-DD, convert to Date
             switch (termType.toLowerCase()) {
                case "days": previousEmiDate.setDate(previousEmiDate.getDate() + 1); currentEmiDate = previousEmiDate; break;
                case "weeks": previousEmiDate.setDate(previousEmiDate.getDate() + 7); currentEmiDate = previousEmiDate; break;
                case "months": previousEmiDate.setMonth(previousEmiDate.getMonth() + 1); currentEmiDate = previousEmiDate; break;
                case "years": previousEmiDate.setMonth(previousEmiDate.getMonth() + 1); currentEmiDate = previousEmiDate; break;
                default: return [];
            }
        }
        dates.push(currentEmiDate.toLocaleDateString('en-CA')); // YYYY-MM-DD
    }
    return dates;
};


const EmiCalculater = () => {
    // State Hooks for Inputs
    const [amount, setLoanAmount] = useState(""); // Renamed to match your snippet's usage
    const [interestRateInput, setInterestRate] = useState(""); // Renamed
    const [term, setLoanTerm] = useState(""); // Renamed
    const [termType, setTermType] = useState("months");
    const [interestType, setInterestType] = useState("1"); // 1: Diminishing, 2: Flat
    const [startDate, setStartDate] = useState(() => new Date().toLocaleDateString('en-CA'));


    // State Hooks for Results
    const [emiDetails, setEmiDetails] = useState([]);
    const [totalCalculatedPayment, setTotalCalculatedPayment] = useState(0);
    const [totalCalculatedPrincipal, setTotalCalculatedPrincipal] = useState(0);
    const [totalCalculatedInterest, setTotalCalculatedInterest] = useState(0);

    // UI State
    const [isCalculating, setIsCalculating] = useState(false);

    // This function adapts your provided calculateNewEMI logic
    const calculateUserSpecificEMI = () => {
        setIsCalculating(true);
        console.log("Calculating EMI with user-specific logic. Inputs:", { amount, term, interestRate: interestRateInput, termType, startDate, interestType });

        // Validation (using state variables directly)
        const requiredFieldsMap = { amount, term, interestRate: interestRateInput, termType, startDate, interestType };
        for (const fieldName in requiredFieldsMap) {
            if (!requiredFieldsMap[fieldName]) {
                toast.error(`Please fill the '${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}' field.`);
                setIsCalculating(false);
                return;
            }
        }

        let principal = parseFloat(amount);
        // annualRateDecimal in your snippet is derived from interestRateInput
        // For diminishing, your snippet uses this directly as periodicRate.
        // For flat, your snippet also uses this for the "diminishing simulation" part.
        const rateFromInputAsDecimal = parseFloat(interestRateInput) / 100;
        const termValue = parseInt(term);
        let numberOfInstallments;
        let periodicRate; // This will be the rate used in loops

        switch (termType.toLowerCase()) {
            case "days":
            case "weeks":
            case "months":
                numberOfInstallments = termValue;
                periodicRate = rateFromInputAsDecimal; // As per your snippet
                break;
            case "years":
                numberOfInstallments = termValue * 12; // Assuming monthly payments for yearly term
                periodicRate = rateFromInputAsDecimal / 12; // Your snippet uses annualRateDecimal directly for years too.
                                                      // If termType is years, and payments are monthly, periodic rate should be /12
                                                      // Let's follow your snippet:
                // periodicRate = rateFromInputAsDecimal; // If this is intended for yearly payments, it's an annual rate.
                                                      // If yearly term implies monthly payments, rate needs conversion.
                                                      // Sticking to your snippet's pattern where periodicRate = annualRateDecimal:
                periodicRate = rateFromInputAsDecimal; // If the termValue for "years" means "number of yearly payments"
                // IF "years" term implies monthly installments for N years:
                // numberOfInstallments = termValue * 12;
                // periodicRate = rateFromInputAsDecimal / 12;
                break;
            default:
                toast.error("Invalid loan term type.");
                setIsCalculating(false); return;
        }
        
        // If term type "years" implies number of yearly installments, and periodicRate is the annual rate.
        // If term type "years" implies N years of monthly installments, then:
        if (termType.toLowerCase() === "years") {
            // Assuming if user selects "years", they mean N years of *monthly* installments
            // And the input interestRate is annual.
            numberOfInstallments = termValue * 12;
            periodicRate = rateFromInputAsDecimal / 12;
        }


        if (numberOfInstallments <= 0 || periodicRate < 0 || isNaN(periodicRate)) {
            toast.error("Invalid loan term or interest rate for calculation.");
            setIsCalculating(false); return;
        }

        const generatedEmiStartDates = calculateEMIStartDatesForSchedule(startDate, numberOfInstallments, termType);
        if (!generatedEmiStartDates || generatedEmiStartDates.length !== numberOfInstallments) {
            toast.error("Could not generate correct EMI dates. Check loan start date and term.");
            console.error("EMI Dates mismatch:", generatedEmiStartDates, "Expected count:", numberOfInstallments);
            setIsCalculating(false); return;
        }

        let emiSchedule = [];
        let currentRemainingPrincipal = principal;
        let calcTotalPayment = 0, calcTotalPrincipal = 0, calcTotalInterest = 0;

        if (interestType === "1") { // Diminishing (as per your snippet)
            const principalPerInstallment = principal / numberOfInstallments;
            for (let i = 0; i < numberOfInstallments; i++) {
                const interestForPeriod = currentRemainingPrincipal * periodicRate;
                let actualPrincipalPaid = principalPerInstallment;

                if (i === numberOfInstallments - 1) {
                    actualPrincipalPaid = currentRemainingPrincipal;
                }
                const emiForPeriod = actualPrincipalPaid + interestForPeriod;
                currentRemainingPrincipal -= actualPrincipalPaid;
                if (Math.abs(currentRemainingPrincipal) < 0.001) {
                    currentRemainingPrincipal = 0;
                }
                // Correcting typo from your snippet for actualPrincipalPaidThisInstallment
                if (currentRemainingPrincipal < 0 && i === numberOfInstallments - 1) {
                    actualPrincipalPaid += currentRemainingPrincipal; // Adjust the current loop's principal
                    currentRemainingPrincipal = 0;
                }
                emiSchedule.push({
                    month: i + 1, emiStartDate: generatedEmiStartDates[i] || "N/A",
                    emiTotalMonth: parseFloat(emiForPeriod.toFixed(2)), interest: parseFloat(interestForPeriod.toFixed(2)),
                    principalPaid: parseFloat(actualPrincipalPaid.toFixed(2)), remainingBalance: parseFloat(Math.max(0, currentRemainingPrincipal).toFixed(2)),
                });
                calcTotalPayment += emiForPeriod; calcTotalPrincipal += actualPrincipalPaid; calcTotalInterest += interestForPeriod;
                if (currentRemainingPrincipal <= 0 && i < numberOfInstallments - 1) {
                    if(emiSchedule.length > 0) emiSchedule[emiSchedule.length-1].remainingBalance = 0;
                    break;
                }
            }
        } else if (interestType === "2") { // Flat Rate (as per your snippet's specific logic)
            // Step 1: Calculate total interest using a simulated diminishing method
            let totalInterestSimulated = 0;
            let remainingPrincipalForInterestSim = principal;
            const fixedPrincipalPaymentSim = principal / numberOfInstallments;

            for (let i = 0; i < numberOfInstallments; i++) { // Loop N times
                let interestForMonthSim = remainingPrincipalForInterestSim * periodicRate; // Using the same periodicRate
                totalInterestSimulated += interestForMonthSim;
                remainingPrincipalForInterestSim -= fixedPrincipalPaymentSim;
                if (remainingPrincipalForInterestSim < 0) remainingPrincipalForInterestSim = 0; // avoid negative
            }
            console.log("Flat Rate - Simulated Total Interest (diminishing method):", totalInterestSimulated);

            // Step 2: Add to principal and divide by months (installments)
            const totalRepayment = principal + totalInterestSimulated;
            const fixedEMI = totalRepayment / numberOfInstallments;
            let remainingPrincipalFlat = principal;

            // Step 3: Generate schedule
            for (let i = 0; i < numberOfInstallments; i++) { // Loop N times
                const principalPaidActual = principal / numberOfInstallments; // Fixed principal portion
                const interestPaidActual = fixedEMI - principalPaidActual; // Derived interest portion
                
                let actualPrincipalThisInstallment = principalPaidActual;
                if (i === numberOfInstallments -1 && Math.abs(remainingPrincipalFlat - actualPrincipalThisInstallment) > 0.001) {
                    actualPrincipalThisInstallment = remainingPrincipalFlat; // Adjust last principal
                }
                remainingPrincipalFlat -= actualPrincipalThisInstallment;
                if (Math.abs(remainingPrincipalFlat) < 0.001) {
                    remainingPrincipalFlat = 0;
                }

                emiSchedule.push({
                    month: i + 1, emiStartDate: generatedEmiStartDates[i] || "N/A",
                    emiTotalMonth: parseFloat(fixedEMI.toFixed(2)),
                    interest: parseFloat(interestPaidActual.toFixed(2)),
                    principalPaid: parseFloat(actualPrincipalThisInstallment.toFixed(2)),
                    remainingBalance: parseFloat(Math.max(0, remainingPrincipalFlat).toFixed(2))
                });
                calcTotalPayment += fixedEMI; calcTotalPrincipal += actualPrincipalThisInstallment; calcTotalInterest += interestPaidActual;
            }
        } else {
            toast.error("Invalid interest type selected.");
            setIsCalculating(false); return;
        }

        setEmiDetails(emiSchedule);
        setTotalCalculatedPayment(calcTotalPayment);
        setTotalCalculatedPrincipal(calcTotalPrincipal);
        setTotalCalculatedInterest(calcTotalInterest);
        setIsCalculating(false);

        if (emiSchedule.length > 0) {
            toast.success("EMI Schedule Calculated!");
            // setActiveTab(3); // If you have tabs
        } else {
            toast.error("Could not calculate EMI schedule.");
        }
    };

    document.title = "EMI Calculator | SPK Finance";

    // Label for interest rate based on type. Your snippet uses 'annualRateDecimal' as periodic for diminishing.
    // This implies the input 'interestRate' is always periodic if diminishing, annual if flat (for the sim).
    // For clarity, if diminishing is chosen, let's assume input is periodic. If flat, it's annual.
    const interestRateLabel = interestType === "1" ? "Interest Rate (% per Period)" : "Annual Interest Rate (%) for Sim.";
    const interestRatePlaceholder = interestType === "1" ? "e.g., 3 (for 3% per period)" : "e.g., 36 (for 36% p.a.)";


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader className="bg-primary text-white">
                                    <CardTitle tag="h5" className="mb-0 text-white">
                                        <FeatherIcon icon="tool" size="20" className="me-2" /> EMI Calculator (User Logic)
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <Row>
                                            <Col md={4} sm={6} xs={12}>
                                                <FormGroup>
                                                    <Label htmlFor="loanAmount">Loan Amount <span className="text-danger">*</span></Label>
                                                    <Input type="number" id="loanAmount" placeholder="e.g., 10000" value={amount} onChange={(e) => setLoanAmount(e.target.value)} min={1} />
                                                </FormGroup>
                                            </Col>
                                            <Col md={4} sm={6} xs={12}>
                                                <FormGroup>
                                                    <Label htmlFor="interestRateInput">{interestRateLabel} <span className="text-danger">*</span></Label>
                                                    <Input type="number" id="interestRateInput" placeholder={interestRatePlaceholder} value={interestRateInput} onChange={(e) => setInterestRate(e.target.value)} min={0} step="0.01" />
                                                </FormGroup>
                                            </Col>
                                            <Col md={4} sm={6} xs={12}>
                                                <FormGroup>
                                                    <Label htmlFor="loanTerm">Loan Term <span className="text-danger">*</span></Label>
                                                    <Input type="number" id="loanTerm" placeholder="e.g., 10" value={term} onChange={(e) => setLoanTerm(e.target.value)} min={1} />
                                                </FormGroup>
                                            </Col>
                                            <Col md={4} sm={6} xs={12}>
                                                <FormGroup>
                                                    <Label htmlFor="termType">Term Type <span className="text-danger">*</span></Label>
                                                    <Input type="select" id="termType" value={termType} onChange={(e) => setTermType(e.target.value)}>
                                                        <option value="days">Days</option>
                                                        <option value="weeks">Weeks</option>
                                                        <option value="months">Months</option>
                                                        <option value="years">Years</option>
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col md={4} sm={6} xs={12}>
                                                <FormGroup>
                                                    <Label htmlFor="interestType">Interest Calculation <span className="text-danger">*</span></Label>
                                                    <Input type="select" id="interestType" value={interestType} onChange={(e) => setInterestType(e.target.value)}>
                                                        <option value="1">Diminishing Rate</option>
                                                        <option value="2">Flat Rate (User Specific Logic)</option>
                                                    </Input>
                                                    <FormText>
                                                        Diminishing: Uses rate per period.
                                                        <br/>Flat (User Specific): Total interest from diminishing sim, then fixed EMI.
                                                    </FormText>
                                                </FormGroup>
                                            </Col>
                                            <Col md={4} sm={6} xs={12}>
                                                <FormGroup>
                                                    <Label htmlFor="startDate">Loan Start Date <span className="text-danger">*</span></Label>
                                                    <Input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row className="mt-3">
                                            <Col className="text-center">
                                                <Button color="success" size="lg" onClick={calculateUserSpecificEMI} disabled={isCalculating}>
                                                    {isCalculating ? <><Spinner size="sm" /> Calculating...</> : <> <FeatherIcon icon="bar-chart-2" size="18" className="me-1" /> Calculate Schedule</>}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    {/* EMI Calculation Results Section (Identical JSX to previous response) */}
                    {emiDetails.length > 0 && (
                        <Row className="mt-4">
                            <Col lg={12}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle tag="h5" className="mb-0">EMI Repayment Schedule</CardTitle>
                                        <p className="card-subtitle text-muted mt-1">
                                            Loan of {formatCurrency(amount)} at {interestRateInput}% 
                                            {interestType === '1' ? ` per ${termType !== "years" ? termType.slice(0,-1) : "period"}` : ' p.a. (for simulation)'} for {term} {termType}
                                            ({interestType === '1' ? 'Diminishing' : 'Flat Rate - User Specific'}) starting {new Date(startDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </p>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="table-responsive" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                            <Table className="table-centered table-nowrap table-hover mb-0 table-striped table-bordered">
                                                <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                                    <tr>
                                                        <th>Installment #</th>
                                                        <th>EMI Date</th>
                                                        <th>EMI Amount</th>
                                                        <th>Principal Paid</th>
                                                        <th>Interest Paid</th>
                                                        <th>Remaining Balance</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {emiDetails.map((row, index) => (
                                                        <tr key={index}>
                                                            <td>{row.month}</td>
                                                            <td>{row.emiStartDate}</td>
                                                            <td>{formatCurrency(row.emiTotalMonth)}</td>
                                                            <td>{formatCurrency(row.principalPaid)}</td>
                                                            <td>{formatCurrency(row.interest)}</td>
                                                            <td>{formatCurrency(row.remainingBalance)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="table-light fw-bold">
                                                        <td colSpan="2" className="text-end">Totals:</td>
                                                        <td>{formatCurrency(totalCalculatedPayment)}</td>
                                                        <td>{formatCurrency(totalCalculatedPrincipal)}</td>
                                                        <td>{formatCurrency(totalCalculatedInterest)}</td>
                                                        <td>-</td>
                                                    </tr>
                                                </tfoot>
                                            </Table>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    )}
                    {!isCalculating && emiDetails.length === 0 && (
                         <Row className="mt-4">
                            <Col>
                                <Alert color="info" className="text-center">
                                    <FeatherIcon icon="info" size="24" className="mb-2 d-block mx-auto"/>
                                    Please enter loan details above and click "Calculate Schedule" to see the EMI breakdown.
                                </Alert>
                            </Col>
                        </Row>
                    )}
                </Container>
            </div>
        </React.Fragment>
    );
};

export default EmiCalculater;