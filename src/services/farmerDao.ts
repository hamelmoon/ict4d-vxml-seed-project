import dbConnection from '../configs/dbConnection';

export type FarmerT = {
  id: string;
  phone_number: string;
  street_name: string;
  house_number: string;
  zip_code: string;
  first_name: string;
  last_name: string;
  pin_code: string;
  created_at: number;
  modified_at: number;
};

export const deleteFarmer = (data, callback) => {
  const connection = dbConnection;
  connection.query('DELETE public.farmers WHERE id=$1;', data, callback);
};

export const addNewFarmer = (data, callback) => {
  const connection = dbConnection;

  connection.query(
    'INSERT INTO public.farmers (phone_number, street_name, house_number, zip_code, first_name, last_name, pin_code, created_at, modified_at) VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now()) RETURNING id;',
    data,
    callback
  );
};

export const updateFarmer = (data, callback) => {
  const connection = dbConnection;

  connection.query(
    'UPDATE public.farmers SET phone_number=$1, street_name=$2, house_number=$3, zip_code=$4, first_name=$5, last_name=$6, pin_code=$7, created_at=now(), modified_at=now() WHERE id=$8;',
    data,
    callback
  );
};

export const getFarmerList = (data, callback) => {
  const connection = dbConnection;

  connection.query(
    'SELECT * , count(*) OVER() AS total  FROM public.farmers ORDER BY id LIMIT $1 OFFSET $2',
    data,
    callback
  );
};

export const getFarmerByPhoneNumberAndPin = (data, callback) => {
  const connection = dbConnection;

  connection.query(
    'SELECT * FROM public.farmers WHERE phone_number = $1 AND pin_code = $2',
    data,
    callback
  );
};
