import React from 'react';

import './Pagination.css';
const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button
              type="submit"
              onClick={() => {
                paginate(number);
                window.scrollTo(0, 0);
              }}
              className={`page-number ${number === currentPage ? 'active' : ''}`}
            >
              {number}
            </button>{' '}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
