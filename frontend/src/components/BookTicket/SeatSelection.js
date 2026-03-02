import React, { useEffect, useState, useRef } from "react";
import "./SeatSelection.css";

function SeatSelection({ filmId, selectedDate, selectedTime, onSeatSelect }) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [seats, setSeats] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const countdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const hasReservedRef = useRef(false);

  useEffect(() => {
    hasReservedRef.current = selectedSeats.some((seat) => seat);
  }, [selectedSeats]);

  // 🟢 Lấy danh sách phòng theo filmId
  useEffect(() => {
    if (!filmId) return;
    const roomIds = filmId % 2 === 1 ? [1, 2, 3, 4, 5] : [6, 7, 8, 9, 10];
    setRooms(roomIds);
    setSelectedRoom(roomIds[0]);
    onSeatSelect(roomIds[0], []);
  }, [filmId]);

  // 🟢 Lấy danh sách ghế khi chọn phòng, ngày, giờ
  useEffect(() => {
    if (!selectedDate || !selectedTime || !selectedRoom) return;

    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    };

    fetch(
      `${process.env.REACT_APP_API_URL}/slots?room_id=${selectedRoom}&day=${formatDate(
        selectedDate,
      )}&time=${selectedTime}`,
    )
      .then((res) => res.json())
      .then((data) => {
        // 🟢 Tạo ma trận ghế 4x5 mặc định là "available"
        const matrix = Array.from({ length: 4 }, () =>
          Array(5).fill("available"),
        );
        // Cập nhật ghế theo dữ liệu từ DB
        data.forEach((slot) => {
          const { line, col, status } = slot;
          const rowIdx = line - 1;
          const colIdx = col - 1;
          if (
            rowIdx >= 0 &&
            rowIdx < matrix.length &&
            colIdx >= 0 &&
            colIdx < matrix[0].length
          ) {
            matrix[rowIdx][colIdx] = status;
          }
        });
        setSeats(matrix);
      })
      .catch((err) => console.error("❌ Lỗi khi tải danh sách ghế:", err));
  }, [selectedDate, selectedTime, selectedRoom]);

  const handleRoomChange = (e) => {
    const newRoom = Number(e.target.value);
    if (newRoom === selectedRoom) return;

    // 🟠 Chuẩn hóa ngày theo định dạng MySQL
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    };

    // 🟢 Nếu có ghế đang giữ, clear trước khi đổi phòng
    if (selectedSeats.length > 0) {
      fetch(`${process.env.REACT_APP_API_URL}/clear_reserved`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.ID,
          day: formatDate(selectedDate),
          time: selectedTime,
        }),
      })
        .then(() => {
          console.log("🧹 Đã clear ghế reserved khi đổi phòng");
          setSelectedSeats([]);
          setSeats((prev) =>
            prev.map((row) =>
              row.map((seat) => (seat === "reserved" ? "available" : seat)),
            ),
          );
          setCountdown(0);
          clearInterval(countdownRef.current);
        })
        .catch((err) => console.error("❌ Lỗi khi clear_reserved:", err));
    }

    setSelectedRoom(newRoom);
    onSeatSelect(newRoom, []); // reset ghế khi đổi phòng
  };

  // 🟡 Giữ ghế tạm thời
  const handleSeatClick = (i, j) => {
    if (!user || !selectedDate || !selectedTime) {
      alert("Vui lòng chọn ngày và giờ chiếu trước!");
      return;
    }

    const seatStatus = seats[i][j];

    if (seatStatus === "booked") {
      alert("Ghế này đã được đặt!");
      return;
    }

    if (seatStatus === "reserved") {
      alert("Ghế đang được giữ tạm thời!");
      return;
    }

    // ✅ Cập nhật giao diện tạm thời
    const updatedSeats = seats.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === i && cIdx === j ? "reserved" : cell)),
    );
    setSeats(updatedSeats);
    setSelectedSeats((prev) => [...prev, { line: i, col: j }]);
    onSeatSelect(selectedRoom, updatedSeats);

    // ✅ Chuẩn hóa format ngày theo MySQL
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    };

    fetch(`${process.env.REACT_APP_API_URL}/slot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room_id: selectedRoom,
        line: i + 1,
        col: j + 1,
        day: formatDate(selectedDate),
        time: selectedTime,
        user_id: user.ID,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Không thể giữ ghế!");
        }
        return res.json();
      })
      .then((result) => {
        if (result.success) {
          // Nếu countdown chưa chạy thì bắt đầu
          // Nếu countdown đang chạy thì reset lại 5 phút
          if (countdown === 0) {
            startCountdown();
          } else {
            setCountdown(300);
          }
        }
      })

      .catch((err) => {
        console.error("❌ Lỗi khi giữ ghế:", err);
        alert("Có lỗi khi giữ ghế. Vui lòng thử lại.");

        // ❌ Nếu lỗi, revert lại giao diện
        setSeats((prev) =>
          prev.map((row, rIdx) =>
            row.map((cell, cIdx) =>
              rIdx === i && cIdx === j ? "available" : cell,
            ),
          ),
        );
        setSelectedSeats((prev) =>
          prev.filter((seat) => !(seat.line === i && seat.col === j)),
        );
      });
  };

  // 🔵 Bắt đầu countdown
  const startCountdown = () => {
    setCountdown(300); // 5 phút
  };

  // 🔵 Giảm countdown mỗi giây
  useEffect(() => {
    if (countdown <= 0) return;
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [countdown]);

  // 🔴 Hết giờ → xoá ghế reserved
  useEffect(() => {
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    };

    if (countdown === 0 && selectedSeats.length > 0) {
      fetch(`${process.env.REACT_APP_API_URL}/clear_reserved`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.ID,
          day: formatDate(selectedDate),
          time: selectedTime,
        }),
      })
        .then(() => {
          setSelectedSeats([]);
          setSeats((prev) =>
            prev.map((r) => r.map((c) => (c === "reserved" ? "available" : c))),
          );
        })
        .catch((err) => console.error("❌ Lỗi clear_reserved:", err));
    }
  }, [countdown]);

  // 🔴 Khi người dùng rời trang (component unmount) → clear ghế reserved và countdown
  useEffect(() => {
    return () => {
      if (hasReservedRef.current && selectedDate && selectedTime && user) {
        const formatDate = (dateStr) => {
          if (!dateStr) return "";
          const [day, month, year] = dateStr.split("/");
          return `${year}-${month}-${day}`;
        };

        fetch(`${process.env.REACT_APP_API_URL}/clear_reserved`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.ID,
            day: formatDate(selectedDate),
            time: selectedTime,
          }),
        })
          .then(() =>
            console.log("🧹 Đã clear ghế reserved khi rời trang BookTicket"),
          )
          .catch((err) => console.error("❌ Lỗi khi clear_reserved:", err));
      }

      // 🕒 Dừng và reset countdown
      clearInterval(countdownRef.current);
      setCountdown(0);
    };
  }, [selectedTime]);

  return (
    <div className="seat-selection-container">
      <div className="seat-header">
        <label>Phòng chiếu:</label>
        <select value={selectedRoom || ""} onChange={handleRoomChange}>
          {rooms.map((r) => (
            <option key={r} value={r}>
              Phòng {r}
            </option>
          ))}
        </select>
      </div>

      {/* 🪑 Lưới ghế */}
      <div className="seat-grid">
        {seats.map((line, i) => (
          <div key={i} className="seat-line">
            {line.map((status, j) => (
              <img
                key={j}
                src={
                  status === "booked"
                    ? require("../../assets/images/Chair/booked.png")
                    : status === "reserved"
                      ? require("../../assets/images/Chair/reserved.png")
                      : require("../../assets/images/Chair/available.png")
                }
                alt={status}
                className={`seat-icon ${status}`}
                onClick={() => handleSeatClick(i, j)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* 🟤 Chú thích */}
      <div className="seat-legend">
        <div className="legend-item">
          <img
            src={require("../../assets/images/Chair/booked.png")}
            alt="Đã đặt"
            className="legend-icon"
          />
          <span>Đã đặt</span>
        </div>
        <div className="legend-item">
          <img
            src={require("../../assets/images/Chair/reserved.png")}
            alt="Chờ thanh toán"
            className="legend-icon"
          />
          <span>Chờ thanh toán</span>
        </div>
        <div className="legend-item">
          <img
            src={require("../../assets/images/Chair/available.png")}
            alt="Còn trống"
            className="legend-icon"
          />
          <span>Còn trống</span>
        </div>
      </div>

      {/* 🕒 Thông báo giữ ghế nổi */}
      <div className={`countdown-toast ${countdown > 0 ? "show" : "hide"}`}>
        ⏰ Giữ ghế trong:{" "}
        <strong>
          {Math.floor(countdown / 60)}:
          {(countdown % 60).toString().padStart(2, "0")}
        </strong>
      </div>
    </div>
  );
}

export default SeatSelection;
