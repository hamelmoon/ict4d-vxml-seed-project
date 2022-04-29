import dbConnection from '../configs/dbConnection';

type FaciliatorT = {
  id: string;
  user_id: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
};

export const getFaciliatorByUserId = (data, callback) => {
  const connection = dbConnection;

  connection.query(
    'SELECT * FROM public.faciliator WHERE user_id = $1',
    data,
    callback
  );
};
