// NPM IMPORTS
const express = require('express')
const cors = require('cors')


// CUSTOM MODULE IMPORTS
const productRouter = require('./routers/product.routes');
const productHeaderRouter = require('./routers/productheader.routes');
const authRouter = require('./routers/auth.routes');
const userRouter = require('./routers/user.routes');
const quotationRouter = require('./routers/quotation.routes');
const { globalError } = require('./controllers/error.controller');
const AppError = require('./utils/AppError');

// APP CALL
const app = express();


// MIDDLEWARES
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type']
}))

// ROUTES
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter);
app.use('/api/v1/productsHeader', productHeaderRouter);
app.use('/api/v1/quotations', quotationRouter);
app.all('*', (req, res, next) => {
    next(new AppError(404, `Can't find ${req.originalUrl} on this server`))
})
app.use(globalError)


module.exports = app;
