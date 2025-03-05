import React, { useState } from 'react';
import {
    Carousel,
    CarouselItem,
    CarouselIndicators,
} from 'reactstrap';

import img1 from "../../assets/images/users/avatar-1.jpg";
import img2 from "../../assets/images/users/avatar-2.jpg";
import img3 from "../../assets/images/users/avatar-3.jpg";

const items = [
    {
        id: 1,
        img: img1,
        name: "Anbu",
        designation: "FOUNDER",
        description: "Financial stability is the foundation of a secure future, requiring careful planning, smart investments, and disciplined spending. By understanding the principles of budgeting, saving, and investing, individuals can maximize their wealth and achieve financial freedom. In today’s dynamic economic landscape, leveraging opportunities in stocks, real estate, and digital assets can lead to long-term growth. However, financial literacy is key to making informed decisions and mitigating risks. With strategic planning and prudent financial management, anyone can build a solid financial future and embrace economic security with confidence."
    },
    {
        id: 2,
        img: img2,
        name: "Vijayalakshmi",
        designation: "CEO",
        description: "Managing personal finances effectively requires a balance between income, expenses, savings, and investments. Setting clear financial goals, such as buying a home, funding education, or planning for retirement, helps individuals make informed decisions. Responsible credit usage, timely debt repayments, and maintaining an emergency fund are essential for financial security. Additionally, exploring diverse investment options—such as stocks, mutual funds, and fixed deposits—can enhance long-term financial growth. By staying informed about market trends and adopting smart money habits, individuals can achieve financial independence and build a stable future."
    },
    {
        id: 3,
        img: img3,
        name: "Muthukumar",
        designation: "Collection manager",
        description: "A Collection Manager plays a crucial role in maintaining a company's financial stability by overseeing debt recovery and ensuring timely payments from clients. They develop and implement effective collection strategies, negotiate repayment plans, and coordinate with customers to resolve outstanding balances. By analyzing credit risks and monitoring delinquent accounts, they help minimize financial losses and improve cash flow. Strong communication, negotiation skills, and knowledge of regulatory compliance are essential for success in this role. A well-managed collection process not only strengthens the company's revenue but also enhances customer relationships by providing structured repayment solutions."
    }
];

const CarouselPage = (props) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    }

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    }

    const slides = items.map((item) => {
        return (
            <CarouselItem
                tag="div"
                key={item.id}
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
            >
                <div className="carousel-item active">
                    <div className="testi-contain text-white">
                        <i className="bx bxs-quote-alt-left text-success display-6"></i>

                        <h4 className="mt-4 fw-medium lh-base text-white">“{item.description}”
                        </h4>
                        <div className="mt-4 pt-3 pb-5">
                            <div className="d-flex align-items-start">
                                <div className="flex-shrink-0">
                                    <img src={item.img} className="avatar-md img-fluid rounded-circle" alt="..." />
                                </div>
                                <div className="flex-grow-1 ms-3 mb-4">
                                    <h5 className="font-size-18 text-white">{item.name}
                                    </h5>
                                    <p className="mb-0 text-white-50">{item.designation}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CarouselItem>
        );
    });

    return (
        <React.Fragment>
            <div className="col-xxl-9 col-lg-8 col-md-7">
                <div className="auth-bg pt-md-5 p-4 d-flex">
                    <div className="bg-overlay bg-primary"></div>
                    <ul className="bg-bubbles">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                    <div className="row justify-content-center align-items-center">
                        <div className="col-xl-7">
                            <div className="p-0 p-sm-4 px-xl-0">
                                <div id="reviewcarouselIndicators" className="carousel slide" data-bs-ride="carousel">
                                    <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} className='carousel-indicators-rounded justify-content-start ms-0 mb-0'/>
                                    <Carousel
                                        activeIndex={activeIndex}
                                        next={next}
                                        previous={previous}
                                    >
                                        {slides}

                                    </Carousel>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default CarouselPage;