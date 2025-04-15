import React, { useEffect, useState } from "react";
import { Accordion, Badge, Col, Container, Image, Row } from "react-bootstrap";
import { MovieClient, ProfileClient } from "../../web-api-client.ts";
import { CommentsComponent } from "../shared/CommentsComponent.jsx";
import { processApiResponse } from "../utils/Utils.js";

export const MovieDetails = () => {
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkIfUserIsLoggedIn();
    populateMovieDetailsData();
  }, []);

  const checkIfUserIsLoggedIn = async () => {
    setLoading(true);
    let client = new ProfileClient();
    let isUserLoggedIn = await processApiResponse(client.getIsUserLoggedIn());
    setIsLoggedIn(isUserLoggedIn);
    setLoading(false);
  };

  const populateMovieDetailsData = async () => {
    setLoading(true);
    let client = new MovieClient();
    const match = window.location.href.match(/\/(\d+)$/);
    if (match) {
      const movieId = parseInt(match[1], 10);
      const data = await processApiResponse(client.getMovieDetails(movieId));
      setMovie(data);

      // Fetch comments for the movie
      await fetchComments(movieId);
      setLoading(false);
    }
  };

  const fetchComments = async (movieId) => {
    let commentClient = new MovieClient();
    const movieComments = await processApiResponse(
      commentClient.getComments(movieId)
    );
    setComments(movieComments); // Update the comments state
  };

  const handleAddComment = async (parentCommentId, commentText) => {
    if (!commentText.trim()) return;

    const newComment = {
      movieId: movie.id,
      text: commentText,
      parentCommentId: Number(parentCommentId) || null,
    };
    await postComment(newComment);
  };

  const postComment = async (newComment) => {
    let commentClient = new MovieClient();
    await processApiResponse(commentClient.createComment(newComment));
    window.location.reload(); // Reload the page to fetch updated comments
  };

  const renderMovieDetails = (movie) => {
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
            <CommentsComponent
              comments={comments}
              isLoggedIn={isLoggedIn}
              onAddComment={handleAddComment}
            />
          </Col>
        </Row>
      </Container>
    );
  };

  return (
    <>
      {loading ? (
        <p>
          <em>Loading...</em>
        </p>
      ) : (
        renderMovieDetails(movie)
      )}
    </>
  );
};
