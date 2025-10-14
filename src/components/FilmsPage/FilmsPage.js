import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./FilmsPage.css";
import { FaPlay, FaSearch } from "react-icons/fa";

const FilmsPage = () => {
  const navigate = useNavigate();
  const [films, setFilms] = useState([]);
  const [activeTab, setActiveTab] = useState("showing"); // "showing" | "upcoming"
  const [showModal, setShowModal] = useState(false);
  const [modalUrl, setModalUrl] = useState("");

  const [filteredFilms, setFilteredFilms] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const location = useLocation();

  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }
  }, [location.state]);

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
        setFilms(data);
        setFilteredFilms(data);
        // lấy danh sách thể loại duy nhất
        const uniqueTypes = [...new Set(data.map((f) => f.type))];
        setCategories(uniqueTypes);
      })
      .catch((err) => console.error("Lỗi fetch films:", err));
  }, [activeTab]);

  // Khi selectedCategory được set (vd: từ FilmDetail) -> lọc phim tương ứng
  useEffect(() => {
    if (selectedCategory && films.length > 0) {
      const result = films.filter((f) => f.type === selectedCategory);
      setFilteredFilms(result);
    } else {
      setFilteredFilms(films);
    }
  }, [selectedCategory, films]);

  // Xử lý tìm kiếm theo tên phim (Enter hoặc icon)
  const handleSearch = () => {
    if (!searchText.trim()) {
      setFilteredFilms(films);
      return;
    }
    const result = films.filter((f) =>
      f.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredFilms(result);
    setSelectedCategory(""); // bỏ chọn thể loại nếu có
  };

  // Lọc theo thể loại
  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setSelectedCategory(cat);
    setSearchText(""); // bỏ text search khi chọn thể loại

    if (!cat) {
      setFilteredFilms(films);
    } else {
      const result = films.filter((f) => f.type === cat);
      setFilteredFilms(result);
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

  const handleBookNow = (filmId) => {
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

  return (
    <div className="films-page">
      {/* Tabs */}
      <div className="films-tabs">
        <span style={{ "margin-right": "104px", "margin-left": "542px" }}>
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
        </span>

        <div className="filter-bar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm theo tên phim..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch}>
              <FaSearch />
            </button>
          </div>
          <select
            className="category-dropdown"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Tất cả thể loại</option>
            {categories.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid phim */}
      <div className="films-grid">
        {filteredFilms.map((film) => (
          <div key={film.ID} className="film-card">
            <div
              className="film-poster"
              onClick={() => navigate(`/film/${film.ID}`)}
            >
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
              onClick={(e) => {
                e.stopPropagation();
                handleBookNow(film.ID);
              }}
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
