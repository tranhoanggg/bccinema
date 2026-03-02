import React, { useState, useEffect, useRef } from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MovieSlider.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import Slider1 from "../../assets/images/Slider/Slider1.jpg";
import Slider2 from "../../assets/images/Slider/Slider2.jpg";
import Slider3 from "../../assets/images/Slider/Slider3.jpg";
import Slider4 from "../../assets/images/Slider/Slider4.jpg";
import Slider5 from "../../assets/images/Slider/Slider5.jpg";

function MovieSlider() {
  const navigate = useNavigate();
  const sliders = [
    { id: 1, img: Slider1, title: "TỬ CHIẾN TRÊN KHÔNG" },
    { id: 22, img: Slider2, title: "CHỊ NGÃ EM NÂNG" },
    { id: 9, img: Slider3, title: "TAY ANH GIỮ MỘT VÌ SAO" },
    {
      id: null,
      img: Slider4,
      title: "MEASURE IN LOVE: NĂM CỦA ANH, NGÀY CỦA EM",
    },
    { id: 6, img: Slider5, title: "CHAINSAW MAN: THE MOVIE - REZE ARC" },
  ];

  const handleBookNow = (filmId) => {
    if (filmId == null) return;
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      // 🔹 Lưu tạm filmId để quay lại sau đăng nhập
      localStorage.setItem(
        "redirectAfterLogin",
        JSON.stringify({
          path: "/bookticket",
          state: { filmId },
        })
      );

      // 🔹 Chuyển sang trang đăng nhập
      navigate("/login");
    } else {
      // 🔹 Người dùng đã đăng nhập → đi thẳng đến BookTicket
      navigate("/bookticket", { state: { filmId } });
    }
  };

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Khai báo useRef để tham chiếu đến element DOM
  const sliderRef = useRef(null);

  // CHUYỂN TOÀN BỘ LOGIC JAVASCRIPT VÀO useEffect
  useEffect(() => {
    // Lấy element từ useRef, đảm bảo nó tồn tại
    const slider = sliderRef.current;
    if (!slider) return;

    // Định nghĩa khoảng ngẫu nhiên (Giữ nguyên logic của bạn)
    const RANGE_LEFT_MIN = 50;
    const RANGE_LEFT_MAX = 80;
    const RANGE_RIGHT_MIN = 20;
    const RANGE_RIGHT_MAX = 50;

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function updateRandomEndPoints() {
      // 1. Logic Random VỊ TRÍ
      const newEndL = getRandomInt(RANGE_LEFT_MIN, RANGE_LEFT_MAX);
      const newEndR = getRandomInt(RANGE_RIGHT_MIN, RANGE_RIGHT_MAX);

      slider.style.setProperty("--end-L", `${newEndL}%`);
      slider.style.setProperty("--end-R", `${newEndR}%`);
    }

    // Lắng nghe sự kiện animationiteration
    const handleAnimationIteration = (e) => {
      if (e.animationName === "spotlight-right") {
        updateRandomEndPoints();
      }
    };

    // Gắn sự kiện (Event Listener)
    slider.addEventListener("animationiteration", handleAnimationIteration);

    // Khởi tạo lần đầu tiên
    updateRandomEndPoints();

    // Cleanup: Quan trọng trong React để gỡ bỏ Event Listener khi component unmount
    return () => {
      slider.removeEventListener(
        "animationiteration",
        handleAnimationIteration
      );
    };
  }, []); // Chỉ chạy một lần khi component mount

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
    <div className="movie-slider" ref={sliderRef}>
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
                  <button
                    className="movieslider btn btn-success me-2 slider-btn-buy"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookNow(slide.id);
                    }}
                  >
                    🎟 MUA VÉ NGAY
                  </button>
                  <button
                    className="movieslider btn btn-outline-light slider-btn-infor"
                    onClick={() => {
                      if (slide.id != null) navigate(`/film/${slide.id}`);
                    }}
                  >
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
        <FaChevronLeft />
      </button>
      <button className="nav-btn next" onClick={handleNext}>
        <FaChevronRight />
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
