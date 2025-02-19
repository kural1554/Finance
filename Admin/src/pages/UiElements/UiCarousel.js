import React from "react";
import {
    Row,
    Col,
    Card,
    CardBody,
    Container,
    CardHeader,
} from "reactstrap";

// Carousel
import Slide from "./CarouselTypes/slide";
import Slidewithcontrol from "./CarouselTypes/slidewithcontrol";
import Slidewithindicator from "./CarouselTypes/slidewithindicator";
import Slidewithcaption from "./CarouselTypes/slidewithcaption";
import Slidewithfade from "./CarouselTypes/slidewithfade";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const UiCarousel = () => {
    //meta title
    document.title = "Carousel | Minia - React Admin & Dashboard Template";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Components" breadcrumbItem="Carousel" />

                    <Row>
                        <Col lg={6}>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title"> Slides Only</h4>
                                    <p className="card-title-desc">
                                        Here’s a carousel with slides only. Note the presence of the{" "}
                                        <code>.d-block</code> and <code>.img-fluid</code> on
                                        carousel images to prevent browser default image alignment.
                                    </p>
                                </CardHeader>
                                <CardBody>
                                    <Slide />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={6}>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title">With controls</h4>
                                    <p className="card-title-desc">
                                        Adding in the previous and next controls:
                                    </p>
                                </CardHeader>
                                <CardBody>
                                    <Slidewithcontrol />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6}>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title">With indicators</h4>
                                    <p className="card-title-desc">
                                        You can also add the indicators to the carousel, alongside
                                        the controls, too.
                                    </p>
                                </CardHeader>
                                <CardBody>
                                    <Slidewithindicator />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={6}>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title">With captions</h4>
                                    <p className="card-title-desc">
                                        Add captions to your slides easily with the{" "}
                                        <code>.carousel-caption</code> element within any{" "}
                                        <code>.carousel-item</code>.
                                    </p>
                                </CardHeader>
                                <CardBody>
                                    <Slidewithcaption />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="6">
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title">Crossfade</h4>
                                    <p className="card-title-desc">
                                        Add <code>.carousel-fade</code> to your carousel to animate
                                        slides with a fade transition instead of a slide.
                                    </p>
                                </CardHeader>
                                <CardBody>
                                    <Slidewithfade />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default UiCarousel;
