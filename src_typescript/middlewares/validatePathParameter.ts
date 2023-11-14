import { Request, Response, NextFunction } from "express";

import toObj from "../config/responseStandart"

import { isValidUUID } from "../validation/standartSchemas";

export const validatePathParameter = async (request: Request, response: Response, next: NextFunction) => {
    const path_fish_id = request.params.id

    if(path_fish_id != undefined) {
        const { error } = isValidUUID.validate({id: path_fish_id});
        if(error) return response.status(400).json(toObj(response,{Error: "Given Fish ID must be a valid UUID"}));
    }

    next()
};
    