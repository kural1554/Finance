import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoanApplicationView = () => {
  // Sample loan application data
  const loanData = {
    first_name: "Anbu",
    phone: "9876543210",
    amount: "300000",
    term: "12",
    termType: "3",
    interestRate: 2,
    purpose: "4",
    repaymentSource: "salary",
    agreeTerms: true,
    agreeCreditCheck: true,
    agreeDataSharing: true,
    translatorName: "",
    translatorPlace: "Pettavaithalai",
    LoanRegDate: "2025-04-08",
    remarks: "fqwegfewgy",
    startDate: "2025-04-10",
    nominees: [
      {
        name: "santhosh",
        phone: "9865748965",
        email: "anbu@gmail.com",
        relationship: "3",
        address: "davasanam",
        idProofType: "Voter ID",
        idProofNumber: "45644"
      }
    ],
    emiSchedule: [
      {
        month: 1,
        emiStartDate: "2025-05-05",
        emiTotalMonth: 31000,
        interest: 6000,
        principalPaid: 25000,
        remainingBalance: 275000
      },
      {
        month: 2,
        emiStartDate: "2025-06-05",
        emiTotalMonth: 30500,
        interest: 5500,
        principalPaid: 25000,
        remainingBalance: 250000
      },
      // ... rest of the EMI schedule
    ],
    applicant_photo: null,
    nominee_files: [
      {
        profile_photo: null,
        id_proof_file: "voter.jpg"
      }
    ]
  };

  // Helper function to format label
  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to display boolean values
  const displayBoolean = (value) => value ? "Yes" : "No";

  // Helper function to format currency
  const formatCurrency = (value) => `₹${Number(value).toLocaleString('en-IN')}`;

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Loan Application Details</h2>
        </div>
        
        <div className="card-body">
          {/* Basic Information Section */}
          <div className="mb-4">
            <h4 className="card-title text-primary border-bottom pb-2">Applicant Information</h4>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" value={loanData.first_name} readOnly />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone</label>
                <input type="text" className="form-control" value={loanData.phone} readOnly />
              </div>
            </div>
          </div>

          {/* Loan Details Section */}
          <div className="mb-4">
            <h4 className="card-title text-primary border-bottom pb-2">Loan Details</h4>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Loan Amount</label>
                <input type="text" className="form-control" value={formatCurrency(loanData.amount)} readOnly />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Term (Months)</label>
                <input type="text" className="form-control" value={loanData.term} readOnly />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Interest Rate</label>
                <input type="text" className="form-control" value={`${loanData.interestRate}%`} readOnly />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Purpose</label>
                <input type="text" className="form-control" value={loanData.purpose} readOnly />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Repayment Source</label>
                <input type="text" className="form-control" value={loanData.repaymentSource} readOnly />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Start Date</label>
                <input type="text" className="form-control" value={loanData.startDate} readOnly />
              </div>
            </div>
          </div>

          {/* Agreements Section */}
          <div className="mb-4">
            <h4 className="card-title text-primary border-bottom pb-2">Agreements</h4>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Agreed to Terms</label>
                <input type="text" className="form-control" value={displayBoolean(loanData.agreeTerms)} readOnly />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Agreed to Credit Check</label>
                <input type="text" className="form-control" value={displayBoolean(loanData.agreeCreditCheck)} readOnly />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Agreed to Data Sharing</label>
                <input type="text" className="form-control" value={displayBoolean(loanData.agreeDataSharing)} readOnly />
              </div>
            </div>
          </div>

          {/* Translator Information */}
          {(loanData.translatorName || loanData.translatorPlace) && (
            <div className="mb-4">
              <h4 className="card-title text-primary border-bottom pb-2">Translator Information</h4>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Translator Name</label>
                  <input type="text" className="form-control" value={loanData.translatorName || "N/A"} readOnly />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Translator Place</label>
                  <input type="text" className="form-control" value={loanData.translatorPlace} readOnly />
                </div>
              </div>
            </div>
          )}

          {/* Nominee Information */}
          <div className="mb-4">
            <h4 className="card-title text-primary border-bottom pb-2">Nominee Information</h4>
            {loanData.nominees.map((nominee, index) => (
              <div key={index} className="card mb-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Name</label>
                      <input type="text" className="form-control" value={nominee.name} readOnly />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Phone</label>
                      <input type="text" className="form-control" value={nominee.phone} readOnly />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Email</label>
                      <input type="text" className="form-control" value={nominee.email} readOnly />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Relationship</label>
                      <input type="text" className="form-control" value={nominee.relationship} readOnly />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Address</label>
                      <input type="text" className="form-control" value={nominee.address} readOnly />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">ID Proof Type</label>
                      <input type="text" className="form-control" value={nominee.idProofType} readOnly />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">ID Proof Number</label>
                      <input type="text" className="form-control" value={nominee.idProofNumber} readOnly />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">ID Proof File</label>
                      <input type="text" className="form-control" 
                        value={loanData.nominee_files[index]?.id_proof_file || "Not uploaded"} 
                        readOnly 
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* EMI Schedule */}
          <div className="mb-4">
            <h4 className="card-title text-primary border-bottom pb-2">EMI Schedule</h4>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-primary">
                  <tr>
                    <th>Month</th>
                    <th>Payment Date</th>
                    <th>Total Payment</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {loanData.emiSchedule.map((emi, index) => (
                    <tr key={index}>
                      <td>{emi.month}</td>
                      <td>{emi.emiStartDate}</td>
                      <td>{formatCurrency(emi.emiTotalMonth)}</td>
                      <td>{formatCurrency(emi.principalPaid)}</td>
                      <td>{formatCurrency(emi.interest)}</td>
                      <td>{formatCurrency(emi.remainingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-4">
            <h4 className="card-title text-primary border-bottom pb-2">Additional Information</h4>
            <div className="row">
              <div className="col-md-12 mb-3">
                <label className="form-label">Remarks</label>
                <textarea className="form-control" value={loanData.remarks} readOnly rows="3" />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Loan Registration Date</label>
                <input type="text" className="form-control" value={loanData.LoanRegDate} readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationView;