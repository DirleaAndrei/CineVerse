import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { MovieClient } from "../../web-api-client.ts";
import { MovieCard } from "../shared/MovieCard.js";
import { PaginationComponent } from "../shared/PaginationComponent.js";

export const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    populateMoviesData(pageNumber);
  }, [pageNumber]);

  const populateMoviesData = async (pageNumber) => {
    setLoading(true);
    let client = new MovieClient();
    const data = await client.getMovies(pageNumber);
    setMovies(data.items);
    setTotalPages(data.totalPages);
    setPageNumber(data.pageNumber);
    setLoading(false);
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

  return (
    <div>
      <h1 id="tableLabel">Top Movies</h1>
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
