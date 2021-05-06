import { ITrainJourney } from '../../../models/trainJourney.schema';
import { TrainService } from '../train/train.service';
import BookingService from './booking.service';
import { IBooking } from '../../../models/booking.schema';

const { MasterController, RequestBuilder, Joi } = require('base-packages');

export default class TempBookingController extends MasterController {
    static doc() {
        return {
            tags: ['Booking'],
            description:
                'This is used to book temporary. Will get auto removed after 7 mins',
            summary: ''
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                trainJourneyId: Joi.string().required(),
                source: Joi.string().required(),
                destination: Joi.string().required(),
                seatType: Joi.string().required()
            })
        );
        return payload;
    }

    async controller() {
        /**
         *  - get all seats of seat type.
         *  - get all routes from  source to destination
         *  - get all available seats for seat type
         *  - get all booked seats from tempbooking of seat type
         *  - remove those seats from available which are conflicting route
         *  - get all booked seats from booking of seat type
         *  - remove those seats from available which are conflicting route
         *  - check if available seats are there then book
         *  - else not found
         * */

        const { trainJourneyId, source, destination, seatType } = this.data;

        if (source === destination) {
            return new this.ResponseBuilder(
                404,
                {},
                'Source cannot be same as destination'
            );
        }

        const trainJourney: ITrainJourney = await TrainService.instance().getTrainJourney(
            trainJourneyId
        );

        if (!trainJourney) {
            return new this.ResponseBuilder(404, {}, 'Train Journey not found');
        }

        let routeToBook = trainJourney.route
            .sort((a, b) =>
                a.totalKMFromSource < b.totalKMFromSource ? -1 : 0
            )
            .map((item) => item.stationId._id.toString());
        routeToBook = routeToBook.slice(
            routeToBook.indexOf(source),
            routeToBook.indexOf(destination) + 1
        );
        this.availableSeatNumbersToBook = trainJourney.trainId.seats
            .filter((_seat) => _seat.sType === seatType)
            .map((_seat) => _seat.sNumber);
        if (!routeToBook || routeToBook.length === 0) {
            return new this.ResponseBuilder(
                404,
                {},
                'Route not found from source to destination'
            );
        }
        let alreadyBookedSeats: IBooking[] = await BookingService.instance().getTempBookingBySeatTypeAndTrainJourney(
            seatType,
            trainJourneyId
        );
        this.removeNotAvailableSeatNumbers(alreadyBookedSeats, routeToBook);

        alreadyBookedSeats = await BookingService.instance().getBookingBySeatTypeAndTrainJourney(
            seatType,
            trainJourneyId
        );
        this.removeNotAvailableSeatNumbers(alreadyBookedSeats, routeToBook);

        if (this.availableSeatNumbersToBook.length > 0) {
            const bookingDTO = {
                bookedBy: this.req.user._id,
                trainJourney: trainJourneyId,
                source: source,
                destination: destination,
                seatNumber: this.availableSeatNumbersToBook[0],
                route: routeToBook,
                seatType: seatType,
                price: trainJourney.trainId.baseAmount
            };
            const sourceStation = trainJourney.route.find(
                (item) => item.stationId._id.toString() === source
            );
            const destinationStation = trainJourney.route.find(
                (item) => item.stationId._id.toString() === destination
            );
            bookingDTO.price +=
                trainJourney.trainId.amountPerKm *
                (destinationStation.totalKMFromSource -
                    sourceStation.totalKMFromSource);
            const bookingDetails = await BookingService.instance().tempBook(
                bookingDTO
            );
            return new this.ResponseBuilder(201, { bookingDetails }, 'success');
        }

        return new this.ResponseBuilder(404, {}, 'No slot found');
    }

    removeNotAvailableSeatNumbers(alreadyBookedSeats, routeToBook) {
        const alreadyBookedSeatObj = BookingService.instance().mergeAllSeatsRoute(
            alreadyBookedSeats
        );
        let notAvailableSeatNumbers = BookingService.instance().findAvailableSeat(
            alreadyBookedSeatObj,
            routeToBook
        );
        this.availableSeatNumbersToBook = this.availableSeatNumbersToBook.filter(
            (x) => !notAvailableSeatNumbers.includes(x)
        );
    }
}
