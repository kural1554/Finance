import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Container, Row } from 'reactstrap'

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import image

import image10 from "../../assets/images/users/avatar-10.jpg"
import image3 from "../../assets/images/small/img-3.jpg"
import { Link } from 'react-router-dom';

const UiUtilities = () => {

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Components" breadcrumbItem="Utilities" />
                    {/* <Row>
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            </div>
                        </div>
                    </Row> */}

                    <Row>
                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Additive Border</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-wrap gap-2">
                                        <span className="border border-primary bg-light p-5 d-inline-block"></span>
                                        <span className="border-top border-primary bg-light p-5 d-inline-block"></span>
                                        <span className="border-end border-primary bg-light p-5 d-inline-block"></span>
                                        <span className="border-bottom border-primary bg-light p-5 d-inline-block"></span>
                                        <span className="border-start border-primary bg-light p-5 d-inline-block"></span>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Subtractive Border</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-wrap gap-2">
                                        <span className="border border-0 border-primary bg-light p-5 d-inline-block"></span>
                                        <span className="border border-top-0 border-primary bg-light p-5 d-inline-block"></span>
                                        <span className="border border-end-0 border-primary bg-light p-5 d-inline-block"></span>
                                        <span className="border border-bottom-0 border-primary bg-light p-5 d-inline-block"></span>
                                        <span className="border border-start-0 border-primary bg-light p-5 d-inline-block"></span>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Border Opacity</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-wrap gap-2">
                                        <span className="border border-primary border-opacity-10 bg-light p-5 d-inline-block"></span>
                                        <span className="border border-primary border-opacity-25 bg-light p-5 d-inline-block"></span>
                                        <span className="border border-primary border-opacity-50 bg-light p-5 d-inline-block"></span>
                                        <span className="border border-primary border-opacity-75 bg-light p-5 d-inline-block"></span>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Border Width</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-wrap gap-2">
                                        <span className="border border-1 p-5 d-inline-block"></span>
                                        <span className="border border-2 p-5 d-inline-block"></span>
                                        <span className="border border-3 p-5 d-inline-block"></span>
                                        <span className="border border-4 p-5 d-inline-block"></span>
                                        <span className="border border-5 p-5 d-inline-block"></span>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <Card className="card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Border Radius</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-wrap gap-3 align-items-center">
                                        <img src={image10} className="rounded avatar-xl" alt=" " />
                                        <img
                                            src={image10}
                                            className="rounded-top avatar-xl"
                                            alt=""
                                        />
                                        <img
                                            src={image10}
                                            className="rounded-end avatar-xl"
                                            alt=""
                                        />
                                        <img
                                            src={image10}
                                            className="rounded-bottom avatar-xl"
                                            alt=""
                                        />
                                        <img
                                            src={image10}
                                            className="rounded-start avatar-xl"
                                            alt=""
                                        />
                                        <img
                                            src={image10}
                                            className="rounded-circle avatar-xl"
                                            alt=""
                                        />
                                        <img
                                            src={image3}
                                            alt=""
                                            className="rounded-pill w-25 h-auto"
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <Card className="card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Rounded Sizes</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-wrap gap-2">
                                        <img src={image10} className="rounded-0 avatar-xl" alt="" />
                                        <img src={image10} className="rounded-1 avatar-xl" alt="" />
                                        <img src={image10} className="rounded-2 avatar-xl" alt="" />
                                        <img src={image10} className="rounded-3 avatar-xl" alt="" />
                                        <img src={image10} className="rounded-4 avatar-xl" alt="" />
                                        <img src={image10} className="rounded-5 avatar-xl" alt="" />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={4}>
                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">
                                        Direction of Flex Row & Reverse
                                    </h4>
                                    <Link
                                        to="https://getbootstrap.com/docs/5.2/utilities/flex/#direction"
                                        target="_blank"
                                        className="btn btn-sm btn-soft-secondary"
                                    >
                                        Docs <i className="mdi mdi-arrow-right align-middle"></i>
                                    </Link>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-row border bg-light mb-3">
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                    <div className="d-flex flex-row-reverse bg-light border ">
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <Card className="card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Grow and Shrink</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex bg-light">
                                        <div className="p-2 flex-grow-1 border">Flex item</div>
                                        <div className="p-2 border">Flex item</div>
                                        <div className="p-2 border">Third flex item</div>
                                    </div>
                                    <div className="d-flex bg-light mt-3">
                                        <div className="p-2 w-100 border">Flex item</div>
                                        <div className="p-2 flex-shrink-1 border">Flexitem</div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <Card className="card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Enable Flex Behaviors</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex p-2 border bg-light mb-2">
                                        I'm a flexbox container!
                                    </div>
                                    <div className="d-inline-flex p-2 border bg-light">
                                        I'm an inline flexbox container!
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={6}>
                            <Card className="card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Wrap</h4>
                                </CardHeader>
                                <CardBody>
                                    <div
                                        className="d-flex flex-nowrap bg-light border mb-3"
                                        style={{ width: "16rem" }}
                                    >
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                        <div className="p-2 border">Flex item 4</div>
                                        <div className="p-2 border">Flex item 5</div>
                                        <div className="p-2 border">Flex item 6</div>
                                        <div className="p-2 border">Flex item 7</div>
                                        <div className="p-2 border">Flex item 8</div>
                                    </div>
                                    <div className="d-flex flex-wrap bg-light border mb-3">
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                        <div className="p-2 border">Flex item 4</div>
                                        <div className="p-2 border">Flex item 5</div>
                                        <div className="p-2 border">Flex item 6</div>
                                        <div className="p-2 border">Flex item 7</div>
                                        <div className="p-2 border">Flex item 8</div>
                                        <div className="p-2 border">Flex item 9</div>
                                    </div>
                                    <div className="d-flex flex-wrap-reverse bg-light border mb-0">
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                        <div className="p-2 border">Flex item 4</div>
                                        <div className="p-2 border">Flex item 5</div>
                                        <div className="p-2 border">Flex item 6</div>
                                        <div className="p-2 border">Flex item 7</div>
                                        <div className="p-2 border">Flex item 8</div>
                                        <div className="p-2 border">Flex item 9</div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={6}>
                            <Card className="card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">
                                        Direction of Flex Column & Reverse
                                    </h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-column bg-light border mb-3">
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                    <div className="d-flex flex-column-reverse bg-light border">
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={4}>
                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Auto Margins</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex border bg-light mb-3">
                                        <div className="p-2 border">Flex item</div>
                                        <div className="p-2 border">Flex item</div>
                                        <div className="p-2 border">Flex item</div>
                                    </div>

                                    <div className="d-flex border bg-light mb-3">
                                        <div className="me-auto p-2 border">Flex item</div>
                                        <div className="p-2 border">Flex item</div>
                                        <div className="p-2 border">Flex item</div>
                                    </div>

                                    <div className="d-flex border bg-light mb-0">
                                        <div className="p-2 border">Flex item</div>
                                        <div className="p-2 border">Flex item</div>
                                        <div className="ms-auto p-2 border">Flex item</div>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Gap</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-grid gap-3">
                                        <div className="p-2 bg-light border">Grid item 1</div>
                                        <div className="p-2 bg-light border">Grid item 2</div>
                                        <div className="p-2 bg-light border">Grid item 3</div>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Text Wrapping and Overflow</h4>
                                </CardHeader>
                                <CardBody>
                                    <div
                                        className="badge bg-primary text-wrap"
                                        style={{ width: "6rem" }}
                                    >
                                        This text should wrap.
                                    </div>
                                </CardBody>
                                <CardBody className="pt-0">
                                    <div
                                        className="text-nowrap border bg-light"
                                        style={{ width: "8rem" }}
                                    >
                                        This text should overflow the parent.
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Word Break</h4>
                                </CardHeader>
                                <CardBody>
                                    <p className="text-break mb-0">
                                        mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                                    </p>
                                </CardBody>
                            </Card>

                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Font Size</h4>
                                </CardHeader>
                                <CardBody>
                                    <p className="fs-1 mb-1">.fs-1 text</p>
                                    <p className="fs-2 mb-1">.fs-2 text</p>
                                    <p className="fs-3 mb-1">.fs-3 text</p>
                                    <p className="fs-4 mb-1">.fs-4 text</p>
                                    <p className="fs-5 mb-1">.fs-5 text</p>
                                    <p className="fs-6 mb-0">.fs-6 text</p>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Align Content</h4>
                                </CardHeader>
                                <CardBody>
                                    <div
                                        className="d-flex align-content-start flex-wrap bg-light border mb-3"
                                        style={{ minHeight: 182 }}
                                    >
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                        <div className="p-2 border">Flex item 4</div>
                                        <div className="p-2 border">Flex item 5</div>
                                        <div className="p-2 border">Flex item 6</div>
                                        <div className="p-2 border">Flex item 7</div>
                                        <div className="p-2 border">Flex item 8</div>
                                    </div>
                                    <div
                                        className="d-flex align-content-end flex-wrap bg-light border mb-3"
                                        style={{ minHeight: 182 }}
                                    >
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                        <div className="p-2 border">Flex item 4</div>
                                        <div className="p-2 border">Flex item 5</div>
                                        <div className="p-2 border">Flex item 6</div>
                                        <div className="p-2 border">Flex item 7</div>
                                        <div className="p-2 border">Flex item 8</div>
                                        <div className="p-2 border">Flex item 9</div>
                                    </div>
                                    <div
                                        className="d-flex align-content-center flex-wrap bg-light border mb-3"
                                        style={{ minHeight: 182 }}
                                    >
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                        <div className="p-2 border">Flex item 4</div>
                                        <div className="p-2 border">Flex item 5</div>
                                        <div className="p-2 border">Flex item 6</div>
                                        <div className="p-2 border">Flex item 7</div>
                                        <div className="p-2 border">Flex item 8</div>
                                        <div className="p-2 border">Flex item 9</div>
                                    </div>
                                    <div
                                        className="d-flex align-content-between flex-wrap bg-light border mb-3"
                                        style={{ minHeight: 182 }}
                                    >
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                        <div className="p-2 border">Flex item 4</div>
                                        <div className="p-2 border">Flex item 5</div>
                                        <div className="p-2 border">Flex item 6</div>
                                        <div className="p-2 border">Flex item 7</div>
                                        <div className="p-2 border">Flex item 8</div>
                                        <div className="p-2 border">Flex item 9</div>
                                    </div>

                                    <div
                                        className="d-flex align-content-around flex-wrap bg-light border mb-3"
                                        style={{ minHeight: 182 }}
                                    >
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                        <div className="p-2 border">Flex item 4</div>
                                        <div className="p-2 border">Flex item 5</div>
                                        <div className="p-2 border">Flex item 6</div>
                                        <div className="p-2 border">Flex item 7</div>
                                        <div className="p-2 border">Flex item 8</div>
                                        <div className="p-2 border">Flex item 9</div>
                                    </div>

                                    <div
                                        className="d-flex align-content-stretch flex-wrap bg-light border mb-0"
                                        style={{ minHeight: 182 }}
                                    >
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                        <div className="p-2 border">Flex item 4</div>
                                        <div className="p-2 border">Flex item 5</div>
                                        <div className="p-2 border">Flex item 6</div>
                                        <div className="p-2 border">Flex item 7</div>
                                        <div className="p-2 border">Flex item 8</div>
                                        <div className="p-2 border">Flex item 9</div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Order</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-nowrap border bg-light">
                                        <div className="order-3 p-2 border">First flex item</div>
                                        <div className="order-2 p-2 border">Second flex item</div>
                                        <div className="order-1 p-2 border">Third flex item</div>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Float</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="float-start">
                                        Float start on all viewport sizes
                                    </div>
                                    <br />
                                    <div className="float-end">
                                        Float end on all viewport sizes
                                    </div>
                                    <br />
                                    <div className="float-none">
                                        Don't float on all viewport sizes
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Text Selection</h4>
                                </CardHeader>
                                <CardBody>
                                    <p className="user-select-all">
                                        This paragraph will be entirely selected when clicked by the
                                        user.
                                    </p>
                                    <p className="user-select-auto">
                                        This paragraph has default select behavior.
                                    </p>
                                    <p className="user-select-none">
                                        This paragraph will not be selectable when clicked by the
                                        user.
                                    </p>
                                </CardBody>
                            </Card>

                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Pointer Events</h4>
                                </CardHeader>
                                <CardBody>
                                    <p>
                                        <a
                                            href="#"
                                            className="pe-none"
                                            tabIndex={-1}
                                            aria-disabled="true"
                                        >
                                            This link
                                        </a>{" "}
                                        can not be clicked.
                                    </p>
                                    <p>
                                        <a href="#" className="pe-auto">
                                            This link
                                        </a>{" "}
                                        can be clicked (this is default behavior).
                                    </p>
                                    <p className="pe-none">
                                        <a href="#" tabIndex={-1} aria-disabled="true">
                                            This link
                                        </a>{" "}
                                        can not be clicked because the <code>pointer-events</code>{" "}
                                        property is inherited from its parent. However,{" "}
                                        <a href="#" className="pe-auto">
                                            this link
                                        </a>{" "}
                                        has a <code>pe-auto</code> className and can be clicked.
                                    </p>
                                </CardBody>
                            </Card>

                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Text Alignment</h4>
                                </CardHeader>
                                <CardBody>
                                    <p className="text-start">
                                        Start aligned text on all viewport sizes.
                                    </p>
                                    <p className="text-center">
                                        Center aligned text on all viewport sizes.
                                    </p>
                                    <p className="text-end">
                                        End aligned text on all viewport sizes.
                                    </p>
                                    <p className="text-sm-start">
                                        Start aligned text on viewports sized SM (small) or wider.
                                    </p>
                                    <p className="text-md-start">
                                        Start aligned text on viewports sized MD (medium) or wider.
                                    </p>
                                    <p className="text-lg-start">
                                        Start aligned text on viewports sized LG (large) or wider.
                                    </p>
                                    <p className="text-xl-start mb-0">
                                        Start aligned text on viewports sized XL (extra-large) or
                                        wider.
                                    </p>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    {/* <!-- end row --> */}

                    <Row>
                        <Col xl={3}>
                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Overflow Auto</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-md-flex bg-light">
                                        <div
                                            className="overflow-auto p-3 mb-0 me-md-3 bg-light"
                                            style={{ height: 100 }}
                                        >
                                            This is an example of using <code>.overflow-auto</code> on
                                            an element with set width and height dimensions. By
                                            design, this content will vertically scroll.
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={3}>
                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Overflow Hidden</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-md-flex bg-light">
                                        <div
                                            className="overflow-hidden p-3 mb-0 me-md-3 bg-light"
                                            style={{ maxHeight: 100 }}
                                        >
                                            This is an example of using <code>.overflow-hidden</code>{" "}
                                            on an element with set width and height dimensions. Lorem
                                            ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore et dolore magna
                                            aliqua.
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={3}>
                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Overflow Visible</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-md-flex bg-light">
                                        <div
                                            className="overflow-visible p-3 mb-0 me-md-3 bg-light"
                                            style={{ maxHeight: 100 }}
                                        >
                                            This is an example of using <code>.overflow-visible</code>{" "}
                                            on an element with set width and height dimensions.Lorem
                                            ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore et dolore magna
                                            aliqua.
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={3}>
                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Overflow Scroll</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-md-flex bg-light">
                                        <div
                                            className="overflow-scroll mb-0 p-3 bg-light"
                                            style={{ maxHeight: 100 }}
                                        >
                                            This is an example of using <code>.overflow-scroll</code>{" "}
                                            on an element with set width and height dimensions. Lorem
                                            ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore et dolore magna
                                            aliqua.
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={4}>
                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Arrange Elements</h4>
                                </CardHeader>
                                <CardBody>
                                    <div
                                        className="position-relative p-5 bg-light m-3 border rounded"
                                        style={{ height: 180 }}
                                    >
                                        <div className="position-absolute top-0 start-0 avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-0 end-0 avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-50 start-50 avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute bottom-50 end-50 avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute bottom-0 start-0 avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute bottom-0 end-0 avatar-sm bg-dark rounded"></div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Center Elements</h4>
                                </CardHeader>
                                <CardBody>
                                    <div
                                        className="position-relative m-3 bg-light border rounded"
                                        style={{ height: 180 }}
                                    >
                                        <div className="position-absolute top-0 start-0 translate-middle avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-0 start-50 translate-middle avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-0 start-100 translate-middle avatar-sm bg-dark rounded"></div>

                                        <div className="position-absolute top-50 start-0 translate-middle avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-50 start-50 translate-middle avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-50 start-100 translate-middle avatar-sm bg-dark rounded"></div>

                                        <div className="position-absolute top-100 start-0 translate-middle avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-100 start-50 translate-middle avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-100 start-100 translate-middle avatar-sm bg-dark rounded"></div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Center Elements</h4>
                                </CardHeader>
                                <CardBody>
                                    <div
                                        className="position-relative m-3 bg-light border rounded"
                                        style={{ height: 180 }}
                                    >
                                        <div className="position-absolute top-0 start-0 avatar-sm bg-dark rounded "></div>
                                        <div className="position-absolute top-0 start-50 translate-middle-x avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-0 end-0 avatar-sm bg-dark rounded"></div>

                                        <div className="position-absolute top-50 start-0 translate-middle-y avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-50 start-50 translate-middle avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-50 end-0 translate-middle-y avatar-sm bg-dark rounded"></div>

                                        <div className="position-absolute bottom-0 start-0 avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute bottom-0 start-50 translate-middle-x avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute bottom-0 end-0 avatar-sm bg-dark rounded"></div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={4}>
                            <Card className="card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Shadows</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="shadow-none p-3 mb-3 bg-light rounded">
                                        No shadow
                                    </div>
                                    <div className="shadow-sm p-3 mb-3 bg-light rounded">
                                        Small shadow
                                    </div>
                                    <div className="shadow p-3 mb-3 bg-light rounded">
                                        Regular shadow
                                    </div>
                                    <div className="shadow-lg p-3 mb-0 bg-light rounded">
                                        Larger shadow
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Width</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="w-25 p-3 bg-light">Width 25%</div>
                                    <div className="w-50 p-3 bg-light">Width 50%</div>
                                    <div className="w-75 p-3 bg-light">Width 75%</div>
                                    <div className="w-100 p-3 bg-light">Width 100%</div>
                                    <div className="w-auto p-3 bg-light">Width auto</div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Height</h4>
                                </CardHeader>
                                <CardBody>
                                    <div
                                        className="d-flex gap-1 align-items-start"
                                        style={{ height: 264 }}
                                    >
                                        <div
                                            className="h-25 p-3 bg-light d-inline-block"
                                            style={{ width: 92 }}
                                        >
                                            Height25%
                                        </div>
                                        <div
                                            className="h-50 p-3 bg-light d-inline-block"
                                            style={{ width: 92 }}
                                        >
                                            Height 50%
                                        </div>
                                        <div
                                            className="h-75 p-3 bg-light d-inline-block"
                                            style={{ width: 92 }}
                                        >
                                            Height 75%
                                        </div>
                                        <div
                                            className="h-100 p-3 bg-light d-inline-block"
                                            style={{ width: 92 }}
                                        >
                                            Height 100%
                                        </div>
                                        <div
                                            className="h-auto p-3 bg-light d-inline-block"
                                            style={{ width: 92 }}
                                        >
                                            Height auto
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={6}>
                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Line Height</h4>
                                </CardHeader>
                                <CardBody>
                                    <p className="lh-1">
                                        This is a long paragraph written to show how the line-height
                                        of an element is affected by our utilities.
                                    </p>
                                    <p className="lh-sm">
                                        This is a long paragraph written to show how the line-height
                                        of an element is affected by our utilities.
                                    </p>
                                    <p className="lh-base">
                                        This is a long paragraph written to show how the line-height
                                        of an element is affected by our utilities.
                                    </p>
                                    <p className="lh-lg mb-0">
                                        This is a long paragraph written to show how the line-height
                                        of an element is affected by our utilities.
                                    </p>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={6}>
                            <Card className="card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Display Property</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex gap-1 align-items-start">
                                        <div className="d-inline p-2 bg-primary text-white">
                                            d-inline
                                        </div>
                                        <div className="d-inline p-2 bg-dark text-white">
                                            d-inline
                                        </div>
                                    </div>
                                </CardBody>
                                <CardBody>
                                    <span className="d-block p-2 bg-primary text-white">
                                        d-block
                                    </span>
                                    <span className="d-block p-2 bg-dark text-white">
                                        d-block
                                    </span>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={3}>
                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Text Transform</h4>
                                </CardHeader>
                                <CardBody>
                                    <p className="text-lowercase">Lowercased text.</p>
                                    <p className="text-uppercase">Uppercased text.</p>
                                    <p className="text-capitalize mb-0">CapiTaliZed text.</p>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardHeader className="card-header justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Clearfix</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="bg-info-subtle clearfix">
                                        <button type="button" className="btn btn-primary float-start">
                                            Button float left
                                        </button>
                                        <button type="button" className="btn btn-primary float-end">
                                            {" "}
                                            Button float right
                                        </button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={3}>
                            <Card className="card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Visibility</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="visible">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                                        do eiusmod tempor incididunt ut labore et dolore magna
                                        aliqua.
                                    </div>
                                    <div className="invisible">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                                        do eiusmod tempor incididunt ut labore et dolore magna
                                        aliqua.
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={3}>
                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Vertical Alignment</h4>
                                </CardHeader>
                                <CardBody>
                                    <table style={{ height: 100 }}>
                                        <tbody>
                                            <tr>
                                                <td className="align-baseline">baseline</td>
                                                <td className="align-top">top</td>
                                                <td className="align-middle">middle</td>
                                                <td className="align-bottom">bottom</td>
                                                <td className="align-text-top">text-top</td>
                                                <td className="align-text-bottom">text-bottom</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Z-index</h4>
                                </CardHeader>
                                <CardBody className="card-body z-0">
                                    <div style={{ height: "100px" }} className="z-index">
                                        <div className="z-3 position-absolute box-1 p-4 rounded-3 bg-primary-subtle"></div>
                                        <div className="z-2 position-absolute box-2 p-4 rounded-3 bg-secondary-subtle "></div>
                                        <div className="z-1 position-absolute box-3 p-4 rounded-3 bg-warning-subtle"></div>
                                        <div className="z-0 position-absolute box-4 p-4 rounded-3 bg-danger-subtle"></div>
                                        <div className="z-n1 position-absolute box-5 p-4 rounded-3 bg-info-subtle"></div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={3}>
                            <Card className="card">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Monospace & Reset Color</h4>
                                </CardHeader>
                                <CardBody>
                                    <p className="font-monospace mb-0">This is in monospace</p>
                                </CardBody>
                                <CardBody className="pt-0">
                                    <p className="text-muted mb-0">
                                        Muted text with a{" "}
                                        <a
                                            href="#"
                                            className="text-reset text-decoration-underline"
                                        >
                                            reset link
                                        </a>
                                        .
                                    </p>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                {/* <!-- container-fluid --> */}
            </div>
        </React.Fragment>
    )
}

export default UiUtilities