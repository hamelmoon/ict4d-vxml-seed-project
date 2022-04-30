import defaultHandler from './handlers/defaultHandler';
import { authHandler } from './handlers/authHandler';
import listingHandler from './handlers/listingHandler';
import dashboardHandler from './handlers/dashboardHandler';
import historyHandler from './handlers/historyHandler';
import farmerHandler from './handlers/farmerHandler';
import i18nConfig from './configs/i18nConfig';
import { cookieConfig } from './configs/cookieSecret';
var express = require('express');
var bodyParser = require('body-parser');
// const methodOverride = require('method-override');
const cors = require('cors');
var path = require('path');

const PORT = process.env.PORT || 80;

const app = express();
cookieConfig(app);
app.use(cors({ credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
i18nConfig(app);

// app.use(methodOverride());
authHandler(app);
listingHandler(app);
dashboardHandler(app);
farmerHandler(app);
historyHandler(app);
defaultHandler(app);

//static file serving
app.use('/static', express.static(path.join(__dirname, '/../public/')));
// This should be the last route else any after it wont work
app.use('*', (req, res) => {
  if (req.xhr) {
    res.status(404).json({
      success: 'false',
      message: 'Page not found',
      error: {
        statusCode: 404,
        message: 'You reached a route that is not defined on this server',
      },
    });
  } else {
    res.sendFile(path.join(__dirname + '/../public/404.html'));
  }
});
app.listen(PORT, () => {
  console.log('Started at http://localhost:%d', PORT);
});
