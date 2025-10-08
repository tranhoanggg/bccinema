import React, { useEffect, useState } from "react";
import "./EndowList.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import EndowPopup from "./EndowPopup";

function EndowList() {
  const [endows, setEndows] = useState([]);
  const [index, setIndex] = useState(0);
  const [transition, setTransition] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const itemsPerPage = 3;

  useEffect(() => {
    fetch("http://localhost:5000/endow")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setEndows(data);
          setIndex(itemsPerPage); // bắt đầu ngay sau clone đầu
        }
      })
      .catch((err) => console.error("Lỗi fetch endows:", err));
  }, []);

  // tạo mảng hiển thị (clone đầu & cuối)
  const slides = React.useMemo(() => {
    if (endows.length === 0) return [];
    return [
      ...endows.slice(-itemsPerPage), // clone cuối lên đầu
      ...endows,
      ...endows.slice(0, itemsPerPage), // clone đầu xuống cuối
    ];
  }, [endows]);

  const next = () => {
    if (endows.length <= itemsPerPage) return;
    setIndex((prev) => prev + 1);
  };

  const prev = () => {
    if (endows.length <= itemsPerPage) return;
    setIndex((prev) => prev - 1);
  };

  // reset index khi đi tới clone
  const handleTransitionEnd = () => {
    if (index >= endows.length + itemsPerPage) {
      // đang ở clone cuối
      setTransition(false);
      setIndex(itemsPerPage); // reset về đầu thật
    } else if (index < itemsPerPage) {
      // đang ở clone đầu
      setTransition(false);
      setIndex(endows.length + (index % itemsPerPage));
    }
  };

  // sau khi reset thì bật lại transition
  useEffect(() => {
    if (!transition) {
      requestAnimationFrame(() => setTransition(true));
    }
  }, [transition]);

  // tính offset %
  const offsetPercent = (100 / itemsPerPage) * index;

  const handleOpenPopup = (id) => {
    setSelectedId(id);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setTimeout(() => setSelectedId(null), 400); // đợi animation kết thúc
  };

  return (
    <section className="endow-section">
      <div className="endow-container">
        <div className="endow-title">
          Ưu đãi
          <br />
          đặc biệt
        </div>

        <div className="endow-slider-area">
          {endows.length > itemsPerPage && (
            <button className="endow-arrow left" onClick={prev}>
              <FaChevronLeft />
            </button>
          )}

          <div className="endow-viewport">
            <div
              className="endow-track"
              style={{
                transform: `translateX(-${offsetPercent}%)`,
                transition: transition ? "transform 0.45s ease" : "none",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {slides.map((item, idx) => (
                <article
                  key={`${item.ID}-${idx}`}
                  className="endow-card"
                  onClick={() => handleOpenPopup(item.ID)}
                >
                  <img
                    className="endow-poster"
                    alt={item.name}
                    src={require(`../../assets/images/Endow/${item.ID}.jpg`)}
                    onError={(e) => {
                      e.target.src = "";
                    }}
                  />
                  <h3 className="endow-name">{item.name}</h3>
                </article>
              ))}
            </div>
          </div>

          {endows.length > itemsPerPage && (
            <button className="endow-arrow right" onClick={next}>
              <FaChevronRight />
            </button>
          )}
        </div>
      </div>

      {showPopup && <EndowPopup id={selectedId} onClose={handleClosePopup} />}
    </section>
  );
}

export default EndowList;
