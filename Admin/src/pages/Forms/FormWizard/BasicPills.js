import React, { useState } from "react";
import { CardBody, NavItem, TabContent, TabPane, NavLink, UncontrolledTooltip, Card, CardHeader } from "reactstrap";

import classnames from "classnames";
import { Link } from "react-router-dom";

const BasicPills = () => {
  const [activeTab, setactiveTab] = useState(1);

  function toggleTab(tab) {
    if (activeTab !== tab) {
      if (tab >= 1 && tab <= 3) {
        setactiveTab(tab);
      }
    }
  }

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <h4 className="card-title mb-0">Basic pills Wizard</h4>
        </CardHeader>
        <CardBody>
          <div id="basic-pills-wizard" className="twitter-bs-wizard">
            <ul className="twitter-bs-wizard-nav nav nav-pills nav-justified">
              <NavItem>
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
                      Seller Details
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
              </NavItem>
            </ul>

            <TabContent
              className="twitter-bs-wizard-tab-content"
              activeTab={activeTab}
            >
              <TabPane tabId={1}>
                <div className="text-center mb-4">
                  <h5>Seller Details</h5>
                  <p className="card-title-desc">Fill all information below</p>
                </div>
                <form>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="basicpill-firstname-input"
                          className="form-label"
                        >
                          First name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="basicpill-firstname-input"
                          placeholder="Enter Your First Name"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="basicpill-lastname-input"
                          className="form-label"
                        >
                          Last name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="basicpill-lastname-input"
                          placeholder="Enter Your Last Name"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="basicpill-phoneno-input"
                          className="form-label"
                        >
                          Phone
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="basicpill-phoneno-input"
                          placeholder="Enter Your Phone No"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="basicpill-email-input"
                          className="form-label"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="basicpill-email-input"
                          placeholder="Enter Your Email"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label
                          htmlFor="basicpill-address-input"
                          className="form-label"
                        >
                          Address
                        </label>
                        <textarea
                          id="basicpill-address-input"
                          className="form-control"
                          rows="2"
                          placeholder="Enter Your Address"
                        ></textarea>
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
                          <label
                            htmlFor="basicpill-pancard-input"
                            className="form-label"
                          >
                            PAN Card
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="basicpill-pancard-input"
                            placeholder="Enter Your PAN No."
                          />
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label
                            htmlFor="basicpill-vatno-input"
                            className="form-label"
                          >
                            VAT/TIN No.
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="basicpill-vatno-input"
                            placeholder="Enter Your VAT/TIN No."
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label
                            htmlFor="basicpill-cstno-input"
                            className="form-label"
                          >
                            GST No.
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="basicpill-cstno-input"
                            placeholder="Enter Your GST No."
                          />
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label
                            htmlFor="basicpill-servicetax-input"
                            className="form-label"
                          >
                            Service Tax No.
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="basicpill-servicetax-input"
                            placeholder="Enter Your Service Tax No."
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label
                            htmlFor="basicpill-companyuin-input"
                            className="form-label"
                          >
                            Company UIN
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="basicpill-companyuin-input"
                            placeholder="Enter Your Company UIN."
                          />
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label
                            htmlFor="basicpill-declaration-input"
                            className="form-label"
                          >
                            Declaration
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="basicpill-declaration-input"
                            placeholder="Enter Your Declaration"
                          />
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
                          <label
                            htmlFor="basicpill-namecard-input"
                            className="form-label"
                          >
                            Name on Card
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="basicpill-namecard-input"
                            placeholder="Enter Your Name on Card"
                          />
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
                          <label
                            htmlFor="basicpill-cardno-input"
                            className="form-label"
                          >
                            Credit Card Number
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="basicpill-cardno-input"
                            placeholder="Enter Your Credit Card Number"
                          />
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label
                            htmlFor="basicpill-card-verification-input"
                            className="form-label"
                          >
                            Card Verification Number
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="basicpill-card-verification-input"
                            placeholder="Enter Your Card Verification Number"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label
                            htmlFor="basicpill-expiration-input"
                            className="form-label"
                          >
                            Expiration Date
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="basicpill-expiration-input"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </TabPane>
            </TabContent>
            <ul className="pager wizard twitter-bs-wizard-pager-link">
              <li className={activeTab === 1 ? "previous disabled" : "previous"}>
                <Link
                  to="#"
                  className={activeTab === 1 ? "btn btn-primary disabled" : "btn btn-primary"}
                  onClick={() => {
                    toggleTab(activeTab - 1);
                  }}
                >
                  <i className="bx bx-chevron-left me-1"></i> Previous
                </Link>
              </li>

              <li className={activeTab === 3 ? "next disabled" : "next"}>
                <Link
                  to="#"
                  className="btn btn-primary"
                  onClick={() => {
                    toggleTab(activeTab + 1);
                  }}
                >
                  Next <i className="bx bx-chevron-right ms-1"></i>
                </Link>
              </li>
            </ul>

          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default BasicPills;
