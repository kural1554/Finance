import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledTooltip } from 'reactstrap'

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import blog grid data
import {blogGridData} from "../../common/data/blog"

//Import Icons
import FeatherIcon from "feather-icons-react";


const blogGrid = () => {

  document.title = "Blog Grid | Minia - React Admin & Dashboard Template";

  const [search_Menu, setsearch_Menu] = useState(false);

  //Toggle Chat Box Menus
  const toggleSearch = () => {
    setsearch_Menu(!search_Menu);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Blog" breadcrumbItem="Blog Grid" />
          <Row className="align-items-center">
            <Col md={6}>
              <div className="mb-3">
                <h5 className="card-title">Blog List <span className="text-muted fw-normal ms-2">(535)</span></h5>
              </div>
            </Col>

            <Col md={6}>
              <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                <div>
                  <ul className="nav nav-pills">
                    <li className="nav-item">
                      <Link className="nav-link" to="/blog-list" id="list"><i className="bx bx-list-ul"></i>
                        <UncontrolledTooltip placement="top" target="list">
                          List
                        </UncontrolledTooltip>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link active" to="/blog-grid" id="grid"><i className="bx bx-grid-alt"></i>
                        <UncontrolledTooltip placement="top" target="grid">
                          Grid
                        </UncontrolledTooltip>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <Link to="#" className="btn btn-light"><i className="bx bx-plus me-1"></i> Add New</Link>
                </div>

                <div className="dropdown">
                  {/* <Link className="btn btn-link text-muted py-1 font-size-16 shadow-none dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> */}
                    {/* <i className="bx bx-dots-horizontal-rounded"></i> */}
                    <Dropdown
                      isOpen={search_Menu}
                      toggle={toggleSearch}
                    >
                      <DropdownToggle
                        className="btn btn-link text-muted py-1 font-size-16 shadow-none dropdown-toggle"
                        tag="button"
                      >
                        <FeatherIcon
                          icon="more-horizontal"
                          className="icon-sm"
                        />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          href="#"
                          className="dropdown-item"
                        >
                          Action
                        </DropdownItem>
                        <DropdownItem
                          href="#"
                          className="dropdown-item"
                        >
                          Another action
                        </DropdownItem>
                        <DropdownItem
                          href="#"
                          className="dropdown-item"
                        >
                          Something else here
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  {/* </Link> */}
                </div>
              </div>
            </Col>
          </Row>
          {/* <!-- end row --> */}

          <Row>
            {
              blogGridData.map((item, key) =>
                <Col xl={4} sm={6} key={key}>
                  <Card>
                    <div className="">
                      <img src={item.img} alt="" className="img-fluid" />
                    </div>
                    <CardBody>
                      <p className="text-muted mb-2">{item.date}</p>
                      <h5 className=""><a href="#" className="text-dark">{item.title}</a></h5>
                      <p className="mb-0 font-size-15">{item.desc}</p>
                      <div className="mt-3">
                        <a href="#" className="align-middle font-size-15">Read more <i className="mdi mdi-chevron-right"></i></a>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              )
            }
          </Row>

          <Row className='justify-content-center mb-4'>
            <Col md={3}>
              <div className="">
                <ul className="pagination mb-sm-0">
                  <li className="page-item disabled">
                    <Link to="#" className="page-link"><i className="mdi mdi-chevron-left"></i></Link>
                  </li>
                  <li className="page-item">
                    <Link to="#" className="page-link">1</Link>
                  </li>
                  <li className="page-item active">
                    <Link to="#" className="page-link">2</Link>
                  </li>
                  <li className="page-item">
                    <Link to="#" className="page-link">3</Link>
                  </li>
                  <li className="page-item">
                    <Link to="#" className="page-link">4</Link>
                  </li>
                  <li className="page-item">
                    <Link to="#" className="page-link">5</Link>
                  </li>
                  <li className="page-item">
                    <Link to="#" className="page-link"><i className="mdi mdi-chevron-right"></i></Link>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default blogGrid