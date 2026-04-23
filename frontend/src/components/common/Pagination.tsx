import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    itemsPerPage?: number;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const showMax = 5;

        if (totalPages <= showMax) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('ellipsis-start');
            
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }
            
            if (currentPage < totalPages - 2) pages.push('ellipsis-end');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2 py-4 border-t border-gray-100">
            {/* Info */}
            <div className="text-sm text-gray-500">
                {totalItems !== undefined && itemsPerPage !== undefined ? (
                    <>
                        Showing <span className="font-semibold text-gray-900">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span> to{' '}
                        <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
                        <span className="font-semibold text-gray-900">{totalItems}</span> results
                    </>
                ) : (
                    <>Page <span className="font-semibold text-gray-900">{currentPage}</span> of <span className="font-semibold text-gray-900">{totalPages}</span></>
                )}
            </div>

            {/* Controls */}
            <nav className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => {
                        if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                            return (
                                <div key={`ellipsis-${index}`} className="w-9 h-9 flex items-center justify-center text-gray-400">
                                    <MoreHorizontal className="w-4 h-4" />
                                </div>
                            );
                        }

                        const pageNum = page as number;
                        const isActive = currentPage === pageNum;

                        return (
                            <button
                                key={`page-${pageNum}`}
                                onClick={() => onPageChange(pageNum)}
                                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200 pointer-events-none'
                                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-transparent'
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </nav>
        </div>
    );
}
