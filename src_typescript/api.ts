import "reflect-metadata";

import express, {Application} from "express";
import helmet from "helmet"
import * as bodyParser from "body-parser";

import routes from "./routes/routes";
import ErrorHandler from "./middlewares/errorHandler"
import CorsHandler from "./middlewares/corsHandler"
import LogHandler from "./middlewares/logHandler"
import {database} from "./config/database";

class API {
  private api: Application;

  constructor() {
    this.api = express();
    this.config();

    //Root
    this.api.use("/", routes);
  }

  public async start(port: String) {
    try {
      console.log("Connecting to Postgresql on DB: " + process.env.PG_USER + "@" + process.env.PG_HOST + ":" + process.env.PG_PORT +  "/" + process.env.PG_DATABASE + " >> Schema: " + process.env.PG_SCHEMA + " ...")
      await database.authenticate()
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Critical: Cannot connect to Postgresql!\n' + error + "\nDB: " + process.env.PG_USER + "@" + process.env.PG_HOST + ":" + process.env.PG_PORT +  "/" + process.env.PG_DATABASE + " >> Schema: " + process.env.PG_SCHEMA)
      throw Error("A connection to the database could not be established!");
    }

    this.api.listen(port, () => console.log(process.env.APP_NAME + " API started on Port: " + port + "!"));
  }

  private config(): void {

    //cors
    this.api.use(CorsHandler.cors);

    //helmet secure
    this.api.use(helmet())

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
    this.api.use("/favicon.ico", express.static("static/images/favicon.ico"));
  
  }
}

export default new API();
