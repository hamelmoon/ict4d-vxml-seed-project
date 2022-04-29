import dbConnection from '../configs/dbConnection';

export const getTotalSeedWeight = (data, callback)=>{
    const connection = dbConnection;

    connection.query(
      'SELECT * FROM public.total_seed_weight',
      data,
      callback
    );
}

