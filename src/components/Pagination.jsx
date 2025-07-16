import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Calculate start and end of page range
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // If we're at the start, show more pages after
    if (currentPage <= 2) {
      endPage = Math.min(totalPages - 1, 4);
    }
    
    // If we're at the end, show more pages before
    if (currentPage >= totalPages - 1) {
      startPage = Math.max(2, totalPages - 3);
    }
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pageNumbers.push('...');
    }
    
    // Add pages in range
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <nav className="flex items-center justify-center space-x-1.5 bg-white p-4 rounded-xl shadow-sm border border-gray-100" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`relative inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
          currentPage === 1
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:shadow-sm'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span className="sr-only">Previous</span>
      </button>

      {getPageNumbers().map((number, idx) => (
        number === '...' ? (
          <span key={`ellipsis-${idx}`} className="relative inline-flex items-center justify-center w-9 h-9 text-sm font-medium text-gray-500">
            •••
          </span>
        ) : (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`relative inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentPage === number
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md transform scale-105'
                : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:shadow-sm'
            }`}
            aria-current={currentPage === number ? 'page' : undefined}
          >
            {number}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`relative inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
          currentPage === totalPages
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:shadow-sm'
        }`}
      >
        <span className="sr-only">Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </nav>
  );
};

export default Pagination;
