import express, { Request, Response } from 'express';
const { I18n } = require('i18n');
var path = require('path');

const i18n = new I18n({
    locales: ['en', 'fr'],
    cookie: 'locale',
    defaultLocale: 'en',
    directory: path.join(__dirname, 'locale'),
  });
  
const i18nConfig = (app: express.Application) =>{
    app.use(i18n.init);
}


export default i18nConfig;