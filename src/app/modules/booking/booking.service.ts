import { IBooking } from '../../../models/booking.schema';

const { MasterService } = require('base-packages');
import TempBooking from '../../../models/tempBooking.schema';
import Booking from '../../../models/booking.schema';

export default class BookingService extends MasterService {
    getTempBookingById(_id) {
        return TempBooking.findById(_id).lean();
    }

    finalBooking(obj) {
        return Booking.create(obj);
    }

    getUserBooking(userId) {
        return Booking.find({ bookedBy: userId }).populate([
            'trainJourney',
            'source',
            'destination'
        ]);
    }

    getTempBookingBySeatTypeAndTrainJourney(seatType, trainJourney) {
        return TempBooking.find({
            seatType,
            trainJourney
        }).lean();
    }

    getBookingBySeatTypeAndTrainJourney(seatType, trainJourney) {
        return Booking.find({
            seatType,
            trainJourney
        }).lean();
    }

    mergeAllSeatsRoute(alreadyBookedSeats: IBooking[]) {
        const alreadyBookedSeatObj = {};
        for (let alreadyBookedSeat of alreadyBookedSeats) {
            const bookedStation =
                alreadyBookedSeatObj[alreadyBookedSeat.seatNumber] || [];
            alreadyBookedSeatObj[
                alreadyBookedSeat.seatNumber
            ] = bookedStation.concat(alreadyBookedSeat.route);
        }
        return alreadyBookedSeatObj;
    }

    findAvailableSeat(alreadyBookedSeatObj, routeToBook) {
        let availableSeatNumber = [];
        for (let seatNumber of Object.keys(alreadyBookedSeatObj)) {
            const conflicts = routeToBook.find((x) =>
                alreadyBookedSeatObj[seatNumber].includes(x)
            );
            if (conflicts) {
                availableSeatNumber.push(Number(seatNumber));
            }
        }
        return availableSeatNumber;
    }

    tempBook(obj) {
        return TempBooking.create(obj);
    }
}
