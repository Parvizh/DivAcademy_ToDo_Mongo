import { RequestHandler } from "express";
import { plainToInstance } from "class-transformer";
import { getMetadataStorage, validate, ValidationError } from "class-validator";
import { errorHandler } from "../helpers/errorHandler";
import { REQ_TYPE } from "../enums/req.enum";



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

export function dtoValidationMiddleware(type: any, reqType: REQ_TYPE, skipMissingProperties = false): RequestHandler {

    return (req, res, next) => {
        const filteredBody = filterRequestBody(type, req[reqType]);
        const dtoObj = plainToInstance(type, filteredBody);
        validate(dtoObj, { skipMissingProperties }).then(
            (errors: ValidationError[]) => {
                if (errors.length > 0) {
                    const dtoErrors = errors.map((error: ValidationError) =>
                        (Object as any).values(error.constraints)).join(", ");
                    return errorHandler(res, 400, dtoErrors)
                } else {
                    reqType === 'body' ?
                        req.body = dtoObj :
                        req.query = Object.assign({}, req.query, dtoObj);
                    next();
                }
            }
        );
    };
}
