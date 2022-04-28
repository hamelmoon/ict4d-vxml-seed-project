import express, { Request, Response } from 'express';
const cookieParser = require('cookie-parser');

const CONST_COOKIE_SECRET = process.env.COOKIE_SECRET || 'secret';

const cookieConfig = (app: express.Application) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: true,
  };

  app.use(cookieParser(CONST_COOKIE_SECRET, cookieOptions));
};
export { CONST_COOKIE_SECRET, cookieConfig };
