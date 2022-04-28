import { Application } from 'express';
import { getCallHistoryList } from '../services/historyDao';
import { authorization } from './authHandler';

const historyHandler = (app: Application) => {
  app.get('/api/callhistory', authorization, (request: any, response) => {
    try {
      const pageSize = request.query.pageSize || 50;
      var currentPage = request.query.current - 1 || 0;
      const offset = currentPage < 0 ? pageSize : currentPage * pageSize;
      getCallHistoryList(
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
