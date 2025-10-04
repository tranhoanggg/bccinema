import React, { useEffect, useState, useRef } from "react";
import "./Goods.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Goods() {
  const [goods, setGoods] = useState([]);
  const [offsetIndex, setOffsetIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const priceRef = useRef(true);

  const itemsPerPage = 4;
  const gap = 20; // must match .goods-track { gap: 20px; }
  const [itemWidth, setItemWidth] = useState(220);

  // load goods
  useEffect(() => {
    fetch("http://localhost:5000/goods")
      .then((r) => r.json())
      .then((data) => setGoods(data || []))
      .catch((e) => console.error(e));
  }, []);

  // compute itemWidth based on viewport and gap
  useEffect(() => {
    function recompute() {
      if (!viewportRef.current) return;
      const w = viewportRef.current.clientWidth;
      const computed = Math.floor(
        (w - gap * (itemsPerPage - 1)) / itemsPerPage
      );
      setItemWidth(computed > 100 ? computed : 120);
    }
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [itemsPerPage]);

  // once goods + itemWidth ready, initialize offsetIndex to middle copy
  useEffect(() => {
    if (goods.length === 0) return;
    // start at middle copy: goods.length (first element of 2nd copy)
    setIsAnimating(false); // no anim for initial positioning
    setOffsetIndex(goods.length);
    // re-enable animation next tick
    const id = setTimeout(() => setIsAnimating(true), 20);
    return () => clearTimeout(id);
  }, [goods.length, itemWidth]);

  // extended array (3 copies)
  const extended = [...goods, ...goods, ...goods];
  const extendedCount = extended.length;
  const step = itemWidth + gap;

  // next / prev circular by changing offsetIndex
  const next = () => {
    if (goods.length === 0) return;
    setIsAnimating(true);
    setOffsetIndex((s) => s + 1);
  };
  const prev = () => {
    if (goods.length === 0) return;
    setIsAnimating(true);
    setOffsetIndex((s) => s - 1);
  };

  // click dot: dot index corresponds to goods index; map to middle copy
  const handleDotClick = (i) => {
    if (goods.length === 0) return;
    setIsAnimating(true);
    setOffsetIndex(goods.length + i);
  };

  // when transition ends, if we are out of middle copy range, jump back (no animation)
  const onTrackTransitionEnd = () => {
    if (goods.length === 0) return;
    // if offsetIndex moved beyond middle copies, normalize it
    if (offsetIndex >= goods.length * 2) {
      // moved too far right -> jump back by one goods.length
      setIsAnimating(false);
      setOffsetIndex((s) => s - goods.length);
      // re-enable animation after DOM update
      setTimeout(() => setIsAnimating(true), 20);
    } else if (offsetIndex < goods.length) {
      // moved too far left -> jump forward by goods.length
      setIsAnimating(false);
      setOffsetIndex((s) => s + goods.length);
      setTimeout(() => setIsAnimating(true), 20);
    }
  };

  // active dot (modulo goods length)
  const activeDot = goods.length
    ? ((offsetIndex % goods.length) + goods.length) % goods.length
    : 0;

  // track inline style
  const trackStyle = {
    width: `${extendedCount * step}px`,
    transform: `translateX(-${offsetIndex * step}px)`,
    transition: isAnimating
      ? "transform 0.45s cubic-bezier(.22,.9,.18,1)"
      : "none",
  };

  return (
    <section className="goods-container">
      <button className="goods-title-inner">
        <span>GIỎ HÀNG</span>
        <i class="bi bi-cart"></i>
        <span className="goods-cart-quantity">1</span>
      </button>

      <button className="goods arrow left" onClick={prev} aria-label="Prev">
        <FaChevronLeft />
      </button>
      <button className="goods arrow right" onClick={next} aria-label="Next">
        <FaChevronRight />
      </button>

      <div className="goods-slider-viewport" ref={viewportRef}>
        <div
          className="goods-track"
          ref={trackRef}
          style={trackStyle}
          onTransitionEnd={onTrackTransitionEnd}
        >
          {extended.map((good, idx) => {
            // if goods empty, render empty slot
            if (!good)
              return (
                <div
                  key={`empty-${idx}`}
                  className="goods-card goods-card--empty"
                  style={{ width: itemWidth }}
                />
              );
            return (
              <article
                key={`${good.ID}-${idx}`}
                className="goods-card"
                style={{ width: `${itemWidth}px`, minWidth: `${itemWidth}px` }}
              >
                <div
                  className="poster-wrapper"
                  onClick={() => (window.location.href = `/good/${good.ID}`)}
                >
                  <div className="goods-poster-wrapper">
                    <img
                      className="goods-poster"
                      alt={good.name}
                      src={require(`../../assets/images/Goods/${good.ID}.png`)}
                    />
                  </div>
                  <h1 className="goods-name" title={good.name}>
                    {good.name}
                  </h1>
                  <p className="goods-description">{good.description}</p>
                  <p className="goods-price" ref={priceRef}>
                    {priceRef.current ? (
                      <>
                        {"Giá: "}
                        <span className="goods old-price">
                          {good.price} VND
                        </span>
                        {" -> "}
                        <span className="goods new-price">
                          {good.discount} VND
                        </span>
                      </>
                    ) : (
                      <span className="goods price">{good.price}</span>
                    )}
                  </p>
                  <p className="goodspage-btn-wrapper">
                    <button
                      className="goodspage btn add"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/good/${good.ID}/buy`;
                      }}
                    >
                      <span className="add-text">THÊM GIỎ HÀNG</span>
                    </button>
                    <button
                      className="goodspage btn buy"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/good/${good.ID}/buy`;
                      }}
                    >
                      <span className="buy-text">MUA NGAY</span>
                    </button>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className=" goods carousel-dots">
        {goods.map((_, idx) => (
          <button
            key={idx}
            className={`goods dot ${idx === activeDot ? "active" : ""}`}
            onClick={() => handleDotClick(idx)}
            aria-label={`Go to ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default Goods;
