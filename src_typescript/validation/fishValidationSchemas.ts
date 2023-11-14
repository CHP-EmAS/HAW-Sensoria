import Joi from 'joi';
import * as customError from "../config/errorCodes" 

export const patchFishSchema = Joi.object({
    name:  
        Joi.string()
        .min(3)
        .allow(null)
        .error(new Error(customError.shortName)),
    data:
        Joi.object()
        .allow(null)
        .error(new Error(customError.invalidData)),
});