import React from "react";
import { Button, Container } from "react-bootstrap";

export const ServerError = ({ message, onRetry }) => {
  return (
    <Container className="text-center mt-5">
      <h1>Something Went Wrong 😢</h1>
      <p>
        {message || "An unexpected error occurred. Please try again later."}
      </p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Retry
        </Button>
      )}
      <div className="mt-3">
        <Button
          variant="secondary"
          onClick={() => (window.location.href = "/")}
        >
          Return to Home
        </Button>
      </div>
    </Container>
  );
};
