import express, { Request, Response } from 'express';
import dbConnection from '../configs/dbConnection';
import {
  createListing,
  deleteListing,
  getListingList,
  ListingT,
  updateListing,
  updateListingConfirm,
} from '../services/listingDao';
import { authorization } from './authHandler';
var path = require('path');

const listingHandler = (app: express.Application) => {
  //TODO: prevent CSRF attack.
  app.post('/api/listings', (request: any, response) => {
    try {
      var farmerId = request.body.farmerId;
      var category = request.body.category;
      var sizeKg = request.body.sizeKg;
      var price = request.body.price;
      var phonenumber = request.body.phonenumber;
      createListing([farmerId, category, sizeKg, price], (error, results) => {
        console.debug('error', error);
        console.debug('results', results);
        if (results.rows?.length > 0) {
          response.status(200).json({
            code: '0000',
            farmerId: farmerId,
          });
        }
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: true, trace: error });
    }
  });

  app.put(
    '/api/listing/:listingId',
    authorization,
    (request: any, response) => {
      try {
        var listingId = request.params.listingId;
        var farmerId = request.body.farmerId;
        var category = request.body.category;
        var sizeKg = request.body.sizeKg;
        var price = request.body.price;
        var phonenumber = request.body.phonenumber;
        updateListing(
          [farmerId, category, sizeKg, price, listingId],
          (error, results) => {
            console.debug('error', error);
            console.debug('results', results);
            if (results.rowCount > 0) {
                response.status(200).json({
                code: '0000',
                listingId: listingId,
                //   data: results.rows,
              });
            }
          }
        );
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: true, trace: error });
      }
    }
  );
  app.delete(
    '/api/listing/:listingId',
    authorization,
    (request: any, response) => {
      try {
        var listingId = request.params.listingId;

        deleteListing([listingId], (error, results) => {
          console.debug('error', error);
          console.debug('results', results);
          if (results.rowCount > 0) {
            response.status(200).json({
              code: '0000',
              listingId: listingId,
              //   data: results.rows,
            });
          }
        });
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: true, trace: error });
      }
    }
  );
  app.get('/api/listing', authorization, (request: any, response) => {
    try {
      if (request.isAuthenticated) {
        const pageSize = request.query.pageSize || 50;
        var currentPage = request.query.current - 1 || 0;
        const offset = currentPage < 0 ? pageSize : currentPage * pageSize;
        getListingList(
          [pageSize, offset],

          (error: any, results: any) => {
            response.status(200).json({
              code: '0000',
              total: results?.rows?.[0]?.total || 0,
              data: results?.rows as ListingT[],
            });
          }
        );
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: true, trace: error });
    }
  });

  app.get('/listingmanage', authorization, function (request: any, response) {
    if (request.isAuthenticated) {
      response.sendFile(
        path.join(__dirname + '/../../public/listingmanage.html')
      );
    }
  });

  app.put(
    '/api/listing/confirm/:listingId',
    authorization,
    (request: any, response) => {
      try {
        var listingId = request.params.listingId;
        updateListingConfirm(
          [1, listingId],
          (error, results) => {
            console.debug('error', error);
            console.debug('results', results);
            if (results.rowCount > 0) {
              response.status(200).json({
                code: '0000',
                listingId: listingId,
                //   data: results.rows,
              });
            }
          }
        );
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: true, trace: error });
      }
    }
  );
};

export default listingHandler;
