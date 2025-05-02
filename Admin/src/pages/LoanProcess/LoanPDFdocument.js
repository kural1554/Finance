import React from 'react';
import { 
  Page, 
  Text, 
  View, 
  Document, 
  StyleSheet, 
  Image,
  Font,
  PDFViewer 
} from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc9.ttf', fontWeight: 700 },
  ],
});

// Bootstrap-like styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
    backgroundColor: '#fff',
  },
  container: {
    maxWidth: 800,
    margin: '0 auto',
  },
  header: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    borderBottomStyle: 'solid',
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#6c757d',
  },
  card: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderStyle: 'solid',
    borderRadius: 4,
    backgroundColor: '#fff',
    padding: 15,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    borderBottomStyle: 'solid',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  col: {
    flexDirection: 'column',
  },
  col6: {
    width: '50%',
  },
  label: {
    width: '40%',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#495057',
  },
  value: {
    width: '60%',
    fontSize: 10,
    color: '#212529',
  },
  table: {
    display: 'table',
    width: '100%',
    marginTop: 10,
    marginBottom: 15,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
  },
  tableCol: {
    width: '16.66%',
    padding: 8,
    fontSize: 9,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  tableColHeader: {
    width: '16.66%',
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dee2e6',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
  },
  badge: {
    fontSize: 9,
    padding: '3px 6px',
    borderRadius: 10,
    textAlign: 'center',
  },
  badgeSuccess: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  badgeDanger: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderStyle: 'solid',
  },
  summaryItem: {
    alignItems: 'center',
    width: '30%',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#6c757d',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#343a40',
  },
  nomineeCard: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderStyle: 'solid',
    borderRadius: 4,
  },
  nomineeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nomineePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderStyle: 'solid',
  },
  nomineeName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#343a40',
  },
  nomineeDetail: {
    fontSize: 10,
    color: '#6c757d',
  },
  declarationCard: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderStyle: 'solid',
    borderRadius: 4,
  },
  declarationTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40',
    textAlign: 'center',
  },
  declarationText: {
    fontSize: 9,
    lineHeight: 1.4,
    color: '#212529',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    fontSize: 8,
    textAlign: 'center',
    color: '#6c757d',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    borderTopStyle: 'solid',
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 15,
  },
  watermark: {
    position: 'absolute',
    bottom: '40%',
    left: '25%',
    right: '25%',
    textAlign: 'center',
    color: 'rgba(0,0,0,0.05)',
    fontSize: 72,
    transform: 'rotate(-45deg)',
  }
});

// Declaration text
const DECLARATION_TEXT = `
Declaration and Undertaking by Applicant to SPK Micro Financial Services (Promoted by SPK Foundation)

I/We, declare that all the information given in the application form are true, correct and complete and that they shall form the basis of any loan SPK Micro Financial Services (Promoted by SPK Foundation) may decide to grant me/us. SPK Micro Financial Services (Promoted by SPK Foundation) may seek / receive information from any source/person to consider this application. I/We further agree that my/our loan shall be governed by rules of SPK Micro Financial Services (Promoted by SPK Foundation) which may be in force time to time. I/We agree that SPK Micro Financial Services (Promoted by SPK Foundation) reserves the right to accept/reject this application without assigning any reason whatsoever. I/We have read the brochure and understood the contents. I/We understand that the fee paid along with the loan application form is non-refundable. I/We undertake to inform SPK Small Finance Bank regarding any change in my/our occupation/employment/residential address and to provide any further information that SPK Micro Financial Services (Promoted by SPK Foundation) require. SPK Micro Financial Services (Promoted by SPK Foundation) may make available any information contained in this form, other documents submitted to SPK Micro Financial Services (Promoted by SPK Foundation) and, information pertaining to any institution or body. I/We confirm that I/We have/had no insolvency proceedings against me/us nor I/We have/had ever been adjudicated insolvent. CIBIL- SPK can initiate any Internal/External/3rd Party Verification with respect to Loan Application.
`;

// Helper functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(value || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const getPurposeText = (purposeCode) => {
  const purposes = {
    '1': "Children's Education",
    '2': "Medical Expenses",
    '3': "Business",
    '4': "Home Improvement/Purchase",
    '5': "Vehicle Purchase",
    '6': "Personal Expense",
    '7': "Debt Consolidation",
    '8': "Other"
  };
  return purposes[purposeCode] || 'Not specified';
};

const getRelationshipText = (relationshipCode) => {
  const relationships = {
    '1': "Spouse",
    '2': "Child",
    '3': "Parent",
    '4': "Sibling",
    '5': "Other"
  };
  return relationships[relationshipCode] || 'Other';
};

const getTermTypeText = (termTypeCode) => {
  const termTypes = {
    '1': "Days",
    '2': "Weeks",
    '3': "Months",
    '4': "Years"
  };
  return termTypes[termTypeCode] || 'Months';
};

const AgreementBadge = ({ agreed }) => (
  <Text style={[styles.badge, agreed ? styles.badgeSuccess : styles.badgeDanger]}>
    {agreed ? 'Agreed' : 'Not Agreed'}
  </Text>
);

// Main PDF Document Component
const LoanPDFdocument = ({ formData, emiDetails, nominees }) => {
  const totalInterest = emiDetails?.reduce((sum, row) => sum + (row.interest || 0), 0) || 0;
  const totalPrincipal = parseFloat(formData?.amount || 0);
  const totalPayment = totalInterest + totalPrincipal;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Watermark */}
          <Text style={styles.watermark}>SPK LOAN</Text>
          
          {/* Header */}
          <View style={styles.header}>
            <Image 
              style={styles.logo} 
              src="https://via.placeholder.com/150x50?text=SPK+LOGO" 
            />
            <Text style={styles.title}>Loan Application</Text>
            <Text style={styles.subtitle}>
              Application Date: {formatDate(formData.LoanRegDate)} | Place: {formData.translatorPlace || 'N/A'}
            </Text>
          </View>

          {/* Applicant Information Card */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Applicant Information</Text>
            <View style={styles.row}>
              <View style={styles.col6}>
                <View style={styles.row}>
                  <Text style={styles.label}>Full Name:</Text>
                  <Text style={styles.value}>{formData.first_name || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Phone Number:</Text>
                  <Text style={styles.value}>{formData.phone || 'N/A'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Loan Details Card */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Loan Details</Text>
            <View style={styles.row}>
              <View style={styles.col6}>
                <View style={styles.row}>
                  <Text style={styles.label}>Loan Amount:</Text>
                  <Text style={styles.value}>{formatCurrency(formData.amount)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Loan Term:</Text>
                  <Text style={styles.value}>
                    {formData.term} {getTermTypeText(formData.termType)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Interest Rate:</Text>
                  <Text style={styles.value}>{formData.interestRate}% per annum</Text>
                </View>
              </View>
              <View style={styles.col6}>
                <View style={styles.row}>
                  <Text style={styles.label}>Purpose:</Text>
                  <Text style={styles.value}>{getPurposeText(formData.purpose)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Repayment Source:</Text>
                  <Text style={styles.value}>{formData.repaymentSource || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Start Date:</Text>
                  <Text style={styles.value}>{formatDate(formData.startDate)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* EMI Schedule Card */}
          {emiDetails?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardHeader}>EMI Repayment Schedule</Text>
              
              <View style={styles.table}>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableColHeader}>Month</Text>
                  <Text style={styles.tableColHeader}>Payment Date</Text>
                  <Text style={styles.tableColHeader}>EMI</Text>
                  <Text style={styles.tableColHeader}>Principal</Text>
                  <Text style={styles.tableColHeader}>Interest</Text>
                  <Text style={styles.tableColHeader}>Balance</Text>
                </View>
                
                {/* Table Rows */}
                {emiDetails.map((emi, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCol}>{emi.month}</Text>
                    <Text style={styles.tableCol}>{formatDate(emi.emiStartDate)}</Text>
                    <Text style={styles.tableCol}>{formatCurrency(emi.emiTotalMonth)}</Text>
                    <Text style={styles.tableCol}>{formatCurrency(emi.principalPaid)}</Text>
                    <Text style={styles.tableCol}>{formatCurrency(emi.interest)}</Text>
                    <Text style={styles.tableCol}>{formatCurrency(emi.remainingBalance)}</Text>
                  </View>
                ))}
              </View>

              {/* Summary */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total Principal</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(totalPrincipal)}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total Interest</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(totalInterest)}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total Payment</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(totalPayment)}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Nominees Card */}
          {nominees?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardHeader}>Nominee Details</Text>
              {nominees.map((nominee, index) => (
                <View key={index} style={styles.nomineeCard}>
                  <View style={styles.nomineeHeader}>
                    <Image 
                      style={styles.nomineePhoto} 
                      src="https://via.placeholder.com/50x50?text=N" 
                    />
                    <View>
                      <Text style={styles.nomineeName}>{nominee.nomineeName || 'N/A'}</Text>
                      <Text style={styles.nomineeDetail}>Phone: {nominee.nomineePhone || 'N/A'}</Text>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Relationship:</Text>
                    <Text style={styles.value}>
                      {nominee.nomineeRelationship === '5' 
                        ? nominee.nomineeOtherRelationship 
                        : getRelationshipText(nominee.nomineeRelationship)}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={styles.value}>{nominee.nomineeAddress || 'N/A'}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>ID Proof:</Text>
                    <Text style={styles.value}>
                      {nominee.nomineeidProofType || 'N/A'}: {nominee.nomineeidProofNumber || 'N/A'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Agreements Card */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Agreements</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Terms & Conditions:</Text>
              <AgreementBadge agreed={formData.agreeTerms} />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Credit Check:</Text>
              <AgreementBadge agreed={formData.agreeCreditCheck} />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Data Sharing:</Text>
              <AgreementBadge agreed={formData.agreeDataSharing} />
            </View>
          </View>

          {/* Declaration Card */}
          <View style={styles.declarationCard}>
            <Text style={styles.declarationTitle}>DECLARATION</Text>
            <Text style={styles.declarationText}>{DECLARATION_TEXT}</Text>
          </View>

          {/* Remarks */}
          {formData.remarks && (
            <View style={styles.card}>
              <Text style={styles.cardHeader}>Remarks</Text>
              <Text style={{ fontSize: 10 }}>{formData.remarks}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This is a computer generated document and does not require a signature</Text>
          <Text>SPK Micro Financial Services (Promoted by SPK Foundation)</Text>
        </View>
      </Page>
    </Document>
  );
};

// PDF Preview Component
const PDFPreview = ({ formData, emiDetails, nominees }) => {
  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <LoanPDFdocument 
        formData={formData} 
        emiDetails={emiDetails} 
        nominees={nominees} 
      />
    </PDFViewer>
  );
};

export default LoanPDFdocument;
export { PDFPreview };