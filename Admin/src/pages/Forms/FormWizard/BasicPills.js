// import React, { useState } from "react";
// import { CardBody, NavItem, TabContent, TabPane, NavLink, UncontrolledTooltip, Card, CardHeader } from "reactstrap";

// import classnames from "classnames";
// import { Link } from "react-router-dom";

// const BasicPills = () => {
//   const [activeTab, setactiveTab] = useState(1);

//   function toggleTab(tab) {
//     if (activeTab !== tab) {
//       if (tab >= 1 && tab <= 3) {
//         setactiveTab(tab);
//       }
//     }
//   }

//   return (
//     <React.Fragment>
//       <Card>
//         <CardHeader>
//           <h4 className="card-title mb-0">Basic pills Wizard</h4>
//         </CardHeader>
//         <CardBody>
//           <div id="basic-pills-wizard" className="twitter-bs-wizard">
//             <ul className="twitter-bs-wizard-nav nav nav-pills nav-justified">
//               <NavItem>
//                 <NavLink
//                   href="#"
//                   className={classnames({ active: activeTab === 1 })}
//                   onClick={() => {
//                     setactiveTab(1);
//                   }}
//                 >
//                   <div
//                     className="step-icon"
//                     data-bs-toggle="tooltip"
//                     id="SellerDetails"
//                   >
//                     <i className="bx bx-list-ul"></i>
//                     <UncontrolledTooltip placement="top" target="SellerDetails">
//                       Seller Details
//                     </UncontrolledTooltip>
//                   </div>
//                 </NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink
//                   href="#"
//                   className={classnames({ active: activeTab === 2 })}
//                   onClick={() => {
//                     setactiveTab(2);
//                   }}
//                 >
//                   <div
//                     className="step-icon"
//                     data-bs-toggle="tooltip"
//                     id="CompanyDocument"
//                   >
//                     <i className="bx bx-book-bookmark"></i>
//                     <UncontrolledTooltip placement="top" target="CompanyDocument">
//                       Company Document
//                     </UncontrolledTooltip>
//                   </div>
//                 </NavLink>
//               </NavItem>

//               <NavItem>
//                 <NavLink
//                   href="#"
//                   className={classnames({ active: activeTab === 3 })}
//                   onClick={() => {
//                     setactiveTab(3);
//                   }}
//                 >
//                   <div
//                     className="step-icon"
//                     data-bs-toggle="tooltip"
//                     id="BankDetails"
//                   >
//                     <i className="bx bxs-bank"></i>
//                     <UncontrolledTooltip placement="top" target="BankDetails">
//                       Bank Details
//                     </UncontrolledTooltip>
//                   </div>
//                 </NavLink>
//               </NavItem>
//             </ul>

//             <TabContent
//               className="twitter-bs-wizard-tab-content"
//               activeTab={activeTab}
//             >
//               <TabPane tabId={1}>
//                 <div className="text-center mb-4">
//                   <h5>Seller Details</h5>
//                   <p className="card-title-desc">Fill all information below</p>
//                 </div>
//                 <form>
//                   <div className="row">
//                     <div className="col-lg-6">
//                       <div className="mb-3">
//                         <label
//                           htmlFor="basicpill-firstname-input"
//                           className="form-label"
//                         >
//                           First name
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           id="basicpill-firstname-input"
//                           placeholder="Enter Your First Name"
//                         />
//                       </div>
//                     </div>
//                     <div className="col-lg-6">
//                       <div className="mb-3">
//                         <label
//                           htmlFor="basicpill-lastname-input"
//                           className="form-label"
//                         >
//                           Last name
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           id="basicpill-lastname-input"
//                           placeholder="Enter Your Last Name"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="row">
//                     <div className="col-lg-6">
//                       <div className="mb-3">
//                         <label
//                           htmlFor="basicpill-phoneno-input"
//                           className="form-label"
//                         >
//                           Phone
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           id="basicpill-phoneno-input"
//                           placeholder="Enter Your Phone No"
//                         />
//                       </div>
//                     </div>
//                     <div className="col-lg-6">
//                       <div className="mb-3">
//                         <label
//                           htmlFor="basicpill-email-input"
//                           className="form-label"
//                         >
//                           Email
//                         </label>
//                         <input
//                           type="email"
//                           className="form-control"
//                           id="basicpill-email-input"
//                           placeholder="Enter Your Email"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="row">
//                     <div className="col-lg-12">
//                       <div className="mb-3">
//                         <label
//                           htmlFor="basicpill-address-input"
//                           className="form-label"
//                         >
//                           Address
//                         </label>
//                         <textarea
//                           id="basicpill-address-input"
//                           className="form-control"
//                           rows="2"
//                           placeholder="Enter Your Address"
//                         ></textarea>
//                       </div>
//                     </div>
//                   </div>
//                 </form>
//               </TabPane>
//               <TabPane tabId={2}>
//                 <div>
//                   <div className="text-center mb-4">
//                     <h5>Company Document</h5>
//                     <p className="card-title-desc">Fill all information below</p>
//                   </div>
//                   <form>
//                     <div className="row">
//                       <div className="col-lg-6">
//                         <div className="mb-3">
//                           <label
//                             htmlFor="basicpill-pancard-input"
//                             className="form-label"
//                           >
//                             PAN Card
//                           </label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             id="basicpill-pancard-input"
//                             placeholder="Enter Your PAN No."
//                           />
//                         </div>
//                       </div>

//                       <div className="col-lg-6">
//                         <div className="mb-3">
//                           <label
//                             htmlFor="basicpill-vatno-input"
//                             className="form-label"
//                           >
//                             VAT/TIN No.
//                           </label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             id="basicpill-vatno-input"
//                             placeholder="Enter Your VAT/TIN No."
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-lg-6">
//                         <div className="mb-3">
//                           <label
//                             htmlFor="basicpill-cstno-input"
//                             className="form-label"
//                           >
//                             GST No.
//                           </label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             id="basicpill-cstno-input"
//                             placeholder="Enter Your GST No."
//                           />
//                         </div>
//                       </div>

//                       <div className="col-lg-6">
//                         <div className="mb-3">
//                           <label
//                             htmlFor="basicpill-servicetax-input"
//                             className="form-label"
//                           >
//                             Service Tax No.
//                           </label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             id="basicpill-servicetax-input"
//                             placeholder="Enter Your Service Tax No."
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-lg-6">
//                         <div className="mb-3">
//                           <label
//                             htmlFor="basicpill-companyuin-input"
//                             className="form-label"
//                           >
//                             Company UIN
//                           </label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             id="basicpill-companyuin-input"
//                             placeholder="Enter Your Company UIN."
//                           />
//                         </div>
//                       </div>

//                       <div className="col-lg-6">
//                         <div className="mb-3">
//                           <label
//                             htmlFor="basicpill-declaration-input"
//                             className="form-label"
//                           >
//                             Declaration
//                           </label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             id="basicpill-declaration-input"
//                             placeholder="Enter Your Declaration"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </form>
//                 </div>
//               </TabPane>

//               <TabPane tabId={3}>
//                 <div>
//                   <div className="text-center mb-4">
//                     <h5>Bank Details</h5>
//                     <p className="card-title-desc">Fill all information below</p>
//                   </div>
//                   <form>
//                     <div className="row">
//                       <div className="col-lg-6">
//                         <div className="mb-3">
//                           <label
//                             htmlFor="basicpill-namecard-input"
//                             className="form-label"
//                           >
//                             Name on Card
//                           </label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             id="basicpill-namecard-input"
//                             placeholder="Enter Your Name on Card"
//                           />
//                         </div>
//                       </div>

//                       <div className="col-lg-6">
//                         <div className="mb-3">
//                           <label className="form-label">Credit Card Type</label>
//                           <select className="form-select">
//                             <option>Select Card Type</option>
//                             <option defaultValue="AE">American Express</option>
//                             <option value="VI">Visa</option>
//                             <option value="MC">MasterCard</option>
//                             <option value="DI">Discover</option>
//                           </select>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-lg-6">
//                         <div className="mb-3">
//                           <label
//                             htmlFor="basicpill-cardno-input"
//                             className="form-label"
//                           >
//                             Credit Card Number
//                           </label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             id="basicpill-cardno-input"
//                             placeholder="Enter Your Credit Card Number"
//                           />
//                         </div>
//                       </div>

//                       <div className="col-lg-6">
//                         <div className="mb-3">
//                           <label
//                             htmlFor="basicpill-card-verification-input"
//                             className="form-label"
//                           >
//                             Card Verification Number
//                           </label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             id="basicpill-card-verification-input"
//                             placeholder="Enter Your Card Verification Number"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-lg-6">
//                         <div className="mb-3">
//                           <label
//                             htmlFor="basicpill-expiration-input"
//                             className="form-label"
//                           >
//                             Expiration Date
//                           </label>
//                           <input
//                             type="date"
//                             className="form-control"
//                             id="basicpill-expiration-input"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </form>
//                 </div>
//               </TabPane>
//             </TabContent>
//             <ul className="pager wizard twitter-bs-wizard-pager-link">
//               <li className={activeTab === 1 ? "previous disabled" : "previous"}>
//                 <Link
//                   to="#"
//                   className={activeTab === 1 ? "btn btn-primary disabled" : "btn btn-primary"}
//                   onClick={() => {
//                     toggleTab(activeTab - 1);
//                   }}
//                 >
//                   <i className="bx bx-chevron-left me-1"></i> Previous
//                 </Link>
//               </li>

//               <li className={activeTab === 3 ? "next disabled" : "next"}>
//                 <Link
//                   to="#"
//                   className="btn btn-primary"
//                   onClick={() => {
//                     toggleTab(activeTab + 1);
//                   }}
//                 >
//                   Next <i className="bx bx-chevron-right ms-1"></i>
//                 </Link>
//               </li>
//             </ul>

//           </div>
//         </CardBody>
//       </Card>
//     </React.Fragment>
//   );
// };

// export default BasicPills;
import React, { useState, useRef } from "react";
import { 
  Card, CardHeader, CardBody, TabContent, TabPane, 
  Nav, NavItem, NavLink, Button, Row, Col, Form, 
  FormGroup, Label, Input, UncontrolledTooltip
} from "reactstrap";
import { useReactToPrint } from 'react-to-print';
import classnames from "classnames";
import { Link } from "react-router-dom";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const LoanApplicationForm = () => {
  const [activeTab, setactiveTab] = useState(1);

    function toggleTab(tab) {
      if (activeTab !== tab) {
        if (tab >= 1 && tab <= 8) {
          setactiveTab(tab);
        }
      }
    }

  const [formData, setFormData] = useState({
    // Loan Details
    loanType: "",
    loanAmount: "",
    loanTerm: "",
    interestRate: "",
    purposeOfLoan: "",
    
    // Personal Details
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    education: "",
    email: "",
    phone: "",
    alternatePhone: "",
    panNumber: "",
    aadharNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    residenceType: "",
    yearsAtCurrentAddress: "",
    
    // Employment Details
    employmentType: "",
    employerName: "",
    jobTitle: "",
    yearsWithEmployer: "",
    monthlyIncome: "",
    otherIncome: "",
    employerAddress: "",
    employerPhone: "",
    
    // Purpose of Loan
    loanPurposeDetail: "",
    repaymentSource: "",
    additionalComments: "",
    
    // Property Details
    propertyType: "",
    propertyAddress: "",
    propertyValue: "",
    propertyAge: "",
    propertySize: "",
    propertyOwnership: "",
    
    // References
    reference1Name: "",
    reference1Relationship: "",
    reference1Phone: "",
    reference1Email: "",
    reference2Name: "",
    reference2Relationship: "",
    reference2Phone: "",
    reference2Email: "",
    
    // Declaration
    agreeTerms: false,
    agreeCreditCheck: false,
    agreeDataSharing: false,
    
    // Vernacular Declaration
    needsTranslator: false,
    translatorName: "",
    translatorSignature: "",
    applicantThumbprint: false,
  });

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted:", formData);
    // Move to the preview tab after submission
    setActiveTab(9);
  };

  // PDF Styles
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontSize: 12,
    },
    section: {
      margin: 10,
      padding: 10,
      borderBottom: '1px solid #ccc',
    },
    heading: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    row: {
      flexDirection: 'row',
      marginBottom: 5,
    },
    column: {
      width: '50%', padding: 5,
    },
  });

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>Loan Application Summary</Text>
        <View style={styles.section}>
          <Text style={styles.heading}>Loan Details</Text>
          <Text>Loan Type: {formData.loanType}</Text>
          <Text>Loan Amount: {formData.loanAmount}</Text>
          <Text>Loan Term: {formData.loanTerm}</Text>
          <Text>Interest Rate: {formData.interestRate}</Text>
          <Text>Purpose of Loan: {formData.purposeOfLoan}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Personal Details</Text>
          <Text>First Name: {formData.firstName}</Text>
          <Text>Last Name: {formData.lastName}</Text>
          <Text>Date of Birth: {formData.dateOfBirth}</Text>
          <Text>Gender: {formData.gender}</Text>
          <Text>Marital Status: {formData.maritalStatus}</Text>
          <Text>Email: {formData.email}</Text>
          <Text>Phone: {formData.phone}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Employment Details</Text>
          <Text>Employment Type: {formData.employmentType}</Text>
          <Text>Employer Name: {formData.employerName}</Text>
          <Text>Job Title: {formData.jobTitle}</Text>
          <Text>Monthly Income: {formData.monthlyIncome}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Property Details</Text>
          <Text>Property Type: {formData.propertyType}</Text>
          <Text>Property Address: {formData.propertyAddress}</Text>
          <Text>Property Value: {formData.propertyValue}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>References</Text>
          <Text>Reference 1: {formData.reference1Name} - {formData.reference1Relationship}</Text>
          <Text>Reference 2: {formData.reference2Name} - {formData.reference2Relationship}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Declaration</Text>
          <Text>Agreed to Terms: {formData.agreeTerms ? "Yes" : "No"}</Text>
        </View>
      </Page>
    </Document>
  );

  return ( 
       <React.Fragment>
          <Card>
            <CardHeader>
              <h4 className="card-title mb-0">Loan Application Form</h4>
            </CardHeader>
            <CardBody>
              <div id="basic-pills-wizard" className="twitter-bs-wizard">
               
                <ul className="twitter-bs-wizard-nav nav nav-pills nav-justified">
          {["Loan Details", "Company Document", "Bank Details", "Employment Details", "Property Details", "References", "Agreement", "Final Review"].map((tooltip, index) => (
            <NavItem key={index}>
              <NavLink
                href="#"
                className={classnames({ active: activeTab === index + 1 })}
                onClick={() => setactiveTab(index + 1)}
              >
                <div className="step-icon" data-bs-toggle="tooltip" id={`Step${index + 1}`}>
                  <i className={`bx bx-${index % 2 === 0 ? "list-ul" : "book-bookmark"}`}></i>
                  <UncontrolledTooltip placement="top" target={`Step${index + 1}`}>{tooltip}</UncontrolledTooltip>
                </div>
              </NavLink>
            </NavItem>
          ))}
        </ul>
                  {/* <NavItem>
                    <NavLink
                      href="#"
                      className={classnames({ active: activeTab === 1 })}
                      onClick={() => {
                        setactiveTab(1);
                      }}
                    >
                      <div
                        className="step-icon"
                        data-bs-toggle="tooltip"
                        id="SellerDetails"
                      >
                        <i className="bx bx-list-ul"></i>
                        <UncontrolledTooltip placement="top" target="SellerDetails">
                          Loan Details
                        </UncontrolledTooltip>
                      </div>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      href="#"
                      className={classnames({ active: activeTab === 2 })}
                      onClick={() => {
                        setactiveTab(2);
                      }}
                    >
                      <div
                        className="step-icon"
                        data-bs-toggle="tooltip"
                        id="CompanyDocument"
                      >
                        <i className="bx bx-book-bookmark"></i>
                        <UncontrolledTooltip placement="top" target="CompanyDocument">
                          Company Document
                        </UncontrolledTooltip>
                      </div>
                    </NavLink>
                  </NavItem>    
                  <NavItem>
                    <NavLink
                      href="#"
                      className={classnames({ active: activeTab === 3 })}
                      onClick={() => {
                        setactiveTab(3);
                      }}
                    >
                      <div
                        className="step-icon"
                        data-bs-toggle="tooltip"
                        id="BankDetails"
                      >
                        <i className="bx bxs-bank"></i>
                        <UncontrolledTooltip placement="top" target="BankDetails">
                          Bank Details
                        </UncontrolledTooltip>
                      </div>
                    </NavLink>
                  </NavItem> */}
                
   
          <TabContent activeTab={activeTab }>
          <TabPane tabId={1}>
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="firstName">First Name</Label>
                      <Input type="text" name="firstName" id="firstName" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="lastName">Last Name</Label>
                      <Input type="text" name="lastName" id="lastName" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="dateOfBirth">Date of Birth</Label>
                      <Input type="date" name="dateOfBirth" id="dateOfBirth" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="gender">Gender</Label>
                      <Input type="select" name="gender" id="gender" onChange={handleInputChange}>
                        <option>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Button color="primary" onClick={() => toggleTab(2)}>Next</Button>
              </Form>
            </TabPane>
            <TabPane tabId={2}>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="loanType">Loan Type</Label>
                      <Input type="text" name="loanType" id="loanType" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="loanAmount">Loan Amount</Label>
                      <Input type="number" name="loanAmount" id="loanAmount" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="loanTerm">Loan Term (Years)</Label>
                      <Input type="number" name="loanTerm" id="loanTerm" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="interestRate">Interest Rate (%)</Label>
                      <Input type="number" name="interestRate" id="interestRate" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="purposeOfLoan">Purpose of Loan</Label>
                      <Input type="text" name="purposeOfLoan" id="purposeOfLoan" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Button color="primary" type="submit">Next</Button>
              </Form>
            </TabPane>
            
            <TabPane tabId={3}>
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="employmentType">Employment Type</Label>
                      <Input type="text" name="employmentType" id="employmentType" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="employerName">Employer Name</Label>
                      <Input type="text" name="employerName" id="employerName" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="jobTitle">Job Title</Label>
                      <Input type="text" name="jobTitle" id="jobTitle" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="monthlyIncome">Monthly Income</Label>
                      <Input type="number" name="monthlyIncome" id="monthlyIncome" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Button color="primary" onClick={() => toggleTab(4)}>Next</Button>
              </Form>
            </TabPane>
            <TabPane tabId={4}>
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      < Label for="loanPurposeDetail">Loan Purpose Detail</Label>
                      <Input type="text" name="loanPurposeDetail" id="loanPurposeDetail" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="repaymentSource">Source of Repayment</Label>
                      <Input type="text" name="repaymentSource" id="repaymentSource" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="additionalComments">Additional Comments</Label>
                      <Input type="textarea" name="additionalComments" id="additionalComments" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Button color="primary" onClick={() => toggleTab(5)}>Next</Button>
              </Form>
            </TabPane>
            <TabPane tabId={5}>
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="propertyType">Property Type</Label>
                      <Input type="text" name="propertyType" id="propertyType" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="propertyAddress">Property Address</Label>
                      <Input type="text" name="propertyAddress" id="propertyAddress" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="propertyValue">Property Value</Label>
                      <Input type="number" name="propertyValue" id="propertyValue" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="propertyAge">Property Age (Years)</Label>
                      <Input type="number" name="propertyAge" id="propertyAge" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Button color="primary" onClick={() => toggleTab(6)}>Next</Button>
              </Form>
            </TabPane>
            <TabPane tabId={6}>
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="reference1Name">Reference 1 Name</Label>
                      <Input type="text" name="reference1Name" id="reference1Name" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="reference1Relationship">Reference 1 Relationship</Label>
                      <Input type="text" name="reference1Relationship" id="reference1Relationship" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="reference1Phone">Reference 1 Phone</Label>
                      <Input type="text" name="reference1Phone" id="reference1Phone" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="reference1Email">Reference 1 Email</Label>
                      <Input type="email" name="reference1Email" id="reference1Email" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="reference2Name">Reference 2 Name</Label>
                      <Input type="text" name="reference2Name" id="reference2Name" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="reference2Relationship">Reference 2 Relationship</Label>
                      <Input type="text" name="reference2Relationship" id="reference2Relationship" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Button color="primary" onClick={() => toggleTab(7)}>Next</Button>
              </Form>
            </TabPane>
            <TabPane tabId={7}>
              <Form>
                <Row>
                  <Col md={12}>
                    <FormGroup check>
                      <Label check></Label>
                        <Input type="checkbox" name="agreeTerms" onChange={handleInputChange} /> I agree to the terms and conditions
                      </ FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup check>
                      <Label check>
                        <Input type="checkbox" name="agreeCreditCheck" onChange={handleInputChange} /> I agree to a credit check
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup check>
                      <Label check>
                        <Input type="checkbox" name="agreeDataSharing" onChange={handleInputChange} /> I agree to data sharing
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
                <Button color="primary" onClick={() => toggleTab(8)}>Next</Button>
              </Form>
            </TabPane>
            <TabPane tabId={8}>
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="translatorName">Translator Name</Label>
                      <Input type="text" name="translatorName" id="translatorName" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="translatorSignature">Translator Signature</Label>
                      <Input type="text" name="translatorSignature" id="translatorSignature" onChange={handleInputChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup check>
                      <Label check>
                        <Input type="checkbox" name="applicantThumbprint" onChange={handleInputChange} /> Applicant's Thumbprint
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
                <Button color="primary" onClick={() => toggleTab(9)}>Preview</Button>
              </Form>
            </TabPane>
            <TabPane tabId={9}>
              <div ref={printRef}>
                <MyDocument />
              </div>
              <Button color="primary" onClick={handlePrint}>Download PDF</Button>
              <PDFDownloadLink document={<MyDocument />} fileName="loan_application.pdf">
                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
              </PDFDownloadLink>
            </TabPane>
          </TabContent>
          
        
       </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default LoanApplicationForm; 
