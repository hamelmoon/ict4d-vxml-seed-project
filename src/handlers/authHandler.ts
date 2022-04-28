import express, { Request, Response } from 'express';
import { CONST_COOKIE_SECRET } from '../configs/cookieSecret';
import dbConnection from '../configs/dbConnection';
import { getFarmerByPhoneNumberAndPin } from '../services/farmerDao';
import { addCallHistory } from '../services/historyDao';
var path = require('path');
const jwt = require('jsonwebtoken');
const CONST_AUTH_COOKIE_NAME = 'access_token';
const authorization = (req, res, next) => {
  const token = req.cookies.access_token;
  req.isAuthenticated = false;
  if (!token) {
    if (req.xhr) {
      return res.sendStatus(403);
    } else {
      return res.redirect('/login');
    }
  }
  try {
    const data = jwt.verify(token, CONST_COOKIE_SECRET);
    req.userId = data.id;
    req.userRole = data.role;
    req.isAuthenticated = true;
    return next();
  } catch {
    if (req.xhr) {
      return res.sendStatus(403);
    } else {
      return res.redirect('/login');
    }
  }
};

const authHandler = (app: express.Application) => {
  app.post('/api/auth', (request: any, response) => {
    var username = request.body.username;
    var password = request.body.password;

    if (username && password) {
      //TODO: implement admin login
      if (username == 'admin' && password == 'admin') {
        const token = jwt.sign({ id: 1, role: 'admin' }, CONST_COOKIE_SECRET);
        response.cookie(CONST_AUTH_COOKIE_NAME, token).redirect('/main');
      }
    }
    response.clearCookie(CONST_AUTH_COOKIE_NAME).redirect('/login');
  });

  app.post('/api/farmerauth', (request: any, response) => {
    try {
      const connection = dbConnection;

      var phonenumber = request.body.phonenumber;
      var pin = request.body.pin;

      console.log(phonenumber, pin);
      try {
        //ignore error(reason : history)
        addCallHistory([phonenumber], (error: any, results: any) => {
          console.log('error', error);
        });
      } catch (error) {
        console.error(error);
      }

      if (phonenumber && pin) {
        getFarmerByPhoneNumberAndPin(
          [phonenumber, pin],
          (error: any, results: any) => {
            console.debug('error', error);
            console.debug('results', results);
            if (results.rows?.length > 0) {
              response.status(200).json({
                code: '0000',
                farmerId: results.rows[0]['id'],
              });
            } else {
              response.status(500).json({
                code: '-1000',
                farmerId: '',
              });
            }
          }
        );
      } else {
        response.status(500).json({
          code: '-9999',
          farmerId: '',
        });
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: true, trace: error });
    }
  });

  app.get('/login', function (request, response) {
    response.sendFile(path.join(__dirname + '/../../public/login.html'));
  });

  app.get('/logout', (req, res) => {
    return res.clearCookie(CONST_AUTH_COOKIE_NAME).redirect('/login');
  });
};

export { authorization, authHandler };
