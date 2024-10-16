exports.filterProducts = (query, queryObj) => {
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    return query.find(JSON.parse(queryStr));
};

exports.searchProducts = (query, searchTerm, searchFieldTerm) => {
    if (searchTerm) {
        const searchFields = searchFieldTerm;
        const searchQuery = {
            $or: searchFields.map(field => ({
                [field]: { $regex: searchTerm, $options: 'i' }
            }))
        };
        return query.find(searchQuery);
    }
    return query;
};
exports.selectFields = (query, fields) => {
    if (fields) {
        const fieldList = fields.split(',').join(' ');
        return query.select(fieldList);
    } else {
        return query.select('-__v'); // Exclude __v by default
    }
};
exports.sortProducts = (query, sortBy) => {
    if (sortBy) {
        const sortFields = sortBy.split(',').join(' ');
        return query.sort(sortFields);
    } else {
        return query.sort('-createdAt');
    }
};
exports.paginateProducts = (query, page, limit) => {
    const pageNum = page * 1 || 1;
    const limitNum = limit * 1 || 10;
    const skip = (pageNum - 1) * limitNum;

    return query.skip(skip).limit(limitNum);
};
