import React, { useState, useEffect, useRef, useCallback } from "react";
import { Table, Button, Form, FormGroup, Label, Input, Container } from "reactstrap";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const LoanCalculator = ({ initialLoanAmount, initialLoanTerm, initialTermType, initialInterestRate }) => {
  const [loanAmount, setLoanAmount] = useState(initialLoanAmount || 1000);
  const [loanTerm, setLoanTerm] = useState(initialLoanTerm || 5);
  const [termType, setTermType] = useState(initialTermType || "months");
  const [interestRate, setInterestRate] = useState(initialInterestRate || 3.0);
  const [totalInterest, setTotalInterest] = useState(0);

  const [schedule, setSchedule] = useState([]);
  const printRef = useRef();
  

  const calculateSchedule = useCallback(() => {
    const termMonths = termType === "years" ? loanTerm * 12 : loanTerm;
    const monthlyInterestRate = interestRate / 100 / 12;
    
    let remainingBalance = loanAmount;
    let fixedPrincipal = loanAmount / termMonths;
    const tempSchedule = [];
    const startDate = new Date();
    let totalInterestPaid = 0; // Initialize total interest counter

    for (let i = 1; i <= termMonths; i++) {
      let interestAmount = (remainingBalance * interestRate) / 100;
      let emi = fixedPrincipal + interestAmount;
      let dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + i);

      totalInterestPaid += interestAmount; // Accumulate total interest

      tempSchedule.push({
        id: i,
        dueDate: dueDate.toLocaleDateString("en-GB"),
        loanAmount: remainingBalance.toFixed(2),
        interestRate: `${interestRate}%`,
        emi: emi.toFixed(2),
        interestAmount: interestAmount.toFixed(2),
        principalAmount: fixedPrincipal.toFixed(2),
        monthlyDue: emi.toFixed(2),
      });

      remainingBalance -= fixedPrincipal;
      if (remainingBalance < 0) remainingBalance = 0;
    }

    console.log(`Total Interest Paid: ${totalInterestPaid.toFixed(2)}`); // Log final total interest
    setTotalInterest(totalInterestPaid.toFixed(2)); // Save total interest in state
    setSchedule(tempSchedule);
}, [loanAmount, loanTerm, termType, interestRate]);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(schedule);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Loan Schedule");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(data, "Loan_Schedule.xlsx");
  };

  

  return (
    <Container>
      <h3 className="mt-3">Loan Repayment Schedule</h3>
      <Form>
        <FormGroup>
          <Label>Loan Amount:</Label>
          <Input type="number" value={loanAmount} onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)} />
        </FormGroup>

        <FormGroup>
          <Label>Loan Term:</Label>
          <div className="d-flex">
            <Input type="number" value={loanTerm} onChange={(e) => setLoanTerm(parseInt(e.target.value) || 0)} style={{ width: "50%" }} />
            <Input type="select" value={termType} onChange={(e) => setTermType(e.target.value)} style={{ width: "50%", marginLeft: "10px" }}>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </Input>
          </div>
        </FormGroup>

        <FormGroup>
          <Label>Interest Rate (%):</Label>
          <Input type="number" value={interestRate} onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)} />
        </FormGroup>

        <Button color="primary" onClick={calculateSchedule}>
          Calculate Schedule
        </Button>
      </Form>

      {schedule.length > 0 && (
        <>
          <div ref={printRef}>
            <Table striped className="mt-3">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Due Date</th>
                  <th>Loan Amount</th>
                  <th>Interest Rate</th>
                  <th>EMI</th>
                  <th>Interest Amount</th>
                  <th>Principal Amount</th>
                  <th>Monthly Due</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row, index) => (
                  <tr key={index}>
                    <td>{row.id}</td>
                    <td>{row.dueDate}</td>
                    <td>{row.loanAmount}</td>
                    <td>{row.interestRate}</td>
                    <td>{row.emi}</td>
                    <td>{row.interestAmount}</td>
                    <td>{row.principalAmount}</td>
                    <td>{row.monthlyDue}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
           
          </div>

          <div className="d-flex justify-content-between mt-3">
            <Button color="secondary" onClick={handlePrint}>
              🖨 Print
            </Button>
            <Button color="success" onClick={exportToExcel}>
              📊 Export to Excel
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default LoanCalculator;
