import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = [];
  const maxVisiblePages = window.innerWidth < 640 ? 4 : 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 mb-4 px-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="cursor-pointer flex items-center gap-1 px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition whitespace-nowrap"
        aria-label="Página anterior"
      >
        <BsChevronLeft size={14} />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      <div className="flex items-center gap-1">
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="cursor-pointer min-w-[36px] sm:min-w-[40px] px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              1
            </button>
            {startPage > 2 && <span className="px-1 sm:px-2 text-gray-500 text-xs sm:text-sm">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`cursor-pointer min-w-[36px] sm:min-w-[40px] px-2 sm:px-3 py-2 text-sm font-medium rounded-lg transition ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-1 sm:px-2 text-gray-500 text-xs sm:text-sm">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="cursor-pointer min-w-[36px] sm:min-w-[40px] px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="cursor-pointer flex items-center gap-1 px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition whitespace-nowrap"
        aria-label="Próxima página"
      >
        <span className="hidden sm:inline">Próxima</span>
        <BsChevronRight size={14} />
      </button>
    </div>
  );
}