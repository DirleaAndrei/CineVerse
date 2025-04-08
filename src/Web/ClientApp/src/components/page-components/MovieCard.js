import React from "react";
import { Card, Col, Row } from "react-bootstrap";

export const MovieCard = ({ movie }) => {
  return (
    <Card
      style={{ borderRadius: "8px", overflow: "hidden", cursor: "pointer" }}
      className="mb-4"
      onClick={() => (window.location.href = `/movie-details/${movie.id}`)}
    >
      <Row className="g-0">
        {/* Left Column: Poster */}
        <Col xs={4} md={3}>
          {movie.poster_Path ? (
            <Card.Img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_Path}`}
              alt={movie.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px 0 0 8px",
              }}
            />
          ) : (
            <Card.Img
              alt="No Poster Available"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px 0 0 8px",
              }}
            />
          )}
        </Col>

        {/* Right Column: Movie Details */}
        <Col xs={8} md={9}>
          <Card.Body>
            <Card.Title>
              {movie.title || "Untitled"} {movie.adult ? "🔞" : "👨‍👩‍👧‍👦"}
            </Card.Title>
            <Card.Text>
              <strong>Overview:</strong>{" "}
              {movie.overview || "No description available."} 📜
            </Card.Text>
            <Card.Text>
              <strong>Popularity:</strong> {movie.popularity.toFixed(1)} 🌟
            </Card.Text>
            <Card.Text>
              <strong>Release Date:</strong> {movie.release_Date || "TBA"} 📅
            </Card.Text>
            <Card.Text>
              <strong>Vote Average:</strong> {movie.vote_Average} ⭐ |{" "}
              <strong>Vote Count:</strong> {movie.vote_Count} 🗳️
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};
