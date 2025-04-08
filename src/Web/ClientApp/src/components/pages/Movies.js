import React, { Component } from "react";
import { Container, Row } from "react-bootstrap";
import { MovieClient } from "../../web-api-client.ts";
import { MovieCard } from "../page-components/MovieCard.js";

export class Movies extends Component {
  static displayName = Movies.name;

  constructor(props) {
    super(props);
    this.state = { movies: [], loading: false };
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("search");
    const genreId = params.get("genreId");

    if (searchQuery || genreId) {
      //   this.searchMovies(searchQuery, genreId);
    } else {
      this.populateMoviesData();
    }
  }

  static renderMovies(movies) {
    if (!movies || movies.length === 0) {
      return <p>No Movies at the moment! 🎥❌</p>;
    }

    if (Object.keys(movies).length === 0) {
      return <p>No Movies found! 🔍❌</p>;
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
  }

  render() {
    let contents = this.state.loading ? (
      <p>
        <em>Loading...</em>
      </p>
    ) : (
      Movies.renderMovies(this.state.movies)
    );

    return (
      <div>
        <h1 id="tableLabel">Top Movies</h1>
        {contents}
      </div>
    );
  }

  async populateMoviesData() {
    this.setState({ loading: true });
    let client = new MovieClient();
    const data = await client.getMovies();
    this.setState({ movies: data, loading: false });
  }

  //   async searchMovies(query, genderId) {
  //     this.setState({ loading: true });
  //     let client = new TheMovieDbClient();
  //     const data = await client.searchMoviesByName(query, Number(genderId));
  //     this.setState({ movies: data, loading: false });
  //   }
}
