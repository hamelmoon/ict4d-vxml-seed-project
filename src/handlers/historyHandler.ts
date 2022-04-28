import { Application } from 'express';
import dbConnection from '../configs/dbConnection';
import { authorization } from './authHandler';

const historyHandler = (app: Application) => {
  app.get('/api/callhistory', authorization, (request: any, response) => {
    try {
      const connection = dbConnection;
      const pageSize = request.query.pageSize || 50;
      var currentPage = (request.query.current - 1) || 0;
      const offset  = currentPage < 0 ? pageSize : currentPage * pageSize;
      console.log(pageSize, offset)
      connection.query(
        'SELECT * , count(*) OVER() AS total  FROM public.call_history LIMIT $1 OFFSET $2',
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
};

export default historyHandler;
