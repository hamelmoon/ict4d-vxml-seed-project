import express from 'express';
import {
    addNewFarmer,
    deleteFarmer,
    FarmerT,
    getFarmerList,
    updateFarmer
} from '../services/farmerDao';
import { authorization } from './authHandler';
var path = require('path');

const farmerHandler = (app: express.Application) => {
  //TODO : prevent CSRF Attack
  app.post('/api/farmer_registration', (request: any, response) => {
    try {
      var firstname = request.body.firstname;
      var lastname = request.body.lastname;
      var phonenumber = request.body.phonenumber;
      var streetname = request.body.streetname;
      var housenumber = request.body.housenumber;
      var zipcode = request.body.zipcode;
      var pincode = request.body.pincode;

      //TODO: User validation

      addNewFarmer(
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

  app.delete(
    '/api/farmer/:farmerId',
    authorization,
    (request: any, response) => {
      try {
        var farmerId = request.params.farmerId;
        if (parseInt(farmerId) > 0) {
          deleteFarmer([farmerId], (error, results) => {
            console.log('error', error);
            console.log('results', results);
            if (results.rows?.length > 0) {
              response.status(200).json({
                code: '0000',
              });
            }
          });
        } else {
          response.status(404).json({
            code: '-9999',
          });
        }
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: true, trace: error });
      }
    }
  );

  app.put('/api/farmer/:farmerId', (request: any, response) => {
    try {
      var farmerId = request.params.farmerId;
      var firstname = request.body.firstname;
      var lastname = request.body.lastname;
      var phonenumber = request.body.phonenumber;
      var streetname = request.body.streetname;
      var housenumber = request.body.housenumber;
      var zipcode = request.body.zipcode;
      var pincode = request.body.pincode;

      //TODO: User validation
      if (parseInt(farmerId) > 0) {
        updateFarmer(
          [
            phonenumber,
            streetname,
            housenumber,
            zipcode,
            firstname,
            lastname,
            pincode,
            farmerId,
          ],
          (error, results) => {
            console.log('error', error);
            console.log('results', results);
            if (results.rowCount > 0) {
              response.status(200).json({
                code: '0000',
              });
            }
          }
        );
      } else {
        response.status(404).json({
          code: '-9999',
        });
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: true, trace: error });
    }
  });

  app.get('/api/getFarmersData', authorization, (request: any, response) => {
    try {
      const pageSize = request.query.pageSize || 50;
      var currentPage = request.query.current - 1 || 0;
      const offset = currentPage < 0 ? pageSize : currentPage * pageSize;
      getFarmerList([pageSize, offset], (error: any, results: any) => {
        response.status(200).json({
          code: '0000',
          total: results?.rows?.[0]?.total || 0,
          data: results?.rows as FarmerT[],
        });
      });
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
