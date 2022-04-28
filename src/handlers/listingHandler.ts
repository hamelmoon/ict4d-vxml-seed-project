import express, { Request, Response } from 'express';
import dbConnection from '../configs/dbConnection';
import { authorization } from './authHandler';
var path = require('path');

const listingHandler = (app: express.Application) => {
  //TODO: prevent CSRF attack.
  app.post('/api/listings', (request: any, response) => {
    try {
      const connection = dbConnection;
      var farmerId = request.body.farmerId;
      var category = request.body.category;
      var sizeKg = request.body.sizeKg;
      var price = request.body.price;
      var phonenumber = request.body.phonenumber;
      connection.query(
        'INSERT INTO public.listings (farmer_id, seed_type, seed_weight, seed_price, created_at, modified_at) VALUES ($1, $2, $3, $4, now(), now()) RETURNING id;',
        [farmerId, category, sizeKg, price],
        (error, results) => {
          console.debug('error', error);
          console.debug('results', results);
          if (results.rows?.length > 0) {
            response.status(200).json({
              code: '0000',
              farmerId: farmerId,
            });
          }
        }
      );
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
        const connection = dbConnection;
        var listingId = request.params.listingId;
        var farmerId = request.body.farmerId;
        var category = request.body.category;
        var sizeKg = request.body.sizeKg;
        var price = request.body.price;
        var phonenumber = request.body.phonenumber;
        connection.query(
          'UPDATE public.listings SET farmer_id=$1, seed_type=$2, seed_weight=$3, seed_price=$4, created_at=now(), modified_at=now() WHERE id=$5;',
          [farmerId, category, sizeKg, price, listingId],
          (error, results) => {
            console.debug('error', error);
            console.debug('results', results);
            if (results.rows?.length > 0) {
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
        const connection = dbConnection;
        var listingId = request.params.listingId;
        connection.query(
          'DELETE public.listings WHERE id=$1;',
          [listingId],
          (error, results) => {
            console.debug('error', error);
            console.debug('results', results);
            if (results.rows?.length > 0) {
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
  app.get('/api/listing', authorization, (request: any, response) => {
    try {
      if (request.isAuthenticated) {
        const connection = dbConnection;
        const pageSize = request.query.pageSize || 50;
        var currentPage = request.query.current - 1 || 0;
        const offset = currentPage < 0 ? pageSize : currentPage * pageSize;
        console.log(pageSize, offset);
        connection.query(
          'SELECT * , count(*) OVER() AS total  FROM public.listings LIMIT $1 OFFSET $2',
          [pageSize, offset],

          (error: any, results: any) => {
            response.status(200).json({
              code: '0000',
              total: results?.rows?.[0]?.total || 0,
              data: results?.rows,
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
};

export default listingHandler;
