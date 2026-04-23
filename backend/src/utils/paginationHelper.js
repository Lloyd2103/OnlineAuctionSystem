/**
 * Returns pagination options (limit and offset) for Sequelize
 * @param {number|string} page 
 * @param {number|string} limit 
 * @returns {object}
 */
export const getPagination = (page, limit) => {
    const defaultLimit = 10;
    const l = limit ? parseInt(limit, 10) : defaultLimit;
    const p = page ? parseInt(page, 10) : 1;
    const offset = (p - 1) * l;

    return { limit: l, offset };
};

/**
 * Formats the response with pagination data
 * @param {object} result - The result from findAndCountAll
 * @param {number} page - Current page
 * @param {number} limit - Number of records per page
 * @returns {object}
 */
export const getPagingData = (result, page, limit) => {
    const { count: totalItems, rows: data } = result;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, data, totalPages, currentPage };
};
