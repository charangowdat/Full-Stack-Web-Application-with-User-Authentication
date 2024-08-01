const express = require('express');
const cors = require('cors');

const AppError = require('./appError')
const globalErrorHandler = require('./errorController')
const projectSignup = require('./projectRouters');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/v1/project', projectSignup);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
  });

app.use(globalErrorHandler);

module.exports = app;
