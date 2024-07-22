import { Model, DataTypes} from "sequelize";

import { database, databaseSchema } from "../config/database";

//------- Class for Fish Model-------//
export class FishModel extends Model {
    public id!: number;
    public raw_data!: string;
    public readonly created_at!: Date;
}

//------- Init Sequelize-Model -------//
FishModel.init(
{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    raw_data: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "{}"
    }
},
{
    timestamps: true, 
    createdAt: 'created_at', 
    updatedAt: false,
    freezeTableName: true,
    tableName: 'fish',
    sequelize: database,
    schema: databaseSchema
});