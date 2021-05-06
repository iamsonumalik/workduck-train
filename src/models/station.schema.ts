import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';

export interface IStation extends Document {
    _id: string;
    name: string;
}

const StationSchema: Schema = new Schema(
    {
        name: {
            type: String
        }
    },
    { versionKey: false }
);

export default mongoose.model('Station', StationSchema);
