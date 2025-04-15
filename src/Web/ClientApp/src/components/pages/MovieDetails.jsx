import React, { useEffect, useState } from "react";
import {
  Accordion,
  Badge,
  Col,
  Container,
  Image,
  Row,
  Spinner,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { MovieClient } from "../../web-api-client.ts";
import { CommentsComponent } from "../shared/CommentsComponent.jsx";
import { processApiResponse } from "../utils/Utils.js";

export const MovieDetails = () => {
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);
  const { id: movieId } = useParams();

  useEffect(() => {
    populateMovieDetailsData();
  }, []);

  const populateMovieDetailsData = async () => {
    setLoading(true);
    let client = new MovieClient();
    const data = await processApiResponse(client.getMovieDetails(movieId));
    setMovie(data);
    setLoading(false);
  };

  const renderMovieDetails = (movie) => {
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

    if (!movie || Object.keys(movie).length === 0) {
      return <p>No movie details available! 🎥❌</p>;
    }

    return (
      <Container className="mt-4">
        <Row>
          {/* Movie Poster */}
          <Col md={4}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fluid
              rounded
            />
          </Col>

          {/* Movie Details */}
          <Col md={8}>
            <h2>{movie.title}</h2>
            <p>
              <Badge bg="info">{movie.original_language?.toUpperCase()}</Badge>{" "}
              <Badge bg="secondary">{movie.status}</Badge>{" "}
              <Badge bg="success">{movie.runtime} mins</Badge>
            </p>
            <p>
              <strong>Tagline:</strong> {movie.tagline || "N/A"}
            </p>
            <p>
              <strong>Overview:</strong> {movie.overview || "N/A"}
            </p>
            <p>
              <strong>Genres:</strong>{" "}
              {movie.genres?.map((genre) => (
                <Badge key={genre.id} bg="primary" className="me-1">
                  {genre.name}
                </Badge>
              )) || "N/A"}
            </p>
            <p>
              <strong>Release Date:</strong>{" "}
              {movie.release_date
                ? new Date(movie.release_date).toDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Popularity:</strong>{" "}
              {`${movie.popularity.toFixed(1)} 🌟` || "N/A"}
            </p>
            <p>
              <strong>Vote Average:</strong> {movie.vote_average || "N/A"} ⭐ |{" "}
              <strong>Vote Count:</strong> {movie.vote_count || 0} 🗳️
            </p>
            {/* Accordion for Production Companies */}
            <Accordion className="mt-4">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Production Companies</Accordion.Header>
                <Accordion.Body>
                  <ul>
                    {movie.production_companies?.map((company) => (
                      <li key={company.id}>
                        {company.logo_path && (
                          <Image
                            src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                            alt={company.name}
                            style={{ height: "30px", marginRight: "10px" }}
                          />
                        )}
                        {company.name} ({company.origin_country})
                        <br />
                        <br />
                      </li>
                    )) || <p>No production companies available.</p>}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
        {/* Comments Section */}
        <Row className="mt-4">
          <Col>
            <h3>Comments</h3>
            <CommentsComponent movieId={movieId} />
          </Col>
        </Row>
      </Container>
    );
  };

  return <>{renderMovieDetails(movie)}</>;
};
