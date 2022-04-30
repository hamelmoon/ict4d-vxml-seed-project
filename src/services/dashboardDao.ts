import dbConnection from '../configs/dbConnection';

export const getTotalSeedWeight = (data, callback)=>{
    const connection = dbConnection;

    connection.query(
      'SELECT * FROM public.total_seed_weight',
      data,
      callback
    );
}

export const getListingCountByDay = (data, callback)=>{
    const connection = dbConnection;
    connection.query(
      'SELECT seed_type , DATE_TRUNC($1, created_at) AS  day_time_stamp, COUNT(id) AS count FROM public.listings  GROUP BY seed_type, DATE_TRUNC($1, created_at);' ,
      data,
      callback
    );
}
