import React from "react"

import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  CardHeader
} from "reactstrap"
import Vector from "./Vectormap"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const MapsVector = () => {
  //meta title
  document.title = "Vector | Minia - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Maps" breadcrumbItem="Vector" />

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">World Map</h4>
                  <p className="card-title-desc">
                    Example of vector map.
                  </p>
                </CardHeader>
                <CardBody>
                  <div id="world-map-markers" className="vector-map-height">
                    <Vector
                      value="world_mill"
                      width="500"
                      color="rgb(98, 110, 212)"
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">USA Map</h4>
                  <p className="card-title-desc">
                    Example of vector map.
                  </p>
                </CardHeader>
                <CardBody>
                  <div id="usa" className="vector-map-height">
                    <Vector
                      value="us_aea"
                      width="500"
                      color="rgb(98, 110, 212)"
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Canada Map</h4>
                  <p className="card-title-desc">
                    Example of vector map.
                  </p>
                </CardHeader>
                <CardBody>

                  <div id="uk" className="vector-map-height">
                    <Vector
                      value="ca_lcc"
                      width="500"
                      color="rgb(98, 110, 212)"
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Asia Vector Map</h4>
                  <p className="card-title-desc">
                    Example of vector map.
                  </p>
                </CardHeader>
                <CardBody>

                  <div id="chicago" className="vector-map-height">
                    <Vector
                      value="asia_mill"
                      width="500"
                      color="rgb(98, 110, 212)"
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default MapsVector
