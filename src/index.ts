import session from 'express-session';
import { Client } from 'pg';
const { I18n } = require('i18n');
const cookieParser = require('cookie-parser');
var Pool = require('pg').Pool;
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const methodOverride = require('method-override');

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
}

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

//TODO: To move configs & To encrypt database information
if (process.env.NODE_ENV == 'production') {
  var connection = new Client({
    user: 'rinejnlhfkdzzl',
    host: 'ec2-63-32-248-14.eu-west-1.compute.amazonaws.com',
    database: 'd6rlvm9rjtdraj',
    password:
      '3d0789a010474f157c0e18ba2c7f48c638873e6cd68f1f2daeaf31c0b6a86bbc',
    port: 5432,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  var connection = new Client({
    user: 'postgres',
    host: 'postgres',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
  });
}

const i18n = new I18n({
  locales: ['en', 'fr'],
  cookie: 'locale',
  defaultLocale: 'en',
  directory: path.join(__dirname, 'locale'),
});

const PORT = process.env.PORT || 80;

const app = express();

//Import middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(i18n.init);
app.use(methodOverride());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

app.get('/ping', async (req, res) => {
  const database = await connection
    .query('SELECT 1 + 1')
    .then(() => 'up')
    .catch(() => 'down');

  res.send({
    environment: process.env.NODE_ENV,
    database,
  });
});

//static file serving
app.use('/static', express.static(path.join(__dirname, '/../public/')));

app.get('/login', function (request, response) {
  response.sendFile(path.join(__dirname + '/../public/login.html'));
});

app.get('/main', function (request, response) {
  response.sendFile(path.join(__dirname + '/../public/main.html'));
});

app.get('/register', function (request, response) {
  response.sendFile(path.join(__dirname + '/../public/register.html'));
});

app.get('/listings', function (request, response) {
  if (request.session.loggedin) {
    response.sendFile(path.join(__dirname + '/../public/listings.html'));
  }
});

app.get('/dashboard', function (request, response) {
  if (request.session.loggedin) {
    response.sendFile(path.join(__dirname + '/../public/dashboard.html'));
  } else {
    response.redirect('/login');
  }
});

app.get('/farmermanage', function (request, response) {
  if (request.session.loggedin) {
    response.sendFile(path.join(__dirname + '/../public/farmermanage.html'));
  } else {
    response.redirect('/login');
  }
});

app.post('/api/listings', (request: any, response) => {
  var farmerId = request.body.farmerId;
  var category = request.body.category;
  var sizeKg = request.body.sizeKg;
  var price = request.body.price;
  var phonenumber = request.body.phonenumber;

  //TODO: User validation

  connection.query(
    'INSERT INTO public.listings (farmer_id, seed_type, seed_weight, seed_price) VALUES ($1, $2, $3, $4) RETURNING id;',
    [farmerId, category, sizeKg, price],
    (error, results) => {
      console.log('error', error);
      console.log('results', results);
      if (results.rows.length > 0) {
        response.send({
          code: '0000',
          farmerId: farmerId,
        });
        response.end();
      } else {
        response.end();
      }
    }
  );
});

app.post('/api/farmer_registration', (request: any, response) => {
  var firstname = request.body.firstname;
  var lastname = request.body.lastname;
  var phonenumber = request.body.phonenumber;
  var streetname = request.body.streetname;
  var housenumber = request.body.housenumber;
  var zipcode = request.body.zipcode;
  var pincode = request.body.pincode;

  //TODO: User validation

  connection.query(
    'INSERT INTO public.farmers (phone_number, street_name, house_number, zip_code, first_name, last_name, pin_code, created_at, modified_at) VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now()) RETURNING id;',
    [
      phonenumber,
      streetname,
      housenumber,
      zipcode,
      firstname,
      lastname,
      pincode,
    ],
    (error, results) => {
      console.log('error', error);
      console.log('results', results);
      if (results.rows.length > 0) {
        response.send({
          code: '0000',
        });
        response.end();
      } else {
        response.end();
      }
    }
  );
});

app.post('/api/auth', (request: any, response) => {
  var username = request.body.username;
  var password = request.body.password;

  if (username && password) {
    //TODO: implement admin login
    if (username == 'admin' && password == 'admin') {
      request.session.loggedin = true;
      response.redirect('/main');
    }
  }

  request.session.loggedin = false;
  response.redirect('/login');
});

app.get('/api/getFarmersData', (request: any, response) => {
  //TODO PAGING
  var limit = 10000;
  var offset = 0;
  connection.query(
    'SELECT *  FROM public.farmers',
    [],

    (error: any, results: any) => {
      response.send({
        code: '0000',
        data: results.rows,
      });
      response.end();
    }
  );
});

app.get('/api/getListingData', (request: any, response) => {
  //TODO PAGING
  var limit = 10000;
  var offset = 0;
  connection.query(
    'SELECT *  FROM public.listings',
    [],

    (error: any, results: any) => {
      response.send({
        code: '0000',
        data: results.rows,
      });
      response.end();
    }
  );
});

app.get('/api/getDashboardData', async (request: any, response) => {
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

    response.send({
      code: '0000',
      data: retVal,
    });
    response.end();
  });
});

app.post('/api/farmerauth', (request: any, response) => {
  var phonenumber = request.body.phonenumber;
  var pin = request.body.pin;
  if (phonenumber && pin) {
    connection.query(
      'SELECT * FROM public.farmers WHERE phone_number = $1 AND pin_code = $2',
      [phonenumber, pin],
      (error: any, results: any) => {
        console.log('error', error);
        console.log('results', results);
        if (results.rows.length > 0) {
          response.send({
            code: '0000',
            farmerId: results.rows[0]['id'],
          });
          response.end();
        } else {
          response.error({
            code: '-1000',
            farmerId: '',
          });
          response.end();
        }
      }
    );
  } else {
    response.error({
      code: '-9999',
      farmerId: '',
    });
    response.end();
  }
});

app.get('/', function (request: any, response) {
  if (request.session.loggedin) {
    response.redirect('/main');
  } else {
    response.redirect('/login');
  }
});

// This should be the last route else any after it wont work
app.use('*', (req, res) => {
  res.status(404).json({
    success: 'false',
    message: 'Page not found',
    error: {
      statusCode: 404,
      message: 'You reached a route that is not defined on this server',
    },
  });
});

app.listen(PORT, () => {
  connection.connect();
  console.log('Started at http://localhost:%d', PORT);
});
