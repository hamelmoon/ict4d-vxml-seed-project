import express, { Request, Response } from 'express';
import dbConnection from '../configs/dbConnection';
import { authorization } from './authHandler'
var path = require('path');

const farmerHandler = (app: express.Application) => {
  //TODO : prevent CSRF Attack
  app.post('/api/farmer_registration', (request: any, response) => {
    try {
      const connection = dbConnection;
      var firstname = request.body.firstname;
      var lastname = request.body.lastname;
      var phonenumber = request.body.phonenumber;
      var streetname = request.body.streetname;
      var housenumber = request.body.housenumber;
      var zipcode = request.body.zipcode;
      var pincode = request.body.pincode;

      //TODO: User validation

      connection.query(
        'INSERT INTO public.farmers (phone_number, street_name, house_number, zip_code, first_name, last_name, pin_code, created_at, modified_at) VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now()) RETURNING id;',
        [
          phonenumber,
          streetname,
          housenumber,
          zipcode,
          firstname,
          lastname,
          pincode,
        ],
        (error, results) => {
          console.log('error', error);
          console.log('results', results);
          if (results.rows?.length > 0) {
            response.status(200).json({
              code: '0000',
            });
          }     
        }
      );
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: true, trace: error });
    }
  });

  app.get('/api/getFarmersData', authorization, (request: any, response) => {
    try {
      const connection = dbConnection;
      const pageSize = request.query.pageSize || 50;
      var currentPage = (request.query.current - 1) || 0;
      const offset  = currentPage < 0 ? pageSize : currentPage * pageSize;
      console.log(pageSize, offset)
      connection.query(
        'SELECT * , count(*) OVER() AS total  FROM public.farmers LIMIT $1 OFFSET $2',
        [pageSize, offset],
        (error: any, results: any) => {
          response.status(200).json({
            code: '0000',
            total: results?.rows?.[0]?.total || 0,
            data: results?.rows,
          });
        }
      );
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: true, trace: error });
    }
  });

  app.get('/farmermanage', authorization, function (request: any, response) {
    if (request.isAuthenticated) {
      response.sendFile(
        path.join(__dirname + '/../../public/farmermanage.html')
      );
    }
  });
};

export default farmerHandler;
