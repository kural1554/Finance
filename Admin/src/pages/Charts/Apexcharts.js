import React from "react"

// import apexChart
import LineApexChart from "../AllCharts/apex/chartapex"
import DashedLine from "../AllCharts/apex/dashedLine"
import SplineArea from "../AllCharts/apex/SplineArea"
import Apaexlinecolumn from "../AllCharts/apex/apaexlinecolumn"
import ColumnWithDataLabels from "../AllCharts/apex/ColumnWithDataLabels"
import BarChart from "../AllCharts/apex/barchart"
import LineColumnArea from "../AllCharts/apex/LineColumnArea"
import RadialChart from "../AllCharts/apex/RadialChart"
import PieChart from "../AllCharts/apex/PieChart"
import DonutChart from "../AllCharts/apex/dountchart"

import { Row, Col, Card, CardBody, CardHeader, Container } from "reactstrap"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const Apexchart = () => {
  //meta title
  document.title = "Apex Charts | Minia - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Charts" breadcrumbItem="Apex Charts" />

          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Line with Data Labels</h4>
                </CardHeader>
                <CardBody>
                  <LineApexChart />
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Dashed Line</h4>
                </CardHeader>
                <CardBody>
                  <DashedLine />
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Spline Area </h4>
                </CardHeader>
                <CardBody>
                  <SplineArea />
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Column Chart </h4>
                </CardHeader>
                <CardBody>
                  <Apaexlinecolumn />
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Column with Data Labels </h4>
                </CardHeader>
                <CardBody>
                  <ColumnWithDataLabels />
                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Bar Chart</h4>
                </CardHeader>
                <CardBody>
                  <BarChart />
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Line, Column & Area Chart </h4>
                </CardHeader>
                <CardBody>
                  <LineColumnArea />
                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Radial Chart</h4>
                </CardHeader>
                <CardBody>
                  <RadialChart />
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Pie Chart </h4>
                </CardHeader>
                <CardBody>
                  <PieChart />
                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Donut Chart</h4>
                </CardHeader>
                <CardBody>
                  <DonutChart />
                </CardBody>
              </Card>
            </Col>
          </Row>

        </Container>
      </div>
    </React.Fragment>
  )
}

export default Apexchart