import "reflect-metadata";

import * as http from "http";
import express, {Application} from "express";
import helmet from "helmet"
import * as bodyParser from "body-parser";

import routes from "./routes/routes";
import ErrorHandler from "./middlewares/errorHandler"
import CorsHandler from "./middlewares/corsHandler"
import LogHandler from "./middlewares/logHandler"
import {database} from "./config/database";
import Web_Console from "./config/web_console";
import { validateUserAccess } from "./config/web_console";

class API {
  private server: http.Server;
  private api: Application;
  private webConsole: Web_Console;

  constructor() {
    this.api = express();
    this.server = http.createServer(this.api);

    this.initAPI();

    this.webConsole = new Web_Console(this.server, "/logging", validateUserAccess);
  }

  public async start(port: String) {
    try {
      console.log("Connecting to PostgreSQL on DB: " + process.env.PG_USER + "@" + process.env.PG_HOST + ":" + process.env.PG_PORT +  "/" + process.env.PG_DATABASE + " >> Schema: " + process.env.PG_SCHEMA + " ...")
      await database.authenticate()
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Critical: Cannot connect to PostgreSQL!\n' + error + "\nDB: " + process.env.PG_USER + "@" + process.env.PG_HOST + ":" + process.env.PG_PORT +  "/" + process.env.PG_DATABASE + " >> Schema: " + process.env.PG_SCHEMA)
      throw Error("A connection to the database could not be established!");
    }

    this.webConsole.start();
    this.server.listen(port, () => console.log(process.env.APP_NAME + " API started on Port: " + port + "!"));
  }

  private initAPI(): void {

    //cors
    this.api.use(CorsHandler.cors);

    //helmet secure
    this.api.use(helmet({
      contentSecurityPolicy: {
        useDefaults: false,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc:  ["'self'", "'wasm-unsafe-eval'"],
        },
      },
    }))

    //bodyParser
    this.api.use(bodyParser.urlencoded({ extended: false }));
    this.api.use(bodyParser.json());

    //Pre Error Handling
    this.api.use(ErrorHandler.checkPreError);

    //logging incoming requests
    if(Boolean(process.env.CONSOLE_LOG_REQUESTS)) {
      this.api.use("*", LogHandler.requestLogger);
    }

    //Static Files
    this.api.use("/favicon.ico",  express.static("static/images/favicon.ico"));
    this.api.use("/web-console",  express.static("static/html/web_console.html"));
    this.api.use('/Build',        express.static('static/build'));
    this.api.use('/TemplateData', express.static('static/templates'));

    //Root Route
    this.api.use("/", routes);
  }
}

export default new API();
