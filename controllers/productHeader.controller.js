const Product = require("../models/Product.model");
const ProductHeader = require("../models/ProductsHeader.model");
const { catchAsync } = require("../utils/catchAsync");


exports.getHeaderData = catchAsync(async (req, res, next) => {
    const headerData = await ProductHeader.find();
    return res.status(200).json({
        status: 'success',
        data: {
            headerData
        }
    });
})

exports.storeDataInHeader = catchAsync(async (req, res, next) => {
    const data = await Product.find();

    // Group data by ItemGroup and collect ItemSubGroup into Sets
    const groupedData = data.reduce((acc, item) => {
        const { ItemGroup, ItemSubGroup } = item;

        // If the ItemGroup doesn't exist in the accumulator, add it
        if (!acc[ItemGroup]) {
            acc[ItemGroup] = new Set(); // Use Set to avoid duplicate subgroups
        }

        // Add the ItemSubGroup to the corresponding ItemGroup
        acc[ItemGroup].add(ItemSubGroup);

        return acc;
    }, {});

    // Convert the sets to arrays and transform them into schema format
    const transformDataForSchema = (groupedData) => {
        let sequenceCounter = 1; // Initialize sequence counter for the main titles

        return Object.keys(groupedData).map((group) => {
            // Convert Set to an array and map it for the subHeader
            const subHeader = [...groupedData[group]].map((subGroup, subIndex) => ({
                subTitle: subGroup,
                subTitleSequence: subIndex + 1, // Sequence for each subTitle
            }));

            return {
                title: group,
                sequence: sequenceCounter++, // Assign sequence for title
                subHeader: subHeader
            };
        });
    };

    const transformedData = transformDataForSchema(groupedData);
    const result = await ProductHeader.create(transformedData)

    return res.status(201).json({
        status: 'success',
        data: {
            result
        }
    });
});


