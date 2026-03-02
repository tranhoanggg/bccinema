import React, { useEffect, useState } from "react";
import "./FilmSchedule.css";

function FilmSchedule({ filmId, onSelectSchedule }) {
  const [film, setFilm] = useState(null);
  const [showDate, setShowDate] = useState("");
  const [showtimes, setShowtimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    if (!filmId) return;

    fetch(`${process.env.REACT_APP_API_URL}/films/${filmId}`)
      .then((res) => res.json())
      .then((data) => {
        setFilm(data);

        // 🗓️ Tính ngày chiếu dựa vào ID phim
        const totalFilms = 22;
        const baseDate = new Date(2025, 9, 1); // 01/10/2025 (tháng 9 vì zero-based)
        const filmIndex = (data.ID - 1) % totalFilms;
        const dayOffset = Math.floor(filmIndex / 2); // 2 phim/ngày
        const scheduledDate = new Date(baseDate);
        scheduledDate.setDate(baseDate.getDate() + dayOffset);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const CYCLE_DAYS = 11; // lặp lại mỗi 11 ngày
        let finalShowDate = new Date(scheduledDate);
        finalShowDate.setHours(0, 0, 0, 0);

        while (finalShowDate < today) {
          finalShowDate.setDate(finalShowDate.getDate() + CYCLE_DAYS);
        }

        const formatted = finalShowDate.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        setShowDate(formatted);

        // 🕒 Sinh danh sách giờ chiếu
        setShowtimes(generateShowTimes(data.duration));
      })
      .catch((err) => console.error("Lỗi lấy dữ liệu phim:", err));
  }, [filmId]);

  // 🔹 Sinh các khung giờ chiếu từ 9h00 đến 24h00
  function generateShowTimes(duration) {
    const start = 9 * 60;
    const end = 24 * 60;
    const times = [];
    let current = start;
    while (current + duration <= end) {
      let hours = Math.floor(current / 60);
      let mins = current % 60;
      mins = Math.floor(mins / 10) * 10;
      const timeStr = `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}`;
      times.push(timeStr);
      current += duration + 30;
    }
    return times;
  }

  // 🔸 Khi chọn giờ chiếu
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    if (onSelectSchedule && showDate) {
      onSelectSchedule(showDate, time);
    }
  };

  if (!film) return <div>Đang tải lịch chiếu...</div>;

  return (
    <div className="schedule-container">
      <p>
        <strong>Ngày chiếu:</strong> {showDate}
      </p>

      <div className="showtime-grid">
        {showtimes.map((t, i) => (
          <button
            key={i}
            className={`showtime-btn ${selectedTime === t ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              handleTimeSelect(t);
            }}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilmSchedule;
