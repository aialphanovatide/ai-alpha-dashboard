import React from "react";
import "./Pagination.css";

const Pagination = ({ totalArticles, articlesPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalArticles / articlesPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage > 3 && currentPage < totalPages - 2) {
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      } else {
        pageNumbers.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      }
    }
    return pageNumbers;
  };

  const handleClick = (page) => {
    if (page !== '...') {
      setCurrentPage(page);
    }
  };

  return (
    <div className="pagination">
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          className={`page-button ${currentPage === page ? "active" : ""}`}
          onClick={() => handleClick(page)}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
