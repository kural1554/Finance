import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Carousel,
    CarouselItem,
    CarouselIndicators,
    Col,
    Card,
    CardBody,
} from 'reactstrap';

const items = [
    {
        id: 1,
        icon: "currency-btc",
        title: "Bitcoin",
        description: "Bitcoin prices fell sharply amid the global sell-off in equities. Negative news over the Bitcoin past week has dampened Bitcoin basics sentiment for bitcoin."
    },
    {
        id: 2,
        icon: "ethereum",
        title: "ETH",
        description: "Bitcoin prices fell sharply amid the global sell-off in equities. Negative news over the Bitcoin past week has dampened Bitcoin basics sentiment for bitcoin."
    },
    {
        id: 3,
        icon: "litecoin",
        title: "Litecoin",
        description: "Bitcoin prices fell sharply amid the global sell-off in equities. Negative news over the Bitcoin past week has dampened Bitcoin basics sentiment for bitcoin."
    },
];

const NewSlider = () => {
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
                tag="div"
                key={item.id}
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
            >
            </CarouselItem>
        );
    });

    return (
        <Col xl={4}>
            
        </Col>
    );
};

export default NewSlider;
