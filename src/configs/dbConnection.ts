import { Client, Pool } from 'pg';

var dbConnection;

//TODO: To move configs & To encrypt database information
if (process.env.NODE_ENV == 'production') {
  dbConnection = new Pool({
    user: process.env.DB_USER,//'rinejnlhfkdzzl',
    host: process.env.DB_HOST, //'ec2-63-32-248-14.eu-west-1.compute.amazonaws.com',
    database: process.env.DB_DATABASE, //'d6rlvm9rjtdraj',
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432') || 5432, //5432,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  dbConnection = new Pool({
    user: 'postgres',
    host: 'postgres',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
  });
}

export default dbConnection;
