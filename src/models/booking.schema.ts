import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import { ITrainJourney } from './trainJourney.schema';
import { IStation } from './station.schema';

export interface IBooking extends Document {
    _id: string;
    trainJourney: ITrainJourney;
    source: IStation;
    destination: IStation;
    route: [string];
    seatNumber: string;
    seatType: string;
    price: number;
}

const BookingSchema: Schema = new Schema(
    {
        bookedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        trainJourney: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TrainJourney'
        },
        source: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Station'
        },
        destination: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Station'
        },
        route: [String], // This will contain only the station ids. Help in finding booking conflicts
        seatNumber: String,
        seatType: String,
        price: Number
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export default mongoose.model('Booking', BookingSchema);
