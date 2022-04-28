import dbConnection from '../configs/dbConnection';

export type ListingT = {
  id: string;
  farmer_id: string;
  seed_type: string;
  seed_weight: string;
  seed_price: string;
  created_at: number;
  modified_at: number;
  is_confirmed: boolean;
};

export const createListing = (data, callback) => {
  const connection = dbConnection;

  connection.query(
    'INSERT INTO public.listings (farmer_id, seed_type, seed_weight, seed_price, created_at, modified_at) VALUES ($1, $2, $3, $4, now(), now()) RETURNING id;',
    data,
    callback
  );
};

export const updateListing = (data, callback) => {
  const connection = dbConnection;

  connection.query(
    'UPDATE public.listings SET farmer_id=$1, seed_type=$2, seed_weight=$3, seed_price=$4, modified_at=now() WHERE id=$5;',
    data,
    callback
  );
};

export const deleteListing = (data, callback) => {
  const connection = dbConnection;

  connection.query('DELETE public.listings WHERE id=$1;', data, callback);
};

export const getListingList = (data, callback) => {
  const connection = dbConnection;

  connection.query(
    'SELECT * , count(*) OVER() AS total  FROM public.listings ORDER BY id LIMIT $1 OFFSET $2',
    data,
    callback
  );
};


export const updateListingConfirm = (data, callback) => {
    const connection = dbConnection;
  
    connection.query(
      'UPDATE public.listings SET is_confirmed=$1, modified_at=now() WHERE id=$2;',
      data,
      callback
    );
  };