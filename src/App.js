import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import HomePage from "./components/HomePage/HomePage";
import FilmsPage from "./components/FilmsPage/FilmsPage";
import GoodsPage from "./components/GoodsPage/GoodsPage";
import Membership from "./components/Membership/Membership";

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/films" element={<FilmsPage />} />
        <Route path="/goods" element={<GoodsPage />} />
        <Route path="/goods" element={<GoodsPage />} />
        <Route path="/membership" element={<Membership />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
