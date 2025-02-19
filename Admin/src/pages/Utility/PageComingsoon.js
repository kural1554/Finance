import React, { useState } from "react";

//Import Countdown
import Countdown from "react-countdown";

//import images
import bg1 from "../../assets/images/bg-1.jpg";
import bg2 from "../../assets/images/bg-2.jpg";
import bg3 from "../../assets/images/bg-3.jpg";
// import images
import logo from "../../assets/images/logo-sm.svg";
import { Carousel, CarouselItem } from "reactstrap";

const PagesComingsoon = () => {

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <span>You are good to go!</span>;
    } else {
      return (
        <React.Fragment>
          <div className="counter-number mt-5">
            <div className="coming-box">
              <div className="count-title">Days</div>
              <div className="count-num">{days}</div>
            </div>{" "}
            <div className="coming-box">
              <div className="count-title">Hours</div>
              <div className="count-num">{hours}</div>
            </div>{" "}
            <div className="coming-box">
              <div className="count-title">Minutes</div>
              <div className="count-num">{minutes}</div>
            </div>{" "}
            <div className="coming-box">
              <div className="count-title">Seconds</div>
              <div className="count-num">{seconds}</div>
            </div>
          </div>
        </React.Fragment>
      );
    }
  };

  const items = [
    {
      id: 1,
      img: bg1,
      name: "Margaret Lampley1",
    },
    {
      id: 2,
      img: bg2,
      name: "Margaret Lampley2",
    },
    {
      id: 3,
      img: bg3,
      name: "Margaret Lampley3",
    },
  ];

  const indicatorsData = [
    {
      id: 1,
      img: bg1,
    },
    {
      id: 2,
      img: bg2,
    },
    {
      id: 3,
      img: bg3,
    },
  ]

  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.name}
      >
        <div style={{ backgroundImage: `url(${item.img})` }} className="slide-bg" />
      </CarouselItem>
    );
  });

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  const renderIndicators = () => {
    return indicatorsData.map((item, index) => (
      <div type="button" className={index === activeIndex ? 'swiper-slide-active swiper-slide-thumb-active ' : ''}
        onClick={() => handleSelect(index)} key={index}>
        <img
          src={item.img}
          alt=""
          className="avatar-sm nav-img rounded-circle me-2"
        />
      </div>
    ))
  };


  //meta title
  document.title = "Coming Soon | Minia - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="preview-img">
        <div className="swiper-container preview-thumbsnav">
          {renderIndicators()}
        </div>
        <Carousel activeIndex={activeIndex} next={next} previous={previous} onSelect={handleSelect}>
          {slides}
        </Carousel>
      </div>
      <div className="coming-content min-vh-100 py-4 px-3 py-sm-5">
        <div className="bg-overlay bg-primary"></div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center py-4 py-sm-5">
                <div className="mb-5">
                  <a href="index.html">
                    <img src={logo} alt="logo" height="30" className="me-1" />
                    <span className="logo-txt text-white font-size-22">
                      Minia
                    </span>
                  </a>
                </div>
                <h3 className="text-white mt-5">
                  Let&apos;s get started with Minia
                </h3>
                <p className="text-white-50 font-size-16">
                  Donec pede justo fringilla vel aliquet nec vulputate eget
                  arcu. In enim justo, rhoncus ut imperdiet a venenatis vitae,
                  justo felis
                </p>

                <Countdown date="2024/12/31" renderer={renderer} />

                <form className="app-search mt-5 mx-auto">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your email address"
                    />
                    <button className="btn btn-primary" type="button">
                      <i className="bx bx-paper-plane align-middle"></i>
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PagesComingsoon;
