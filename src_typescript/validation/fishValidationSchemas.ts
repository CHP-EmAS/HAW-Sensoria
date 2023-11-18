import Joi from 'joi';
import * as customError from "../config/errorCodes" 

export const createFishSchema = Joi.object({
    raw_data:
        Joi.string()
        .required()
        .error(new Error(customError.invalidData)),
});

export const patchFishSchema = Joi.object({
    raw_data:
        Joi.string()
        .allow(null)
        .error(new Error(customError.invalidData)),
});

