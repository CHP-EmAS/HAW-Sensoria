import { Request, Response } from "express";
import { Op } from "sequelize";

import toObj from "../config/responseStandart"
import * as customError from "../config/errorCodes"

import { v4 as uuidv4 } from 'uuid';

import { CreateFishInterface, getLatestFishInterface } from "../validation/interfaces"
import { createFishSchema } from "../validation/fishValidationSchemas";

import {FishModel} from "../models/Fish";

class FishController {

    private static allowFishCreation: boolean = true;

    //GET All Fish Info
    public static async getLatestFishInfo(request: Request, response: Response) {
        try{
            if(!request.query.after) {
                console.log("Returning all Fish...");
                const fishes: Array<FishModel> = await FishModel.findAll();
                console.log("[200] " + fishes.length + " Fish returned!");
                return response.status(200).json(toObj(response,{fishes: fishes}));
            }

            console.log("Returning Fish after " + request.query.after.toString() + "...");

            const requestParams: getLatestFishInterface = {after: new Date(request.query.after.toString())};

            const fishes: (Array<FishModel> | null) = await FishModel.findAll({
                where: {
                    created_at: {
                        [Op.gte]: requestParams.after.toUTCString(),
                    }
                        
                }
            });

            console.log("[200] " + fishes.length + " Fish returned! Listing...");

            fishes.forEach(fish => {
                console.log("- " + fish.id + ", created_at: " + fish.created_at.toUTCString() + "\n     - Data: " + fish.raw_data);
            });

            return response.status(200).json(toObj(response,{fishes: fishes}));

        } catch ( error: any ) {
            console.log("[500] Error when returning fish: " + error.message);
            response.status(500).json(toObj(response));
        }
    }

    //GET Single Fish Info
    public static async getFishInfo(request: Request, response: Response) {
        //get fish_id given in path
        const requested_fish_id = request.params.id

        //build user information array
        let response_fish_attr: Array<string>;

        try{
            const fish: (FishModel | null) = await FishModel.findByPk(requested_fish_id);
            if(!fish) return response.status(404).json(toObj(response, {Error: customError.fishNotFound}));
            response.status(200).json(toObj(response,{fish: fish.toJSON()}));
        } catch {
            response.status(500).json(toObj(response));
        }
    }

    //POST Fish
    public static async createFish(request: Request, response: Response) {
        if(!FishController.allowFishCreation) {
            return response.status(403).json(toObj(response));
        }

        const requestParams: CreateFishInterface = request.body;

        const { error } = createFishSchema.validate(requestParams);
        if(error) {
            console.error("[400] Error when creating the fish: " + error?.message)
            return response.status(400).json(toObj(response,{Error: error.message}));
        }

        console.log("Creating new fish...\nData: " + requestParams.raw_data);

        let fish = new FishModel();

        fish.id = uuidv4();

        try {
            JSON.parse(requestParams.raw_data);
        } catch (e: any) {
            console.error("[400] Json Error when creating the fish: " + e.message)
            return response.status(400).json(toObj(response, {Error: customError.invalidJson}));
        }

        fish.raw_data = requestParams.raw_data;
    
        try {
            const newFish: FishModel = await fish.save();

            console.log("[201] New Fish created! ID: " + fish.id + "\nData: " + fish.raw_data);
            return response.status(201).json(toObj(response,{ fish_id: fish.id }));

        } catch ( error: any) {
            console.error("[500] Error when creating the fish: " + error.message)
            return response.status(500).json(toObj(response));
        }
    }

    //PATCH Fish
    public static async patchFish(request: Request, response: Response) {
         return response.status(501).json(toObj(response));
    }

    //DELETE Fish
    public static async deleteAllFish() {
        console.log("Destroying all Fish! :(")

        try {
            FishModel.truncate();
        } catch ( error ) {
            console.error(error);
        }
    }

    //Toggle Creation
    public static toggleFishCreation() {
        FishController.allowFishCreation = !FishController.allowFishCreation;
        console.log("Allow Fish Creation: " + FishController.allowFishCreation)
    }
}

export default FishController;
