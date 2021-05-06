import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

const TempBookingSchema: Schema = new Schema(
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

export default mongoose.model('TempBooking', TempBookingSchema);
