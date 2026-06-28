import React, { useState, useEffect, type ReactNode } from "react";

import "../../../styles/modules/Post/custom.slider.css";

interface CustomCarouselProps {
    children: ReactNode;
}

export const CustomCarousel: React.FC<CustomCarouselProps> = ({ children }) => {
    const slides = React.Children.toArray(children);

    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [slideDone, setSlideDone] = useState<boolean>(true);
    const [timeID, setTimeID] = useState<number | null>(null);

    useEffect(() => {
        let timeout: number;

        if (slideDone) {
            setSlideDone(false);

            timeout = window.setTimeout(() => {
                slideNext();
                setSlideDone(true);
            }, 5000);

            setTimeID(timeout);
        }

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [slideDone]);

    const slideNext = () => {
        setActiveIndex((val) => {
            if (val >= slides.length - 1) {
                return 0;
            }
            return val + 1;
        });
    };

    const slidePrev = () => {
        setActiveIndex((val) => {
            if (val <= 0) {
                return slides.length - 1;
            }
            return val - 1;
        });
    };

    const AutoPlayStop = () => {
        if (timeID !== null) {
            clearTimeout(timeID);
            setSlideDone(false);
        }
    };

    const AutoPlayStart = () => {
        if (!slideDone) {
            setSlideDone(true);
        }
    };

    return (
        <div
            className="container__slider"
            onMouseEnter={AutoPlayStop}
            onMouseLeave={AutoPlayStart}
        >
            {slides.map((item, index) => (
                <div
                    className={`slider__item slider__item-active-${activeIndex + 1}`}
                    key={index}
                >
                    {item}
                </div>
            ))}

            <div className="container__slider__links">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={
                            activeIndex === index
                                ? "container__slider__links-small container__slider__links-small-active"
                                : "container__slider__links-small"
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveIndex(index);
                        }}
                    />
                ))}
            </div>

            <button
                className="slider__btn-next"
                onClick={(e) => {
                    e.preventDefault();
                    slideNext();
                }}
            >
                {">"}
            </button>

            <button
                className="slider__btn-prev"
                onClick={(e) => {
                    e.preventDefault();
                    slidePrev();
                }}
            >
                {"<"}
            </button>
        </div>
    );
};


