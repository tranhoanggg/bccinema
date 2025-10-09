import "./App.css";
import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import NavigationBar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import HomePage from "./components/HomePage/HomePage";
import FilmsPage from "./components/FilmsPage/FilmsPage";
import GoodsPage from "./components/GoodsPage/GoodsPage";
import Membership from "./components/Membership/Membership";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import LoadingPopup from "./components/LoadingPopup/LoadingPopup";
import FilmDetailPage from "./components/FilmDetailPage/FilmDetailPage";
import ComboDetailPage from "./components/ComboDetailPage/ComboDetailPage";

function AppContent() {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);

  const handleMemberClick = () => {
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
      navigate("/login");
    }, 3200);
  };

  return (
    <>
      <NavigationBar onMemberClick={handleMemberClick} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/films" element={<FilmsPage />} />
        <Route path="/goods" element={<GoodsPage />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/login" element={<LoginPopup />} />
        <Route path="/film/:id" element={<FilmDetailPage />} />
        <Route path="/combo/:id" element={<ComboDetailPage />} />
      </Routes>
      {showLoading && <LoadingPopup />}
      <Footer />
    </>
  );
}

export default AppContent;
