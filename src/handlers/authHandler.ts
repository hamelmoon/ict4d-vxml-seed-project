import express, { Request, Response } from 'express';
import { CONST_COOKIE_SECRET } from '../configs/cookieSecret';
import dbConnection from '../configs/dbConnection';
import { getFaciliatorByUserId } from '../services/authDao';
import { getFarmerByPhoneNumberAndPin } from '../services/farmerDao';
import { addCallHistory } from '../services/historyDao';

const bcrypt = require('bcrypt');
const saltRounds = 10;
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
    const username = request.body.username;
    const password = request.body.password;
    // const hash = bcrypt.hashSync(password, saltRounds);
    if (username && password) {
        getFaciliatorByUserId([username], (error: any, results: any) => {
        console.log('error', error);
        console.log('results', results);
        if (results.rowCount > 0) {
          if (bcrypt.compareSync(password, results?.rows[0]?.password)) {
            const token = jwt.sign(
              { id: results.rows[0].user_id, role: 'faciliator' },
              CONST_COOKIE_SECRET
            );
            response.cookie(CONST_AUTH_COOKIE_NAME, token).redirect('/main');
            response.end();
          }
        }else{
            response.clearCookie(CONST_AUTH_COOKIE_NAME).redirect('/login');
        }
      });

    }
    else{
        response.clearCookie(CONST_AUTH_COOKIE_NAME).redirect('/login');
    }
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

