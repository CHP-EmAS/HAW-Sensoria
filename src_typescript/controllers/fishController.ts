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
            if(!request.query.from) {
                const fishes: Array<FishModel> = await FishModel.findAll();
                return response.status(200).json(toObj(response,{fishes: fishes}));
            }

            const requestParams: getLatestFishInterface = {from: new Date(request.query.from.toString())};

            const fishes: (Array<FishModel> | null) = await FishModel.findAll({
                where: {
                    created_at: {
                        [Op.gte]: requestParams.from.toUTCString(),
                    }
                        
                }
            });

            return response.status(200).json(toObj(response,{fishes: fishes}));

        } catch ( error ) {
            console.error(error);
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
        if(error) return response.status(400).json(toObj(response,{Error: error.message}));

        let fish = new FishModel();

        fish.id = uuidv4();

        try {
            JSON.parse(requestParams.raw_data);
        } catch (e) {
            return response.status(400).json(toObj(response, {Error: customError.invalidJson}));
        }

        fish.raw_data = requestParams.raw_data;
    
        try {
            const newFish: FishModel = await fish.save();

            console.log("New Fish created! ID: " + fish.id + "\nData: " + fish.raw_data);
            return response.status(201).json(toObj(response,{ fish_id: fish.id }));

        } catch ( error ) {
            console.error(error);
            return response.status(500).json(toObj(response));
        }
    }

    //PATCH Fish
    public static async patchFish(request: Request, response: Response) {
         return response.status(501).json(toObj(response));
    }

    //DELETE Fish
    public static async deleteFish(request: Request, response: Response) {
        return response.status(501).json(toObj(response));
    }

    //Toggle Creation
    public static async toggleFishCreation(request: Request, response: Response) {
        FishController.allowFishCreation = !FishController.allowFishCreation;
    }
}

export default FishController;
