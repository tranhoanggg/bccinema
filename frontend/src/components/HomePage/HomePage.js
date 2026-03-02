import React, { useEffect } from "react";
import MovieSlider from "../MovieSlider/MovieSlider";
import MovieList from "../MovieList/MovieList";
import ComboList from "../ComboList/ComboList";
import EndowList from "../EndowList/EndowList";
import IncomingMovieList from "../IncomingMovieList/IncomingMovieList";

function HomePage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <React.Fragment>
      <MovieSlider />
      <MovieList />
      <ComboList />
      <EndowList />
      <IncomingMovieList />
    </React.Fragment>
  );
}

export default HomePage;
