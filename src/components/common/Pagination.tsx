import React from 'react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    totalItems?: number
    limit: number
    isLoading?: boolean
    onPageChange: (page: number) => void
    onLimitChange: (limit: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    limit,
    isLoading = false,
    onPageChange,
    onLimitChange,
}) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1)
        }
    }

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1)
        }
    }

    const getPageNumbers = () => {
        const pages: number[] = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages is less than or equal to max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Show smart pagination
            if (currentPage <= 3) {
                // Show first 5 pages
                for (let i = 1; i <= maxVisiblePages; i++) {
                    pages.push(i)
                }
            } else if (currentPage >= totalPages - 2) {
                // Show last 5 pages
                for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                // Show current page and 2 pages on each side
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pages.push(i)
                }
            }
        }

        return pages
    }

    if (totalPages <= 0) {
        return null
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-6 md:px-6 xl:px-7.5 border-t border-stroke dark:border-strokedark gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing page {currentPage} of {totalPages}
                {totalItems && ` (${totalItems} total items)`}
            </div>

            <div className="flex items-center gap-3">
                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                    <label htmlFor="limit-select" className="text-sm text-gray-600 dark:text-gray-400">
                        Per page:
                    </label>
                    <select
                        id="limit-select"
                        value={limit}
                        onChange={(e) => onLimitChange(Number(e.target.value))}
                        className="px-3 py-1.5 border border-stroke rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-boxdark dark:border-strokedark dark:text-white text-sm"
                    >
                        <option value={8}>8</option>
                        <option value={12}>12</option>
                        <option value={16}>16</option>
                        <option value={24}>24</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                {/* Pagination controls */}
                <div className="flex gap-2">
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1 || isLoading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                        Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-1">
                        {getPageNumbers().map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                disabled={isLoading}
                                className={`px-3 py-2 rounded-md transition-colors text-sm ${
                                    currentPage === pageNum
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                } disabled:cursor-not-allowed`}
                            >
                                {pageNum}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={currentPage >= totalPages || isLoading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Pagination
