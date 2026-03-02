import React, { useEffect, useState } from "react";
import "./LoadingPopup.css";

/**
 * props:
 *  - duration: tổng thời gian loading (ms), mặc định 3000
 *  - onFinish: callback khi loading hoàn tất (progress = 100)
 */
export default function LoadingPopup({ duration = 2000, onFinish }) {
  const [progress, setProgress] = useState(0);
  const [animEnds, setAnimEnds] = useState(0); // đếm overlay animationend
  const [overlayComplete, setOverlayComplete] = useState(false);

  // Khi cả 2 overlay hoàn thành animation thì bật overlayComplete
  useEffect(() => {
    if (animEnds >= 2) {
      setOverlayComplete(true);
    }
  }, [animEnds]);

  // Bắt đầu tăng progress CHỈ KHI overlayComplete = true
  useEffect(() => {
    if (!overlayComplete) return;

    const tick = 30; // ms
    const steps = Math.max(1, Math.floor(duration / tick));
    const increment = 100 / steps;
    let current = 0;

    const id = setInterval(() => {
      current += increment;
      if (current >= 100) {
        setProgress(100);
        clearInterval(id);
        // gọi callback sau một chút để cho UI có thời gian hoàn tất (tweak nếu cần)
        setTimeout(() => {
          if (typeof onFinish === "function") onFinish();
        }, 200);
      } else {
        // làm tròn để tránh hiển thị % lẻ quá nhiều
        setProgress(Math.min(99, Math.round(current)));
      }
    }, tick);

    return () => clearInterval(id);
  }, [overlayComplete, duration, onFinish]);

  const handleOverlayAnimEnd = () => {
    setAnimEnds((c) => c + 1);
  };

  return (
    <div className="loading-container" aria-hidden={false}>
      {/* 2 overlay tràn vào từ 2 phía */}
      <div
        className={`overlay-left ${overlayComplete ? "done" : ""}`}
        onAnimationEnd={handleOverlayAnimEnd}
      />
      <div
        className={`overlay-right ${overlayComplete ? "done" : ""}`}
        onAnimationEnd={handleOverlayAnimEnd}
      />

      {/* Khi cả hai overlay đã chạm nhau, hiển thị 1 lớp full cover để tránh khe */}
      {overlayComplete && <div className="overlay-full" />}

      {/* Loading popup: chỉ visible khi overlayComplete = true */}
      <div className={`loading-popup ${overlayComplete ? "visible" : ""}`}>
        <h2 className="loading-text">Đang khởi động hệ thống...</h2>

        <div className="progress-bar" aria-hidden>
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={progress}
          />
        </div>

        <p className="progress-percent">{progress}%</p>
      </div>
    </div>
  );
}
