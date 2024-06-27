import { Model, DataTypes} from "sequelize";

import { database, databaseSchema } from "../config/database";

//------- Class for Space Model-------//
export class SpaceModel extends Model {
    public id!: string;
    public name!: string;
    public score!: number;
    public readonly created_at!: Date;
}

//------- Init Sequelize-Model -------//
SpaceModel.init(
{
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "Player"
    },
    score: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0
    }
},
{
    timestamps: true, 
    createdAt: 'created_at', 
    updatedAt: false,
    freezeTableName: true,
    tableName: 'space',
    sequelize: database,
    schema: databaseSchema
});