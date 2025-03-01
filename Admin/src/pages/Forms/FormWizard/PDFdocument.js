import React from "react";

const PDFPreview = ({ formData, passportPhoto }) => {
  const formatCurrency = (value) => {
    return value ? `$${Number(value).toLocaleString()}` : 'N/A';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const renderSection = (heading, details) => (
    <div style={styles.section}>
      <h4 style={styles.heading}>{heading}</h4>
      {details.map((detail, index) => (
        <p key={index} style={styles.detail}>
          <strong>{detail.label}:</strong> {detail.value || 'N/A'}
        </p>
      ))}
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>Loan Application Summary</h2>
          <p style={styles.applicantName}>
            {formData.firstName} {formData.lastName}
          </p>
          <p style={styles.applicantContact}>
            {formData.email} | {formData.phone}
          </p>
          <p style={styles.applicantInfo}>
            DOB: {formatDate(formData.dateOfBirth)} | {formData.gender}
          </p>
        </div>
        {passportPhoto && (
          <img 
            src={passportPhoto} 
            alt="Applicant" 
            style={styles.photo} 
          />
        )}
      </div>

      <div style={styles.gridContainer}>
        <div style={styles.column}>
          {renderSection("Loan Details", [
            { label: "Loan Type", value: formData.loanType },
            { label: "Loan Amount", value: formatCurrency(formData.loanAmount) },
            { label: "Loan Term", value: formData.loanTerm + ' months' },
            { label: "Interest Rate", value: formData.interestRate + '%' },
            { label: "Purpose", value: formData.purposeOfLoan },
          ])}
          
          {renderSection("Employment Details", [
            { label: "Employment Type", value: formData.employmentType },
            { label: "Employer", value: formData.employerName },
            { label: "Job Title", value: formData.jobTitle },
            { label: "Monthly Income", value: formatCurrency(formData.monthlyIncome) },
          ])}
          
          {renderSection("Property Details", [
            { label: "Property Type", value: formData.propertyType },
            { label: "Address", value: formData.propertyAddress },
            { label: "Value", value: formatCurrency(formData.propertyValue) },
          ])}
        </div>

        <div style={styles.column}>
          {renderSection("Personal Details", [
            { label: "Marital Status", value: formData.maritalStatus },
            { label: "Residence Address", value: formData.residenceAddress },
            { label: "Nationality", value: formData.nationality },
            { label: "ID Number", value: formData.idNumber },
          ])}
          
          {renderSection("References", [
            {
              label: "Reference 1",
              value: `${formData.reference1Name} (${formData.reference1Relationship}) - ${formData.reference1Phone}`,
            },
            {
              label: "Reference 2",
              value: `${formData.reference2Name} (${formData.reference2Relationship}) - ${formData.reference2Phone}`,
            },
          ])}
          
          {renderSection("Financial Information", [
            { label: "Total Assets", value: formatCurrency(formData.totalAssets) },
            { label: "Liabilities", value: formatCurrency(formData.liabilities) },
            { label: "Credit Score", value: formData.creditScore },
          ])}
          
          {renderSection("Declaration", [
            { label: "Agreed to Terms", value: formData.agreeTerms ? "Yes" : "No" },
            { label: "Signature", value: formData.signatureDate ? `Signed on ${formatDate(formData.signatureDate)} ` : 'Not Signed' },
          ])}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '40px',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    gap: '20px',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  applicantName: {
    fontSize: '18px',
    margin: '5px 0',
  },
  applicantContact: {
    fontSize: '14px',
    color: '#666',
    margin: '5px 0',
  },
  applicantInfo: {
    fontSize: '14px',
    color: '#666',
    margin: '5px 0',
  },
  photo: {
    width: '120px',
    height: '150px',
    objectFit: 'cover',
    border: '2px solid #007bff',
    borderRadius: '4px',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    alignItems: 'flex-start',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  section: {
    margin: '10px 0',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    pageBreakInside: 'avoid',
  },
  heading: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '5px',
    borderBottom: '2px solid #007bff',
    paddingBottom: '5px',
  },
  detail: {
    margin: '5px 0',
    lineHeight: '1.5',
  },
};

export default PDFPreview;