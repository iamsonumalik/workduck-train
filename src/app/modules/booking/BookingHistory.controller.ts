import BookingService from './booking.service';

const { MasterController } = require('base-packages');

export default class BookingHistoryController extends MasterController {
    static doc() {
        return {
            tags: ['Booking'],
            description: 'Fetch user booking history',
            summary: ''
        };
    }

    async controller() {
        const {
            user: { _id }
        } = this.data;
        const bookings = await BookingService.instance().getUserBooking(_id);
        return new this.ResponseBuilder(201, { bookings }, 'success');
    }
}
