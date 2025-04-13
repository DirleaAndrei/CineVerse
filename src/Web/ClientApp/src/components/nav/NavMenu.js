import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Col,
  Collapse,
  Form,
  Input,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Row,
} from "reactstrap";
import { MovieGenres } from "../utils/Utils";
import "./NavMenu.css";

export class NavMenu extends Component {
  static displayName = NavMenu.name;
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleGenreIdChange = this.handleGenreIdChange.bind(this);

    this.state = {
      collapsed: true,
      searchQuery: "",
      genreId: 0, // Default genre ID
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  handleSearchChange(event) {
    this.setState({ searchQuery: event.target.value });
  }

  handleGenreIdChange(event) {
    this.setState({ genreId: event.target.value });
  }

  handleSearchSubmit(event) {
    event.preventDefault();
    // Redirect to the Movies page with the search query and type as parameters
    window.location.href = `/movies/search?query=${this.state.searchQuery}&genreId=${this.state.genreId}`;
  }

  render() {
    return (
      <header>
        <Navbar
          className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
          container
          light
        >
          <NavbarBrand tag={Link} to="/">
            Home
          </NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse
            className="d-sm-inline-flex flex-sm-row-reverse"
            isOpen={!this.state.collapsed}
            navbar
          >
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/movies">
                  Movies
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/fetch-data">
                  Get Weather
                </NavLink>
              </NavItem>
              <NavItem>
                <a
                  className="nav-link text-dark"
                  href="/Identity/Account/Manage"
                >
                  Account
                </a>
              </NavItem>
            </ul>

            {/* Search Form */}
            <Form
              inline
              onSubmit={this.handleSearchSubmit}
              className="d-flex w-100 justify-content-center w-100"
            >
              <Row className="w-100 gx-2 justify-content-center">
                <Col xs="12" sm="6" md="4" lg="4">
                  <Input
                    type="text"
                    placeholder="Search Movies..."
                    value={this.state.searchQuery}
                    onChange={this.handleSearchChange}
                    style={{ width: "100%" }}
                  />
                </Col>
                <Col xs="12" sm="4" md="3" lg="3">
                  <Input
                    type="select"
                    value={this.state.genreId}
                    onChange={this.handleGenreIdChange}
                    style={{ width: "100%" }}
                  >
                    {/* Default option */}
                    <option value="0">All genres</option>

                    {/* Dynamically generate options from MovieGenres */}
                    {Object.entries(MovieGenres).map(([name, id]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </Input>
                </Col>
                <Col xs="12" sm="2" md="2" lg="2">
                  <Button
                    color="primary"
                    disabled={
                      !this.state.searchQuery && this.state.genreId === 0
                    }
                    type="submit"
                    className="w-100"
                  >
                    Search
                  </Button>
                </Col>
              </Row>
            </Form>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}
