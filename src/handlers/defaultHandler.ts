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
  app.get('/guide',async (req, res) => {
    res.redirect('https://docs.google.com/document/d/1zfEs-7vln-OhqIF9qUryjBfo04YbCz_ljP1sF18WUz8/edit');
  });

  app.get('/video',async (req, res) => {
    res.redirect('https://www.youtube.com/watch?v=r8soPXnnug8');
  })
  app.get('/repo',async (req, res) => {
    res.redirect('https://github.com/hamelmoon/ict4d-vxml-seed-project');
  })

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
