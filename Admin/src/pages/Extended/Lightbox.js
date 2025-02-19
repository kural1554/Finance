import React, { useState } from "react";

import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Container,
  CardHeader,
} from "reactstrap";

//Lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import ModalVideo from "react-modal-video";
import "react-modal-video/scss/modal-video.scss";

// import image
import img1 from "../../assets/images/small/img-1.jpg";
import img2 from "../../assets/images/small/img-2.jpg";
import img3 from "../../assets/images/small/img-3.jpg";
import img4 from "../../assets/images/small/img-4.jpg";
import img5 from "../../assets/images/small/img-5.jpg";
import img6 from "../../assets/images/small/img-6.jpg";
import img7 from "../../assets/images/small/img-7.jpg";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const images = [img1, img2, img3, img4, img5, img6];
// const imageZoom = [img3, img7];

const UiLightbox = () => {

  //meta title
  document.title = "Lightbox | Minia - React Admin & Dashboard Template";
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEffects, setisEffects] = useState(false);

  const [photoIndex, setphotoIndex] = useState(0);
  const [isGallery, setisGallery] = useState(false);
  const [isFits, setisFits] = useState(0);
  const [isOpen, setisOpen] = useState(false);
  const [isOpen1, setisOpen1] = useState(false);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Extended" breadcrumbItem="Lightbox" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h5 className="card-title">Single Image Lightbox</h5>
                  <p className="card-title-desc">
                    Glightbox Single Image Lightbox Example
                  </p>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={3} sm={6}>
                      <div className="mt-4">
                        <img
                          onClick={() => {
                            setOpen(true)
                            setisFits(0);
                          }}
                          className="img-fluid"
                          alt="Minia"
                          src={img1}
                        />
                        {open && (
                          <Lightbox
                            open={open}
                            close={() => setOpen(false)}
                            index={isFits}
                            slides={images.map((image) => ({ src: image }))}
                          />
                        )}
                      </div>
                    </Col>
                    <Col lg={3} sm={6}>
                      <div className="mt-4">
                        <img
                          onClick={() => {
                            setisEffects(true);
                          }}
                          className="img-fluid"
                          alt=""
                          src={img2}
                        />
                        {isEffects && (
                          <Lightbox
                            open={isEffects}
                            close={() => setisEffects(false)}
                            index={currentIndex}
                            slides={images.map((image) => ({ src: image }))}
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h5 className="card-title">Images with Description</h5>
                  <p className="card-title-desc">
                    Glightbox Images with Description Example{" "}
                  </p>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={3} sm={6}>
                      <div className="mt-4">
                        <img
                          src={img4}
                          onClick={() => {
                            setisGallery(true);
                            setphotoIndex(3);
                          }}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    </Col>
                    <Col lg={3} sm={6}>
                      <div className="mt-4">
                        <img
                          src={img5}
                          onClick={() => {
                            setisGallery(true);
                            setphotoIndex(4);
                          }}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    </Col>
                    <Col lg={3} sm={6}>
                      <div className="mt-4">
                        <img
                          src={img1}
                          onClick={() => {
                            setisGallery(true);
                            setphotoIndex(0);
                          }}
                          className="img-fluid"
                          alt=""
                        />
                        {isGallery && (
                        <Lightbox
                          open={isGallery}
                          close={() => setisGallery(false)}
                          index={photoIndex}
                          slides={images.map((image) => ({ src: image }))}
                        />
                      )}
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h5 className="card-title">Popup with Video or Map</h5>
                  <p className="card-title-desc">
                    Glightbox Popup with Video or Map Example{" "}
                  </p>
                </CardHeader>
                <CardBody>
                  <Row>
                    <div className="d-flex align-items-start gap-3 flex">
                      <Button
                        className="btn btn-light image-popup-video-map"
                        onClick={() => {
                          setisOpen(!isOpen);
                        }}
                      >
                        Open YouTube Video
                      </Button>{" "}
                      <Button
                        className="btn btn-light image-popup-video-map"
                        onClick={() => {
                          setisOpen1(!isOpen1);
                        }}
                      >
                        Open Vimeo Video
                      </Button>{" "}
                      <ModalVideo
                        videoId="L61p2uyiMSo"
                        channel="youtube"
                        isOpen={isOpen}
                        onClose={() => {
                          setisOpen(!isOpen);
                        }}
                      />
                      <ModalVideo
                        videoId="L61p2uyiMSo"
                        channel="youtube"
                        isOpen={isOpen1}
                        onClose={() => {
                          setisOpen1(false);
                        }}
                      />
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UiLightbox;