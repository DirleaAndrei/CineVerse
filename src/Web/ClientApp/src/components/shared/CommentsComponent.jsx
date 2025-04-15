import React, { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { MovieClient, ProfileClient } from "../../web-api-client.ts";
import { processApiResponse } from "../utils/Utils.js";

export const CommentsComponent = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [commentTree, setCommentTree] = useState({});
  const [newComments, setNewComments] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments(movieId);
    checkIfUserIsLoggedIn();
  }, []);

  const fetchComments = async (movieId) => {
    setLoading(true);
    let client = new MovieClient();
    const movieComments = await processApiResponse(client.getComments(movieId));
    setComments(movieComments);
    setLoading(false);
  };

  const checkIfUserIsLoggedIn = async () => {
    let client = new ProfileClient();
    let isUserLoggedIn = await processApiResponse(client.getIsUserLoggedIn());
    setIsLoggedIn(isUserLoggedIn);
  };

  useEffect(() => {
    // Build a tree structure from the flat comments array
    const buildCommentTree = (comments) => {
      const commentMap = {}; // Map to store comments by their ID
      const tree = {}; // Final tree structure

      // Initialize the map with all comments
      comments.forEach((comment) => {
        commentMap[comment.id] = { ...comment, replies: [] };
      });

      // Build the tree structure
      comments.forEach((comment) => {
        if (comment.parentCommentId) {
          // If the comment has a parent, add it to the parent's replies
          const parent = commentMap[comment.parentCommentId];
          if (parent) {
            parent.replies.push(commentMap[comment.id]);
          }
        } else {
          // If the comment has no parent, it's a root comment
          tree[comment.id] = commentMap[comment.id];
        }
      });
      return tree;
    };

    setCommentTree(buildCommentTree(comments));
  }, [comments]);

  const handleInputChange = (commentId, value) => {
    setNewComments((prev) => ({
      ...prev,
      [commentId]: value,
    }));
  };

  const postComment = async (parentCommentId) => {
    const newCommentText = newComments[parentCommentId] || "";
    if (newCommentText.trim() === "") return;

    const newComment = {
      movieId: movieId,
      text: newCommentText,
      parentCommentId: Number(parentCommentId) || null,
    };

    let client = new MovieClient();
    let comment = await processApiResponse(client.createComment(newComment));
    delete newComments[parentCommentId];
    setComments([...comments, comment]);
  };

  const renderComments = (comments) => {
    return Object.values(comments).map((comment) => (
      <ListGroup.Item key={comment.id} className="border-0">
        <Card className="mb-3">
          <Card.Body>
            <Row className="align-items-start">
              <Col xs={12}>
                <div className="text-muted small mb-1">
                  <strong>{comment.authorName || "Unknown"}</strong> on{" "}
                  {new Date(comment.created).toLocaleString()}
                </div>
                <Card.Text>{comment.text}</Card.Text>
              </Col>
            </Row>
          </Card.Body>

          {/* Reply Input Section */}
          {isLoggedIn && (
            <Card.Footer>
              <Form>
                <Row>
                  <Col xs={9} sm={10}>
                    <Form.Control
                      type="text"
                      placeholder="Add a reply..."
                      value={newComments[comment.id] || ""}
                      onChange={(e) =>
                        handleInputChange(comment.id, e.target.value)
                      }
                    />
                  </Col>
                  <Col xs={3} sm={2} className="d-flex justify-content-end">
                    <Button
                      variant="primary"
                      onClick={() => postComment(comment.id)}
                    >
                      Reply
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Footer>
          )}

          {/* Nested Replies Section */}
          {comment.replies && comment.replies.length > 0 && (
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  View {comment.replies.length}{" "}
                  {comment.replies.length > 1 ? "replies" : "reply"}
                </Accordion.Header>
                <Accordion.Body>
                  <ListGroup className="ms-4">
                    {renderComments(comment.replies)}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          )}
        </Card>
      </ListGroup.Item>
    ));
  };

  const renderAddNewComment = () => {
    return (
      <Card className="mt-3">
        <Card.Body>
          <Form>
            <Row>
              <Col xs={9} sm={10}>
                <Form.Control
                  type="text"
                  placeholder="Add a new comment..."
                  value={newComments["new"] || ""}
                  onChange={(e) => handleInputChange("new", e.target.value)}
                />
              </Col>
              <Col xs={3} sm={2} className="d-flex justify-content-end">
                <Button variant="success" onClick={() => postComment("new")}>
                  Add
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    );
  };

  if ((!comments || Object.keys(commentTree).length === 0) && !isLoggedIn) {
    return <p>No comments available.</p>;
  }

  return (
    <>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "100px" }}
        >
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div className="comments-component">
          <ListGroup>{renderComments(commentTree)}</ListGroup>
          {/* Input for adding a new top-level comment */}
          {isLoggedIn && renderAddNewComment()}
        </div>
      )}
    </>
  );
};
