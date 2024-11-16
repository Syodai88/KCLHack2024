import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxPagesToShow = 5;
  const pageNumbers = [];

  // 最初と最後のページを常に表示
  if (currentPage > 1) pageNumbers.push(1);
  if (currentPage > 2) pageNumbers.push('...');

  // 前後2ページと現在のページを表示
  for (let i = Math.max(2, currentPage - 2); i <= Math.min(currentPage + 2, totalPages - 1); i++) {
    pageNumbers.push(i);
  }

  if (currentPage < totalPages - 1) pageNumbers.push('...');
  if (currentPage < totalPages) pageNumbers.push(totalPages);

  return (
    <div className="mt-4 flex justify-center">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 mx-1 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
      >
        前へ
      </button>
      {pageNumbers.map((number, index) =>
        typeof number === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(number)}
            className={`px-3 py-1 mx-1 ${number === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'} rounded hover:bg-gray-400`}
          >
            {number}
          </button>
        ) : (
          <span key={index} className="px-3 py-1 mx-1">...</span>
        )
      )}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 mx-1 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
      >
        次へ
      </button>
    </div>
  );
};

export default Pagination;
