import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./FilmDetail.css";

function FilmDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [film, setFilm] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/films/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => setFilm(data))
      .catch((err) => console.error("Lỗi fetch film:", err));
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [film]);

  if (!film) return <div className="film-loading">Đang tải...</div>;

  const classifyText =
    film.classify === 0
      ? "Phim phù hợp với mọi độ tuổi"
      : `Phim phổ biến đến người xem từ ${film.classify} tuổi trở lên`;

  function convertYoutubeToEmbed(url) {
    try {
      if (!url) return "";
      let videoId = "";

      // xử lý link youtu.be/abc123
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split(/[?&]/)[0];
      }
      // xử lý link youtube.com/watch?v=abc123
      else if (url.includes("youtube.com/watch")) {
        const u = new URL(url);
        videoId = u.searchParams.get("v");
      }
      // xử lý link youtube.com/embed/abc123 (đã đúng format)
      else if (url.includes("youtube.com/embed/")) {
        videoId = url.split("embed/")[1].split(/[?&]/)[0];
      }

      return videoId
        ? `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0`
        : url;
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
        }),
      );

      // 🔹 Chuyển sang trang đăng nhập
      navigate("/login");
    } else {
      // 🔹 Người dùng đã đăng nhập → đi thẳng đến BookTicket
      navigate("/bookticket", { state: { filmId } });
    }
  };

  return (
    <section className="filmdetail-overlay">
      <div className="filmdetail-container">
        <div className="filmdetail-left">
          <img
            src={require(`../../assets/images/Film/${film.ID}.jpg`)}
            alt={film.name}
            className="filmdetail-poster"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>

        <div className="filmdetail-right">
          <h1 className="filmdetail-title">{film.name}</h1>
          <p className="filmdetail-description">{film.description}</p>

          <div className="filmdetail-info">
            <p>
              <strong>Phân loại:</strong>{" "}
              <span className="highlight">{classifyText}</span>
            </p>
            <p>
              <strong>Định dạng:</strong> {film.format}
            </p>
            <p>
              <strong>Đạo diễn:</strong> {film.director}
            </p>
            <p>
              <strong>Diễn viên:</strong> {film.actor}
            </p>
            <p>
              <p>
                <strong>Thể loại:</strong>{" "}
                <span
                  className="filmdetail-genre"
                  onClick={() =>
                    navigate("/films", {
                      state: { selectedCategory: film.type },
                    })
                  }
                >
                  {film.type}
                </span>
              </p>
            </p>
            <p>
              <strong>Khởi chiếu:</strong> {film.start_day}
            </p>
            <p>
              <strong>Thời lượng:</strong> {film.duration} phút
            </p>
            <p>
              <strong>Giá vé:</strong> 50.000 VNĐ
            </p>
          </div>

          <button
            className="filmdetail btn buy"
            onClick={(e) => {
              e.stopPropagation();
              handleBookNow(film.ID);
            }}
          >
            MUA VÉ
          </button>
        </div>
      </div>

      {/* --- HIỂN THỊ TRAILER --- */}
      {film.link && (
        <div className="filmdetail-trailer">
          <iframe
            title="Trailer"
            src={convertYoutubeToEmbed(film.link)}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </section>
  );
}

export default FilmDetail;
