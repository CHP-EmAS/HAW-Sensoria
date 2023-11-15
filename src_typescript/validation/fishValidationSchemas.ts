import Joi from 'joi';
import * as customError from "../config/errorCodes" 

export const patchFishSchema = Joi.object({
    name:  
        Joi.string()
        .min(2)
        .allow(null)
        .error(new Error(customError.shortName)),
    raw_data:
        Joi.string()
        .allow(null)
        .error(new Error(customError.invalidData)),
});

export const createFishSchema = Joi.object({
    name:  
        Joi.string()
        .min(2)
        .required()
        .error(new Error(customError.shortName)),
    raw_data:
        Joi.string()
        .required()
        .error(new Error(customError.invalidData)),
});