import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Collapse,
  Form,
  Input,
  InputGroup,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
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
                <NavLink tag={Link} className="text-dark" to="/to-do-list">
                  To Do List
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
              className="d-flex ms-12"
            >
              <InputGroup>
                <Input
                  type="text"
                  placeholder="Search Movies..."
                  value={this.state.searchQuery}
                  onChange={this.handleSearchChange}
                  style={{ width: "11rem" }}
                />
                <Input
                  type="select"
                  value={this.state.genreId}
                  onChange={this.handleGenreIdChange}
                  style={{ width: "8rem" }}
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
                <Button
                  color="primary"
                  disabled={!this.state.searchQuery && this.state.genreId === 0}
                  type="submit"
                >
                  Search
                </Button>
              </InputGroup>
            </Form>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}
