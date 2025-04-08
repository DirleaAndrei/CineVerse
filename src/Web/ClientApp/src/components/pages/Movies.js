import React, { Component } from "react";
import { Container, Pagination, Row } from "react-bootstrap";
import { MovieClient } from "../../web-api-client.ts";
import { MovieCard } from "../page-components/MovieCard.js";

export class Movies extends Component {
  static displayName = Movies.name;

  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      loading: false,
      pageNumber: 1,
      totalPages: 0,
    };
  }

  componentDidMount() {
    this.populateMoviesData(this.state.pageNumber);
  }

  static renderMovies(movies) {
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
  }

  renderPagination() {
    const { pageNumber, totalPages } = this.state;
    const maxPagesToShow = 8; // Maximum number of pagination items to display
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than or equal to maxPagesToShow
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calculate start and end pages
      const halfRange = Math.floor(maxPagesToShow / 2);
      if (pageNumber <= halfRange) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (pageNumber + halfRange >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = pageNumber - halfRange;
        endPage = pageNumber + halfRange - 1;
      }
    }

    let items = [];
    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === pageNumber}
          onClick={() => this.handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return (
      <Pagination>
        <Pagination.Prev
          onClick={() => this.handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
        />
        {items}
        <Pagination.Next
          onClick={() => this.handlePageChange(pageNumber + 1)}
          disabled={pageNumber === totalPages}
        />
      </Pagination>
    );
  }

  handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > this.state.totalPages) return;
    this.setState({ pageNumber }, () => this.populateMoviesData(pageNumber));
  };

  async populateMoviesData(pageNumber) {
    this.setState({ loading: true });
    let client = new MovieClient();
    const data = await client.getMovies(pageNumber);
    this.setState({
      movies: data.items,
      totalPages: data.totalPages,
      pageNumber: data.pageNumber,
      loading: false,
    });
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
        {this.renderPagination()}
      </div>
    );
  }
}
