import dbConnection from '../configs/dbConnection';

export type CallHistoryT = {
  id: string;
  phone_number: string;
  created_at: number;
};

export const addCallHistory = (data, callback) => {
  const connection = dbConnection;

  connection.query(
    'INSERT INTO public.call_history (phone_number, created_at) VALUES($1, now())',
    data,
    callback
  );
};

export const getCallHistoryList = (data, callback) => {
  const connection = dbConnection;

  connection.query(
    'SELECT * , count(*) OVER() AS total  FROM public.call_history LIMIT $1 OFFSET $2',
    data,
    callback
  );
};
