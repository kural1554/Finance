import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledTooltip } from 'reactstrap';

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import BlogList Data
import { blogListData, UpcomingPost, PopularPost, tagCloud, InstagramPost } from "../../common/data/blog"

//Import Icons
import FeatherIcon from "feather-icons-react";

const blogList = () => {

    const [search_Menu, setsearch_Menu] = useState(false);

    //Toggle Chat Box Menus
    const toggleSearch = () => {
        setsearch_Menu(!search_Menu);
    };

    document.title = "Blog List | Minia - React Admin & Dashboard Template";


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Blog" breadcrumbItem="Blog List" />
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
                                            <Link className="nav-link active" id="list" to="/blog-list"><i className="bx bx-list-ul"></i>
                                                <UncontrolledTooltip placement="top" target="list">
                                                    List
                                                </UncontrolledTooltip>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" id="grid" to="/blog-grid"><i className="bx bx-grid-alt"></i>
                                                <UncontrolledTooltip placement="top" target="grid">
                                                    Grid
                                                </UncontrolledTooltip>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <Link to="#" className="btn btn-light me-0"><i className="bx bx-plus me-1"></i> Add New</Link>
                                </div>

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
                        </Col>
                    </Row>
                    {/* <!-- end row --> */}
                    <Row>
                        <Col xl={8}>
                            {
                                blogListData.map((item, key) =>
                                    <Card key={key}>
                                        <img src={item.img} alt="" className="img-fluid" />
                                        <CardBody>
                                            <p className="text-muted mb-2">{item.date}</p>
                                            <h5 className=""><a href="#" className="text-dark">{item.title}</a></h5>
                                            <p className="mb-0 font-size-15">{item.desc}</p>
                                            <div className="mt-3">
                                                <Link to="#" className="align-middle font-size-15">Read more <i className="mdi mdi-chevron-right"></i></Link>
                                            </div>
                                        </CardBody>
                                    </Card>
                                )
                            }
                        </Col>

                        <Col xl={4}>
                            <Card>
                                <CardBody>
                                    <div className="search-box">
                                        <h5 className="mb-3">Search</h5>
                                        <div className="position-relative px-2">
                                            <input type="text" className="form-control rounded bg-light border-light" placeholder="Search..." />
                                            <i className="mdi mdi-magnify search-icon"></i>
                                        </div>
                                    </div>
                                    <div className="mt-5">
                                        <h5 className="mb-3">Categories</h5>
                                        <ul className="list-unstyled fw-medium px-2">
                                            <li><Link to="" className="text-dark pb-3 d-block border-bottom">Design<span className="badge bg-primary-subtle text-primary rounded-pill ms-1 float-end font-size-12">02</span></Link></li>
                                            <li><Link to="" className="text-dark py-3 d-block border-bottom">Development <span className="badge bg-primary-subtle text-primary rounded-pill ms-1 float-end font-size-12">04</span></Link></li>
                                            <li><Link to="" className="text-dark py-3 d-block border-bottom">Business<span className="badge bg-primary-subtle text-primary rounded-pill ms-1 float-end font-size-12">12</span></Link></li>
                                            <li><Link to="" className="text-dark py-3 d-block border-bottom">Project<span className="badge bg-primary-subtle text-primary rounded-pill ms-1 float-end font-size-12">08</span></Link></li>
                                            <li><Link to="" className="text-dark pt-3 pb-0 d-block">Travel<span className="badge bg-primary-subtle text-primary rounded-pill ms-1 float-end font-size-12">10</span></Link></li>
                                        </ul>
                                    </div>
                                    <div className="mt-5">
                                        <h5 className="mb-3">Upcoming Post</h5>
                                        <div className="list-group list-group-flush">
                                            {
                                                UpcomingPost.map((item, key) =>
                                                    <Link key={key} to="" className={item.class}>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0 me-3">
                                                                <img src={item.img} alt="" className="avatar-lg h-auto d-block rounded" />
                                                            </div>
                                                            <div className="flex-grow-1 overflow-hidden">
                                                                <h5 className="font-size-13 text-truncate">{item.title}</h5>
                                                                <p className="mb-0 text-truncate">{item.date} <span className="">/ {item.time}</span></p>
                                                            </div>
                                                            <div className="fs-1">
                                                                <i className="mdi mdi-calendar"></i>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                )
                                            }
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <h5 className="mb-3">Popular Post</h5>
                                        <div className="list-group list-group-flush">

                                            {
                                                PopularPost.map((item, key) =>
                                                    <Link key={key} to="" className={item.class}>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0 me-3">
                                                                <img src={item.img} alt="" className="avatar-xl h-auto d-block rounded" />
                                                            </div>
                                                            <div className="flex-grow-1 overflow-hidden">
                                                                <h5 className="font-size-13 text-truncate">{item.title}</h5>
                                                                <p className="mb-0 text-truncate">{item.time}</p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                )
                                            }
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <h5 className="mb-3">Tag Clouds</h5>
                                        <div className="px-2 gap-1">
                                            {
                                                tagCloud.map((item, key) =>
                                                    <Link key={key} to="#" className="font-size-17 me-1">
                                                        <span className="badge bg-primary-subtle text-primary">{item.desc}</span>
                                                    </Link>
                                                )
                                            }
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <h5 className="mb-3">Instagram Post</h5>
                                        <div className="gap-2 hstack flex-wrap px-2">
                                            {
                                                InstagramPost.map((item, key) =>
                                                    <img key={key} src={item.img} alt="" className="avatar-xl rounded" />
                                                )
                                            }
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <h5 className="mb-3">Email Newsletter</h5>
                                        <div className="">
                                            <div className="input-group mb-0 px-2">
                                                <input type="text" className="form-control" placeholder="Enter Email" />
                                                <div className="input-group-append">
                                                    <span className="input-group-text"><i className="mdi mdi-send-outline"></i></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <div className="row justify-content-center mb-4">
                            <div className="col-md-3">
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
                            </div>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default blogList