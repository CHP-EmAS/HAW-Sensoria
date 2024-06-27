import Joi from 'joi';
import * as customError from "../config/errorCodes" 

export const createScoreEntrySchema = Joi.object({
    name:
        Joi.string()
        .required()
        .error(new Error(customError.invalidData)),
    score:
        Joi.number()
        .required()
        .error(new Error(customError.invalidData)),
});

