const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const passport = require('passport');
const LocalAPIKeyStrategy = require('passport-localapikey-update').Strategy;
const hdtRequest = require('herodotus-middleware');
const {get_token} = require('./util');

let logger;

let bootstrap = (opts = {}) => {
  const app = express();

  app.use(helmet());

  if (opts.view_path) {
    // view engine setup
    app.set('views', opts.view_path);
    app.set('view engine', 'pug');
  }

  if (opts.logger) {
    logger = opts.logger;
    const requestLogger = hdtRequest({
      logger,
      headerName: 'x-request-id'
    });
    app.use(requestLogger);
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  if (opts.static) {
    opts.static.forEach((static) => {
      app.use(express.static(static));
    });
  }

  if (opts.auth === true) {
    app.use(passport.initialize());
    passport.use(new LocalAPIKeyStrategy(get_token));
  }

  if (opts.routes) {
    Object.keys(opts.routes).forEach((path) => {
      if (Array.isArray(opts.routes[path])) {
        opts.routes[path].forEach((r) => {
          app.use(path, r);
        });
      } else {
        app.use(path, opts.routes[path]);
      }
    });
  }

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  // eslint-disable-next-line no-unused-vars
  app.use(function(err, req, res, next) {
    // render the error page
    res.status(err.status || 500);
    logger && logger.error(err);
    res.json({err});
  });

  return app;
};

let start = (app) => {
  const http = require('http');
  let server = http.createServer(app);

  const port = process.env.PORT || 3000;
  app.set('port', port);

  server.listen(port);

  server.on('listening', () => {
    logger && logger.info({port}, 'started');
  });

  return server;
};

let require_auth = (req, res, next) => {
  passport.authenticate('localapikey', (err, user) => {
    /* istanbul ignore if */
    if (err) {
      return next(err);
    } else if (!user) {
      let err = new Error('unauthorized');
      err.status = 401;
      return next(err);
    } else {
      req.user = user;
      return next();
    }
  })(req, res, next);
};


let run = async (opts) => {
  let app = bootstrap(opts);
  let server = start(app);
  let out = new Promise((pass, fail) => {
    server.on('error', (err) => {
      fail(err);
    });
    server.on('listening', () => {
      pass(server);
    });
  });
  return out;
};

module.exports = {
  bootstrap,
  start,
  run,
  require_auth,
  passport
};
