import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
  Dropdown,
  ButtonDropdown,
  Button
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const UiDropdowns = () => {

  //meta title
  document.title = "Dropdown | Minia - React Admin & Dashboard Template";

  const [btnprimary1, setBtnprimary1] = useState(false);
  const [btnsecondary1, setBtnsecondary1] = useState(false);
  const [btnsuccess1, setBtnsuccess1] = useState(false);
  const [btnInfo1, setBtnInfo1] = useState(false);
  const [btnWarning1, setBtnWarning1] = useState(false);
  const [btnDanger1, setBtnDanger1] = useState(false);
  const [drp_primary1, setDrp_primary1] = useState(false);
  const [drp_secondary1, setDrp_secondary1] = useState(false);
  const [drp_success1, setDrp_success1] = useState(false);
  const [drp_info1, setDrp_info1] = useState(false);
  const [drp_warning1, setDrp_warning1] = useState(false);
  const [drp_danger1, setDrp_danger1] = useState(false);
  const [drp_secondary, setDrp_secondary] = useState(false);
  const [drp_secondary_lg, setDrp_secondary_lg] = useState(false);
  const [drp_secondary_sm, setDrp_secondary_sm] = useState(false);
  const [drp_secondary_sm1, setDrp_secondary_sm1] = useState(false);
  const [dropup1, setDropup1] = useState(false);
  const [drp_up11, setDrp_up11] = useState(false);
  const [info_dropup1, setInfo_dropup1] = useState(false);
  const [infodrp_up11, setInfodrp_up11] = useState(false);
  const [info_dropup111, setInfo_dropup111] = useState(false);
  const [infodrp_up1111, setInfodrp_up1111] = useState(false);
  const [drp_menudark, setDrp_menudark] = useState(false);
  const [drp_menualignMent, setDrp_menualignMent] = useState(false);
  const [drp_menualignMentRight, setDrp_menualignMentRight] = useState(false);
  const [drp_menualignMentLeft, setDrp_menualignMentLeft] = useState(false);
  const [drp_Default, setDrp_Default] = useState(false);
  const [drp_ManualClose, setDrp_ManualClose] = useState(false);
  const [drp_ClkInside, setDrp_ClkInside] = useState(false);
  const [drp_ClkOutside, setDrp_ClkOutside] = useState(false);
  const [drp_menuheader, setDrp_menuheader] = useState(false);
  const [drp_menutext, setDrp_menutext] = useState(false);
  const [drp_menuform, setDrp_menuform] = useState(false);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Components" breadcrumbItem="Dropdowns" />
          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Single button dropdowns</h4>
                  <p className="card-title-desc">
                    Any single <code className="highlighter-rouge">.btn</code>{" "}
                    can be turned into a dropdown toggle with some markup
                    changes. Here’s how you can put them to work with either{" "}
                    <code className="highlighter-rouge">&lt;button&gt;</code>
                    elements:
                  </p>
                </CardHeader>

                <CardBody>
                  <Row>
                    <Col sm={6}>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          className="btn btn-secondary"
                          type="button"
                          tag="a"
                        >
                          Dropdown button{" "}
                          <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem to="#">Action</DropdownItem>
                          <DropdownItem to="#">Another action</DropdownItem>
                          <DropdownItem to="#">
                            Something else here
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Col>

                    <Col sm={6}>
                      <UncontrolledDropdown className="mt-4 mt-sm-0">
                        <DropdownToggle tag="a" className="btn btn-secondary">
                          Dropdown link <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>

                        <DropdownMenu>
                          <DropdownItem to="#">Action</DropdownItem>
                          <DropdownItem to="#">Another action</DropdownItem>
                          <DropdownItem to="#">
                            Something else here
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Variant</h4>
                  <p className="card-title-desc">
                    The best part is you can do this with any button variant,
                    too:
                  </p>
                </CardHeader>

                <CardBody>
                  <div className="d-flex gap-2 flex-wrap">
                    <Dropdown
                      isOpen={btnprimary1}
                      toggle={() => setBtnprimary1(!btnprimary1)}
                    >
                      <DropdownToggle tag="button" className="btn btn-primary">
                        Primary <i className="mdi mdi-chevron-down" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>{" "}
                    <Dropdown
                      isOpen={btnsecondary1}
                      toggle={() => setBtnsecondary1(!btnsecondary1)}
                    >
                      <DropdownToggle
                        tag="button"
                        className="btn btn-secondary"
                      >
                        Secondary <i className="mdi mdi-chevron-down" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>{" "}
                    <Dropdown
                      isOpen={btnsuccess1}
                      toggle={() => setBtnsuccess1(!btnsuccess1)}
                    >
                      <DropdownToggle tag="button" className="btn btn-success">
                        Success <i className="mdi mdi-chevron-down" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <Dropdown
                      isOpen={btnInfo1}
                      toggle={() => setBtnInfo1(!btnInfo1)}
                    >
                      <DropdownToggle tag="button" className="btn btn-info">
                        Info <i className="mdi mdi-chevron-down" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <Dropdown
                      isOpen={btnWarning1}
                      toggle={() => setBtnWarning1(!btnWarning1)}
                    >
                      <DropdownToggle tag="button" className="btn btn-warning">
                        Warning <i className="mdi mdi-chevron-down" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <Dropdown
                      isOpen={btnDanger1}
                      toggle={() => setBtnDanger1(!btnDanger1)}
                    >
                      <DropdownToggle tag="button" className="btn btn-danger">
                        Danger <i className="mdi mdi-chevron-down" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Dropdown Menu Item Color</h4>
                  <p className="card-title-desc">
                    Example of dropdown menu item color
                  </p>
                </CardHeader>

                <CardBody>
                  <Row>
                    <Col lg={3}>
                      <div className="">
                        <h5 className="font-size-13 mb-3">
                          Dropdown Menu Success link example
                        </h5>
                        <div className="clearfix">
                          <DropdownMenu
                            className="d-inline-block position-relative dropdownmenu-success"
                            style={{ zIndex: "1" }}
                          >
                            <DropdownItem to="#">Action</DropdownItem>
                            <DropdownItem to="#">Another action</DropdownItem>
                            <DropdownItem className="active" to="#">
                              Something else here
                            </DropdownItem>
                            <div className="dropdown-divider"></div>
                            <DropdownItem to="#">Separated link</DropdownItem>
                          </DropdownMenu>
                        </div>
                      </div>
                    </Col>

                    <Col lg={9}>
                      <div className="mt-lg-0 mt-3">
                        <h5 className="font-size-13 mb-0">
                          Dropdown Menu link Color example
                        </h5>
                        <div>
                          <Row>
                            <Col lg={4} sm={6}>
                              <div className="mt-3">
                                <p className="font-size-13 mb-2">
                                  Dropdown menu Primary link
                                </p>
                                <UncontrolledDropdown>
                                  <DropdownToggle color="primary" type="button">
                                    Primary{" "}
                                    <i className="mdi mdi-chevron-down"></i>
                                  </DropdownToggle>
                                  <DropdownMenu className="dropdownmenu-primary">
                                    <DropdownItem to="#">Action</DropdownItem>
                                    <DropdownItem to="#">
                                      Another action
                                    </DropdownItem>
                                    <DropdownItem to="#">
                                      Something else here
                                    </DropdownItem>
                                    <div className="dropdown-divider"></div>
                                    <DropdownItem to="#">
                                      Separated link
                                    </DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              </div>
                            </Col>
                            <Col lg={4} sm={6}>
                              <div className="mt-3">
                                <p className="font-size-13 mb-2">
                                  Dropdown menu Secondary link
                                </p>
                                <UncontrolledDropdown>
                                  <DropdownToggle
                                    type="button"
                                    className="btn btn-secondary"
                                  >
                                    Secondary{" "}
                                    <i className="mdi mdi-chevron-down"></i>
                                  </DropdownToggle>
                                  <DropdownMenu className="dropdownmenu-secondary">
                                    <DropdownItem to="#">Action</DropdownItem>
                                    <DropdownItem to="#">
                                      Another action
                                    </DropdownItem>
                                    <DropdownItem to="#">
                                      Something else here
                                    </DropdownItem>
                                    <div className="dropdown-divider"></div>
                                    <DropdownItem to="#">
                                      Separated link
                                    </DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              </div>
                            </Col>
                            <Col lg={4} sm={6}>
                              <div className="mt-3">
                                <p className="font-size-13 mb-2">
                                  Dropdown menu Success link
                                </p>
                                <UncontrolledDropdown>
                                  <DropdownToggle
                                    type="button"
                                    className="btn btn-success"
                                  >
                                    Success{" "}
                                    <i className="mdi mdi-chevron-down"></i>
                                  </DropdownToggle>
                                  <DropdownMenu className="dropdownmenu-success">
                                    <DropdownItem to="#">Action</DropdownItem>
                                    <DropdownItem to="#">
                                      Another action
                                    </DropdownItem>
                                    <DropdownItem to="#">
                                      Something else here
                                    </DropdownItem>
                                    <div className="dropdown-divider"></div>
                                    <DropdownItem to="#">
                                      Separated link
                                    </DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              </div>
                            </Col>
                            <Col lg={4} sm={6}>
                              <div className="mt-3">
                                <p className="font-size-13 mb-2">
                                  Dropdown menu Warning link
                                </p>
                                <UncontrolledDropdown>
                                  <DropdownToggle
                                    type="button"
                                    className="btn btn-warning"
                                  >
                                    Warning{" "}
                                    <i className="mdi mdi-chevron-down"></i>
                                  </DropdownToggle>
                                  <DropdownMenu className="dropdownmenu-warning">
                                    <DropdownItem to="#">Action</DropdownItem>
                                    <DropdownItem to="#">
                                      Another action
                                    </DropdownItem>
                                    <DropdownItem to="#">
                                      Something else here
                                    </DropdownItem>
                                    <div className="dropdown-divider"></div>
                                    <DropdownItem to="#">
                                      Separated link
                                    </DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              </div>
                            </Col>
                            <Col lg={4} sm={6}>
                              <div className="mt-3">
                                <p className="font-size-13 mb-2">
                                  Dropdown menu Info link
                                </p>
                                <UncontrolledDropdown>
                                  <DropdownToggle
                                    type="button"
                                    className="btn btn-info"
                                  >
                                    Info{" "}
                                    <i className="mdi mdi-chevron-down"></i>
                                  </DropdownToggle>
                                  <DropdownMenu className="dropdownmenu-info">
                                    <DropdownItem to="#">Action</DropdownItem>
                                    <DropdownItem to="#">
                                      Another action
                                    </DropdownItem>
                                    <DropdownItem to="#">
                                      Something else here
                                    </DropdownItem>
                                    <div className="dropdown-divider"></div>
                                    <DropdownItem to="#">
                                      Separated link
                                    </DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              </div>
                            </Col>
                            <Col lg={4} sm={6}>
                              <div className="mt-3">
                                <p className="font-size-13 mb-2">
                                  Dropdown menu Danger link
                                </p>
                                <UncontrolledDropdown>
                                  <DropdownToggle
                                    type="button"
                                    className="btn btn-danger"
                                  >
                                    Danger{" "}
                                    <i className="mdi mdi-chevron-down"></i>
                                  </DropdownToggle>
                                  <DropdownMenu className="dropdownmenu-danger">
                                    <DropdownItem to="#">Action</DropdownItem>
                                    <DropdownItem to="#">
                                      Another action
                                    </DropdownItem>
                                    <DropdownItem to="#">
                                      Something else here
                                    </DropdownItem>
                                    <div className="dropdown-divider"></div>
                                    <DropdownItem to="#">
                                      Separated link
                                    </DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <Card>
                <div className="card-header">
                  <h4 className="card-title">Split Button Dropdowns</h4>
                  <p className="card-title-desc">
                    The best part is you can do this with any button variant,
                    too:
                  </p>
                </div>

                <CardBody>
                  <div className="d-flex gap-2 flex-wrap">
                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_primary1}
                        toggle={() => setDrp_primary1(!drp_primary1)}
                      >
                        <Button color="primary">Primary</Button>
                        <DropdownToggle
                          color="primary"
                          className="dropdown-toggle-split"
                        >
                          <i className="mdi mdi-chevron-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>

                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_secondary1}
                        toggle={() => setDrp_secondary1(!drp_secondary1)}
                      >
                        <Button color="secondary">Secondary</Button>
                        <DropdownToggle
                          caret
                          color="secondary"
                          className="dropdown-toggle-split"
                        >
                          <i className="mdi mdi-chevron-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>

                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_success1}
                        toggle={() => setDrp_success1(!drp_success1)}
                      >
                        <Button color="success">Success</Button>
                        <DropdownToggle
                          caret
                          color="success"
                          className="dropdown-toggle-split"
                        >
                          <i className="mdi mdi-chevron-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>

                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_info1}
                        toggle={() => setDrp_info1(!drp_info1)}
                      >
                        <Button color="info">Info</Button>
                        <DropdownToggle
                          caret
                          color="info"
                          className="dropdown-toggle-split"
                        >
                          <i className="mdi mdi-chevron-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>

                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_warning1}
                        toggle={() => setDrp_warning1(!drp_warning1)}
                      >
                        <Button color="warning"> Warning </Button>
                        <DropdownToggle
                          caret
                          color="warning"
                          className="dropdown-toggle-split">
                          <i className="mdi mdi-chevron-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>

                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_danger1}
                        toggle={() => setDrp_danger1(!drp_danger1)}
                      >
                        <Button color="danger">Danger
                        </Button>
                        <DropdownToggle caret color="danger" className="dropdown-toggle-split">
                          <i className="mdi mdi-chevron-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <div className="card-header">
                  <h4 className="card-title">Sizing</h4>
                  <p className="card-title-desc">
                    Button dropdowns work with buttons of all sizes, including
                    default and split dropdown buttons.
                  </p>
                </div>
                <CardBody>
                  <div className="btn-group me-1 mt-2">
                    <ButtonDropdown
                      isOpen={drp_secondary}
                      toggle={() => setDrp_secondary(!drp_secondary)}
                    >
                      <DropdownToggle
                        caret
                        color="primary"
                        className="btn btn-primary btn-lg"
                      >
                        Large button <i className="mdi mdi-chevron-down" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem disabled>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>{" "}
                  <div className="btn-group me-1 mt-2">
                    <ButtonDropdown
                      isOpen={drp_secondary_lg}
                      toggle={() => setDrp_secondary_lg(!drp_secondary_lg)}
                    >
                      <DropdownToggle
                        color="secondary"
                        className="btn-lg dropdown-toggle"
                      >Large button <i className="mdi mdi-chevron-down" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem disabled>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>{" "}
                  <div className="btn-group me-1 mt-2">
                    <ButtonDropdown
                      isOpen={drp_secondary_sm}
                      toggle={() => setDrp_secondary_sm(!drp_secondary_sm)}
                    >
                      <DropdownToggle
                        caret
                        color="info"
                        className="btn btn-info btn-sm"
                      >
                        Small button <i className="mdi mdi-chevron-down" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem disabled>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>{" "}
                  <div className="btn-group me-1 mt-2">
                    <ButtonDropdown
                      isOpen={drp_secondary_sm1}
                      toggle={() => setDrp_secondary_sm1(!drp_secondary_sm1)}
                    >
                      <Button className="btn btn-secondary btn-sm">
                        {" "}
                        Small button
                      </Button>
                      <DropdownToggle
                        caret
                        color="secondary"
                        className="btn btn-secondary btn-sm"
                      >
                        <i className="mdi mdi-chevron-down" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem disabled>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Dark Dropdowns</h4>
                  <p className="card-title-desc">
                    Opt into darker dropdowns to match a dark navbar or custom
                    style by adding <code>.dropdown-menu-dark</code> onto an
                    existing <code>.dropdown-menu</code>. No changes are
                    required to the dropdown items.
                  </p>
                </CardHeader>
                <CardBody>
                  <ButtonDropdown
                    isOpen={drp_menudark}
                    toggle={() => setDrp_menudark(!drp_menudark)}
                  >
                    <DropdownToggle color="secondary" className="dropdown-toggle">
                      Dropdown Button <i className="mdi mdi-chevron-down"></i>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-dark">
                      <DropdownItem to="#">Action</DropdownItem>
                      <DropdownItem to="#">Another action</DropdownItem>
                      <DropdownItem to="#">Something else here</DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Menu Content</h4>
                  <p className="card-title-desc">
                    Example of dropdown menu Headers, Text, Forms content
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <ButtonDropdown
                      isOpen={drp_menuheader}
                      toggle={() => setDrp_menuheader(!drp_menuheader)}
                    >
                      <DropdownToggle color="primary" className="dropdown-toggle">
                        Header <i className="mdi mdi-chevron-down"></i>
                      </DropdownToggle>
                      <DropdownMenu>
                        <div className="dropdown-header noti-title">
                          <h5 className="font-size-13 text-muted text-truncate mn-0">
                            Welcome Jessie!
                          </h5>
                        </div>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>

                    <ButtonDropdown
                      isOpen={drp_menutext}
                      toggle={() => setDrp_menutext(!drp_menutext)}
                    >
                      <DropdownToggle color="success" className="dropdown-toggle">
                        Text <i className="mdi mdi-chevron-down"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-md p-3">
                        <div className="text-wrap">
                          <p>
                            Some example text that's free-flowing within the
                            dropdown menu.
                          </p>
                          <p className="mb-0">And this is more example text.</p>
                        </div>
                      </DropdownMenu>
                    </ButtonDropdown>

                    <ButtonDropdown
                      isOpen={drp_menuform}
                      toggle={() => setDrp_menuform(!drp_menuform)}
                    >
                      <DropdownToggle color="light" className="dropdown-toggle">
                        Forms <i className="mdi mdi-chevron-down"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-md p-4">
                        <form>
                          <div className="mb-2">
                            <label
                              className="form-label"
                              htmlFor="exampleDropdownFormEmail"
                            >
                              Email address
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              id="exampleDropdownFormEmail"
                              placeholder="email@example.com"
                            />
                          </div>
                          <div className="mb-2">
                            <label
                              className="form-label"
                              htmlFor="exampleDropdownFormPassword"
                            >
                              Password
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              id="exampleDropdownFormPassword"
                              placeholder="Password"
                            />
                          </div>
                          <div className="mb-2">
                            <div className="form-check custom-checkbox">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="rememberdropdownCheck"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="rememberdropdownCheck"
                              >
                                Remember me
                              </label>
                            </div>
                          </div>
                          <button type="submit" className="btn btn-primary">
                            Sign in
                          </button>
                        </form>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Menu Alignment</h4>
                  <p className="card-title-desc">Add <code className="highlighter-rouge">.dropdown-menu-end</code>
                    to a <code className="highlighter-rouge">.dropdown-menu</code> to right
                    align the dropdown menu.</p>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-3">
                    <ButtonDropdown
                      isOpen={drp_menualignMent}
                      toggle={() => setDrp_menualignMent(!drp_menualignMent)}
                    >
                      <DropdownToggle color="secondary" className="dropdown-toggle">
                        Right-aligned menu example <i className="mdi mdi-chevron-down"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-end">
                        <DropdownItem to="#">Action</DropdownItem>
                        <DropdownItem to="#">Another action</DropdownItem>
                        <DropdownItem to="#">Something else here</DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>

                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_menualignMentLeft}
                        toggle={() => setDrp_menualignMentLeft(!drp_menualignMentLeft)}
                      >
                        <DropdownToggle color="secondary" className="dropdown-toggle">
                          Left-aligned but right aligned when large screen <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-lg-end">
                          <DropdownItem to="#">Action</DropdownItem>
                          <DropdownItem to="#">Another action</DropdownItem>
                          <DropdownItem to="#">Something else here</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>

                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_menualignMentRight}
                        toggle={() => setDrp_menualignMentRight(!drp_menualignMentRight)}
                      >
                        <DropdownToggle color="secondary" className="dropdown-toggle">
                          Right-aligned but left aligned when large screen <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-end dropdown-menu-lg-start">
                          <DropdownItem to="#">Action</DropdownItem>
                          <DropdownItem to="#">Another action</DropdownItem>
                          <DropdownItem to="#">Something else here</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Auto Close Behavior</h4>
                  <p className="card-title-desc">Trigger dropdown menus at the down of the elements by adding <code>.dropdown</code> to the parent element.
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="d-flex gap-2 flex-wrap">
                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_Default}
                        toggle={() => setDrp_Default(!drp_Default)}
                        className="dropdown-toggle"
                      >
                        <DropdownToggle color="secondary" className="dropdown-toggle">
                          Default dropdown
                          <i className="mdi mdi-chevron-down ps-1"></i>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu">
                          <DropdownItem to="#">Menu item</DropdownItem>
                          <DropdownItem to="#">Menu item</DropdownItem>
                          <DropdownItem to="#">Menu item</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>

                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_ClkOutside}
                        toggle={() => setDrp_ClkOutside(!drp_ClkOutside)}
                        className="dropdown-toggle"
                      >
                        <DropdownToggle color="secondary" className="dropdown-toggle">
                          Clickable outside
                          <i className="mdi mdi-chevron-down ps-1"></i>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu">
                          <DropdownItem to="#">Menu item</DropdownItem>
                          <DropdownItem to="#">Menu item</DropdownItem>
                          <DropdownItem to="#">Menu item</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>

                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_ClkInside}
                        toggle={() => setDrp_ClkInside(!drp_ClkInside)}
                        className="dropdown-toggle"
                      >
                        <DropdownToggle color="secondary" className="dropdown-toggle">
                          Clickable inside
                          <i className="mdi mdi-chevron-down ps-1"></i>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu">
                          <DropdownItem to="#">Menu item</DropdownItem>
                          <DropdownItem to="#">Menu item</DropdownItem>
                          <DropdownItem to="#">Menu item</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>

                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_ManualClose}
                        toggle={() => setDrp_ManualClose(!drp_ManualClose)}
                        className="dropdown-toggle"
                      >
                        <DropdownToggle color="secondary" className="dropdown-toggle">
                          Manual close<i className="mdi mdi-chevron-down ps-1"></i>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu">
                          <DropdownItem to="#">Menu item</DropdownItem>
                          <DropdownItem to="#">Menu item</DropdownItem>
                          <DropdownItem to="#">Menu item</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Dropup Variation</h4>
                  <p className="card-title-desc">
                    Trigger dropdown menus above elements by adding{" "}
                    <code className="highlighter-rouge">.dropup</code> to the
                    parent element.
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="d-flex gap-2 flex-wrap">
                    <Dropdown
                      className="btn-group dropup"
                      isOpen={dropup1}
                      direction="up"
                      toggle={() => setDropup1(!dropup1)}
                    >
                      <DropdownToggle className="btn btn-info dropdown-toggle">
                        Dropup <i className="mdi mdi-chevron-up" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>

                    <ButtonDropdown
                      direction="up"
                      isOpen={drp_up11}
                      toggle={() => setDrp_up11(!drp_up11)}
                    >
                      <Button id="caret" color="info">
                        Split dropup
                      </Button>
                      <DropdownToggle
                        caret
                        color="info"
                        className="dropdown-toggle-split"
                      >
                        <i className="mdi mdi-chevron-up" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header>Header</DropdownItem>
                        <DropdownItem disabled>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Dropstart Variation</h4>
                  <p className="card-title-desc">
                    Trigger dropdown menus at the right of the elements by
                    adding <code>.dropStart</code> to the parent element.
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="d-flex gap-2 flex-wrap">
                    <Dropdown
                      isOpen={info_dropup111}
                      className="btn-group dropstart"
                      toggle={() => setInfo_dropup111(!info_dropup111)}
                      direction="left"
                    >
                      <DropdownToggle className="btn btn-info dropdown-toggle">
                        <i className="mdi mdi-chevron-left" /> Dropstart
                      </DropdownToggle>
                      <DropdownMenu data-popper-placement="left-start">
                        <DropdownItem header>Header</DropdownItem>
                        <DropdownItem disabled>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <ButtonDropdown
                      isOpen={infodrp_up1111}
                      className="btn-group dropstart"
                      toggle={() => setInfodrp_up1111(!infodrp_up1111)}
                      direction="left"
                    >
                      <DropdownToggle
                        caret
                        color="info"
                        className="dropdown-toggle-split"
                      >
                        <i className="mdi mdi-chevron-left" />
                      </DropdownToggle>
                      <Button id="caret" color="info" className="dropdown-toggle">
                        Split dropstart
                      </Button>
                      <DropdownMenu data-popper-placement="left-start">
                        <DropdownItem header>Header</DropdownItem>
                        <DropdownItem disabled>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Dropend Variation</h4>
                  <p className="card-title-desc">
                    Trigger dropdown menus at the right of the elements by
                    adding <code>.dropend</code> to the parent element.
                  </p>
                </CardHeader>

                <CardBody>
                  <div className="d-flex gap-2 flex-wrap">
                    <Dropdown
                      isOpen={info_dropup1}
                      className="btn-group dropend"
                      toggle={() => setInfo_dropup1(!info_dropup1)}
                      direction="right"
                    >
                      <DropdownToggle className="btn btn-info" caret>
                        Dropend <i className="mdi mdi-chevron-right" />
                      </DropdownToggle>
                      <DropdownMenu data-popper-placement="right-start">
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <ButtonDropdown
                      isOpen={infodrp_up11}
                      className="btn-group dropend"
                      toggle={() => setInfodrp_up11(!infodrp_up11)}
                      direction="right"
                    >
                      <Button id="caret" color="info">
                        Split dropend
                      </Button>
                      <DropdownToggle
                        caret
                        color="info"
                        className="dropdown-toggle-split"
                      >
                        <i className="mdi mdi-chevron-right" />
                      </DropdownToggle>
                      <DropdownMenu data-popper-placement="right-start">
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UiDropdowns;