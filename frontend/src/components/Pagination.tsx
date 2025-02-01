import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

interface PaginationProps {
  total: number;
  perPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  total,
  perPage,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(total / perPage);

  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <PageButton
          key={1}
          page={1}
          isActive={currentPage === 1}
          onClick={onPageChange}
        />
      );
      if (startPage > 2) pages.push(<span key="start-ellipsis">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PageButton
          key={i}
          page={i}
          isActive={currentPage === i}
          onClick={onPageChange}
        />
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1)
        pages.push(<span key="end-ellipsis">...</span>);
      pages.push(
        <PageButton
          key={totalPages}
          page={totalPages}
          isActive={currentPage === totalPages}
          onClick={onPageChange}
        />
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2">
      <PageButton
        page={currentPage - 1}
        onClick={onPageChange}
        disabled={currentPage === 1}
        className="!px-2"
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </PageButton>

      <div className="hidden sm:flex items-center space-x-1 sm:space-x-2">
        {renderPageNumbers()}
      </div>

      <div className="flex sm:hidden items-center space-x-1">
        <span className="text-sm text-secondary-600">
          {currentPage}/{totalPages}
        </span>
      </div>

      <PageButton
        page={currentPage + 1}
        onClick={onPageChange}
        disabled={currentPage === totalPages}
        className="!px-2"
      >
        <ChevronRightIcon className="w-4 h-4" />
      </PageButton>
    </div>
  );
}

interface PageButtonProps {
  page: number;
  isActive?: boolean;
  disabled?: boolean;
  onClick: (page: number) => void;
  children?: React.ReactNode;
  className?: string;
}

function PageButton({
  page,
  isActive,
  disabled,
  onClick,
  children,
  className = "",
}: PageButtonProps) {
  return (
    <motion.button
      onClick={() => onClick(page)}
      disabled={disabled}
      className={`
        px-3 py-1 rounded-md text-sm font-medium
        ${
          isActive
            ? "bg-primary-600 text-white"
            : "bg-white text-secondary-600 hover:bg-secondary-50"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
    >
      {children || page}
    </motion.button>
  );
}
