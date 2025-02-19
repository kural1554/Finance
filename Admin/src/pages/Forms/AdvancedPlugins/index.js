import React from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import ChoicesInput from './ChoicesInput';
import ColorPickers from "./ColorPicker";
import Switcher from './Switcher';

const AdvancedPlugins = () => {
    //meta title
    document.title = "Advanced Plugins | Minia - React Admin & Dashboard Template";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Forms" breadcrumbItem="Advanced Plugins" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title">Css Switch</h4>
                                    <p className="card-title-desc">Here are a few types of switches. </p>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        {/* import Switcher */}
                                        <Switcher />
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title">Choices</h4>
                                    <p className="card-title-desc">Choices.js is a lightweight, configurable select box/text input plugin.</p>
                                </CardHeader>

                                <CardBody>
                                    <ChoicesInput />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title">React Colorpicker</h4>
                                    <p className="card-title-desc">
                                        Fancy and customizable colorpicker plugin
                                    </p>
                                </CardHeader>

                                <CardBody>
                                    <ColorPickers />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default AdvancedPlugins;