const Product = require("../models/Product.model");
const Quotation = require("../models/quotation.model");
const AppError = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");
const { searchProducts, selectFields, sortProducts, paginateProducts } = require("../utils/filters");
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const { pdfTemplate } = require("../utils/pdfTemplate");
exports.getAllQuotation = catchAsync(async (req, res, next) => {
    let quotations;

    if (req.user.role === 'admin') {
        quotations = await Quotation.find().populate('userId');
    } else {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        quotations = await Quotation.find({ userId });
    }

    // If no quotations are found
    if (!quotations.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'No quotations found for this user'
        });
    }

    res.status(200).json({
        status: 'success',
        result: quotations.length,
        data: {
            quotations
        }
    });
});


exports.createQuotation = catchAsync(async (req, res, next) => {

    const userId = req?.user._id;
    const products = req.body.products;


    const quotation = await Quotation.create({ userId, products });



    res.status(201).json({
        status: 'success',
        data: {
            quotation
        }
    });
})

exports.updateQuotation = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const updatedQuotation = await Quotation.findByIdAndUpdate(id, {
        ...req.body
    }, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: 'success',
        data: {
            updatedQuotation
        }
    });
})

exports.deleteQuotation = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const quotation = await Quotation.findByIdAndDelete(id);

    if (!quotation) return next(new AppError(404, "Either quotation does not exist or Id is not valid"));

    res.status(204).json({
        status: 'success',
        data: null
    })

})

exports.checkQuotation = catchAsync(async (req, res, next) => {

    const id = req.params.id;
    const quotation = await Quotation.findById(id).populate('userId')
        .populate('products.productsId');

    res.status(200).json({
        status: 'success',
        data: {
            quotation
        }
    });
})


// exports.approveQuotation = catchAsync(async (req, res, next) => {

//     const id = req.params.id;

//     // READING PDF FILE
//     const templatePath = path.resolve(__dirname, '../dev-data/quote.pdf');

//     // Log file path to make sure it's correct
//     console.log('Reading PDF template from:', templatePath);

//     // Read the PDF template
//     const existingPdfBytes = await fs.readFile(templatePath);

//     // Load the PDF document
//     const pdfDoc = await PDFDocument.load(existingPdfBytes);

//     // Log if the PDF was successfully loaded
//     console.log('PDF loaded successfully');

//     // Get the font
//     const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

//     // Get the first page
//     const pages = pdfDoc.getPages();
//     const firstPage = pages[0];
//     const { width, height } = firstPage.getSize();


//     // GETTING QUOTATION VALUE
//     const quotation = await Quotation.findById(id).populate('products.productsId');



//     const { products } = quotation;
//     console.log(products)

//     // INSERTING TEXT IN PDF
//     // first -   y: height / 2 + 145,

//     // Add text to the first page - SERIAL NUMBER

//     let yPosition = height / 2 + 110; // Initial Y position

//     products.forEach((product, i) => {
//         // Add text to the first page - ITEM NUMBER
//         firstPage.drawText('1', {
//             x: 25 + 15,
//             y: yPosition, // Use the dynamic yPosition
//             size: 10,
//             font: helveticaFont,
//             color: rgb(0.95, 0.1, 0.1),
//         });

//         // Add text to the first page - ITEM DETAILS
//         firstPage.drawText(product.productsId.ItemDetails, {
//             x: 45 + 15,
//             y: yPosition, // Use the dynamic yPosition
//             size: 8,
//             font: helveticaFont,
//             color: rgb(0.95, 0.1, 0.1),
//         });

//         // Add text to the first page - HSN
//         firstPage.drawText('8471', {
//             x: 165 + 15,
//             y: yPosition, // Use the dynamic yPosition
//             size: 8,
//             font: helveticaFont,
//             color: rgb(0.95, 0.1, 0.1),
//         });

//         // Add text to the first page - QUANTITY
//         firstPage.drawText('1.00', {
//             x: 220 + 15,
//             y: yPosition, // Use the dynamic yPosition
//             size: 8,
//             font: helveticaFont,
//             color: rgb(0.95, 0.1, 0.1),
//         });

//         // Add text to the first page - UNIT
//         firstPage.drawText('Pcs.', {
//             x: 255 + 15,
//             y: yPosition, // Use the dynamic yPosition
//             size: 8,
//             font: helveticaFont,
//             color: rgb(0.95, 0.1, 0.1),
//         });

//         // Add text to the first page - DISCOUNT
//         firstPage.drawText('0.00  %', {
//             x: 325 + 15,
//             y: yPosition, // Use the dynamic yPosition
//             size: 8,
//             font: helveticaFont,
//             color: rgb(0.95, 0.1, 0.1),
//         });

//         // Add text to the first page - CGST RATE
//         firstPage.drawText('9.00  %', {
//             x: 375 + 15,
//             y: yPosition, // Use the dynamic yPosition
//             size: 8,
//             font: helveticaFont,
//             color: rgb(0.95, 0.1, 0.1),
//         });

//         // Add text to the first page - CGST Amount
//         firstPage.drawText('282.20', {
//             x: 410 + 15,
//             y: yPosition, // Use the dynamic yPosition
//             size: 8,
//             font: helveticaFont,
//             color: rgb(0.95, 0.1, 0.1),
//         });

//         // Add text to the first page - SGST RATE
//         firstPage.drawText('9.00  %', {
//             x: 445 + 15,
//             y: yPosition, // Use the dynamic yPosition
//             size: 8,
//             font: helveticaFont,
//             color: rgb(0.95, 0.1, 0.1),
//         });

//         // Add text to the first page - SGST Amount
//         firstPage.drawText('282', {
//             x: 480 + 15,
//             y: yPosition, // Use the dynamic yPosition
//             size: 8,
//             font: helveticaFont,
//             color: rgb(0.95, 0.1, 0.1),
//         });

//         // Add text to the first page - AMOUNT
//         firstPage.drawText('3,700.00', {
//             x: 520 + 15,
//             y: yPosition, // Use the dynamic yPosition
//             size: 8,
//             font: helveticaFont,
//             color: rgb(0.95, 0.1, 0.1),
//         });

//         // Subtract 20 from the yPosition for the next row
//         yPosition -= 15;
//     });




//     // Serialize the PDFDocument to bytes
//     const pdfBytes = await pdfDoc.save();

//     // Log if the PDF was successfully modified
//     console.log('PDF modified and saved successfully');

//     // Set headers and send the PDF
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');
//     res.send(Buffer.from(pdfBytes));


// });




exports.approveQuotation = catchAsync(async (req, res, next) => {
    const id = req.params.id;

    // GETTING QUOTATION VALUE
    const quotation = await Quotation.findById(id).populate('products.productsId');

    const { products } = quotation;
    console.log(products);

    // Generate HTML content for the PDF



    const htmlContent = pdfTemplate(products);

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        headless: false,

    });


    const page = await browser.newPage();
    await page.setContent(htmlContent);

    // Generate PDF from the HTML content
    const pdfBuffer = await page.pdf({ format: 'A4' });

    // Close Puppeteer
    await browser.close();

    // Send the PDF as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="quotation.pdf"');
    res.end(pdfBuffer);
});