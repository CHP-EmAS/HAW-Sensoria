import { Request, Response } from "express";
import toObj from "../config/responseStandart"

import { v4 as uuidv4 } from 'uuid';

import { CreateScoreEntryInterface } from "../validation/interfaces"
import { createScoreEntrySchema } from "../validation/scoreValidationSchemas";

import {SpaceModel} from "../models/Space";

class SpaceController {

    //GET limited Entries
    public static async getSortedScoreEntriesLimited(request: Request, response: Response) {
        try{
            if(!request.query.limit) {
                console.log("Returning all Entries...");
                const entries: Array<SpaceModel> = await SpaceModel.findAll({
                    order: ['score', 'DESC'],
                });
                console.log("[200] " + entries.length + " Entries returned!");
                return response.status(200).json(toObj(response, {Entries: entries}));
            }

            const limit:number = Number(request.query.limit);
            console.log("Returning Entries with limit " + limit + "...");

            const entries: (Array<SpaceModel>) = await SpaceModel.findAll({
                order: ['score', 'DESC'],
                limit: limit
            });

            console.log("[200] " + entries.length + " Entries returned!");
            return response.status(200).json(toObj(response,{Entries: entries}));

        } catch ( error: any ) {
            console.log("[500] Error when returning limited Entries: " + error.message);
            response.status(500).json(toObj(response));
        }
    }

    //POST Create Entry
    public static async createScoreEntry(request: Request, response: Response) {
        const requestParams: CreateScoreEntryInterface = request.body;

        const { error } = createScoreEntrySchema.validate(requestParams);
        if(error) {
            console.error("[400] Error when creating score entry: " + error?.message)
            return response.status(400).json(toObj(response,{Error: error.message}));
        }

        let space = new SpaceModel();

        space.id = uuidv4();
        space.name = requestParams.name;
        space.score = requestParams.score;

        try {
            const newScore: SpaceModel = await space.save();

            console.log("[201] New Score created! ID: " + space.id + "\nData: " + space.name + "(" + space.score + ")");
            return response.status(201).json(toObj(response));

        } catch ( error: any) {
            console.error("[500] Error when creating the fish: " + error.message)
            return response.status(500).json(toObj(response));
        }
    }
}

export default SpaceController;
