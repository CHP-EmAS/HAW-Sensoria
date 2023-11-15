import { Request, Response } from "express";

import toObj from "../config/responseStandart"
import * as customError from "../config/errorCodes"

import { v4 as uuidv4 } from 'uuid';

import { CreateFishInterface } from "../validation/interfaces"
import { createFishSchema } from "../validation/fishValidationSchemas";

import {FishModel} from "../models/Fish";

class FishController {

    //GET All Fish Info
    public static async getAllFishInfo(request: Request, response: Response) {
        try{
            const fishes: Array<FishModel> = await FishModel.findAll();
            response.status(200).json(toObj(response,{Fishes: fishes}));
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
            response.status(200).json(toObj(response,{Fish: fish.toJSON()}));
        } catch {
            response.status(500).json(toObj(response));
        }
    }

    //POST Fish
    public static async createFish(request: Request, response: Response) {
        const requestParams: CreateFishInterface = request.body;
    
        const { error } = createFishSchema.validate(requestParams);
        if(error) return response.status(400).json(toObj(response,{Error: error.message}));

        let fish = new FishModel();

        fish.id = uuidv4();
        fish.name = requestParams.name;

        try {
            JSON.parse(requestParams.raw_data);
        } catch (e) {
            return response.status(400).json(toObj(response, {Error: customError.invalidJson}));
        }

        fish.raw_data = requestParams.raw_data;
    
        try {
            const newFish: FishModel = await fish.save();

            console.log("New Fish created! Name: " + fish.name + " <" + fish.id + ">\nData: " + fish.raw_data);
            return response.status(201).json(toObj(response,{ fish_id: fish.id }));

        } catch ( error ) {
            console.error(error);
            return response.status(500).json(toObj(response));
        }
    }

    //PATCH Fish
    public static async patchFish(request: Request, response: Response) {
         return response.status(500).json(toObj(response));
    }

    //DELETE Fish
    public static async deleteFish(request: Request, response: Response) {
        return response.status(500).json(toObj(response));
    }

   
}

export default FishController;
