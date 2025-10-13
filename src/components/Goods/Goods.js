import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Goods.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Goods() {
  const navigate = useNavigate();
  const [goods, setGoods] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [offsetIndex, setOffsetIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const priceRef = useRef(true);

  const itemsPerPage = 4;
  const gap = 20; // must match .goods-track { gap: 20px; }
  const [itemWidth, setItemWidth] = useState(220);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      setCartCount(0);
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user && user.ID) {
        fetch(`http://localhost:5000/cart/${user.ID}`)
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              // 🟩 Cộng tổng quantity của tất cả sản phẩm trong giỏ
              const totalQuantity = data.reduce(
                (sum, item) => sum + (item.quantity || 0),
                0
              );
              setCartCount(totalQuantity);
            } else {
              setCartCount(0);
            }
          })
          .catch((err) => {
            console.error("Lỗi tải giỏ hàng:", err);
            setCartCount(0);
          });
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error("Lỗi đọc localStorage:", err);
      setCartCount(0);
    }
  }, []);

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

  // Hàm kiểm tra login
  const checkLogin = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      // chưa đăng nhập → lưu lại trang hiện tại để quay lại
      localStorage.setItem("redirectAfterLogin", "/goods");
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleAddToCart = (e, id) => {
    e.stopPropagation();
    if (!checkLogin()) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.ID) return;

    fetch("http://localhost:5000/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.ID,
        goods_id: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        // Cập nhật hiển thị số lượng giỏ hàng
        setCartCount((prev) => prev + 1);
      })
      .catch((err) => console.error("Lỗi thêm giỏ hàng:", err));
  };

  const handleBuyNow = (e, id) => {
    e.stopPropagation();
    if (!checkLogin()) return;

    const user = JSON.parse(localStorage.getItem("user"));
    fetch(`http://localhost:5000/cart/${user.ID}`)
      .then((res) => res.json())
      .then((cartItems) => {
        navigate("/goodspayment", {
          state: {
            clickedId: id,
            cartItems: cartItems || [],
          },
        });
      })
      .catch((err) => {
        console.error("Lỗi khi lấy giỏ hàng:", err);
      });
  };

  return (
    <section className="goods-container">
      <button
        className="goods-title-inner"
        onClick={(e) => handleBuyNow(e, null)}
      >
        <span>GIỎ HÀNG</span>
        <i className="bi bi-cart"></i>
        <span className="goods-cart-quantity">{cartCount}</span>
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
                <div className="poster-wrapper">
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
                      onClick={(e) => handleAddToCart(e, good.ID)}
                    >
                      <span className="add-text">THÊM GIỎ HÀNG</span>
                    </button>
                    <button
                      className="goodspage btn buy"
                      onClick={(e) => handleBuyNow(e, good.ID)}
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
