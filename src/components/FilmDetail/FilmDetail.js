import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./FilmDetail.css";

function FilmDetail() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/films/${id}`)
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
              <strong>Thể loại:</strong> {film.type}
            </p>
            <p>
              <strong>Khởi chiếu:</strong> {film.start_day}
            </p>
            <p>
              <strong>Thời lượng:</strong> {film.duration} phút
            </p>
          </div>

          <button
            className="filmdetail btn buy"
            onClick={() => (window.location.href = `/buy-ticket/${film.ID}`)}
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
