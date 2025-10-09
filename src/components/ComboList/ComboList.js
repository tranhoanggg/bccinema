import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ComboList.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function ComboList() {
  const navigate = useNavigate();
  const [combos, setCombos] = useState([]);
  const [offsetIndex, setOffsetIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const viewportRef = useRef(null);

  const itemsPerPage = 3;
  const gap = 20;
  const [itemWidth, setItemWidth] = useState(240);

  useEffect(() => {
    fetch("http://localhost:5000/combos")
      .then((r) => r.json())
      .then((data) => setCombos(data || []))
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    function recompute() {
      if (!viewportRef.current) return;
      const w = viewportRef.current.clientWidth;
      const computed = Math.floor(
        (w - gap * (itemsPerPage - 1)) / itemsPerPage
      );
      setItemWidth(computed > 140 ? computed : 140);
    }
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [itemsPerPage]);

  useEffect(() => {
    if (combos.length === 0) return;
    setIsAnimating(false);
    setOffsetIndex(combos.length);
    const id = setTimeout(() => setIsAnimating(true), 20);
    return () => clearTimeout(id);
  }, [combos.length, itemWidth]);

  const extended = [...combos, ...combos, ...combos];
  const step = itemWidth + gap;

  const next = () => {
    if (combos.length === 0) return;
    setIsAnimating(true);
    setOffsetIndex((s) => s + 1);
  };
  const prev = () => {
    if (combos.length === 0) return;
    setIsAnimating(true);
    setOffsetIndex((s) => s - 1);
  };

  const onTrackTransitionEnd = () => {
    if (combos.length === 0) return;
    if (offsetIndex >= combos.length * 2) {
      setIsAnimating(false);
      setOffsetIndex((s) => s - combos.length);
      setTimeout(() => setIsAnimating(true), 20);
    } else if (offsetIndex < combos.length) {
      setIsAnimating(false);
      setOffsetIndex((s) => s + combos.length);
      setTimeout(() => setIsAnimating(true), 20);
    }
  };

  const activeDot = combos.length
    ? ((offsetIndex % combos.length) + combos.length) % combos.length
    : 0;

  const trackStyle = {
    width: `${extended.length * step}px`,
    transform: `translateX(-${offsetIndex * step}px)`,
    transition: isAnimating
      ? "transform 0.45s cubic-bezier(.22,.9,.18,1)"
      : "none",
  };

  return (
    <section className="combo-list-container">
      <h2 className="combo-list-title">COMBO ƯU ĐÃI</h2>

      <button className="combolist arrow left" onClick={prev}>
        <FaChevronLeft />
      </button>
      <button className="combolist arrow right" onClick={next}>
        <FaChevronRight />
      </button>

      <div className="combo-slider-viewport" ref={viewportRef}>
        <div
          className="combo-track"
          style={trackStyle}
          onTransitionEnd={onTrackTransitionEnd}
        >
          {extended.map((combo, idx) =>
            combo ? (
              <article
                key={`${combo.ID}-${idx}`}
                className="combo-card"
                style={{ width: `${itemWidth}px`, minWidth: `${itemWidth}px` }}
                onClick={() => navigate(`/combo/${combo.ID}`)}
              >
                <img
                  className="combo-poster"
                  alt={combo.name}
                  src={require(`../../assets/images/Combo/${combo.ID}.jpg`)}
                />
                <h3 className="combo-name">{combo.name}</h3>
                <p className="combo-title">{combo.title}</p>
              </article>
            ) : (
              <div
                key={`empty-${idx}`}
                className="combo-card combo-card--empty"
                style={{ width: itemWidth }}
              />
            )
          )}
        </div>
      </div>

      <div className="combolist carousel-dots">
        {combos.map((_, idx) => (
          <button
            key={idx}
            className={`combolist dot ${idx === activeDot ? "active" : ""}`}
            onClick={() => setOffsetIndex(combos.length + idx)}
          />
        ))}
      </div>
    </section>
  );
}

export default ComboList;
