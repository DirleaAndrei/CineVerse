import React, { Component } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

export class Home extends Component {
  render() {
    return (
      <Container className="my-5">
        <h1 className="text-center text-primary mb-4">
          Welcome to CineVerse 🎥
        </h1>

        <Card className="mb-4">
          <Card.Body>
            <Card.Text>
              <strong>CineVerse</strong> is your ultimate destination for
              exploring a wide range of movies using data powered by{" "}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                TMDb (The Movie Database)
              </a>
              .
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <Card.Title>🔥 Explore the Latest & Most Popular Movies</Card.Title>
            <Card.Text>
              Stay up to date with trending movies. Browse the most popular
              films currently making waves around the world.
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <Card.Title>🔍 Search by Movie Name</Card.Title>
            <Card.Text>
              Looking for something specific? Use the powerful search feature to
              find any movie by its title instantly.
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <Card.Title>🎭 Filter by Genre</Card.Title>
            <Card.Text>
              Whether you're in the mood for action, comedy, horror, or romance,
              CineVerse lets you browse all movies by genre with ease.
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <Card.Title>💬 Comments & Reviews</Card.Title>
            <Card.Text>
              Dive into the discussion! On each movie's detail page, you can
              read user comments or share your own thoughts about the film.
            </Card.Text>
          </Card.Body>
        </Card>

        <Row className="mt-5">
          <Col className="text-center text-muted">
            🚀 Start discovering your next favorite movie now with{" "}
            <strong>CineVerse</strong>!
          </Col>
        </Row>
      </Container>
    );
  }
}
