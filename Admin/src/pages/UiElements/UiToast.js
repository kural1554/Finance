import React, { useEffect, useState } from 'react';

import {
    Row,
    Col,
    Card,
    CardBody,
    Container,
    Button,
    Toast,
    ToastHeader,
    ToastBody,
    Spinner,
    CardHeader,
    Form
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//import images
import logo from "../../assets/images/logo.svg";

const UiToast = () => {

    //meta title
    document.title = "Toast | Minia - React Admin & Dashboard Template";

    const [toast, setToast] = useState(false);
    const [toast1, setToast1] = useState(true);
    const [toast2, setToast2] = useState(true);
    const [toast3, setToast3] = useState(true);
    const [toast4, setToast4] = useState(true);
    const [toast5, setToast5] = useState(false);
    const [toast6, setToast6] = useState(false);
    const [toast7, setToast7] = useState(false);
    const [toast8, setToast8] = useState(false);
    const [position, setPosition] = useState();
    const [toast9, setToast9] = useState(true);
    const [toast10, setToast10] = useState(true);
    const [toast11, setToast11] = useState(true);
    const [toast12, setToast12] = useState(true);

    const toggleToast = () => {
        setToast(!toast);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Components" breadcrumbItem="Toasts" />

                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    <h5 className="card-title">Live Example</h5>
                                    <p className="card-title-desc">Click the button below to show a toast (positioned with our
                                        utilities in the
                                        lower right corner) that has been hidden by default.</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-wrap gap-2">
                                        <div>
                                            <Button
                                                type="button"
                                                color="primary"
                                                id="liveToastBtn"
                                                onClick={toggleToast}
                                            >Show live toast</Button>

                                            <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1051 }}>
                                                <Toast isOpen={toast}>
                                                    <ToastHeader toggle={toggleToast}>
                                                        <img src={logo} className="me-2" height="18" alt="logo" />
                                                        Reactstrap
                                                    </ToastHeader>
                                                    <ToastBody>
                                                        Hello, world! This is a toast message.
                                                    </ToastBody>
                                                </Toast>
                                            </div>
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
                                    <h5 className="card-title">Basic Toast</h5>
                                    <p className="card-title-desc">Toasts are as flexible as you need and have very little
                                        required markup.
                                        At a minimum, we require a single element to contain your
                                        “toasted” content and strongly encourage a dismiss button.
                                    </p>
                                </CardHeader>
                                <CardBody>
                                    <Toast isOpen={toast1}>
                                        <ToastHeader toggle={() => setToast1(!toast1)}>
                                            <img src={logo} className="me-2"
                                                alt="..." height="20" />
                                            <span className="fw-semibold me-auto">Minia</span>
                                            <small className='text-muted' style={{ marginLeft: "165px" }}>06 mins ago</small>
                                        </ToastHeader>
                                        <ToastBody>
                                            Hello, world! This is a toast message.
                                        </ToastBody>
                                    </Toast>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={6}>
                            <Card>
                                <CardHeader>
                                    <h5 className="card-title">Translucent</h5>
                                    <p className="card-title-desc">Toasts are slightly translucent, too, so they blend over
                                        whatever they might appear over. For browsers that
                                        support the <code>backdrop-filter</code> CSS property,
                                        we’ll also attempt to blur the elements under a toast.
                                    </p>
                                </CardHeader>
                                <CardBody>
                                    <Toast isOpen={toast2}>
                                        <ToastHeader toggle={() => setToast2(!toast2)}>
                                            <img src={logo} className="rounded me-2"
                                                alt="..." height="20" />
                                            <span className="fw-semibold me-auto">Minia</span>
                                            <small className='text-muted' style={{ marginLeft: "165px" }}>06 mins ago</small>
                                        </ToastHeader>
                                        <ToastBody>
                                            Hello, world! This is a toast message.
                                        </ToastBody>
                                    </Toast>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={6}>
                            <Card>
                                <CardHeader>
                                    <h5 className="card-title">Stacking</h5>
                                    <p className="card-title-desc">For systems that generate more notifications, consider using
                                        a wrapping element
                                        so they can easily stack.
                                    </p>
                                </CardHeader>
                                <CardBody>
                                    <div style={{ minHeight: "230px" }}>
                                        <div aria-live="polite" aria-atomic="true" className="position-relative">
                                            <div className="toast-container position-absolute top-0 end-0 p-2 p-lg-3">
                                                <Toast isOpen={toast3}>
                                                    <ToastHeader toggle={() => setToast3(!toast3)}>
                                                        <img src={logo} className="rounded me-2"
                                                            alt="..." height="20" />
                                                        <span className="fw-semibold me-auto">Minia</span>
                                                        <small className='text-muted'  style={{ marginLeft: "175px" }}>Just now</small>
                                                    </ToastHeader>
                                                    <ToastBody>
                                                        See? Just like this.
                                                    </ToastBody>
                                                </Toast>

                                                <Toast isOpen={toast4}>
                                                    <ToastHeader toggle={() => setToast4(!toast4)}>
                                                        <img src={logo} className="rounded me-2"
                                                            alt="..." height="20" />
                                                        <span className="fw-semibold me-auto">Minia</span>
                                                        <small className='text-muted' style={{ marginLeft: "150px" }}>2 seconds ago</small>
                                                    </ToastHeader>
                                                    <ToastBody>
                                                        Heads up, toasts will stack automatically
                                                    </ToastBody>
                                                </Toast>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={6}>
                            <Card>
                                <CardHeader>
                                    <h5 className="card-title">Custom content</h5>
                                    <p className="card-title-desc">Customize your toasts by removing sub-components, tweaking them with utilities, or by adding your own markup.</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-column gap-3">
                                        <div aria-live="polite" aria-atomic="true" className="position-relative">
                                            <Toast isOpen={toast10}>
                                                {/* <ToastHeader toggle={() => setToast4(!toast4)}>
                                                    Hello, world! This is a toast message.
                                                </ToastHeader> */}
                                                <ToastBody>
                                                    Hello, world! This is a toast message.
                                                    <div className="mt-2 pt-2 border-top">
                                                        <button type="button" className="btn btn-primary btn-sm">Take
                                                            action</button>
                                                        <button type="button" className="btn btn-secondary btn-sm"
                                                            data-bs-dismiss="toast" onClick={() => setToast10(false)}>Close</button>
                                                    </div>
                                                </ToastBody>
                                            </Toast>
                                        </div>

                                        <div className="d-flex">
                                            <Toast isOpen={toast11}>
                                                <ToastBody>
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-shrink-0 me-2">
                                                            <i className="ri-user-smile-line align-middle"></i>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <h6 className="mb-0">Hello, world! This is a toast message.</h6>
                                                        </div>
                                                        <button type="button" className="btn-close btn-close me-2 m-auto" data-bs-dismiss="toast"
                                                            aria-label="Close" onClick={() => setToast11(false)}></button>
                                                    </div>
                                                </ToastBody>
                                            </Toast>
                                        </div>
                                
                                        <div className="d-flex">
                                            <Toast isOpen={toast12}>
                                                <ToastBody className='bg-primary text-white'>
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-shrink-0 me-2">
                                                            <i className="ri-user-smile-line align-middle"></i>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <h6 className="mb-0 text-white">Hello, world! This is a toast message.</h6>
                                                        </div>
                                                        <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
                                                            aria-label="Close" onClick={() => setToast12(false)}></button>
                                                    </div>
                                                </ToastBody>
                                            </Toast>
                                        </div>
                                    </div>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    <h5 className="card-title">Toasts Example</h5>
                                    <p className="card-title-desc">Click the button below to show a toast</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-wrap gap-2">
                                        <div className="position-relative">
                                            <div className="hstack flex-wrap gap-2">
                                                <Button type="button" className="btn btn-primary" id="borderedToast1Btn" onClick={() => setToast5(!toast5)}>Primary toast</Button>
                                                <Button type="button" className="btn btn-success" id="borderedToast2Btn" onClick={() => setToast6(!toast6)}>Success toast</Button>
                                                <Button type="button" className="btn btn-warning" id="borderedTost3Btn" onClick={() => setToast7(!toast7)}>Warning toast</Button>
                                                <Button type="button" className="btn btn-danger" id="borderedToast4Btn" onClick={() => setToast8(!toast8)}>danger toast</Button>
                                            </div>


                                            <div style={{ zIndex: "11" }}>
                                                <Toast isOpen={toast5} id="borderedToast1" className="toast-border-primary overflow-hidden mt-3">
                                                    {/* <ToastHeader toggle={() => setToast5(!toast5)}>
                                                </ToastHeader> */}
                                                    <ToastBody className='bg-primary text-white'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0 me-2">
                                                                <i className="ri-user-smile-line align-middle"></i>
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <h6 className="mb-0 text-white">Hello, world! This is a toast message.</h6>
                                                            </div>
                                                            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
                                                                aria-label="Close" onClick={() => setToast5(false)}></button>
                                                        </div>
                                                    </ToastBody>
                                                </Toast>
                                            </div>

                                            <div style={{ zIndex: "11" }}>
                                                <Toast isOpen={toast6} id="borderedToast1" className="toast-border-primary overflow-hidden mt-3">
                                                    <ToastBody className='bg-success text-white'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0 me-2">
                                                                <i className="ri-user-smile-line align-middle"></i>
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <h6 className="mb-0 text-white">Hello, world! This is a toast message.</h6>
                                                            </div>
                                                            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
                                                                aria-label="Close" onClick={() => setToast6(false)}></button>
                                                        </div>
                                                    </ToastBody>
                                                </Toast>
                                            </div>

                                            <div style={{ zIndex: "11" }}>
                                                <Toast isOpen={toast7} id="borderedToast1" className="toast-border-primary overflow-hidden mt-3">
                                                    <ToastBody className='bg-warning text-white'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0 me-2">
                                                                <i className="ri-user-smile-line align-middle"></i>
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <h6 className="mb-0 text-white">Hello, world! This is a toast message.</h6>
                                                            </div>
                                                            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
                                                                aria-label="Close" onClick={() => setToast7(false)}></button>
                                                        </div>
                                                    </ToastBody>
                                                </Toast>
                                            </div>

                                            <div style={{ zIndex: "11" }}>
                                                <Toast isOpen={toast8} id="borderedToast1" className="toast-border-primary overflow-hidden mt-3">
                                                    <ToastBody className='bg-danger text-white'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0 me-2">
                                                                <i className="ri-user-smile-line align-middle"></i>
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <h6 className="mb-0 text-white">Hello, world! This is a toast message.</h6>
                                                            </div>
                                                            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
                                                                aria-label="Close" onClick={() => setToast8(false)}></button>
                                                        </div>
                                                    </ToastBody>
                                                </Toast>
                                            </div>

                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    <h5 className="card-title">Live Example</h5>
                                    <p className="card-title-desc">Click the button below to show a toast (positioned with our
                                        utilities in the
                                        lower right corner) that has been hidden by default.
                                    </p>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <div className="mb-3">
                                            <select className="form-select mt-2" id="selectToastPlacement" onChange={(e) => setPosition(e.currentTarget.value)}>
                                                <option value="" defaultValue>Select a position...</option>
                                                <option value="top-0 start-0">Top left ( top-0 start-0 )</option>
                                                <option value="top-0 start-50 translate-middle-x">Top center ( top-0 start-50 translate-middle-x )</option>
                                                <option value="top-0 end-0">Top right( top-0 end-0 ) </option>
                                                <option value="top-50 start-0 translate-middle-y">Middle left ( top-50 start-0 translate-middle-y )</option>
                                                <option value="top-50 start-50 translate-middle">Middle center ( top-50 start-50 translate-middle )</option>
                                                <option value="top-50 end-0 translate-middle-y">Middle right ( top-50 end-0 translate-middle-y )</option>
                                                <option value="bottom-0 start-0">Bottom left ( bottom-0 start-0 )</option>
                                                <option value="bottom-0 start-50 translate-middle-x">Bottom center ( bottom-0 start-50 translate-middle-x )</option>
                                                <option value="bottom-0 end-0">Bottom right ( bottom-0 end-0 )</option>
                                            </select>
                                        </div>
                                    </Form>
                                    <div aria-live="polite" aria-atomic="true" className="bd-example bg-light position-relative" style={{ minHeight: "300px" }}>
                                        <div className={"toast-container position-absolute p-3 " + position} id="toastPlacement">
                                            <Toast isOpen={toast9}>
                                                <ToastHeader toggle={() => setToast9(!toast9)}>
                                                    <img src={logo} className="rounded me-2"
                                                        alt="..." height="20" />
                                                    <strong className="me-auto">Minia</strong>
                                                    <small className='text-muted' style={{ marginLeft: "165px" }}>11 mins ago</small>
                                                </ToastHeader>
                                                <ToastBody>
                                                    Hello, world! This is a toast message.
                                                </ToastBody>
                                            </Toast>
                                        </div>
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

export default UiToast;