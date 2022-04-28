import express, { Request, Response } from 'express';
import dbConnection from '../configs/dbConnection';
import { authorization } from './authHandler';
var path = require('path');

const dashboardHandler = (app: express.Application) => {
  app.get('/api/getDashboardData', authorization, async (request: any, response) => {
    try {
      const connection = dbConnection;

      //TODO: improvement
      const getCallsTodayCount = await connection.query(
        'SELECT COUNT(*) as callsToday  FROM public.call_history WHERE created_at >= CURRENT_DATE'
      );

      const getListingsToday = await connection.query(
        'SELECT COUNT(*) as listingToday  FROM public.listings WHERE created_at >= CURRENT_DATE'
      );
      const getListingsTotal = await connection.query(
        'SELECT COUNT(*) as listingTotal  FROM public.listings'
      );

      const getActiveFarmers = await connection.query(
        'SELECT COUNT(*) as activeFarmers  FROM public.farmers'
      );

      Promise.all([
        getCallsTodayCount,
        getListingsToday,
        getListingsTotal,
        getActiveFarmers,
      ]).then((values) => {
        var retVal = {
          callsToday: -1,
          listingToday: -1,
          listingTotal: -1,
          activeFarmers: -1,
        };
        values.forEach((value) => {
          if (value.rows.length > 0) {
            if (value.rows[0].hasOwnProperty('callstoday')) {
              retVal.callsToday = parseInt(value.rows[0].callstoday);
            }
            if (value.rows[0].hasOwnProperty('listingtoday')) {
              retVal.listingToday = parseInt(value.rows[0].listingtoday);
            }
            if (value.rows[0].hasOwnProperty('listingtotal')) {
              retVal.listingTotal = parseInt(value.rows[0].listingtotal);
            }
            if (value.rows[0].hasOwnProperty('activefarmers')) {
              retVal.activeFarmers = parseInt(value.rows[0].activefarmers);
            }
          }
        });

        response.status(200).json({
          code: '0000',
          data: retVal,
        });
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: true, trace: error });
    }
  });

  app.get('/main', authorization, function (request, response) {
    response.sendFile(path.join(__dirname + '/../../public/main.html'));
  });
};

export default dashboardHandler;