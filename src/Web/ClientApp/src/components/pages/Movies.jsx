import React, { useEffect, useState } from "react";
import { Container, Row, Spinner } from "react-bootstrap";
import { MovieClient } from "../../web-api-client.ts";
import { MovieCardComponent } from "../shared/MovieCardComponent.jsx";
import { PaginationComponent } from "../shared/PaginationComponent.jsx";
import { processApiResponse } from "../utils/Utils.js";

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
    const data = await processApiResponse(client.getMovies(pageNumber));
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
    if (loading)
      return (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "100px" }}
        >
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );

    if (!movies || movies.length === 0) {
      return <p>No Movies at the moment! 🎥❌</p>;
    }

    return (
      <Container>
        <Row>
          {movies.map((movie) => (
            <MovieCardComponent key={movie.id} movie={movie} />
          ))}
        </Row>
      </Container>
    );
  };

  return (
    <div>
      <h1 id="tableLabel">Popular Movies</h1>
      <>
        {renderMovies(movies)}
        <PaginationComponent
          pageNumber={pageNumber}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </>
    </div>
  );
};
