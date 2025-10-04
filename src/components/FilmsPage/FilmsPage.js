import React, { useEffect, useState } from "react";
import "./FilmsPage.css";
import { FaPlay, FaTicketAlt } from "react-icons/fa";

const FilmsPage = () => {
  const [films, setFilms] = useState([]);
  const [activeTab, setActiveTab] = useState("showing"); // "showing" | "upcoming"
  const [showModal, setShowModal] = useState(false);
  const [modalUrl, setModalUrl] = useState("");

  // fetch films theo tab
  useEffect(() => {
    let url =
      activeTab === "showing"
        ? "http://localhost:5000/films"
        : "http://localhost:5000/incoming";
    console.log(activeTab);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFilms(data);
      })
      .catch((err) => console.error("Lỗi fetch films:", err));
  }, [activeTab]);

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

  return (
    <div className="films-page">
      {/* Tabs */}
      <div className="films-tabs">
        <span
          className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("upcoming");
          }}
        >
          PHIM SẮP CHIẾU
        </span>
        <span
          className={`tab ${activeTab === "showing" ? "active" : ""}`}
          onClick={() => setActiveTab("showing")}
        >
          PHIM ĐANG CHIẾU
        </span>
      </div>

      {/* Grid phim */}
      <div className="films-grid">
        {films.map((film) => (
          <div key={film.ID} className="film-card">
            <div className="film-poster">
              <img
                className="film-image"
                alt={film.name}
                src={
                  activeTab === "showing"
                    ? `/assets/images/Film/${film.ID}.jpg`
                    : `/assets/images/Incoming/${film.ID}.jpg`
                }
              />
              <div className="overlay">
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
            <h3 className="film-name">{film.name}</h3>
            <p className="film-type">Thể loại: {film.type}</p>
            <button
              className="filmpage btn buy"
              onClick={() => (window.location.href = `/buy-ticket/${film.ID}`)}
            >
              MUA VÉ
            </button>
          </div>
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
    </div>
  );
};

export default FilmsPage;
