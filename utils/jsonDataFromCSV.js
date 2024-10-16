const csv = require('csvtojson');
const slugify = require('slugify');

exports.jsonDataFromCSV = async (filePath) => {
    try {
        const jsonArray = await csv().fromFile(filePath);

        // Process jsonArray to convert necessary fields
        const results = jsonArray.filter(product => {
            if (product.ItemGroup !== 'Discontinued Items') {

                // Convert specific fields from string to number, with checks
                const fieldsToConvert = ['GST', 'Sale Price', 'CON/Factor', 'RetailPrice', 'MRP', 'Qty.', 'Price', 'Amount', 'HSN'];
                fieldsToConvert.forEach(field => {
                    if (product[field]) {
                        product[field] = parseFloat(product[field].replace(/,/g, ''));
                        if (isNaN(product[field])) {
                            product[field] = 0; // Set a default value if conversion fails
                        }
                    } else {
                        product[field] = 0; // Set a default value if the field is missing
                    }
                });

                // Rename fields
                const fieldMappings = {
                    'Item Details': 'ItemDetails',
                    'CON/Factor': 'CON_FACTOR',
                    'Alternate Unit': 'Alternate_Unit',
                    'Sale Price': 'Sale_price',
                    'Qty.': 'QTY'
                };

                Object.keys(fieldMappings).forEach(key => {
                    if (product[key]) {
                        product[fieldMappings[key]] = product[key];
                        delete product[key];
                    }
                });

                // Create a slug from the concatenated fields
                const fieldsToSlugify = [
                    'Brand', 'ALIAS', 'Filter2', 'Filter3', 'Filter4', 'Filter5',
                    'Filter6', 'Filter7', 'Filter8', 'Filter9', 'Filter10',
                    'Description1'
                ];
                const slugSource = fieldsToSlugify
                    .map(field => product[field] || '')  // Handle undefined fields
                    .join(' ');

                product.slug = slugify(slugSource, { lower: true, strict: true }).toUpperCase();

                return true; // Include this product in the results
            }
            return false; // Exclude this product
        });

        return results; // Return the processed results

    } catch (error) {
        console.error('Error while processing CSV file:', error);
        throw error; // Re-throw the error to be handled by the calling function
    }
};
