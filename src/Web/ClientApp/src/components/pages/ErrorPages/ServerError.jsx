import React from "react";
import { Button, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";

export const ServerError = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const errorDetails = queryParams.get("error")
      ? JSON.parse(decodeURIComponent(queryParams.get("error")))
      : null;

  return (
    <Container className="text-center mt-5">
      <h1>Something Went Wrong 😢</h1>
      {errorDetails ? (
        <div>
          <p>
            <strong>Status:</strong> {errorDetails.status}
          </p>
          <p>
            <strong>Message:</strong> {errorDetails.message}
          </p>
          <p>
            <strong>Details:</strong> {errorDetails.details}
          </p>
        </div>
      ) : (
        <p>An unexpected server error occurred.</p>
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
