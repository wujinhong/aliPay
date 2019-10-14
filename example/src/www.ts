#!/usr/bin/env node

import { ConfigMgr } from "./ConfigMgr";

let path = require('path');
let configPath:string = path.join(__dirname, '../config/config.json');
let config = require(configPath);
ConfigMgr.instance.config = config;

import { Express, NextFunction, Request, Response } from "express-serve-static-core";

let debug = require('debug')('fish:server');

let express = require('express');

let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let fs = require('fs');

let app: Express = express();

let secret: string = "25qp";
app.use(cookieParser(secret));


app.set("trust proxy", 1);


/*

let session = require('express-session');
let redisConfig = {
  client: RedisMgr.client,
  prefix: 'session'
};
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  store: new RedisStore(redisConfig),
  cookie: {
    secure: false,
    maxAge: 9000000
  }
}));*/

// view engine setup
app.set('views', path.join(__dirname,"..", 'views'));
app.set('view engine', 'ejs');

let faviconStr:string = path.join(__dirname,"..", 'public','favicon.ico');

app.use(favicon(faviconStr));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

import auth = require('http-auth');
import { RouteMgr } from "./RouteMgr";
const basic = auth.basic({
  realm: "star war",
  file: __dirname + "/../config/users.htpasswd"
});
app.use(auth.connect(basic));


let publicPath:string = path.join(__dirname,'..', 'public');
app.use(express.static(publicPath));

RouteMgr.instance.use(app);

// catch 404 and forward to error handler
app.use((err1: any, req: Request, res: Response, next: NextFunction): any => {
  let err: any = new Error('Not Found'+err1.toString());
  err.status = 404;
  next(err);
});

// error handler
app.use((err: any, res: Response, next: NextFunction): any => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = res.app.get('env') === 'development' ? err : {};

  // render the error page
  err.status = err.status || 500;
  res.status(err.status);
  res.render('error',{ error:err,message:"出错" });
  next(err);
});

/**
 * Get port from environment and store in Express.
 */
let port = normalizePort(process.env.PORT || config.port);

app.set('port', port);
console.log("https的端口:"+port + "-----------------------------------------------------------------------");

let https = require('https');
/**
 * Create HTTPS server.
 */
let credentials = {
  key:fs.readFileSync(__dirname + `/../config/https_csr/juhetec.com.key`, 'utf8'),
  cert:fs.readFileSync(__dirname + `/../config/https_csr/juhetec.com.crt`, 'utf8')
};
let server = https.createServer( credentials, app );

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

let http = require('http');
let httpServer = http.createServer( app );
let httpPort = normalizePort(process.env.PORT || config.httpPort);

httpServer.listen(httpPort);
httpServer.on('error', onError);
httpServer.on('listening', onListening2);


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' 程序需要更大权限');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' 端口已经被使用了');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


function onListening2() {
    let addr = httpServer.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}