// const { items } = require('./fakeDb');
const express = require('express');
const MyError = require('./error');
const routes = require('./routes');

const morgan = require('morgan');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/items', routes);


//404 handler- needs to come after routes but before error handler below
app.use((req, res, next)=>{
    const e = new MyError('Page not found', 404);
    next(e);
})
//end 404 handler

//error handler goes here 
app.use((error, req, res, next) => {
    let status = error.status || 500;
    let message = error.msg;
    return res.status(status).json({
            error: {message, status}
        });
    });
//end error handler

module.exports = app;

//This app.listen should be at the bottom of the file or in another file like server.js if running supertests
