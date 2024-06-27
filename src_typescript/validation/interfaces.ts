//------- Fish Interfaces -------//
export interface CreateFishInterface {
    raw_data: string;
}

export interface getLatestFishInterface {
    after: Date;
}

//------- Space Interfaces -------//
export interface CreateScoreEntryInterface {
    name: string;
    score: number;
}