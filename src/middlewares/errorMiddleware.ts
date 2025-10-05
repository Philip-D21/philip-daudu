import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../helpers/response";

export const handleNotFound = (req: Request, res: Response, next: NextFunction) => {
  return errorResponse(res, "Not found", null, 404);
};


export const handleErrors = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);
  return errorResponse(res, error.message, null, error.statusCode);
};

 