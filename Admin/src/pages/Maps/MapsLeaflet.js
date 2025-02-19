import React from "react"

import { Container, Row, Col, Card, CardBody, CardHeader} from "reactstrap"

//Import maps
import SimpleMap from "./LeafletMap/SimpleMap"
import MapWithPopup from "./LeafletMap/MapWithPopup"
import MapVectorLayers from "./LeafletMap/MapVectorLayers"
import MapMarkerCustomIcons from "./LeafletMap/MapMarkerCustomIcons"
import LayerGroup from "./LeafletMap/LayerGroup"
import MapLayerControl from "./LeafletMap/MapLayerControl"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const MapsLeaflet = () => {
  //meta title
  document.title = "Leaflet | Minia - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Maps" breadcrumbItem="Leaflet" />
          <Row>
            <Col lg="6">
              <Card>
                <CardHeader>
                  <h4 className="card-title">Example1</h4>
                </CardHeader>
                <CardBody>
                  <div id="leaflet-map" className="leaflet-map">
                    <SimpleMap />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6">
              <Card>
                <CardHeader>
                  <h4 className="card-title">
                    Markers, circles and polygons
                  </h4>
                </CardHeader>
                <CardBody>
                  <div id="leaflet-map-marker" className="leaflet-map">
                    <MapVectorLayers />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg="6">
              <Card>
                <CardHeader>
                  <h4 className="card-title">Working with popups</h4>
                </CardHeader>
                <CardBody>
                  <div id="leaflet-map-popup" className="leaflet-map">
                    <MapWithPopup />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6">
              <Card>
                <CardBody>
                  <h4 className="card-title">Markers with Custom Icons</h4>
                  <div id="leaflet-map-custom-icons" className="leaflet-map">
                    <MapMarkerCustomIcons />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg="6">
              <Card>
                <CardHeader>
                  <h4 className="card-title">
                    Layer Group & Feature Group
                  </h4>
                </CardHeader>
                <CardBody>
                  <div id="leaflet-map-interactive-map" className="leaflet-map">
                    <LayerGroup />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6">
              <Card>
                <CardHeader>
                  <h4 className="card-title">
                    Layer Groups and Layers Control
                  </h4>
                </CardHeader>
                <CardBody>
                  <div id="leaflet-map-group-control" className="leaflet-map">
                    <MapLayerControl />
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

export default MapsLeaflet
