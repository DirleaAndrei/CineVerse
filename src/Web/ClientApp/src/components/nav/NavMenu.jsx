import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Collapse,
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

export const NavMenu = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [genreId, setGenreId] = useState(0); // Default genre ID
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value) {
      setGenreId(0); // Reset genre if searchQuery is not empty
    }
  };

  const handleGenreIdChange = (event) => {
    setGenreId(Number(event.target.value));
    if (event.target.value !== 0) {
      setSearchQuery(""); // Reset searchQuery if a genre is selected
    }
  };

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
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse
          className="d-sm-inline-flex flex-sm-row-reverse"
          isOpen={!collapsed}
          navbar
        >
          <ul className="navbar-nav flex-grow">
            <NavItem>
              <Row className="w-100 gx-2 justify-content-center">
                <Col xs="12" sm="4" md="5" lg="4">
                  <Input
                    type="text"
                    placeholder="Search Movies..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    disabled={genreId !== 0} // Disable if a genre is selected
                    style={{ width: "100%" }}
                  />
                </Col>
                <Col xs="12" sm="5" md="3" lg="4">
                  <Input
                    type="select"
                    value={genreId}
                    onChange={handleGenreIdChange}
                    disabled={!!searchQuery} // Disable if searchQuery is not empty
                    style={{ width: "100%" }}
                  >
                    {/* Default option */}
                    <option value={0}>All genres</option>

                    {/* Dynamically generate options from MovieGenres */}
                    {Object.entries(MovieGenres).map(([name, id]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </Input>
                </Col>
                <Col xs="12" sm="3" md="3" lg="3">
                  <Button
                    color="primary"
                    disabled={!searchQuery && genreId === 0} // Disable if both are empty
                    onClick={() =>
                      navigate(
                        `/movies/search?query=${searchQuery}&genreId=${genreId}`
                      )
                    }
                    className="w-100"
                  >
                    Search
                  </Button>
                </Col>
              </Row>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} className="text-dark" to="/movies">
                Popular Movies
              </NavLink>
            </NavItem>
            <NavItem>
              <a className="nav-link text-dark" href="/Identity/Account/Manage">
                Account
              </a>
            </NavItem>
          </ul>
        </Collapse>
      </Navbar>
    </header>
  );
};
