import { RequestHandler } from "express";
import { plainToInstance } from "class-transformer";
import { getMetadataStorage, validate, ValidationError } from "class-validator";
import { errorHandler } from "../helpers/errorHandler";

function filterRequestBody(dtoClass: any, requestBody: any): any {
    const filteredBody = {};
    const metadataStorage = getMetadataStorage();
    const validationMetadatas = metadataStorage.getTargetValidationMetadatas(dtoClass, "", false, false);
    const propertyNames = validationMetadatas.map(metadata => metadata.propertyName);
    for (const key of Object.keys(requestBody)) {
  
      if (propertyNames.includes(key)) {
        filteredBody[key] = requestBody[key];
      }
    }
  
    return filteredBody;
  }

  export function bodyDtoValidationMiddleware(type: any, skipMissingProperties = false): RequestHandler {

    return (req, res, next) => {
      const filteredBody = filterRequestBody(type, req.body);
      const dtoObj = plainToInstance(type, filteredBody);
      validate(dtoObj, { skipMissingProperties }).then(
        (errors: ValidationError[]) => {
          if (errors.length > 0) {
            const dtoErrors = errors.map((error: ValidationError) =>
              (Object as any).values(error.constraints)).join(", ");
            return errorHandler(res, 400, dtoErrors)
          } else {
            req.body = dtoObj;
            next();
          }
        }
      );
    };
  }
  
  
  export function queryDtoValidationMiddleware(type: any, skipMissingProperties = false): RequestHandler {
    return (req, res, next) => {
      const dtoObj = plainToInstance(type, req.query) as Object;
      validate(dtoObj, { skipMissingProperties }).then(
        (errors: ValidationError[]) => {
          if (errors.length > 0) {
            const dtoErrors = errors.map((error: ValidationError) =>
              Object.values(error.constraints)).join(", ");
            return errorHandler(res, 400, dtoErrors);
          } else {
            req.query = Object.assign({}, req.query, dtoObj);
            next();
          }
        }
      );
    };
  }