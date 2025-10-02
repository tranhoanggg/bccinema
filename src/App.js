import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/Navbar/Navbar";
import MovieSlider from "./components/MovieSlider/MovieSlider";
import MovieList from "./components/MovieList/MovieList";
import ComboList from "./components/ComboList/ComboList";
import EndowList from "./components/EndowList/EndowList";
import IncomingMovieList from "./components/IncomingMovieList/IncomingMovieList";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <Router>
      <NavigationBar />
      <MovieSlider />
      <MovieList />
      <ComboList />
      <EndowList />
      <IncomingMovieList />
      <Footer />
    </Router>
  );
}

export default App;
