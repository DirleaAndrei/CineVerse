import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { MovieClient } from "../../web-api-client.ts";
import { MovieCard } from "../shared/MovieCard.js";
import { PaginationComponent } from "../shared/PaginationComponent.js";
import { ServerError } from "./ErrorPages/ServerError.js";

export const SearchMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query") || " ";
    const genre = parseInt(urlParams.get("genreId")) || 0;

    populateMoviesData(query, genre, pageNumber);
  }, [pageNumber]);

  const populateMoviesData = async (query, genreId, pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      let client = new MovieClient();
      const data = await client.searchMovies(query, genreId, pageNumber);
      setMovies(data.items);
      setTotalPages(data.totalPages);
      setPageNumber(data.pageNumber);
      setLoading(false);
    } catch (err) {
      setError("Failed to load movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPageNumber) => {
    if (newPageNumber < 1 || newPageNumber > totalPages) return;
    setPageNumber(newPageNumber);
  };

  const renderMovies = (movies) => {
    if (!movies || movies.length === 0) {
      return <p>No Movies at the moment! 🎥❌</p>;
    }

    return (
      <Container>
        <Row>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </Row>
      </Container>
    );
  };

  if (error) {
    return (
      <ServerError
        message={error}
        onRetry={() => populateMoviesData(pageNumber)}
      />
    );
  }

  return (
    <div>
      <h1 id="tableLabel">Movie Results</h1>
      {loading ? (
        <p>
          <em>Loading...</em>
        </p>
      ) : (
        <>
          {renderMovies(movies)}
          <PaginationComponent
            pageNumber={pageNumber}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};
