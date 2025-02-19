import React, { Component } from "react";
import { Row, Col, Card, CardBody, TabContent, TabPane, NavItem, NavLink, Progress, UncontrolledTooltip, CardHeader } from "reactstrap";

import classnames from 'classnames';
import { Link } from "react-router-dom";

class ProgressbarWizard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "Forms", link: "#" },
                { title: "Form Wizard", link: "#" },
            ],
            activeTabProgress: 1,
            progressValue: 33
        };
        this.toggleTabProgress.bind(this);
    }


    toggleTabProgress(tab) {
        if (this.state.activeTabProgress !== tab) {
            if (tab >= 1 && tab <= 3) {
                this.setState({
                    activeTabProgress: tab
                });

                if (tab === 1) { this.setState({ progressValue: 33 }) }
                if (tab === 2) { this.setState({ progressValue: 66 }) }
                if (tab === 3) { this.setState({ progressValue: 100 }) }
            }
        }
    }

    render() {

        return (
            <React.Fragment>
                <Row>
                    <Col lg="12">
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Wizard with Progressbar</h4>
                            </CardHeader>
                            <CardBody>

                                <div id="progrss-wizard" className="twitter-bs-wizard">
                                    <ul className="twitter-bs-wizard-nav nav-justified nav nav-pills">
                                        <NavItem>
                                            <NavLink className={classnames({ active: this.state.activeTabProgress === 1 })} onClick={() => { this.toggleTabProgress(1); }} >
                                                <div className="step-icon" data-bs-toggle="tooltip" id="SellerDetails">
                                                    <i className="bx bx-list-ul"></i>
                                                    <UncontrolledTooltip placement="top" target="SellerDetails">
                                                        Seller Details
                                                    </UncontrolledTooltip>
                                                </div>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink className={classnames({ active: this.state.activeTabProgress === 2 })} onClick={() => { this.toggleTabProgress(2); }} >
                                                <div className="step-icon" data-bs-toggle="tooltip" id="CompanyDocument">
                                                    <i className="bx bx-book-bookmark"></i>
                                                    <UncontrolledTooltip placement="top" target="CompanyDocument">
                                                        Company Document
                                                    </UncontrolledTooltip>
                                                </div>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink className={classnames({ active: this.state.activeTabProgress === 3 })} onClick={() => { this.toggleTabProgress(3); }} >
                                                <div className="step-icon" data-bs-toggle="tooltip" id="BankDetails">
                                                    <i className="bx bxs-bank"></i>
                                                    <UncontrolledTooltip placement="top" target="BankDetails">
                                                        Bank Details
                                                    </UncontrolledTooltip>
                                                </div>
                                            </NavLink>
                                        </NavItem>
                                    </ul>

                                    <div id="bar" className="mt-4">
                                        <Progress color="success" striped animated value={this.state.progressValue} />
                                    </div>
                                    <TabContent activeTab={this.state.activeTabProgress} className="twitter-bs-wizard-tab-content">
                                        <TabPane tabId={1}>
                                            <div className="text-center mb-4">
                                                <h5>Seller Details</h5>
                                                <p className="card-title-desc">Fill all information below</p>
                                            </div>
                                            <form>
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label htmlFor="progresspill-firstname-input">First name</label>
                                                            <input type="text" className="form-control" id="progresspill-firstname-input" placeholder="Enter your First Name" />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label htmlFor="progresspill-lastname-input">Last name</label>
                                                            <input type="text" className="form-control" id="progresspill-lastname-input" placeholder="Enter your Last Name" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label htmlFor="progresspill-phoneno-input">Phone</label>
                                                            <input type="text" className="form-control" id="progresspill-phoneno-input" placeholder="Enter your Phone No" />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label htmlFor="progresspill-email-input">Email</label>
                                                            <input type="email" className="form-control" id="progresspill-email-input" placeholder="Enter your Email" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="mb-3">
                                                            <label htmlFor="progresspill-address-input">Address</label>
                                                            <textarea id="progresspill-address-input" className="form-control" rows="2" placeholder="Enter your Address" ></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </TabPane>
                                        <TabPane tabId={2}>
                                            <div>
                                                <div className="text-center mb-4">
                                                    <h5>Company Document</h5>
                                                    <p className="card-title-desc">Fill all information below</p>
                                                </div>
                                                <form>
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="mb-3">
                                                                <label htmlFor="progresspill-pancard-input" className="form-label">PAN Card</label>
                                                                <input type="text" className="form-control" id="progresspill-pancard-input" placeholder="Enter your PAN Card No." />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6">
                                                            <div className="mb-3">
                                                                <label htmlFor="progresspill-vatno-input" className="form-label">VAT/TIN No.</label>
                                                                <input type="text" className="form-control" id="progresspill-vatno-input" placeholder="Enter your VAT/TIN No." />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="mb-3">
                                                                <label htmlFor="progresspill-cstno-input" className="form-label">GST No.</label>
                                                                <input type="text" className="form-control" id="progresspill-cstno-input" placeholder="Enter your GST No." />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6">
                                                            <div className="mb-3">
                                                                <label htmlFor="progresspill-servicetax-input" className="form-label">Service Tax No.</label>
                                                                <input type="text" className="form-control" id="progresspill-servicetax-input" placeholder="Enter your Service Tax No." />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="mb-3">
                                                                <label htmlFor="progresspill-companyuin-input" className="form-label">Company UIN</label>
                                                                <input type="text" className="form-control" id="progresspill-companyuin-input" placeholder="Enter your Company UIN" />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6">
                                                            <div className="mb-3">
                                                                <label htmlFor="progresspill-declaration-input" className="form-label">Declaration</label>
                                                                <input type="text" className="form-control" id="progresspill-declaration-input" placeholder="Enter your Declaration" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </TabPane>
                                        <TabPane tabId={3}>
                                            <div>
                                                <div className="text-center mb-4">
                                                    <h5>Bank Details</h5>
                                                    <p className="card-title-desc">Fill all information below</p>
                                                </div>
                                                <form>
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="mb-3">
                                                                <label htmlFor="progresspill-namecard-input" className="form-label">Name on Card</label>
                                                                <input type="text" className="form-control" id="progresspill-namecard-input" placeholder="Enter your Name on Card" />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">Credit Card Type</label>
                                                                <select className="form-select">
                                                                    <option>Select Card Type</option>
                                                                    <option defaultValue="AE">American Express</option>
                                                                    <option value="VI">Visa</option>
                                                                    <option value="MC">MasterCard</option>
                                                                    <option value="DI">Discover</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="mb-3">
                                                                <label htmlFor="progresspill-cardno-input" className="form-label">Credit Card Number</label>
                                                                <input type="text" className="form-control" id="progresspill-cardno-input" placeholder="Enter your Credit Card Number" />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6">
                                                            <div className="mb-3">
                                                                <label htmlFor="progresspill-card-verification-input" className="form-label">Card Verification Number</label>
                                                                <input type="text" className="form-control" id="progresspill-card-verification-input" placeholder="Enter your Card Verification Number" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="mb-3">
                                                                <label htmlFor="progresspill-expiration-input" className="form-label">Expiration Date</label>
                                                                <input type="date" className="form-control" id="progresspill-expiration-input" />
                                                            </div>
                                                        </div>

                                                    </div>
                                                </form>
                                            </div>
                                        </TabPane>
                                    </TabContent>
                                    <ul className="pager wizard twitter-bs-wizard-pager-link">
                                        <li className={this.state.activeTabProgress === 1 ? "previous disabled" : "previous"}>
                                            <Link
                                                to="#"
                                                className={this.state.activeTabProgress === 1 ? "btn btn-primary disabled" : "btn btn-primary"}
                                                onClick={() => {
                                                    this.toggleTabProgress(this.state.activeTabProgress - 1);
                                                }}
                                            >
                                                <i className="bx bx-chevron-left me-1"></i> Previous
                                            </Link>
                                        </li>

                                        <li className={this.state.activeTabProgress === 3 ? "next disabled" : "next"}>
                                            <Link
                                                to="#"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    this.toggleTabProgress(this.state.activeTabProgress + 1);
                                                }}
                                            >
                                                Next <i className="bx bx-chevron-right ms-1"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default ProgressbarWizard;
