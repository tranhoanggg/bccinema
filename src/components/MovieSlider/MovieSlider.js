import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MovieSlider.css";

import Slider1 from "../../assets/images/Slider/Slider1.jpg";
import Slider2 from "../../assets/images/Slider/Slider2.jpg";
import Slider3 from "../../assets/images/Slider/Slider3.jpg";
import Slider4 from "../../assets/images/Slider/Slider4.jpg";
import Slider5 from "../../assets/images/Slider/Slider5.jpg";

function MovieSlider() {
  const sliders = [
    { img: Slider1, title: "TỬ CHIẾN TRÊN KHÔNG" },
    { img: Slider2, title: "CHỊ NGÃ EM NÂNG" },
    { img: Slider3, title: "TAY ANH GIỮ MỘT VÌ SAO" },
    { img: Slider4, title: "MEASURE IN LOVE: NĂM CỦA ANH, NGÀY CỦA EM" },
    { img: Slider5, title: "CHAINSAW MAN: THE MOVIE - REZE ARC" },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? sliders.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % sliders.length);
  };

  return (
    <div className="movie-slider">
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        interval={null}
        controls={false}
        indicators={false}
        fade
      >
        {sliders.map((slide, i) => (
          <Carousel.Item key={i}>
            <div className="slider-img-wrapper">
              <img
                src={slide.img}
                alt={`Slide ${i + 1}`}
                className="d-block w-100 slider-img"
              />
              <div className="overlay"></div>

              <div className="slider-content">
                <h2 className="movie-title">{slide.title}</h2>
                <div className="btn-group">
                  <button className="btn btn-success me-2 slider-btn-buy">
                    🎟 MUA VÉ NGAY
                  </button>
                  <button className="btn btn-outline-light slider-btn-infor">
                    THÔNG TIN CHI TIẾT ℹ
                  </button>
                </div>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Nút điều hướng Prev / Next */}
      <button className="nav-btn prev" onClick={handlePrev}>
        ❮
      </button>
      <button className="nav-btn next" onClick={handleNext}>
        ❯
      </button>

      {/* Thumbnail chọn slide */}
      <div className="thumbnail-wrapper">
        {sliders.map((slide, i) => (
          <img
            key={i}
            src={slide.img}
            alt={`thumb-${i}`}
            className={`thumbnail ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default MovieSlider;
