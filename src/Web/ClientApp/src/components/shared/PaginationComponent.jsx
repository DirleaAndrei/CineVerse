import React from "react";
import { Pagination } from "react-bootstrap";

export const PaginationComponent = ({ pageNumber, totalPages, onPageChange }) => {
  const maxPagesToShow = 8; // Maximum number of pagination items to display
  let startPage, endPage;

  if (totalPages <= maxPagesToShow) {
    startPage = 1;
    endPage = totalPages;
  } else {
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
        onClick={() => onPageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <Pagination>
      <Pagination.Prev
        onClick={() => onPageChange(pageNumber - 1)}
        disabled={pageNumber === 1}
      />
      {items}
      <Pagination.Next
        onClick={() => onPageChange(pageNumber + 1)}
        disabled={pageNumber === totalPages}
      />
    </Pagination>
  );
};
