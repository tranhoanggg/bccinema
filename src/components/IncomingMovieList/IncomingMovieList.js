import React, { useEffect, useState, useRef } from "react";
import "./IncomingMovieList.css";
import { FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function IncomingMovieList() {
  const [films, setIncomings] = useState([]);
  const [offsetIndex, setOffsetIndex] = useState(0); // index inside extended array
  const [isAnimating, setIsAnimating] = useState(true); // control css transition on track
  const [showModal, setShowModal] = useState(false);
  const [modalUrl, setModalUrl] = useState("");
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  const itemsPerPage = 5;
  const gap = 20; // must match .movie-track { gap: 20px; }
  const [itemWidth, setItemWidth] = useState(220);

  // load films
  useEffect(() => {
    fetch("http://localhost:5000/incoming")
      .then((r) => r.json())
      .then((data) => setIncomings(data || []))
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

  // once films + itemWidth ready, initialize offsetIndex to middle copy
  useEffect(() => {
    if (films.length === 0) return;
    // start at middle copy: films.length (first element of 2nd copy)
    setIsAnimating(false); // no anim for initial positioning
    setOffsetIndex(films.length);
    // re-enable animation next tick
    const id = setTimeout(() => setIsAnimating(true), 20);
    return () => clearTimeout(id);
  }, [films.length, itemWidth]);

  // extended array (3 copies)
  const extended = [...films, ...films, ...films];
  const extendedCount = extended.length;
  const step = itemWidth + gap;

  // next / prev circular by changing offsetIndex
  const next = () => {
    if (films.length === 0) return;
    setIsAnimating(true);
    setOffsetIndex((s) => s + 1);
  };
  const prev = () => {
    if (films.length === 0) return;
    setIsAnimating(true);
    setOffsetIndex((s) => s - 1);
  };

  // click dot: dot index corresponds to films index; map to middle copy
  const handleDotClick = (i) => {
    if (films.length === 0) return;
    setIsAnimating(true);
    setOffsetIndex(films.length + i);
  };

  // when transition ends, if we are out of middle copy range, jump back (no animation)
  const onTrackTransitionEnd = () => {
    if (films.length === 0) return;
    // if offsetIndex moved beyond middle copies, normalize it
    if (offsetIndex >= films.length * 2) {
      // moved too far right -> jump back by one films.length
      setIsAnimating(false);
      setOffsetIndex((s) => s - films.length);
      // re-enable animation after DOM update
      setTimeout(() => setIsAnimating(true), 20);
    } else if (offsetIndex < films.length) {
      // moved too far left -> jump forward by films.length
      setIsAnimating(false);
      setOffsetIndex((s) => s + films.length);
      setTimeout(() => setIsAnimating(true), 20);
    }
  };

  // modal handling (no autoplay by default)
  const openModalWith = (link) => {
    setModalUrl(link);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setModalUrl("");
  };
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // active dot (modulo films length)
  const activeDot = films.length
    ? ((offsetIndex % films.length) + films.length) % films.length
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
    <section className="incoming-movie-list-container">
      <h2 className="incoming-movie-list-title">
        <span className="incoming-movie-list-title-inner">PHIM SẮP CHIẾU</span>
      </h2>

      <button
        className="incomingmovielist arrow left"
        onClick={prev}
        aria-label="Prev"
      >
        <FaChevronLeft />
      </button>
      <button
        className="incomingmovielist arrow right"
        onClick={next}
        aria-label="Next"
      >
        <FaChevronRight />
      </button>

      <div className="incoming-movie-slider-viewport" ref={viewportRef}>
        <div
          className="incoming-movie-track"
          ref={trackRef}
          style={trackStyle}
          onTransitionEnd={onTrackTransitionEnd}
        >
          {extended.map((film, idx) => {
            // if films empty, render empty slot
            if (!film)
              return (
                <div
                  key={`empty-${idx}`}
                  className="incoming-movie-card incoming-movie-card--empty"
                  style={{ width: itemWidth }}
                />
              );
            return (
              <article
                key={`${film.ID}-${idx}`}
                className="incoming-movie-card"
                style={{ width: `${itemWidth}px`, minWidth: `${itemWidth}px` }}
              >
                <div
                  className="incoming-poster-wrapper"
                  onClick={() => (window.location.href = `/film/${film.ID}`)}
                >
                  <img
                    className="incoming-movie-poster"
                    alt={film.name}
                    src={require(`../../assets/images/Incoming/${film.ID}.jpg`)}
                  />
                  <div className="card-overlay" />
                  <div className="overlay-buttons">
                    {film.link && (
                      <button
                        className="btn play"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModalWith(film.link);
                        }}
                      >
                        <FaPlay />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="incoming-movie-name" title={film.name}>
                  {film.name}
                </h3>
                <p className="incoming-movie-type">Thể loại: {film.type}</p>
              </article>
            );
          })}
        </div>
      </div>

      <div className=" incomingmovielist carousel-dots">
        {films.map((_, idx) => (
          <button
            key={idx}
            className={`incomingmovielist dot ${
              idx === activeDot ? "active" : ""
            }`}
            onClick={() => handleDotClick(idx)}
            aria-label={`Go to ${idx + 1}`}
          />
        ))}
      </div>

      {showModal && (
        <div
          className="video-modal-overlay"
          onMouseDown={(e) => {
            if (e.target.classList.contains("video-modal-overlay"))
              closeModal();
          }}
        >
          <div className="video-modal">
            <div className="video-wrapper">
              {/* note: no autoplay in embed URL so it won't auto-play */}
              {modalUrl.includes("youtube.com") ||
              modalUrl.includes("youtu.be") ? (
                <iframe
                  title="Trailer"
                  src={convertYoutubeToEmbed(modalUrl, false)} // autoplay=false
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <iframe
                  title="Trailer"
                  src={modalUrl}
                  frameBorder="0"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// convert youtube url -> embed, autoplay optional
function convertYoutubeToEmbed(url, autoplay = false) {
  try {
    const u = new URL(url);
    let id = "";
    if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
    else id = u.searchParams.get("v");
    if (!id) return url;
    return `https://www.youtube.com/embed/${id}?rel=0${
      autoplay ? "&autoplay=1" : ""
    }`;
  } catch {
    return url;
  }
}

export default IncomingMovieList;
