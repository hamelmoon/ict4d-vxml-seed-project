import express, { Application } from 'express';
import dbConnection from '../configs/dbConnection';
import { authorization } from './authHandler';
var path = require('path');

function xhrErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
}

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function errorHandler(err, req, res, next) {
  //To prevent leaking of error traces, never return details
  res.status(500).send({ error: 'Something failed!' });
}
const defaultHandler = (app: Application) => {
  app.get('/ping', async (req, res) => {
    try {
      const connection = dbConnection;
      const database = await connection
        .query('SELECT 1 + 1')
        .then(() => 'up')
        .catch(() => 'down');

      res.status(200).json({
        environment: process.env.NODE_ENV,
        database,
      });
    } catch (error) {
      res
        .status(500)
        .json({ environment: process.env.NODE_ENV, server: 'error' });
    }
  });
  app.use(logErrors);
  app.use(xhrErrorHandler);
  app.use(errorHandler);

  app.get('/', authorization, function (request: any, response) {
    if (request.isAuthenticated) {
      response.redirect('/main');
    }
  });


};

export default defaultHandler;
