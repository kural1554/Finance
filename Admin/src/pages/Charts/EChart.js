import React from "react";
import { Row, Col, Card, CardBody, Container, CardHeader } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import Line from "../AllCharts/echart/linechart";
import LineBar from "../AllCharts/echart/linebarchart";
import Doughnut from "../AllCharts/echart/doughnutchart";
import Pie from "../AllCharts/echart/piechart";
import Scatter from "../AllCharts/echart/scatterchart";
import Bubble from "../AllCharts/echart/bubblechart";
import Candlestick from "../AllCharts/echart/candlestickchart";
import GaugeChart from "../AllCharts/echart/gaugechart";

const EChart = () => {
   //meta title
   document.title = "E Charts | Minia - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Charts" breadcrumbItem="Echarts" />
          <Row>
            <Col xl="6">
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Line Chart</h4>
                </CardHeader>
                <CardBody>
                  <div id="line-chart" className="e-chart">
                    <Line />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="6">
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Mix Line-Bar</h4>
                </CardHeader>
                <CardBody>
                  <div id="mix-line-bar" className="e-chart">
                    <LineBar />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl="6">
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Doughnut Chart</h4>
                </CardHeader>
                <CardBody>
                  <div id="doughnut-chart" className="e-chart">
                    <Doughnut />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="6">
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Pie Chart</h4>
                </CardHeader>
                <CardBody>
                  <div id="pie-chart" className="e-chart">
                    <Pie />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl="6">
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Scatter Chart</h4>
                </CardHeader>
                <CardBody>
                  <div id="scatter-chart" className="e-chart">
                    <Scatter />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="6">
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Bubble Chart</h4>
                </CardHeader>
                <CardBody>
                  <div id="bubble-chart" className="e-chart">
                    <Bubble />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl="6">
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Candlestick Chart</h4>
                </CardHeader>
                <CardBody>
                  <div id="candlestick-chart" className="e-chart">
                    <Candlestick />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="6">
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Gauge Chart</h4>
                </CardHeader>
                <CardBody>
                  <div id="gauge-chart" className="e-chart">
                    <GaugeChart />
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

export default EChart;
