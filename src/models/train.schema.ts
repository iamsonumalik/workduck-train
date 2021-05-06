import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';

export interface ISeat {
    sNumber: number;
    sType: string;
}

export interface ITrain extends Document {
    _id: string;
    name: string;
    number: string;
    baseAmount: number;
    amountPerKm: number;
    seats: ISeat[];
}

const TrainSchema: Schema = new Schema(
    {
        name: {
            type: String
        },
        number: {
            type: String
        },
        baseAmount: Number, // In paise
        amountPerKm: Number, // In paise
        seats: [
            {
                sNumber: Number,
                sType: String
            }
        ]
    },
    { versionKey: false }
);

export default mongoose.model('Train', TrainSchema);
