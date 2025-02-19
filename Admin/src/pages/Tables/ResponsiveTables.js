import React, { useMemo, useState } from "react"

import { Row, Col, Card, CardBody, CardHeader } from "reactstrap"
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { tabledata } from "../../common/data"
import Pagination from "../../components/Common/Pagination"

const ResponsiveTables = () => {
  //meta title
  document.title = "Responsive Table | Minia - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Tables" breadcrumbItem="Responsive Table" />

          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Example</h4>
                  <p className="card-title-desc">This is an experimental awesome solution for responsive tables with complex data.</p>
                </CardHeader>
                <CardBody>
                  <div className="table-rep-plugin">
                    <div
                      className="table-responsive mb-0"
                      data-pattern="priority-columns"
                    >
                      <Table
                        id="tech-companies-1"
                        className="table table-striped table-bordered"
                      >
                        <Thead>
                          <Tr>
                            <Th>Company</Th>
                            <Th data-priority="1">Last Trade</Th>
                            <Th data-priority="3">Trade Time</Th>
                            <Th data-priority="1">Change</Th>
                            <Th data-priority="3">Prev Close</Th>
                            <Th data-priority="3">Open</Th>
                            <Th data-priority="6">Bid</Th>
                            <Th data-priority="6">Ask</Th>
                            <Th data-priority="6">1y Target Est</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {tabledata.map((rowData, index) => (
                            <Tr key={index}>
                              <Th>
                                {rowData.ticker} <span className="co-name">{rowData.companyName}</span>
                              </Th>
                              <Td>{rowData.price}</Td>
                              <Td>{rowData.time}</Td>
                              <Td>{rowData.change}</Td>
                              <Td>{rowData.low}</Td>
                              <Td>{rowData.high}</Td>
                              <Td>{rowData.bidQuantity}</Td>
                              <Td>{rowData.askQuantity}</Td>
                              <Td>{rowData.volume}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                        {/* <Pagination
                          perPageData={perPageData}
                          data={tabledata}
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                          currentData={tabledata}
                          className="d-flex align-items-center justify-content-between text-center text-sm-start mb-3" /> */}
                      </Table>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ResponsiveTables
