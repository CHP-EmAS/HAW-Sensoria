import {NextFunction, Request, Response} from "express";

import * as customError from "../config/errorCodes"
import toObj from "../config/responseStandart"

export const authProtected = async (request: Request, response: Response, next: NextFunction) => {
  //Get the jwt token from headers
  const token: string = <string>request.headers["auth-token"];

  if(!token) return response.status(401).json(toObj(response,{Error: customError.tokenRequired}));

  if(token != process.env.AUTH_TOKEN) {
    return response.status(401).json(toObj(response));
  } else {
    next();
  }
};