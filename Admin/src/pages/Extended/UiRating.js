import React, { useState } from "react";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Row, Col, Card, CardBody, Container, CardHeader } from "reactstrap";

import { Rating } from "react-simple-star-rating";


const UiRating = () => {
    //meta title
    document.title = "Rating | Minia - React Admin & Dashboard Template";

    const [customize, setcustomize] = useState(0)
    const [rating, setRating] = useState(0)
  
    const handleRating = (rate) => {
        setRating(rate)
    }
  
    const handleReset = () => {
        setRating(0)
    }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Extended" breadcrumbItem="Rating" />

          <Card>
            <CardHeader>
              <h4 className="card-title">Rater Js</h4>
              <p className="card-title-desc">Rater Js Different Example For Rating</p>
            </CardHeader>
            <CardBody>
              <Row>
                <Col sm={6}>
                  <div className="p-lg-5 p-4 text-center" dir="ltr">
                    <h5 className="font-size-15 mb-4">Basic Rater</h5>
                    <div id="basic-rater">
                      <Rating
                        initialValue={3}
                        size={25}
                      // allowFraction
                      />
                    </div>
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="p-lg-5 p-4 text-center" dir="ltr">
                    <h5 className="font-size-15 mb-4">Rater with Step</h5>
                    <div id="rater-step">
                      <Rating
                        initialValue={1.5}
                        size={25}
                        allowFraction
                      />
                    </div>
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="p-lg-5 p-4 text-center" dir="ltr">
                    <h5 className="font-size-15 mb-4">Custom Messages</h5>
                    <div id="rater-message">
                      <Rating
                        size={25}
                      />
                    </div>
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="p-lg-5 p-4 text-center" dir="ltr">
                    <h5 className="font-size-15 mb-4">Example with unlimited number of stars. readOnly option is set to true.</h5>
                    <div id="rater-unlimitedstar">
                      <Rating
                        size={20}
                        initialValue={4.5}
                        readonly
                        iconsCount={16}
                      />
                    </div>
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="p-lg-5 p-4 text-center" dir="ltr">
                    <h5 className="font-size-15 mb-4">On Hover event</h5>
                    <div id="rater-onhover" className="align-middle">
                      <Rating
                        size={25}
                        initialValue={1}
                        onPointerEnter={() => setcustomize(customize)}
                      />
                    </div>
                    <span className="ratingnum badge bg-info align-middle ms-2"></span>
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="p-lg-5 p-4 text-center" dir="ltr">
                    <h5 className="font-size-15 mb-4">Clear/Reset rater</h5>
                    <div id="raterreset" className="align-middle">
                    <Rating onClick={handleRating} initialValue={rating} size={25} />
                    <button id="raterreset-button" className="btn btn-outline-primary btn-sm ms-2" onClick={handleReset}>Reset</button>
                    </div>
                  </div>
                </Col>

              </Row>

            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default UiRating;
