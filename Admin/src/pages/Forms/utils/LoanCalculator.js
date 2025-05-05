import React, { useState, useCallback, useRef, useEffect } from "react";
import { Table, Button, Form, FormGroup, Label, Input, Container, Alert } from "reactstrap";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { format, addDays, addWeeks, addMonths, addYears } from "date-fns";


const LoanCalculator = ({
  initialLoanAmount = 1000,
  initialLoanTerm = 5,
  initialTermType = "months",
  initialInterestRate = 3.0,
  borrowerName,
  contactNumber,
  loanDate = new Date(),
}) => {
  const [loanAmount, setLoanAmount] = useState(initialLoanAmount);
  const [loanTerm, setLoanTerm] = useState(initialLoanTerm);
  const [termType, setTermType] = useState(initialTermType);
  const [interestRate, setInterestRate] = useState(initialInterestRate);
  const [totalInterest, setTotalInterest] = useState(0);
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState("");
  const printRef = useRef();
  useEffect(() => {
    setLoanAmount(initialLoanAmount);
    setLoanTerm(initialLoanTerm);
    setTermType(initialTermType);
    setInterestRate(initialInterestRate);
  }, [initialLoanAmount, initialLoanTerm, initialTermType, initialInterestRate]);

  const validateInputs = () => {
    if (loanAmount <= 0 || loanTerm <= 0 || interestRate <= 0) {
      setError("All values must be greater than zero");
      return false;
    }
    setError("");
    return true;
  };

  const calculateSchedule = useCallback(() => {
    if (!validateInputs()) return;

    let paymentDates = [];
    const startDate = new Date(loanDate);
    let currentDate = startDate;

    switch (termType) {
      case "daily":
        paymentDates = Array.from({ length: loanTerm }, (_, i) => 
          addDays(startDate, i + 1));
        break;
      case "weeks":
        paymentDates = Array.from({ length: loanTerm }, (_, i) => 
          addWeeks(startDate, i + 1));
        break;
      case "months":
        paymentDates = Array.from({ length: loanTerm }, (_, i) => 
          addMonths(startDate, i + 1));
        break;
      case "years":
        paymentDates = Array.from({ length: loanTerm }, (_, i) => 
          addYears(startDate, i + 1));
        break;
      default:
        paymentDates = [];
    }

    const periodicInterestRate = interestRate / 100 / 
      (termType === "months" ? 12 : termType === "weeks" ? 52 : 
       termType === "years" ? 1 : 365);

    const tempSchedule = [];
    let remainingBalance = loanAmount;
    let totalInterestPaid = 0;

    paymentDates.forEach((date, index) => {
      const interestAmount = remainingBalance * periodicInterestRate;
      const principalAmount = loanAmount / paymentDates.length;
      const payment = principalAmount + interestAmount;

      totalInterestPaid += interestAmount;
      remainingBalance -= principalAmount;

      tempSchedule.push({
        id: index + 1,
        dueDate: format(date, "dd/MM/yyyy"),
        outstandingPrincipal: remainingBalance,
        interestRate: interestRate,
        interestAmount: interestAmount,
        principalAmount: principalAmount,
        paymentDue: payment,
      });
    });

    setSchedule(tempSchedule);
    setTotalInterest(totalInterestPaid);
  }, [loanAmount, loanTerm, termType, interestRate, loanDate]);

  useEffect(() => {
    if (schedule.length > 0) {
      calculateSchedule();
    }
  }, [loanAmount, loanTerm, termType, interestRate, calculateSchedule]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const exportToExcel = () => {
    if (schedule.length === 0) {
      setError("No schedule to export. Calculate first!");
      return;
    }

    const worksheetData = schedule.map((row) => ({
      "Installment #": row.id,
      "Due Date": row.dueDate,
      "Outstanding Principal": row.outstandingPrincipal,
      "Interest Rate (%)": row.interestRate,
      "Interest Amount": row.interestAmount,
      "Principal Amount": row.principalAmount,
      "Total Payment Due": row.paymentDue,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Loan Schedule");

    // Format currency columns
    const formatRange = { 
      wch: 20, 
      numFmt: '"₹"#,##0.00' 
    };
    worksheet["!cols"] = [
      formatRange, formatRange, formatRange, 
      formatRange, formatRange, formatRange, formatRange
    ];

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "Loan_Schedule.xlsx");
  };

  return (
    <Container className="py-4">
      <h3 className="mb-4">Loan Repayment Schedule</h3>

      {error && <Alert color="danger" className="mb-4">{error}</Alert>}

      <div className="mb-4 p-3 border rounded bg-light">
        <div className="row">
          <div className="col-md-4">
            <strong>Borrower:</strong> {borrowerName || "N/A"}
          </div>
          <div className="col-md-4">
            <strong>Contact:</strong> {contactNumber || "N/A"}
          </div>
          <div className="col-md-4">
            <strong>Loan Date:</strong> {format(new Date(loanDate), "dd/MM/yyyy")}
          </div>
        </div>
      </div>

      <Form className="mb-5">
        <div className="row g-4">
          <div className="col-md-4">
            <FormGroup>
              <Label>Loan Amount (₹)</Label>
              <Input
                type="number"
                min="0"
                step="100"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Math.max(0, parseFloat(e.target.value)))}
              />
            </FormGroup>
          </div>

          <div className="col-md-4">
            <FormGroup>
              <Label>Loan Term</Label>
              <div className="input-group">
                <Input
                  type="number"
                  min="0"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Math.max(0, parseInt(e.target.value)))}
                />
                <Input
                  type="select"
                  value={termType}
                  onChange={(e) => setTermType(e.target.value)}
                  className="w-50"
                >
                  <option value="daily">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </Input>
              </div>
            </FormGroup>
          </div>

          <div className="col-md-4">
            <FormGroup>
              <Label>Interest Rate (%)</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value)))}
              />
            </FormGroup>
          </div>
        </div>

        <div className="text-center">
          <Button color="primary" size="lg" onClick={calculateSchedule}>
            Generate Schedule
          </Button>
        </div>
      </Form>

      {schedule.length > 0 && (
        <div className="mt-4">
          <div ref={printRef}>
            <Table bordered responsive className="mb-4">
              <thead className="bg-primary text-white">
                <tr>
                  <th>#</th>
                  <th>Due Date</th>
                  <th>Outstanding Principal</th>
                  <th>Interest Rate</th>
                  <th>Interest Amount</th>
                  <th>Principal</th>
                  <th>Total Due</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.dueDate}</td>
                    <td>₹{row.outstandingPrincipal.toFixed(2)}</td>
                    <td>{row.interestRate.toFixed(1)}%</td>
                    <td>₹{row.interestAmount.toFixed(2)}</td>
                    <td>₹{row.principalAmount.toFixed(2)}</td>
                    <td>₹{row.paymentDue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="alert alert-success">
              <h5 className="mb-0">
                Total Interest Payable: ₹{totalInterest.toFixed(2)}
              </h5>
            </div>
          </div>

          <div className="d-flex gap-3 justify-content-end mt-4">
            <Button color="outline-primary" onClick={handlePrint}>
              <i className="bi bi-printer me-2"></i>Print Schedule
            </Button>
            <Button color="success" onClick={exportToExcel}>
              <i className="bi bi-file-earmark-spreadsheet me-2"></i>Export to Excel
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default LoanCalculator;