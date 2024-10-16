const { catchAsync } = require("../utils/catchAsync")
const puppeteer = require('puppeteer');
const path = require('path')
const { jsonDataFromCSV } = require("../utils/jsonDataFromCSV");
const Product = require("../models/Product.model");
const AppError = require("../utils/AppError");
const { filterProducts, searchProducts, selectFields, paginateProducts, sortProducts } = require("../utils/filters");


exports.getAllProducts = catchAsync(async (req, res, next) => {
    let query = Product.find();
    const queryObj = { ...req.query };

    // Apply filtering
    query = filterProducts(query, queryObj)

    // Apply searching
    query = searchProducts(query, req.query.search, ['Brand', 'ALIAS', 'ItemGroup', 'ItemDetails', 'slug']);

    // Apply field selection
    query = selectFields(query, req.query.fields);

    // Apply sorting
    query = sortProducts(query, req.query.sort);

    // Pagination settings
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    query = paginateProducts(query, page, limit);

    // Execute the query
    const products = await query;
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
        status: 'success',
        total: totalProducts,
        currentPage: page,
        totalPages: totalPages,
        data: {
            products
        }
    });


});

exports.createAllProducts = catchAsync(async (req, res, next) => {
    const filePath = path.join(__dirname, '../dev-data/CSVLatestSIS_StockStatus.csv');

    const products = await jsonDataFromCSV(filePath);

    await Product.deleteMany();
    await Product.create(products);
    return res.status(201).json({
        status: 'success',
        data: {
            message: "Data uploading Completed"
        }
    });


});

exports.getSingleProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findById(id)
    if (!product) return next(new AppError(404, `Product not found with the id ${id}`))

    return res.status(200).json({
        status: "success",
        data: {
            product
        }
    })
})

exports.updateProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    if (!product) return next(new AppError(404, `Product not found with the id ${id}`))

    return res.status(200).json({
        status: "success",
        data: {
            message: "successfully Updated"
        }
    })
})


exports.getExtraProductDetails = catchAsync(async (req, res, next) => {
    const products = await Product.find();
    const query = 'Adapter Lap Dell 65w LDOADNP1545 Lapcare';

    const browser = await puppeteer.launch({ headless: false }); // Browser visible

    try {
        // Open a new page
        const page = await browser.newPage();

        // Navigate to Google
        await page.goto('https://www.google.com');

        // Wait for the search input to appear
        await page.waitForSelector('#APjFqb');

        // Type the search query
        await page.type('#APjFqb', query);

        // Press Enter to perform the search
        await page.keyboard.press('Enter');

        // Wait for search results to load
        await page.waitForSelector('a h3');

        // Get a list of all search result links
        const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a')).map(anchor => {
                return {
                    text: anchor.innerText,
                    href: anchor.href
                };
            });
        });

        // Find the first Amazon or Flipkart link (priority Amazon)
        const amazonLink = links.find(link => link.href.includes('amazon'));
        const flipkartLink = links.find(link => link.href.includes('flipkart'));
        const targetLink = amazonLink ? amazonLink.href : (flipkartLink ? flipkartLink.href : null);

        if (targetLink) {
            console.log(`Opening: ${targetLink}`);
            // Navigate to the Amazon/Flipkart link
            await page.goto(targetLink);

            // Wait for the div with class "imgTagWrapper" to be present
            await page.waitForSelector('div.imgTagWrapper');

            // Click on the div with class "imgTagWrapper"
            await page.click('div.imgTagWrapper');

            // Wait for the popover to open and for the div with class "a-popover-inner" to be available
            await page.waitForSelector('div.a-popover-inner');

            // Extract thumbnail image URLs and large image URLs inside "a-popover-inner"
            const imageLinks = await page.evaluate(() => {
                const thumbnailImages = Array.from(document.querySelectorAll('div#a-popover-inner div#ivThumbs div.ivThumb'));
                const largeImageUrls = [];
                console.log(thumbnailImages)

                thumbnailImages.forEach(thumbnail => {
                    const thumbnailSrc = thumbnail.src;
                    // Click the thumbnail to load the corresponding large image (if necessary)
                    thumbnail.click();

                    // Wait for the large image to appear
                    const largeImage = document.querySelector('div#a-popover-inner div#ivLargeImage img');
                    if (largeImage) {
                        const largeImageUrl = largeImage.src;
                        largeImageUrls.push({
                            thumbnailSrc,
                            largeImageUrl
                        });
                    }
                });

                return largeImageUrls;
            });

            console.log('Thumbnail and Large Image Links:', imageLinks);

        } else {
            console.log('No Amazon or Flipkart link found in the search results.');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        // Wait a few seconds before closing (optional)
        await browser.close();
    }
});
