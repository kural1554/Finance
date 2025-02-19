import React from "react";

import { Row, Col, Card, CardBody, Container, CardHeader } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

// import chartJs
import LineChart from "../AllCharts/chartjs/linechart";
import DountChart from "../AllCharts/chartjs/dountchart";
import PieChart from "../AllCharts/chartjs/piechart";
import BarChart from "../AllCharts/chartjs/barchart";
import RadarChart from "../AllCharts/chartjs/radarchart";
import PolarChart from "../AllCharts/chartjs/polarchart";

const ChartjsChart = () => {
   //meta title
   document.title = "Chartjs | Minia - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Charts" breadcrumbItem="Chartjs Charts" />
          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Line Chart</h4>
                </CardHeader>
                <CardBody>
                  <LineChart />
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
                  <h4 className="card-title mb-0">Pie Chart</h4>
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
                  <DountChart />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Polar Chart</h4>
                </CardHeader>
                <CardBody>
                  <PolarChart />
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Radar Chart</h4>
                </CardHeader>
                <CardBody>
                  <RadarChart />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ChartjsChart;
