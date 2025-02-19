import React from 'react'
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import Bloglist Data
import { InstagramPost, UpcomingPost, PopularPost, tagCloud } from "../../common/data/blog"

import image2 from "../../assets/images/small/img-2.jpg"

const blogDetails = () => {

  document.title = "Blog Details | Minia - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Blog" breadcrumbItem="Blog Details" />
                    <Row>
                        <Col lg={8}>
                            <Card>
                                <CardBody>
                                    <div className="">
                                        <div className="text-center mb-3">
                                            <h4>Beautiful Day with Friends</h4>
                                        </div>
                                        <div className="mb-4">
                                            <img src={image2} alt="" className="img-thumbnail mx-auto d-block" />
                                        </div>

                                        <div className="text-center">
                                            <Row>

                                                <Col sm={4}>
                                                    <div>
                                                        <h6 className="mb-2">Categories</h6>
                                                        <p className="text-muted font-size-15">Project</p>
                                                    </div>
                                                </Col>
                                                <Col sm={4}>
                                                    <div className="mt-4 mt-sm-0">
                                                        <h6 className="mb-2">Date</h6>
                                                        <p className="text-muted font-size-15">20 June, 2022</p>
                                                    </div>
                                                </Col>
                                                <Col sm={4}>
                                                    <div className="mt-4 mt-sm-0">
                                                        <p className="text-muted mb-2">Post by</p>
                                                        <h5 className="font-size-15">Gilbert Smith</h5>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <hr />

                                        <div className="mt-4">
                                            <div className="text-muted font-size-14">
                                                <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam enim ad minima veniam quis</p>

                                                <p className="mb-4">Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt</p>

                                                <blockquote className="p-4 border-light border rounded mb-4">
                                                    <div className="d-flex">
                                                        <div className="me-3">
                                                            <i className="bx bxs-quote-alt-left text-dark font-size-24"></i>
                                                        </div>
                                                        <div>
                                                            <p className="mb-0"> At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium deleniti atque corrupti quos dolores et quas molestias excepturi sint quidem rerum facilis est</p>
                                                        </div>
                                                    </div>

                                                </blockquote>

                                                <p>Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit</p>


                                                <div className="mt-4">
                                                    <h5 className="mb-3">Title: </h5>

                                                    <div>
                                                        <Row>
                                                            <Col lg={4} sm={6}>
                                                                <div>
                                                                    <ul className="ps-4">
                                                                        <li className="py-1">Donec sodales sagittis</li>
                                                                        <li className="py-1">Sed consequat leo eget</li>
                                                                        <li className="py-1">Aliquam lorem ante</li>
                                                                    </ul>
                                                                </div>
                                                            </Col>

                                                            <Col lg={4} sm={6}>
                                                                <div>
                                                                    <ul className="ps-4">
                                                                        <li className="py-1">Aenean ligula eget</li>
                                                                        <li className="py-1">Cum sociis natoque</li>
                                                                    </ul>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>

                                            </div>

                                            <hr />

                                            <div className="mt-5">
                                                <h5 className="font-size-15"><i className="bx bx-message-dots text-muted align-middle me-1"></i> Comments :</h5>

                                                <div>
                                                    <div className="d-flex py-3">
                                                        <div className="flex-shrink-0 me-3">
                                                            <div className="avatar-xs">
                                                                <div className="avatar-title rounded-circle bg-light text-primary">
                                                                    <i className="bx bxs-user"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <h5 className="font-size-14 mb-1">Delores Williams <small className="text-muted float-end">1 hr Ago</small></h5>
                                                            <p className="text-muted">If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual</p>
                                                            <div>
                                                                <Link to="" className="text-success"><i className="mdi mdi-reply"></i> Reply</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex py-3 border-top">
                                                        <div className="flex-shrink-0 me-3">
                                                            <div className="avatar-xs">
                                                                <img src={image2} alt="" className="img-fluid d-block rounded-circle" />
                                                            </div>
                                                        </div>

                                                        <div className="flex-grow-1">
                                                            <h5 className="font-size-14 mb-1">Clarence Smith <small className="text-muted float-end">2 hrs Ago</small></h5>
                                                            <p className="text-muted">Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet</p>
                                                            <div>
                                                                <Link to="" className="text-success"><i className="mdi mdi-reply"></i> Reply</Link>
                                                            </div>

                                                            <div className="d-flex pt-3">
                                                                <div className="flex-shrink-0 me-3">
                                                                    <div className="avatar-xs">
                                                                        <div className="avatar-title rounded-circle bg-light text-primary">
                                                                            <i className="bx bxs-user"></i>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex-grow-1">
                                                                    <h5 className="font-size-14 mb-1">Silvia Martinez <small className="text-muted float-end">2 hrs Ago</small></h5>
                                                                    <p className="text-muted">To take a trivial example, which of us ever undertakes laborious physical exercise</p>
                                                                    <div>
                                                                        <Link to="" className="text-success"><i className="mdi mdi-reply"></i> Reply</Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex py-3 border-top">
                                                        <div className="flex-shrink-0 me-3">
                                                            <div className="avatar-xs">
                                                                <div className="avatar-title rounded-circle bg-light text-primary">
                                                                    <i className="bx bxs-user"></i>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex-grow-1">
                                                            <h5 className="font-size-14 mb-1">Keith McCoy <small className="text-muted float-end">12 Aug</small></h5>
                                                            <p className="text-muted">Donec posuere vulputate arcu. phasellus accumsan cursus velit</p>
                                                            <div>
                                                                <Link to="" className="text-success"><i className="mdi mdi-reply"></i> Reply</Link>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            <hr />
                                            <div className="mt-5">
                                                <h5 className="font-size-16 mb-3">Leave a Reply:</h5>

                                                <form>
                                                    <Row>
                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <label htmlFor="commentname-input" className="form-label">Name</label>
                                                                <input type="text" className="form-control" id="commentname-input" placeholder="Enter name" />
                                                            </div>
                                                        </Col>

                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <label htmlFor="commentemail-input" className="form-label">Email</label>
                                                                <input type="email" className="form-control" id="commentemail-input" placeholder="Enter email" />
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    <div className="mb-3">
                                                        <label htmlFor="commentmessage-input" className="form-label">Message</label>
                                                        <textarea className="form-control" id="commentmessage-input" placeholder="Your message..." rows="3"></textarea>
                                                    </div>

                                                    <div className="text-end">
                                                        <button type="submit" className="btn btn-primary w-sm">Submit</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col lg={4}>
                            <Row>
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
                                                <li><Link to="" className="text-dark py-3 d-block border-bottom">Development <span className="badge bg-primary-subtle text-primary rounded-pill float-end ms-1 font-size-12">04</span></Link></li>
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
                                                                        <p className="mb-0 text-truncate">{item.date}<span className="">/ {item.time}</span></p>
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
                                                                    <p className="mb-0 text-truncate">{item.date}</p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    )
                                                }
                                            </div>
                                        </div>

                                        <div className="mt-5">
                                            <h5 className="mb-3">Tag Clouds</h5>
                                            <div className="px-2 d-flex flex-wrap gap-1">
                                                {
                                                    tagCloud.map((item, key) =>
                                                        <Link key={key} to="#" className="font-size-17"><span className="badge badge-soft-primary d-block">{item.desc}</span></Link>
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
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default blogDetails