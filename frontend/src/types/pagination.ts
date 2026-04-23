export interface PaginatedResponse<T> {
    data: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}
