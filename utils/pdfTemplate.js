exports.pdfTemplate = (products) => {
    return `
<html>

<head>
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Arial, sans-serif;
            margin: 25px;
            padding: 25px;


        }

        .underline {
            text-decoration: underline;
            font-weight: 700;
        }

        .italic {
            font-style: italic;
            font-weight: 900;
            font-size: 12px;
            margin-bottom: 15px;
        }

        /* HEADER */
        .header-heading {
            text-align: left;
            
        }


        .header {
            text-align: center;
            border: 1px solid black;
        }

        .header-details-heading {
            font-weight: 900;

        }

        /* DETAILS */
        .details {
            display: flex;
            justify-content: space-between;

        }

        .party-details,
        .quote-details {
            flex: 1;
            border: 1px solid black;
            padding: 15px;
        }

        .party-details {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        /* TABLE */
        .table {
            width: 100%;
            border-collapse: collapse;
        }

        .table th,
        .table td {
            border: 1px solid black;
            padding: 5px;
            font-size:10px;
        }

        .table th {
            background-color: #f2f2f2;
        }

        .gap {
            border: 1px solid black;
            border-top: transparent;
            height: 25px;
        }

        .footer-d {
            padding: 25px;
        }

        .footer-details {
            border: 1px solid black;
            border-color: transparent black black black;

            display: flex;

        }

        .footer-details div {
            flex: 1;
            padding: 5px;
        }

        .footer-details div:first-child {
            flex: 1;
            border-color: transparent black transparent transparent;
            border-width: 1px;
            border-style: solid;
        }

        .footer-details div {
            padding: 0;
            display: flex;
            flex-direction: column;
        }

        .footer-details div aside {
            flex: 1;
        }

        .footer-details div aside h1 {
            text-align: right;
            padding: 10px;
        }

        .footer-details div aside:first-child {
            flex: 1;
            border-color: transparent transparent black transparent;
            border-width: 1px;
            padding: 0;
            border-style: solid;
        }
    </style>
</head>

<body>
    <div class="header">
        <h3 class="header-heading">GSTIN : 08BKIPK5535P1ZI</h3>
        <div class="header-details">
            <p class="underline">Sales Quotation</p>
            <h1 class="header-details-heading">Shekh Info.Solutions</h1>
            <p class="header-detials-para">135, Furniture Market, Nai Mandi Road Near Zakir Hussain Park</p>
            <p class="header-detials-para">Hanumangarh Town - 335513, Rajasthan </p>
            <p class="header-address italic">Tel. : 01552-231147 email : khan.aslam386@gmail.com </p>
        </div>
    </div>

    <div class="details">
        <div class="party-details">
            <aside>
                <h1 class="italic">Party Details:</h1>
                <p></p>
            </aside>
            <aside>
                <p>GSTIN / UIN :</p>
            </aside>
        </div>


        <div class="quote-details">
            <p>Quotation No.</p>
            <p>Dated</p>
            <p>Disc.1</p>
            <p>Disc.2</p>
            <p>Disc.3</p>
            <p>Disc.4</p>
        </div>
    </div>
    <div class="gap"></div>

    <table class="table">
        <thead>
            <tr>
                <th>S.N.</th>
                <th>Description of Goods</th>
                <th>HSN/SAC Code</th>
                <th>Qty.</th>
                <th>Unit</th>
                <th>List Price</th>
                <th>Discount</th>
                <th>CGST Rate</th>
                <th>CGST Amount</th>
                <th>SGST Rate</th>
                <th>SGST Amount</th>
                <th>Amount(₹)</th>
            </tr>
        </thead>
        <tbody>

            <tr>
                <td>S.N.</td>
                <td>Description of Goods</td>
                <td>HSN/SAC Code</td>
                <td>Qty.</td>
                <td>Unit</td>
                <td>List Price</td>
                <td>Discount</td>
                <td>CGST Rate</td>
                <td>CGST Amount</td>
                <td>SGST Rate</td>
                <td>SGST Amount</td>
                <td>Amount(₹)</td>
            </tr>
            ${products.map((product, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${product?.productsId?.ItemDetails}</td>
                <td>${product?.productsId?.HSN}</td>
                <td>${product?.quantity}</td>
                <td>${product?.productsId?.Unit}</td>
                <td>${product?.productsId?.Sale_price}</td>
                <td>0.00%</td>
                <td>${product?.productsId?.GST}.00%</td>
                <td>${(product?.productsId?.Sale_price * product?.productsId?.GST) / 100}</td>
                <td>${product?.productsId?.GST}</td>
                <td>${(product?.productsId?.Sale_price * product?.productsId?.GST) / 100}</td>
                <td>₹${(product?.productsId?.Sale_price + (product?.productsId?.Sale_price * product?.productsId?.GST) / 100)}</td>
            </tr>
            `).join('')}
            
           
            <tr>
                <td colspan="2" style="border-color: transparent transparent transparent black;"></td>
                <td colspan="2" style="border-color:transparent;">Grand total (25) Pcs.</td>
                <td colspan="7" style="border-color: transparent black transparent transparent;"></td>
                <td colspan="8" style="border-color: black black transparent;">₹</td>

            </tr>

        </tbody>
    </table>

    <!-- DECLARATION BOX -->
    <div class="footer-d header">
        <h1 class="underline">Declaration</h1>
        <p class="underline">HDFC Bank a/c no 50200041744675 IFSC - HDFC0001476 </p>
    </div>

    <div class="details footer-details">
        <div>
            <h1 class="underline" style="font-size:15px;">Terms & Conditions</h1>
            <p>1. Goods once sold will not be taken back.</p>
            <p>2. In case warranty required of the product would be as per d of the product would be as per <br>
                The manufacturer's policy</p>
            <p>3. Interest @ 18% p.a. will be charged if the payment <br>
                Is not made with in the stipulated time.</p>
            <p>4. Subject to 'Rajasthan' Jurisdiction only.</p>
        </div>
        <div>
            <aside>
                <h4 >Receiver's Signature : </h4>
                <p></p>
            </aside>
            <aside>
                <h1 style="font-size:20px;">for Shekh Info.Solutions</h1>
                <h1 style="font-size:20px;">Authorised Signatory</h1>
            </aside>
        </div>
    </div>
</body>

</html>
    `
}