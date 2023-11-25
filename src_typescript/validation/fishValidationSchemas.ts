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

export const getLatestFishSchema = Joi.object({
    after: Joi.date()
            .min("01.01.2000")
            .error(new Error(customError.startAfter1900))
});

